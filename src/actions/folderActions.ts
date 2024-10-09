"use server";

import { createFolderInS3 } from "@/lib/aws";
import { prisma } from "@/lib/prisma";
import { DUMMYUSERID } from "@/lib/utils";
import { revalidatePath } from "next/cache";

/**
 * Creates a folder in the database and S3 simultaneously.
 * @param folderName - The name of the folder to create.
 * @param parentId - The ID of the parent folder, if any.
 * @returns Promise<string> - A message indicating the result.
 */
export const createFolder = async (
  folderName: string,
  pathname: string,
  parentId?: string
): Promise<string> => {
  if (!folderName) {
    throw new Error("Folder name is required.");
  }

  try {
    // Check if the folder already exists in the database
    let existingFolder = await prisma.folder.findFirst({
      where: {
        name: folderName,
        parentId: parentId ?? null, // Check if the folder exists under the given parent
      },
    });

    // If the folder exists, append a number to the folder name
    let counter = 1;
    while (existingFolder) {
      folderName = `${folderName} ${counter}`;
      existingFolder = await prisma.folder.findFirst({
        where: {
          name: folderName,
          parentId: parentId ?? null,
        },
      });
      counter++;
    }

    // Build the full path for S3
    let fullS3Path = parentId ? await buildFullS3Path(parentId) : ""; // Function to get the path from parentId
    fullS3Path += `${folderName}/`; // Append the new folder name

    console.log("Creating folder in S3:", fullS3Path);

    // Create the folder in S3 and log the folder creation in the database concurrently
    const s3Promise = createFolderInS3(fullS3Path); // Adjusted to use the full path
    const prismaPromise = prisma.folder.create({
      data: {
        name: folderName,
        userId: DUMMYUSERID,
        parentId: parentId ?? null, // Associate with the parent folder
        createdAt: new Date(),
        updatedAt: new Date(),
        key: fullS3Path, // Store the full S3 path in the database
      },
    });

    // Wait for both promises to resolve
    await Promise.all([s3Promise, prismaPromise]);

    revalidatePath(pathname); // Revalidate the cache for the current path

    return "Folder created successfully.";
  } catch (error) {
    console.error("Error creating folder:", error);
    if (error instanceof Error) {
      throw new Error(`Error creating folder: ${error.message}`);
    } else {
      throw new Error("Error creating folder: Unknown error");
    }
  }
};

// Helper function to build the full S3 path based on parent folder
async function buildFullS3Path(parentId: string): Promise<string> {
  const folder = await prisma.folder.findUnique({
    where: { id: parentId },
    select: { name: true, parentId: true },
  });

  if (!folder) return "";

  // Recursively get the parent folder path
  const parentPath = folder.parentId
    ? await buildFullS3Path(folder.parentId)
    : "";

  // Build the current folder path
  return `${parentPath}${folder.name}/`;
}
