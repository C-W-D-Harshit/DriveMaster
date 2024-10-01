'use client'

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Folder, Clock, Star, Trash2, Plus, CropIcon } from "lucide-react"

export function Sidebar() {
  return (
    <div className="w-72 bg-background text-foreground flex flex-col h-screen border-r border-border divide-y">
      <div className="flex items-center h-20 pl-6 gap-3">
        <div className="w-8 h-8 bg-primary rounded">
          <CropIcon className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold">Beast - CMS</h1>
      </div>

      <div className="p-6">
        <h2 className="text-muted-foreground text-sm mb-2">Overview</h2>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Overview Storage
        </Button>
      </div>

      <div className="p-6">
        <h2 className="text-muted-foreground text-sm mb-2">File Manager</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 mr-2" />
            <Folder className="w-4 h-4 mr-2" />
            <span>My Storage</span>
          </li>
          <li className="flex items-center justify-between">
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 mr-2" />
              <Clock className="w-4 h-4 mr-2" />
              <span>Recents</span>
            </div>
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2">12</span>
          </li>
          <li className="flex items-center justify-between">
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 mr-2" />
              <Star className="w-4 h-4 mr-2" />
              <span>Favorites</span>
            </div>
            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2">8</span>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 mr-2" />
            <Trash2 className="w-4 h-4 mr-2" />
            <span>Trash</span>
          </li>
        </ul>
      </div>

      <div className="p-6">
        <h2 className="text-muted-foreground text-sm mb-2">Shared File</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 mr-2" />
            <Folder className="w-4 h-4 mr-2" />
            <span>Shared Folder</span>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 mr-2" />
            <Folder className="w-4 h-4 mr-2" />
            <span>Shared File</span>
          </li>
        </ul>
      </div>

      <div className="p-6">
        <h2 className="text-muted-foreground text-sm mb-2">Team Storage</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 mr-2" />
            <div className="w-4 h-4 bg-destructive rounded-sm mr-2"></div>
            <span>Civic Team</span>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 mr-2" />
            <div className="w-4 h-4 bg-secondary rounded-sm mr-2"></div>
            <span>Developer Team</span>
          </li>
        </ul>
        <Button variant="outline" className="w-full mt-2 text-primary border-primary hover:bg-primary hover:text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add team storage
        </Button>
      </div>

      <div className="p-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Storage</span>
          <span>92%</span>
        </div>
        <Progress value={92} className="h-2" />
        <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
          Upgrade Plan
        </Button>
      </div>
    </div>
  )
}