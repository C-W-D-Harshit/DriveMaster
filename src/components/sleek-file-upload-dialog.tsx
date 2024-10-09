/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadIcon, File, CheckCircle, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useParams, usePathname, useRouter } from "next/navigation";

export function SleekFileUploadDialog({
  open,
  setOpen,
  path,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  path?: string;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const folderIds: string[] = Array.isArray(params.folderIds)
    ? params.folderIds
    : [params.folderIds];
  const parentId = folderIds[folderIds.length - 1];

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      setError("Invalid file. Please try again.");
      return;
    }
    setFile(acceptedFiles[0]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const uploadFile = async (file: File) => {
    // Auto-generate metadata from the file
    const metaData = {
      name: file.name,
      size: file.size.toString(),
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
    };
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: await fileToBase64(file), // Helper function to convert file to base64
        metaData,
        folderId: parentId,
        key: `${path}${file.name}`,
        pathname,
      }),
    });

    if (!response.body) {
      throw new Error("Response body is null");
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      console.log(decoder.decode(value)); // Logs progress to console
      const chunk = decoder.decode(value, { stream: true });

      // Extract the progress value (example: Progress: 5242880/34692877)
      const progressMatch = chunk.match(/Progress: (\d+)\/(\d+)/);
      if (progressMatch) {
        const loaded = parseInt(progressMatch[1], 10);
        const total = parseInt(progressMatch[2], 10);
        const percentage = Math.round((loaded / total) * 100); // Calculate percentage

        // Update progress as percentage
        setUploadProgress(percentage);
      }
    }
    router.refresh(); // Reload the page to show the updated file
    setIsCompleted(true);
    setIsUploading(false);
  };

  const fileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve((reader.result as string).split(",")[1]);
        } else {
          reject(new Error("File reading failed"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const upload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    // Upload file to s3
    uploadFile(file as File);

    // Add metadata to db
  };

  const resetUpload = () => {
    setFile(null);
    setIsCompleted(false);
    setUploadProgress(0);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Upload File</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Drag and drop your file here or click to select.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            {...getRootProps()}
            className={`relative overflow-hidden border-2 border-dashed rounded-lg p-10 transition-all duration-300 ease-in-out
              ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
              }
              ${file ? "bg-muted/50" : ""}
            `}
          >
            <input {...getInputProps()} aria-label="File upload input" />
            <AnimatePresence>
              {file ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <File className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetUpload();
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="p-4 bg-primary/5 inline-block rounded-full mb-4">
                    <UploadIcon className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium mb-1">
                    {isDragActive
                      ? "Drop the file here"
                      : "Drag 'n' drop a file here"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to select (max 5MB)
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-2 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </motion.div>
            )}
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-2"
              >
                <Progress value={uploadProgress} className="w-full h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  {uploadProgress}% uploaded
                </p>
              </motion.div>
            )}
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-2 text-sm text-green-500"
              >
                <CheckCircle className="h-4 w-4" />
                File uploaded successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <DialogFooter>
          <Button
            onClick={upload}
            disabled={!file || isUploading || isCompleted}
            className="w-full"
          >
            {isUploading ? (
              <UploadIcon className="mr-2 h-4 w-4 animate-pulse" />
            ) : (
              <UploadIcon className="mr-2 h-4 w-4" />
            )}
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
