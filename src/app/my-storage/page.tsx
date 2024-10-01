import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  FileIcon,
  FolderIcon,
  Grid,
  List,
  MoreVertical,
} from "lucide-react";
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

export default async function Page() {
  const data = await Promise.all([
    prisma.folder.findMany(),
    prisma.document.findMany(),
  ]);
  const [folders, documents] = data;

  console.log(folders, documents);
  const foldersData = folders.map((folder) => ({
    type: "folder",
    name: folder.name,
    owner: folder.userId,
    lastModified: folder.updatedAt,
    size: "-",
  }));

  // const filesData = documents.map((document) => ({
  //   type: document.type,
  //   name: document.name,
  //   owner: document.userId,
  //   lastModified: document.updatedAt,
  //   size: document.size,
  // }));
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-semibold">My Drive</h1>
          <ChevronDown className="h-5 w-5" />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </Button>
        </div>
      </div>
      <div className="flex space-x-2 mb-4">
        <Button variant="outline">
          Type
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>

        <Button variant="outline">
          People
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>

        <Button variant="outline">
          Modified
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
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
          {foldersData.map((file, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
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
