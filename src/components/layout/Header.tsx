import React from "react";
import Search from "./Search";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BellIcon, InfoIcon, SettingsIcon } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 border-b w-full p-6 flex items-center justify-between">
      <div className="flex items-center w-full">
        <h1 className="font-semibold text-xl">File Manager</h1>
        <Search />
      </div>
      <div className="flex items-center gap-2">
        <Button size={"icon"} variant={"ghost"}>
          <InfoIcon size={"1.3rem"} />
        </Button>
        <Button size={"icon"} variant={"ghost"}>
          <BellIcon size={"1.3rem"} />
        </Button>
        <Button size={"icon"} variant={"ghost"}>
          <SettingsIcon size={"1.3rem"} />
        </Button>
        <Avatar className="ml-2">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
