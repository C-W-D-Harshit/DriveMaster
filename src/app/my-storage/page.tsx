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

export default async function Page() {
  const data = await Promise.all([
    prisma.folder.findMany(),
    prisma.document.findMany(),
  ]);
  const [folders, documents] = data;

  console.log(folders, documents);
  const files = [
    {
      name: "Classroom",
      type: "folder",
      owner: "me",
      lastModified: "Sep 27, 2024",
      size: "—",
    },
    {
      name: "Scribbl Transcription",
      type: "folder",
      owner: "me",
      lastModified: "Jan 4, 2024",
      size: "—",
    },
    {
      name: "Untitled folder",
      type: "folder",
      owner: "me",
      lastModified: "3:13 PM",
      size: "—",
    },
    {
      name: "Untitled folder",
      type: "folder",
      owner: "me",
      lastModified: "Sep 11, 2024",
      size: "—",
    },
    {
      name: "Data Collection for Monthly Review Meeting(Accounts)",
      type: "form",
      owner: "me",
      lastModified: "Aug 30, 2024",
      size: "1 KB",
    },
    {
      name: "Data Collection for Monthly Review Meeting(HR)",
      type: "form",
      owner: "me",
      lastModified: "Aug 30, 2024",
      size: "1 KB",
    },
  ];
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
          {files.map((file, index) => (
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
                  <span>{file.owner}</span>
                </div>
              </TableCell>
              <TableCell>{file.lastModified}</TableCell>
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
