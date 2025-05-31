"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface AppSettingsToggleProps {
  settingName: string
  label: string
  description: string
  value: boolean
  onToggle: (value: boolean) => void
}

export function AppSettingsToggle({ settingName, label, description, value, onToggle }: AppSettingsToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor={settingName} className="text-base font-medium">
          {label}
        </Label>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Switch id={settingName} checked={value} onCheckedChange={onToggle} aria-label={label} />
    </div>
  )
}
