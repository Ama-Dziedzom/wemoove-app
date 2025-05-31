"use client"
import { Mail, Phone, Edit } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfileCardProps {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  onEdit: () => void
}

export function UserProfileCard({ user, onEdit }: UserProfileCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <Card className="bg-white rounded-lg shadow-sm border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="font-montserrat text-lg font-bold text-gray-800">Personal Information</CardTitle>
          <Button variant="ghost" size="sm" onClick={onEdit} className="text-orange-500 hover:text-orange-600">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="text-lg bg-orange-100 text-orange-800">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-3 flex-1 text-center md:text-left">
            <div>
              <h3 className="font-montserrat text-xl font-bold text-gray-800">
                {user.firstName} {user.lastName}
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
