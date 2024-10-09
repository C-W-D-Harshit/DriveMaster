import { prisma } from "@/lib/prisma";
import { BUCKET_NAME, DUMMYUSERID, s3Client } from "@/lib/utils";
import { Upload } from "@aws-sdk/lib-storage";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    file,
    key,
    metaData,
    folderId = null,
  }: // pathname,
  {
    file: Buffer;
    folderId: string | null;
    pathname: string;
    key: string | undefined;
    metaData: {
      name: string;
      size: string;
      type: string;
      lastModified: string;
    };
  } = body;

  const target = {
    Bucket: BUCKET_NAME,
    Key: key ?? metaData.name,
    Body: Buffer.from(String(file), "base64"),
    MetaData: metaData,
  };

  try {
    const upload = new Upload({
      client: s3Client,
      queueSize: 4,
      partSize: 5 * 1024 * 1024, // 5MB per part
      leavePartsOnError: false,
      params: target,
    });

    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          upload.on("httpUploadProgress", (progress) => {
            // Stream progress back to the client
            controller.enqueue(
              `Progress: ${progress.loaded}/${progress.total}`
            );
          });

          await upload.done();

          // After upload is complete, update Postgres
          await prisma.document.create({
            data: {
              title: metaData.name,
              content: key ?? metaData.name, // You can use S3 Key as content or add file URL later
              userId: DUMMYUSERID, // Replace with actual user ID from session or auth
              folderId: folderId ?? null, // Optional: Folder ID if it's provided
              status: "published", // Set as needed
            },
          });

          // revalidatePath(pathname, "page");

          controller.enqueue("Upload complete");
          controller.close();
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain", // Or you can use text/event-stream for SSE
        },
      }
    );
  } catch (error) {}
}
