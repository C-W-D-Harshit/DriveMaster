import { createFolder } from "@/actions/folderActions";
import { S3Client } from "@aws-sdk/client-s3";
import { clsx, type ClassValue } from "clsx";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DUMMYUSERID = "60ddee5f-b660-4751-a1da-2c245eb5f399";
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

export const handleNewFolder = async (
  folderName: string,
  {
    router,
    parentId,
    pathname,
  }: {
    router: AppRouterInstance;
    parentId?: string;
    pathname: string;
  }
) => {
  const toastId = toast.loading("Creating folder...");
  try {
    await createFolder(folderName, pathname, parentId);
    !parentId && router.push("/my-storage");
    toast.success("Folder created successfully.", { id: toastId });
  } catch (error) {
    toast.error("Error creating folder.", { id: toastId });
  }
};
