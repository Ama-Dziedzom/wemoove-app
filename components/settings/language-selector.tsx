"use client"

import { Check, Globe } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange: (language: string) => void
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "tw", name: "Twi", flag: "🇬🇭" },
    { code: "ha", name: "Hausa", flag: "🇬🇭" },
    { code: "ga", name: "Ga", flag: "🇬🇭" },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-gray-500" />
        <Label className="text-base font-medium">Language</Label>
      </div>
      <RadioGroup
        value={currentLanguage}
        onValueChange={onLanguageChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
      >
        {languages.map((language) => (
          <div
            key={language.code}
            className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer transition-colors ${
              currentLanguage === language.code ? "bg-orange-50 border-orange-200" : "border-gray-200"
            }`}
            onClick={() => onLanguageChange(language.code)}
          >
            <RadioGroupItem value={language.code} id={`language-${language.code}`} className="sr-only" />
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xl">{language.flag}</span>
              <Label htmlFor={`language-${language.code}`} className="cursor-pointer">
                {language.name}
              </Label>
            </div>
            {currentLanguage === language.code && <Check className="h-4 w-4 text-orange-500" />}
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
