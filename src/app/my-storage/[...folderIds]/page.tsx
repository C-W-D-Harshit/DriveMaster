import { Button } from "@/components/ui/button";
import { FileIcon, FolderIcon, MoreVertical } from "lucide-react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import Header from "../Header";
import DoubleClickLink from "@/components/DoubleClickLink";

export default async function Page({
  params: { folderIds },
}: {
  // array of folder IDs
  params: {
    folderIds: string[];
  };
}) {
  const data = await Promise.all([
    prisma.folder.findUnique({
      where: {
        id: folderIds[folderIds.length - 1],
      },
      include: {
        subfolders: true,
        documents: true,
      },
    }),
  ]);
  const [parentFolder] = data;

  const folders = parentFolder?.subfolders ?? [];
  const documents = parentFolder?.documents ?? [];

  console.log(folders, documents);
  const foldersData = folders.map((folder) => ({
    type: "folder",
    name: folder.name,
    owner: folder.userId,
    lastModified: folder.updatedAt,
    size: "-",
    id: folder.id,
  }));

  const filesData = documents.map((document) => ({
    type: "file",
    name: document.title,
    owner: document.userId,
    lastModified: document.updatedAt,
    size: "-",
    id: document.id,
  }));

  const allData = [...foldersData, ...filesData];

  return (
    <div>
      <Header folder={parentFolder} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Last modified</TableHead>
            <TableHead>File size</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allData.map((file, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <DoubleClickLink
                  href={`${
                    file.type === "folder"
                      ? `/my-storage/${folderIds.join("/")}/${file.id}`
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {file.type === "folder" && (
                      <FolderIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                    {file.type === "file" && (
                      <FileIcon className="h-5 w-5 text-blue-500" />
                    )}
                    {file.type === "spreadsheet" && (
                      <FileIcon className="h-5 w-5 text-green-500" />
                    )}
                    {file.type === "form" && (
                      <FileIcon className="h-5 w-5 text-purple-500" />
                    )}
                    <span>{file.name}</span>
                  </div>
                </DoubleClickLink>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <img
                    src="/placeholder.svg"
                    alt="User"
                    className="h-6 w-6 rounded-full"
                  />
                  <span>{"Me"}</span>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(file.lastModified), "MM/dd/yyyy")}
              </TableCell>
              <TableCell>{file.size}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
