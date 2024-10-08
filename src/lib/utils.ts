import { S3Client } from "@aws-sdk/client-s3";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DUMMYUSERID = "c4a4cd5a-3498-4d38-8703-a2485bb483e5";
export const BUCKET_NAME = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || ""; // Your S3 bucket name

export const s3Client = new S3Client({
  forcePathStyle: true,
  region: process.env.AWS_REGION, // Your AWS region
  endpoint: process.env.AWS_ENDPOINT, // Supabase S3 endpoint
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "", // Your access key
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "", // Your secret key
  },
});
