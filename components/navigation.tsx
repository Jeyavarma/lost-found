"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  GraduationCap, 
  User, 
  Plus, 
  BookOpen, 
  MessageCircle, 
  LogOut,
  Settings,
  UserCircle
} from "lucide-react"
import { isAuthenticated, getUserData, logout, type User as AuthUser } from "@/lib/auth"

export default function Navigation() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    setAuthenticated(isAuthenticated())
    setUser(getUserData())
  }, [])

  const handleLogout = () => {
    logout()
    setAuthenticated(false)
    setUser(null)
  }

  return (
    <nav className="mcc-primary border-b-4 border-brand-accent sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="w-12 h-12 mcc-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg">
                <GraduationCap className="w-6 h-6 text-brand-text-light" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-brand-text-light font-serif">MCC Lost & Found</span>
                <span className="text-xs text-gray-300 font-medium">Madras Christian College</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/browse">
              <Button variant="ghost" className="hover:bg-red-800 text-brand-text-light font-medium">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Items
              </Button>
            </Link>
            
            <Link href="/report-lost">
              <Button variant="ghost" className="hover:bg-red-800 text-brand-text-light font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Report Lost
              </Button>
            </Link>
            
            <Link href="/report-found">
              <Button variant="ghost" className="hover:bg-red-800 text-brand-text-light font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Report Found
              </Button>
            </Link>
            
            <Link href="/feedback">
              <Button variant="ghost" className="hover:bg-red-800 text-brand-text-light font-medium">
                <MessageCircle className="w-4 h-4 mr-2" />
                Feedback
              </Button>
            </Link>
            
            {authenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hover:bg-red-800 text-brand-text-light font-medium">
                    <UserCircle className="w-4 h-4 mr-2" />
                    {user?.name || 'User'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" className="hover:bg-red-800 text-brand-text-light font-medium">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}