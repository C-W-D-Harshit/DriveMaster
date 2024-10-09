"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { NewFolderDialogComponent } from "@/components/new-folder-dialog";
import { SleekFileUploadDialog } from "@/components/sleek-file-upload-dialog";
import { handleNewFolder } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Grid, List } from "lucide-react";
import { Prisma } from "@prisma/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function extractFolderIds(path: string): string[] {
  // Split the path by "/" and filter out any empty segments
  const segments = path.split("/").filter((segment) => segment !== "");

  // Remove the first segment (e.g., "my-storage") and return the rest as folder IDs
  return segments.slice(1);
}

export default function Header({
  folder,
}: {
  folder: Prisma.FolderGetPayload<{
    include: {
      subfolders: true;
      documents: true;
    };
  }> | null;
}) {
  type Dialogs = "newFolder" | "fileUpload" | "folderUpload";

  const [openDialogs, setOpenDialogs] = useState<Record<Dialogs, boolean>>({
    newFolder: false,
    fileUpload: false,
    folderUpload: false,
  });
  const router = useRouter();
  const pathname = usePathname();
  const key = folder?.key;
  const keySplit = key?.split("/");
  const keySplitLength = keySplit?.length ?? 0;
  // console.log(keySplit, keySplitLength);
  console.log(pathname);

  const folderIds = extractFolderIds(pathname);

  // generate url for folder
  const folderUrl = folderIds.join("/");

  console.log(folderIds, folderUrl);
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Breadcrumb className="">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/my-storage`}>
                  <BreadcrumbPage className="text-xl font-semibold">
                    My Storage
                  </BreadcrumbPage>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {keySplitLength > 1 && <BreadcrumbSeparator />}
              {keySplit?.map((key, index) => {
                if (index === keySplitLength - 1) return null;
                const generateHref = (index: number): string => {
                  if (index === 0) return `/my-storage`;
                  return `${generateHref(index - 1)}/${folderIds[index - 1]}`;
                };

                return (
                  <>
                    <BreadcrumbItem key={index}>
                      <BreadcrumbLink href={generateHref(index + 1)}>
                        <BreadcrumbPage className="text-xl font-semibold">
                          {key}
                        </BreadcrumbPage>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index !== keySplitLength - 2 && <BreadcrumbSeparator />}
                  </>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
              <ChevronDown className="h-5 w-5" />
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
              <DropdownMenuItem
                onClick={() =>
                  setOpenDialogs({ ...openDialogs, fileUpload: true })
                }
              >
                File Upload
              </DropdownMenuItem>
              <DropdownMenuItem>Folder Upload</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NewFolderDialogComponent
            isOpen={openDialogs.newFolder}
            onClose={() => setOpenDialogs({ ...openDialogs, newFolder: false })}
            onCreateFolder={(folderName) =>
              handleNewFolder(folderName, {
                router,
                parentId: folder?.id,
                pathname,
              })
            }
          />
          <SleekFileUploadDialog
            open={openDialogs.fileUpload}
            setOpen={() =>
              setOpenDialogs({ ...openDialogs, fileUpload: false })
            }
            path={folder?.key}
          />
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
    </>
  );
}
