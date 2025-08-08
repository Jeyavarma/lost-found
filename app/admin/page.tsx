"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Shield,
  TrendingUp,
  Clock,
  Star,
  Users,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
  Calendar,
  MapPin,
  LogOut,
  Settings,
  BarChart3,
  UserCheck,
  FileText,
  Bell,
} from "lucide-react"

// Mock data for admin dashboard
const dashboardStats = {
  totalItems: 234,
  activeItems: 89,
  resolvedThisWeek: 18,
  pendingVerification: 12,
  totalUsers: 1247,
  newReportsToday: 7,
}

const recentItems = [
  {
    id: 1,
    title: 'MacBook Pro 13" (CS Major)',
    type: "lost",
    reporter: "harish.kumar@mcc.edu.in",
    status: "pending",
    date: "2024-01-15",
    urgency: "high",
    building: "Arts Block - Room 204",
  },
  {
    id: 2,
    title: "Student ID Card - Kiruba Shankar",
    type: "found",
    reporter: "suresh.nathan@mcc.edu.in",
    status: "verified",
    date: "2024-01-15",
    urgency: "medium",
    building: "College Union Society",
  },
  {
    id: 3,
    title: "TI-84 Plus Calculator",
    type: "lost",
    reporter: "jeya.prakash@mcc.edu.in",
    status: "active",
    date: "2024-01-14",
    urgency: "high",
    building: "Mathematics",
  },
  {
    id: 4,
    title: "Chemistry Textbook",
    type: "found",
    reporter: "kiruba.devi@mcc.edu.in",
    status: "resolved",
    date: "2024-01-14",
    urgency: "low",
    building: "Science block",
  },
]

const recentActivity = [
  { user: "Harish K.", action: "reported lost", item: "MacBook Pro", time: "2 min ago" },
  { user: "Admin", action: "verified", item: "Student ID", time: "15 min ago" },
  { user: "Kiruba S.", action: "found", item: "Calculator", time: "1 hour ago" },
  { user: "System", action: "auto-matched", item: "Textbook", time: "2 hours ago" },
]

export default function AdminPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState<any>(null)

  useEffect(() => {
    // Check if user is authenticated as admin
    const userType = localStorage.getItem("userType")
    const storedUserName = localStorage.getItem("userName")

    if (userType !== "admin") {
      router.push("/login")
      return
    }

    setUserName(storedUserName || "Admin User")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const filteredItems = recentItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reporter.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "verified":
        return "bg-blue-500"
      case "active":
        return "bg-green-500"
      case "resolved":
        return "bg-gray-500"
      default:
        return "bg-gray-400"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="mcc-primary border-b-4 border-brand-accent sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-4">
                <div className="w-12 h-12 mcc-accent rounded-lg flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-brand-text-light" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-brand-text-light font-serif">MCC Admin Dashboard</span>
                  <span className="text-xs text-gray-300 font-medium">Lost & Found Management</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <UserCheck className="w-4 h-4" />
                <span className="font-medium">Welcome, {userName}</span>
              </div>
              <Button variant="ghost" size="icon" className="relative hover:bg-white/10 text-brand-text-light">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-4 h-4 mcc-accent rounded-full text-xs text-brand-text-light flex items-center justify-center font-bold">
                  {dashboardStats.pendingVerification}
                </div>
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-white/10 text-brand-text-light font-medium"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 mcc-text-primary font-serif">Admin Dashboard</h1>
          <p className="text-brand-text-dark text-lg">Manage and oversee the MCC Lost & Found system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="mcc-card hover:shadow-xl transition-all duration-300 border-2 border-brand-primary/20 cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 mcc-text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold mcc-text-primary mb-1">{dashboardStats.totalItems}</div>
              <div className="text-brand-text-dark font-medium">Total Items</div>
              <Progress value={75} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="mcc-card hover:shadow-xl transition-all duration-300 border-2 border-green-200 cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-green-700 mb-1">{dashboardStats.activeItems}</div>
              <div className="text-brand-text-dark font-medium">Active Items</div>
              <Progress value={60} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="mcc-card hover:shadow-xl transition-all duration-300 border-2 border-brand-accent/20 cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 mcc-text-accent" />
                </div>
              </div>
              <div className="text-3xl font-bold mcc-text-accent mb-1">{dashboardStats.resolvedThisWeek}</div>
              <div className="text-brand-text-dark font-medium">Resolved This Week</div>
              <Progress value={40} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="mcc-card hover:shadow-xl transition-all duration-300 border-2 border-yellow-200 cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-yellow-700 mb-1">{dashboardStats.pendingVerification}</div>
              <div className="text-brand-text-dark font-medium">Pending Verification</div>
              <div className="flex items-center justify-center mt-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs text-gray-500 font-medium">Needs Attention</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items Management */}
          <div className="lg:col-span-2">
            <Card className="mcc-card border-2 border-brand-primary/20">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold mcc-text-primary">Recent Items</CardTitle>
                    <CardDescription>Manage reported lost and found items</CardDescription>
                  </div>
                  <Button className="mcc-accent hover:bg-red-800">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search items or reporters..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 border border-gray-200"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)} animate-pulse`}></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold mcc-text-primary">{item.title}</h3>
                            <Badge
                              variant={item.type === "lost" ? "destructive" : "default"}
                              className={item.type === "lost" ? "bg-red-500 text-white" : "bg-green-500 text-white"}
                            >
                              {item.type}
                            </Badge>
                            <span className={`text-sm font-medium ${getUrgencyColor(item.urgency)}`}>
                              {item.urgency.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-brand-text-dark">
                            <span>{item.reporter}</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.building}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${getStatusColor(item.status)} text-white border-0`}>
                          {item.status}
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="mcc-text-primary">{item.title}</DialogTitle>
                              <DialogDescription>Item details and management options</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="font-medium">Type:</span> {item.type}
                                </div>
                                <div>
                                  <span className="font-medium">Status:</span> {item.status}
                                </div>
                                <div>
                                  <span className="font-medium">Reporter:</span> {item.reporter}
                                </div>
                                <div>
                                  <span className="font-medium">Building:</span> {item.building}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button className="mcc-accent hover:bg-red-800">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Verify Item
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject Item
                                </Button>
                                <Button variant="outline">
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Contact Reporter
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div className="space-y-6">
            <Card className="mcc-card border-2 border-brand-primary/20">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg font-semibold mcc-text-primary">Recent Activity</CardTitle>
                <CardDescription>Live system activity feed</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 border-2 border-brand-primary/20">
                        <AvatarFallback className="text-xs font-semibold bg-blue-100 mcc-text-primary">
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <strong className="mcc-text-primary">{activity.user}</strong> {activity.action}{" "}
                          <strong className="mcc-text-accent">{activity.item}</strong>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mcc-card border-2 border-green-200">
              <CardHeader className="bg-green-50 border-b">
                <CardTitle className="text-lg font-semibold text-green-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700 text-white">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
