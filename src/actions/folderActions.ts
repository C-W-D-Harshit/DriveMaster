"use server";

import { createFolderInS3 } from "@/lib/aws";
import { prisma } from "@/lib/prisma";
import { DUMMYUSERID } from "@/lib/utils";

/**
 * Creates a folder in the database and S3 simultaneously.
 * @param folderName - The name of the folder to create.
 * @returns Promise<string> - A message indicating the result.
 */
export const createFolder = async (folderName: string): Promise<string> => {
  if (!folderName) {
    throw new Error("Folder name is required.");
  }

  try {
    // Check if the folder already exists in the database
    let existingFolder = await prisma.folder.findUnique({
      where: {
        name: folderName,
      },
    });

    // If the folder exists, append a number to the folder name
    let counter = 1;
    while (existingFolder) {
      folderName = `${folderName} ${counter}`;
      existingFolder = await prisma.folder.findUnique({
        where: {
          name: folderName,
        },
      });
      counter++;
    }

    // Create the folder in S3 and log the folder creation in the database concurrently
    const s3Promise = createFolderInS3(folderName);
    const prismaPromise = prisma.folder.create({
      data: {
        name: folderName,
        userId: DUMMYUSERID,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Wait for both promises to resolve
    await Promise.all([s3Promise, prismaPromise]);

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
