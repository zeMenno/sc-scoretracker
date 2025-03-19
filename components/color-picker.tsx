'use client'

import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  name: string
}

export function ColorPicker({ name }: ColorPickerProps) {
  return (
    <Input
      type="color"
      name={name}
      className="h-10 w-full cursor-pointer"
      defaultValue="#3b82f6"
    />
  )
} 