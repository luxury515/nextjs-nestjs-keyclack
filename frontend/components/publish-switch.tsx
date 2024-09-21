'use client'

import React from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function PublishSwitchComponent({ isPublished, setIsPublished }: Readonly<{ isPublished: boolean, setIsPublished: (value: boolean) => void }>) {
  const handleToggle = () => {
    setIsPublished(!isPublished)
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="publish-switch"
        checked={isPublished}
        onCheckedChange={handleToggle}
        aria-label={isPublished ? "게시 중" : "게시안함"}
      />
      <Label htmlFor="publish-switch" className="text-sm font-medium">
        {isPublished ? "게시" : "게시안함"}
      </Label>
    </div>
  )
}