"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MoreVertical, PlusIcon, SortAsc } from "lucide-react";
// import { useState } from "react";
// import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useState } from "react";
import { NewFolderDialogComponent } from "./new-folder-dialog";
import { toast } from "sonner";
import { createFolder } from "@/actions/folderActions";
import { useRouter } from "next/navigation";

export function StorageOverview() {
  // const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  // const [selectAll, setSelectAll] = useState(false);
  const router = useRouter();

  type Dialogs = "newFolder" | "fileUpload" | "folderUpload";

  const [openDialogs, setOpenDialogs] = useState<Record<Dialogs, boolean>>({
    newFolder: false,
    fileUpload: false,
    folderUpload: false,
  });
  const files = [
    {
      name: "Toba Lake Proposal 2023.doc",
      size: "8.45 MB",
      shared: "Me",
      modified: "23/03/2023 - 17:15",
    },
    {
      name: "Explaination music mardua holong.pdf",
      size: "19.21 MB",
      shared: "Me",
      modified: "24/03/2023 - 08:09",
    },
    {
      name: "Member of 2021.xls",
      size: "5.14 MB",
      shared: "Team",
      modified: "25/03/2023 - 17:12",
    },
    {
      name: "Invoice 2021.pdf",
      size: "10.66MB",
      shared: "Me",
      modified: "26/03/2023 - 09:18",
    },
    {
      name: "Furniture Catalog January.pdf",
      size: "28.11 MB",
      shared: "Me",
      modified: "27/03/2023 - 16:21",
    },
  ];

  const handleNewFolder = async (folderName: string) => {
    const toastId = toast.loading("Creating folder...");
    try {
      await createFolder(folderName);
      router.push("/my-storage");
      toast.success("Folder created successfully.", { id: toastId });
    } catch (error) {
      toast.error("Error creating folder.", { id: toastId });
    }
  };
  return (
    <div className="bg-background text-foreground">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Overview Storage</h1>
        <div className="flex gap-4">
          <Button variant="outline">
            <SortAsc className="mr-2 h-4 w-4" /> Sort
          </Button>
          <Button variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <rect x="7" y="7" width="3" height="9" />
              <rect x="14" y="7" width="3" height="5" />
            </svg>
            View
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusIcon size={"1.2rem"} /> New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background">
              <DropdownMenuItem
                onClick={() =>
                  setOpenDialogs({ ...openDialogs, newFolder: true })
                }
              >
                New Folder
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>File Upload</DropdownMenuItem>
              <DropdownMenuItem>Folder Upload</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <NewFolderDialogComponent
            isOpen={openDialogs.newFolder}
            onClose={() => setOpenDialogs({ ...openDialogs, newFolder: false })}
            onCreateFolder={(folderName) => handleNewFolder(folderName)}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          {
            title: "Image",
            items: 154,
            used: 24,
            total: 100,
            color: "bg-red-700",
          },
          {
            title: "Video",
            items: 24,
            used: 32,
            total: 100,
            color: "bg-blue-700",
          },
          {
            title: "Document",
            items: 232,
            used: 22,
            total: 100,
            color: "bg-green-700",
          },
          {
            title: "Others",
            items: 154,
            used: 22,
            total: 100,
            color: "bg-yellow-700",
          },
        ].map((category) => (
          <Card className="rounded" key={category.title}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div
                  className={`w-8 h-8 ${category.color} rounded-lg mr-4 flex items-center justify-center`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-background"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold">{category.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {category.items} items
                  </p>
                </div>
              </div>
              <Progress
                value={(category.used / category.total) * 100}
                className={cn("h-2 mb-2 bg-secondary")}
                indicatorColor={category.color}
              />
              <p className="text-sm text-muted-foreground">
                {category.used} GB of {category.total} GB
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Suggested</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          {
            title: "Google testing.doc",
            image: "/placeholder.svg?height=100&width=200",
          },
          {
            title: "Data_2021.xls",
            image: "/placeholder.svg?height=100&width=200",
          },
          {
            title: "Compro.pdf",
            image: "/placeholder.svg?height=100&width=200",
          },
          {
            title: "January Article.doc",
            image: "/placeholder.svg?height=100&width=200",
          },
        ].map((file) => (
          <Card className="rounded" key={file.title}>
            <CardContent className="p-4">
              <div className="h-28 w-full relative">
                <Image
                  src={file.image}
                  fill
                  alt={file.title}
                  className="object-cover"
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm truncate">{file.title}</p>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent files</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>
              <Checkbox
                checked={selectAll}
                onCheckedChange={(checked) => {
                  setSelectAll(checked === "indeterminate" ? false : checked);
                  handleSelectAllChange({ target: { checked } });
                }}
              />
            </TableHead> */}

            <TableHead className="text-muted-foreground">Name</TableHead>
            <TableHead className="text-muted-foreground">Size</TableHead>
            <TableHead className="text-muted-foreground">Shared</TableHead>
            <TableHead className="text-muted-foreground">
              Last modified
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.name}>
              {/* <TableCell>
                <Checkbox
                  checked={selectedFiles.includes(file.name as never)}
                  onCheckedChange={() => {
                    handleCheckboxChange(file.name);
                  }}
                />
              </TableCell> */}
              <TableCell className="font-medium">{file.name}</TableCell>
              <TableCell>{file.size}</TableCell>
              <TableCell>{file.shared}</TableCell>
              <TableCell>{file.modified}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
