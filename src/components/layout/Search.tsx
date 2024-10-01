"use client";

import React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SearchIcon, SlidersVerticalIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function Search() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setOpen((open) => !open);
        }
      };
      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
    }, []);
  return (
    <>
      <div className="flex items-center justify-between p-0.5 px-3 text-muted-foreground relative left-1/2 transform -translate-x-1/2 border rounded bg-accent w-full max-w-2xl">
        <div className="flex items-center gap-3 w-full">
          <SearchIcon size={"1rem"} className="w-6" />
          <p className="w-full" role="button" onClick={() => setOpen((open) => !open)}>Search here</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size={"icon"} variant={"ghost"}>
            <SlidersVerticalIcon size={"1rem"} />
          </Button>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>Profile</CommandItem>
            <CommandItem>Billing</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
