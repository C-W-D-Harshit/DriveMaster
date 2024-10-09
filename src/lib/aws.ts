"use server";

import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3";
import { BUCKET_NAME } from "./utils";

// Initialize S3 Client
const s3Client = new S3Client({
  forcePathStyle: true,
  region: process.env.AWS_REGION, // Your AWS region
  endpoint: process.env.AWS_ENDPOINT, // Supabase S3 endpoint
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "", // Your access key
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "", // Your secret key
  },
});

/**
 * Upload a file to S3.
 * @param bucketName - The name of the S3 bucket.
 * @param key - The path where the file will be stored in S3.
 * @param body - The file content to upload (Buffer, string, or Readable stream).
 * @returns The metadata of the uploaded file.
 */
export const uploadFileToS3 = async (
  bucketName: string,
  key: string,
  body: Buffer | string | Readable
) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: "application/octet-stream", // Adjust based on file type
    ACL: "private", // Set the appropriate ACL
  });

  try {
    const data = await s3Client.send(command);
    console.log("File uploaded successfully:", data);
    return data;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("File upload failed");
  }
};

/**
 * Download a file from S3.
 * @param bucketName - The name of the S3 bucket.
 * @param key - The path of the file in S3.
 * @returns The file content as a Readable stream.
 */
export const downloadFileFromS3 = async (
  bucketName: string,
  key: string
): Promise<Readable> => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const data: GetObjectCommandOutput = await s3Client.send(command);
    console.log("File downloaded successfully:", data);
    return data.Body as Readable; // This will contain the file content as a stream
  } catch (error) {
    console.error("Error downloading file from S3:", error);
    throw new Error("File download failed");
  }
};

/**
 * Delete a file from S3.
 * @param bucketName - The name of the S3 bucket.
 * @param key - The path of the file in S3.
 * @returns A confirmation message.
 */
export const deleteFileFromS3 = async (bucketName: string, key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const data = await s3Client.send(command);
    console.log(`File deleted successfully from ${bucketName}/${key}`, data);
    return { message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw new Error("File deletion failed");
  }
};

/**
 * Generate a pre-signed URL for downloading a file from S3.
 * @param bucketName - The name of the S3 bucket.
 * @param key - The path of the file in S3.
 * @param expiresIn - Expiration time in seconds for the URL.
 * @returns A pre-signed URL for accessing the file.
 */
export const generatePresignedUrl = async (
  bucketName: string,
  key: string,
  expiresIn: number = 3600
) => {
  console.log("Generating pre-signed URL for:", key, "in bucket:", bucketName);
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    console.log("Pre-signed URL generated:", url);
    return url;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    console.log((error as any).message);
    throw new Error("Failed to generate pre-signed URL");
  }
};

/**
 * Creates a folder in the specified S3 bucket.
 * @param folderName - The name of the folder to create.
 */
export const createFolderInS3 = async (folderName: string): Promise<void> => {
  if (!folderName || folderName.trim() === "") {
    throw new Error("Folder path is required.");
  }
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${folderName}/`, // S3 uses the trailing slash to identify a folder
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
};

/**
 * List all files and folders in a specified directory in S3.
 * @param bucketName - The name of the S3 bucket.
 * @param prefix - The path of the directory to list (e.g., 'my-folder/').
 * @returns An array of file and folder names.
 */
export const listFilesAndFoldersInS3 = async (
  bucketName: string,
  prefix: string
) => {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
    Delimiter: "/", // Use delimiter to get "folders"
  });

  try {
    const response: ListObjectsV2CommandOutput = await s3Client.send(command);

    const files = response.Contents?.map((item) => item.Key) || []; // Files
    const folders =
      response.CommonPrefixes?.map((prefix) => prefix.Prefix) || []; // Folders

    console.log("Files:", files);
    console.log("Folders:", folders);
    return { files, folders };
  } catch (error) {
    console.error("Error listing files and folders in S3:", error);
    throw new Error("Failed to list files and folders");
  }
};
/**
 * Generate a pre-signed URL for uploading parts of a file to S3.
 * @param bucketName - The name of the S3 bucket.
 * @param key - The path where the file will be stored in S3.
 * @param totalParts - The total number of parts for the file.
 * @param expiresIn - Expiration time in seconds for the URL.
 * @returns An object containing the upload ID and an array of pre-signed URLs for each part.
 */
export const generateMultipartUploadPresignedUrls = async (
  bucketName: string,
  key: string,
  totalParts: number,
  expiresIn: number = 3600
) => {
  // Step 1: Initiate the multipart upload
  const createMultipartUploadCommand = new CreateMultipartUploadCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const createUploadResponse = await s3Client.send(
      createMultipartUploadCommand
    );
    const uploadId = createUploadResponse.UploadId;

    // Step 2: Generate pre-signed URLs for each part
    const presignedUrls = await Promise.all(
      Array.from({ length: totalParts }, async (_, partNumber) => {
        const uploadPartCommand = new UploadPartCommand({
          Bucket: bucketName,
          Key: key,
          PartNumber: partNumber + 1, // Part numbers are 1-based
          UploadId: uploadId,
        });

        const url = await getSignedUrl(s3Client, uploadPartCommand, {
          expiresIn,
        });
        return { partNumber: partNumber + 1, url };
      })
    );

    console.log("Pre-signed URLs for upload generated:", presignedUrls);
    return { uploadId, presignedUrls };
  } catch (error) {
    console.error(
      "Error generating pre-signed URLs for multipart upload:",
      error
    );
    throw new Error("Failed to generate pre-signed URLs for multipart upload");
  }
};

export const initiateMultipartUpload = async (
  bucketName: string,
  fileName: string
) => {
  const command = new CreateMultipartUploadCommand({
    Bucket: bucketName,
    Key: fileName,
  });
  const response = await s3Client.send(command);
  return { uploadId: response.UploadId };
};

// Upload a part of the file
export const uploadPart = async (
  bucketName: string,
  key: string,
  uploadId: string,
  partNumber: number,
  body: string
) => {
  const command = new UploadPartCommand({
    Bucket: bucketName,
    Key: key,
    PartNumber: partNumber,
    UploadId: uploadId,
    Body: body,
  });
  const response = await s3Client.send(command);
  return response.ETag; // Return the ETag for the uploaded part
};

/**
 * Completes a multipart upload to an S3 bucket.
 *
 * @param uploadId - The unique identifier for the multipart upload.
 * @param etags - An array of ETag values for the uploaded parts.
 * @param bucketName - The name of the S3 bucket.
 * @param key - The object key for the uploaded file.
 * @returns A promise that resolves when the multipart upload is completed successfully.
 * @throws An error if the multipart upload fails.
 */
export const completeMultipartUpload = async (
  uploadId: string,
  etags: string[],
  bucketName: string,
  key: string
) => {
  console.log(bucketName, key);
  console.log("Completing multipart upload with ETags:", etags);
  console.log("Upload ID:", uploadId);
  // Create the parts array using the part numbers and corresponding ETags
  const parts = etags.map((etag, index) => ({
    ETag: etag,
    PartNumber: index + 1, // Part numbers are 1-based
  }));

  console.log("Parts:", parts);

  // Prepare the CompleteMultipartUploadCommand input
  const command = new CompleteMultipartUploadCommand({
    Bucket: bucketName,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts.length > 0 ? parts : undefined,
    },
  });

  console.log("Completing multipart upload...");

  try {
    const response = await s3Client.send(command);
    console.log("Multipart upload completed successfully:", response);
    return response; // Ensure the response is returned
  } catch (error) {
    console.error("Error completing multipart upload:", (error as any).message);
    throw new Error("Failed to complete multipart upload");
  }
};
