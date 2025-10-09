"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  MapPin,
  Calendar,
  User,
  Plus,
  Shield,
  Heart,
  MessageCircle,
  Star,
  Zap,
  TrendingUp,
  Clock,
  Eye,
  BookOpen,
  GraduationCap,
} from "lucide-react"
import { useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MccCampusMap from "@/components/mcc-campus-map"
import LiveActivity from "@/components/live-activity"
import EventHighlights from "@/components/event-highlights"




// Enhanced mock data with college-specific items and MCC student names
const collegeItems = [
  {
    id: 1,
    title: 'MacBook Pro 13" (B.Sc Computer Science)',
    category: "Electronics",
    type: "lost",
    location: "Science Block",
    date: "2024-01-15",
    description:
      "Silver MacBook Pro with MCC stickers and Tamil programming notes. Lost during Data Structures practical session!",
    contact: "harish.kumar@mcc.edu.in",
    image: "/placeholder.svg?height=200&width=200&text=MacBook+Pro",
    urgency: "high",
    reward: "₹2000",

    course: "B.Sc Computer Science - III Year",
    building: "Computer Science Block",
    floor: "2nd Floor",
    timeAgo: "2 hours ago",
    status: "active",
    tags: ["laptop", "programming", "urgent", "reward", "tamil-notes"],
    department: "Computer Science",
    hostel: "Not Applicable",
    culturalEvent: null,
    semester: "V Semester",
    batch: "2022-2025",
  },
  {
    id: 2,
    title: "Student ID Card - Kiruba Shankar (B.A Tamil)",
    category: "ID Cards",
    type: "found",
    location: "Centenary Hall - Near Stage",
    date: "2024-01-15",
    description:
      "Found student ID for Kiruba Shankar, B.A Tamil Literature, III Year. Found after Annual Day cultural program.",
    contact: "suresh.nathan@mcc.edu.in",
    image: "/placeholder.svg?height=200&width=200&text=Student+ID",
    urgency: "high",
    views: 89,
    likes: 15,
    building: "Centenary Hall",
    floor: "Ground Floor",
    timeAgo: "4 hours ago",
    status: "active",
    tags: ["id-card", "tamil", "cultural-event", "urgent"],
    department: "Tamil Literature",
    hostel: "Kamaraj Hostel",
    culturalEvent: "Annual Day 2024",
    semester: "V Semester",
    batch: "2022-2025",
  },
  {
    id: 3,
    title: "Scientific Calculator (Casio fx-991ES Plus)",
    category: "Academic",
    type: "lost",
    location: "Mathematics Department - Exam Hall",
    date: "2024-01-14",
    description: "Black Casio calculator with 'ஜெயா பிரகாஷ்' (Jeya Prakash) written in Tamil. Lost during Calculus exam!",
    contact: "jeya.prakash@mcc.edu.in",
    image: "/placeholder.svg?height=200&width=200&text=Calculator",
    urgency: "high",
    reward: "₹500",
    views: 156,
    likes: 31,
    course: "B.Sc Mathematics - II Year",
    building: "Mathematics Block",
    floor: "1st Floor",
    timeAgo: "1 day ago",
    status: "active",
    tags: ["calculator", "math", "exam", "urgent", "tamil-name"],
    department: "Mathematics",
    hostel: "Periyar Hostel",
    culturalEvent: null,
    semester: "III Semester",
    batch: "2023-2026",
  },
  {
    id: 4,
    title: "Tamil Literature Book - திருக்குறள் உரை",
    category: "Textbooks",
    type: "found",
    location: "Central Library - Tamil Section",
    date: "2024-01-14",
    description:
      "Tamil commentary on Thirukkural with extensive handwritten notes. Found in Tamil Literature reference section.",
    contact: "kiruba.devi@mcc.edu.in",
    image: "/placeholder.svg?height=200&width=200&text=Tamil+Book",
    urgency: "medium",
    views: 73,
    likes: 12,
    course: "M.A Tamil Literature",
    building: "Central Library",
    floor: "1st Floor",
    timeAgo: "1 day ago",
    status: "active",
    tags: ["textbook", "tamil", "literature", "thirukkural"],
    department: "Tamil Literature",
    hostel: "Bharathi Hostel",
    culturalEvent: null,
    semester: "I Semester",
    batch: "2024-2026",
  },
  {
    id: 5,
    title: "Cricket Kit Bag (MCC Sports Team)",
    category: "Sports Equipment",
    type: "lost",
    location: "Sports Ground - Cricket Pavilion",
    date: "2024-01-13",
    description:
      "Blue cricket kit bag with MCC Sports Team logo. Contains pads, gloves, and helmet. Lost after inter-college match!",
    contact: "sports.captain@mcc.edu.in",
    image: "/placeholder.svg?height=200&width=200&text=Cricket+Kit",
    urgency: "high",
    views: 98,
    likes: 24,
    building: "Sports Complex",
    floor: "Ground Floor",
    timeAgo: "2 days ago",
    status: "active",
    tags: ["sports", "cricket", "team", "urgent", "inter-college"],
    department: "Physical Education",
    hostel: "Kamaraj Hostel",
    culturalEvent: "Inter-College Sports Meet",
    semester: "Not Applicable",
    batch: "Sports Team",
  },
]

// MCC-Specific Data
const mccDepartments = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Tamil Literature",
  "English Literature",
  "Economics",
  "Commerce",
  "Psychology",
  "History",
  "Philosophy",
  "Sociology",
  "Physical Education",
]

const mccBuildings = [
  { name: "Main Building", tamil: "முதன்மை கட்டிடம்", floors: 3 },
  { name: "Computer Science Block", tamil: "கணினி அறிவியல் கட்டிடம்", floors: 3 },
  { name: "Mathematics Block", tamil: "கணித கட்டிடம்", floors: 2 },
  { name: "Science Block", tamil: "அறிவியல் கட்டிடம்", floors: 4 },
  { name: "Central Library", tamil: "மத்திய நூலகம்", floors: 3 },
  { name: "Centenary Hall", tamil: "நூற்றாண்டு மண்டபம்", floors: 2 },
  { name: "Chapel", tamil: "தேவாலயம்", floors: 1 },
  { name: "Sports Complex", tamil: "விளையாட்டு வளாகம்", floors: 2 },
  { name: "Cafeteria", tamil: "உணவகம்", floors: 1 },
  { name: "Administrative Block", tamil: "நிர்வாக கட்டிடம்", floors: 2 },
]

const mccHostels = [
  { name: "Kamaraj Hostel", tamil: "காமராஜ் விடுதி", type: "Boys", capacity: 200 },
  { name: "Periyar Hostel", tamil: "பெரியார் விடுதி", type: "Boys", capacity: 150 },
  { name: "Bharathi Hostel", tamil: "பாரதி விடுதி", type: "Girls", capacity: 180 },
  { name: "Avvaiyar Hostel", tamil: "அவ்வையார் விடுதி", type: "Girls", capacity: 120 },
]

const culturalEvents = [
  "Annual Day 2024",
  "Sports Day",
  "Tamil Literary Meet",
  "Science Exhibition",
  "Cultural Festival",
  "Inter-College Competition",
  "Founder's Day",
  "Christmas Celebration",
]

const liveStats = {
  totalItems: 234,
  activeItems: 89,
  resolvedThisWeek: 18,
  pendingVerification: 12,
}



export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())

  const [showQuickActions, setShowQuickActions] = useState(true)
  const [recentItems, setRecentItems] = useState<any[]>([])
  const [loadingRecent, setLoadingRecent] = useState(true)
  const [allItems, setAllItems] = useState<any[]>([])
  const [loadingItems, setLoadingItems] = useState(true)

  // Add new state variables after the existing ones
  const [showMessaging, setShowMessaging] = useState(false)
  const [showTamilMode, setShowTamilMode] = useState(false)


  // Fetch all items and recent items from backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log('🔄 Fetching all items from backend...')
        const [itemsResponse, recentResponse] = await Promise.all([
          fetch('http://localhost:5000/api/items'),
          fetch('http://localhost:5000/api/items/recent?limit=10')
        ])
        
        if (itemsResponse.ok) {
          const itemsData = await itemsResponse.json()
          console.log('✅ All items loaded:', itemsData.length, 'items')
          setAllItems(itemsData)
        }
        
        if (recentResponse.ok) {
          const recentData = await recentResponse.json()
          console.log('✅ Recent items loaded:', recentData.length, 'items')
          setRecentItems(recentData)
        }
      } catch (error) {
        console.error('❌ Error fetching items:', error)
      } finally {
        setLoadingRecent(false)
        setLoadingItems(false)
      }
    }
    
    fetchItems()
  }, [])

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesSearch
  })

  const handleLike = (itemId: string) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MCC Brand Navigation */}
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
              <Link href="/login">
                <Button variant="ghost" className="hover:bg-red-800 text-brand-text-light font-medium">
                  <User className="w-4 h-4 mr-2" />
                  Login
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
            </div>
          </div>
        </div>
      </nav>

      {/* MCC Brand Hero Section */}
      <div className="mcc-primary text-brand-text-light relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Brand accent stripe */}
        <div className="absolute top-0 left-0 w-full h-1 mcc-accent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">

            <h1 className="text-5xl font-bold mb-4 animate-fade-in font-serif">Lost Something? Found Something?</h1>
            <p className="text-xl mb-2 opacity-95 font-medium">Madras Christian College Community Portal</p>
            <p className="text-lg mb-8 opacity-80">
              Connect with your campus community to reunite with lost belongings
            </p>

            {/* Enhanced Search Bar with Filters */}
            <div className="max-w-4xl mx-auto relative">
              <div className="bg-white rounded-xl p-2 shadow-2xl">
                <div className="flex items-center">
                  <Search className="ml-4 mcc-text-primary w-6 h-6" />
                  <Input
                    type="text"
                    placeholder="Search for textbooks, electronics, ID cards, calculators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-lg text-brand-text-dark placeholder:text-gray-500 focus:ring-0 px-4 py-4"
                  />
                  <div className="flex items-center gap-2 mr-2">

                    <Button 
                      size="lg" 
                      className="mcc-accent hover:bg-red-800 shadow-lg"
                      onClick={() => window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`}
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Search Tags */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {["Electronics", "Textbooks", "ID Cards", "Keys", "Calculators"].map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-white/40 text-brand-text-light hover:bg-white/30 rounded-full font-medium backdrop-blur-sm"
                  onClick={() => window.location.href = `/browse?search=${encodeURIComponent(tag.toLowerCase())}`}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="mcc-card hover:shadow-xl transition-all duration-300 border-2 border-brand-primary/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 mcc-text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold mcc-text-primary mb-1">{liveStats.totalItems}</div>
              <div className="text-brand-text-dark font-medium">Total Items</div>
              <Progress value={75} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="mcc-card hover:shadow-xl transition-all duration-300 border-2 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-green-700 mb-1">{liveStats.activeItems}</div>
              <div className="text-brand-text-dark font-medium">Active Items</div>
              <Progress value={60} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="mcc-card hover:shadow-xl transition-all duration-300 border-2 border-brand-accent/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 mcc-text-accent" />
                </div>
              </div>
              <div className="text-3xl font-bold mcc-text-accent mb-1">{liveStats.resolvedThisWeek}</div>
              <div className="text-brand-text-dark font-medium">Resolved This Week</div>
              <Progress value={40} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="mcc-card hover:shadow-xl transition-all duration-300 border-2 border-yellow-200">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-yellow-700 mb-1">{liveStats.pendingVerification}</div>
              <div className="text-brand-text-dark font-medium">Pending Verification</div>
              <div className="flex items-center justify-center mt-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs text-gray-500 font-medium">Awaiting Review</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MCC Campus Map */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mcc-text-primary font-serif">Campus Map & Navigation</h2>
              <p className="text-brand-text-dark">Interactive map of MCC buildings and locations</p>
            </div>
          </div>
          <MccCampusMap />
        </div>

        {/* Event Highlights */}
        <EventHighlights />

        {/* Live Activity Feed */}
        <div className="mb-12">
          <LiveActivity />
        </div>



        {/* Browse Items */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-3 mcc-text-primary font-serif">Browse Items</h2>
          <p className="text-brand-text-dark text-lg">Help your fellow MCC students find their belongings</p>
        </div>

        {loadingItems ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-52 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.slice(0, 4).map((item) => (
              <Card
                key={item._id}
                className="mcc-card hover:shadow-2xl transition-all duration-500 group cursor-pointer overflow-hidden border-2 border-gray-200"
              >
                <div className="relative">
                  {(item.itemImageUrl || item.imageUrl) ? (
                    <img
                      src={`http://localhost:5000${item.itemImageUrl || item.imageUrl}`}
                      alt={item.title}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge
                      variant={item.status === "lost" ? "destructive" : "default"}
                      className={`shadow-lg font-medium ${
                        item.status === "lost" ? "bg-red-500" : "bg-green-500"
                      } text-white`}
                    >
                      {item.status === "lost" ? "Lost" : "Found"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs font-medium border-brand-primary/30 mcc-text-primary">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <CardTitle className="text-lg mb-3 group-hover:text-brand-primary transition-colors cursor-pointer font-serif">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="mb-4 line-clamp-2 text-brand-text-dark">
                    {item.description}
                  </CardDescription>

                  <div className="space-y-2 text-sm text-brand-text-dark mb-5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 mcc-text-primary" />
                      <span className="truncate font-medium">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium">{item.reportedBy?.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-yellow-600" />
                      <span className="truncate font-medium">{item.reportedBy?.email || item.contactEmail}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(item._id)}
                        className={`flex items-center gap-1 hover:bg-red-50 ${
                          likedItems.has(item._id) ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${likedItems.has(item._id) ? "fill-current" : ""}`} />
                        <span className="font-medium">{likedItems.has(item._id) ? 1 : 0}</span>
                      </Button>
                    </div>
                    <a href={`mailto:${item.reportedBy?.email || item.contactEmail}`}>
                      <Button size="sm" className="mcc-accent hover:bg-red-800 shadow-md font-medium">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Contact
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View All Items Button */}
        <div className="text-center mt-8">
          <Link href="/browse">
            <Button size="lg" className="mcc-accent hover:bg-red-800 px-8 py-3">
              View All Items
            </Button>
          </Link>
        </div>





        {/* Quick Actions */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold mb-8 mcc-text-primary font-serif">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/report-lost">
              <Button
                size="lg"
                variant="outline"
                className="flex items-center gap-3 bg-red-50 border-red-300 text-red-700 hover:bg-red-100 px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all font-medium text-lg"
              >
                <Plus className="w-6 h-6" />
                Report a Lost Item
              </Button>
            </Link>
            <Link href="/report-found">
              <Button
                size="lg"
                className="flex items-center gap-3 mcc-accent hover:bg-red-800 px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all font-medium text-lg"
              >
                <Plus className="w-6 h-6" />
                Report a Found Item
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mcc-primary text-brand-text-light mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 mcc-accent rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-brand-text-light" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif">MCC Lost & Found</h3>
                  <p className="text-sm text-gray-300">Madras Christian College</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Connecting the MCC community to reunite students with their lost belongings. 
                A digital platform built for Madras Christian College students, by students.
              </p>
              <div className="flex space-x-4">
                <div className="text-sm">
                  <span className="font-semibold">📧 Contact:</span>
                  <br />
                  <span className="text-gray-300">lostfound@mcc.edu.in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/report-lost" className="hover:text-white transition-colors">Report Lost Item</Link></li>
                <li><Link href="/report-found" className="hover:text-white transition-colors">Report Found Item</Link></li>
                <li><Link href="/browse" className="hover:text-white transition-colors">Browse Items</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Campus Info</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>📍 East Tambaram, Chennai</li>
                <li>📞 044-2271 5566</li>
                <li>🌐 www.mcc.edu.in</li>
                <li>🕒 24/7 Lost & Found Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              © 2024 MCC Lost & Found. Made with ❤️ for Madras Christian College community.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0 text-sm text-gray-300">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Help</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
