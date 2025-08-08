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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Add imports for the new components at the top
import MCCCampusMap from "@/components/mcc-campus-map"
import StudentMessaging from "@/components/student-messaging"
import CulturalEvents from "@/components/cultural-events"

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

const recentActivity = [
  { user: "Harish K.", action: "reported lost", item: "MacBook Pro", time: "2 min ago" },
  { user: "Kiruba S.", action: "found", item: "Student ID", time: "5 min ago" },
  { user: "Jeya P.", action: "reported lost", item: "Calculator", time: "8 min ago" },
  { user: "Suresh N.", action: "found", item: "Dorm Key", time: "12 min ago" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set())
  const [liveUpdates, setLiveUpdates] = useState(recentActivity)
  const [showQuickActions, setShowQuickActions] = useState(true)

  // Add new state variables after the existing ones
  const [selectedBuilding, setSelectedBuilding] = useState("")
  const [showMessaging, setShowMessaging] = useState(false)
  const [showTamilMode, setShowTamilMode] = useState(false)

  const filteredItems = collegeItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesSearch
  })

  const handleLike = (itemId: number) => {
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
              <div className="flex items-center space-x-2 text-sm text-gray-300 bg-green-600 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <span className="font-medium">{liveStats.resolvedThisWeek} resolved this week</span>
              </div>
              <Link href="/browse">
                <Button variant="ghost" className="hover:bg-white/10 text-brand-text-light font-medium">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Items
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="hover:bg-white/10 text-brand-text-light font-medium">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/report-lost">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-red-50 border-red-400 text-red-600 bg-white font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Report Lost
                </Button>
              </Link>
              <Link href="/report-found">
                <Button className="flex items-center gap-2 mcc-accent hover:bg-red-800 font-medium shadow-lg">
                  <Plus className="w-4 h-4" />
                  Report Found
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
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 mcc-accent rounded-full flex items-center justify-center shadow-2xl">
                <Search className="w-10 h-10 text-brand-text-light" />
              </div>
            </div>
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

                    <Button size="lg" className="mcc-accent hover:bg-red-800 shadow-lg">
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
                  onClick={() => setSearchQuery(tag.toLowerCase())}
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

        {/* MCC Campus Map Integration */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mcc-text-primary font-serif">
                {showTamilMode ? "வளாக வரைபடம்" : "Campus Map & Navigation"}
              </h2>
              <p className="text-brand-text-dark">
                {showTamilMode
                  ? "MCC வளாகத்தில் உள்ள கட்டிடங்கள் மற்றும் இடங்கள்"
                  : "Interactive map of MCC buildings and locations"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowTamilMode(!showTamilMode)}
              className="border-brand-primary/30 mcc-text-primary hover:bg-blue-50 bg-transparent"
            >
              {showTamilMode ? "English" : "தமிழ்"}
            </Button>
          </div>
          <MCCCampusMap
            onBuildingSelect={(building) => setSelectedBuilding(building.name)}
            selectedBuilding={selectedBuilding}
          />
        </div>

        {/* Cultural Events Section */}
        <div className="mb-12">
          <CulturalEvents showTamil={showTamilMode} />
        </div>

        {/* Student Messaging System */}
        {showMessaging && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold mcc-text-primary font-serif">
                  {showTamilMode ? "மாணவர் செய்திகள்" : "Student Messages"}
                </h2>
                <p className="text-brand-text-dark">
                  {showTamilMode ? "மற்ற மாணவர்களுடன் தொடர்பு கொள்ளுங்கள்" : "Connect with fellow MCC students"}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowMessaging(false)}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                {showTamilMode ? "மூடு" : "Close"}
              </Button>
            </div>
            <StudentMessaging />
          </div>
        )}

        {/* Live Activity Feed */}
        <Card className="mb-12 mcc-card border-2 border-brand-primary/20">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center gap-3 mcc-text-primary">
              <div className="w-8 h-8 mcc-accent rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-brand-text-light" />
              </div>
              Live Campus Activity
            </CardTitle>
            <CardDescription className="text-brand-text-dark">Real-time updates from the MCC community</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {liveUpdates.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 border border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10 border-2 border-brand-primary/20">
                      <AvatarFallback className="text-sm font-semibold bg-blue-100 mcc-text-primary">
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-brand-text-dark">
                      <strong className="mcc-text-primary">{activity.user}</strong> {activity.action}{" "}
                      <strong className="mcc-text-accent">{activity.item}</strong>
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded-full">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Featured Items with MCC Categories */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mcc-text-primary font-serif">
                {showTamilMode ? "முக்கிய பொருட்கள்" : "Featured Items"}
              </h2>
              <p className="text-brand-text-dark">
                {showTamilMode ? "அவசர மற்றும் முக்கியமான பொருட்கள்" : "High-priority and urgent items from MCC campus"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMessaging(!showMessaging)}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {showTamilMode ? "செய்திகள்" : "Messages"}
              </Button>
              <Button
                variant="outline"
                className="border-brand-primary/30 mcc-text-primary hover:bg-blue-50 bg-transparent"
              >
                {showTamilMode ? "அனைத்தையும் பார்க்கவும்" : "View All Featured"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collegeItems
              .filter((item) => item.urgency === "high")
              .slice(0, 3)
              .map((item) => (
                <Card
                  key={item.id}
                  className="mcc-card border-2 border-red-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                      {showTamilMode ? "அவசரம்" : "URGENT"}
                    </div>
                    {item.reward && (
                      <div className="absolute top-2 right-2 mcc-accent text-brand-text-light px-2 py-1 rounded-full text-xs font-bold">
                        {item.reward}
                      </div>
                    )}
                    {item.culturalEvent && (
                      <div className="absolute bottom-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {showTamilMode ? "நிகழ்வு" : "EVENT"}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 mcc-text-primary">{item.title}</h3>
                    <p className="text-sm text-brand-text-dark mb-3 line-clamp-2">{item.description}</p>
                    <div className="space-y-1 text-xs text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{showTamilMode ? "துறை:" : "Dept:"}</span>
                        {item.department}
                      </div>
                      {item.hostel !== "Not Applicable" && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{showTamilMode ? "விடுதி:" : "Hostel:"}</span>
                          {item.hostel}
                        </div>
                      )}
                      {item.culturalEvent && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{showTamilMode ? "நிகழ்வு:" : "Event:"}</span>
                          {item.culturalEvent}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {item.building}
                      </div>
                      <Button size="sm" className="mcc-accent hover:bg-red-800">
                        {showTamilMode ? "தொடர்பு" : "Contact"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-3 mcc-text-primary font-serif">Recent Items</h2>
          <p className="text-brand-text-dark text-lg">Help your fellow MCC students find their belongings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="mcc-card hover:shadow-2xl transition-all duration-500 group cursor-pointer overflow-hidden border-2 border-gray-200"
            >
              <div className="relative">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className={`absolute top-3 left-3 w-4 h-4 rounded-full ${getUrgencyColor(item.urgency)} animate-pulse shadow-lg`}
                ></div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge
                    variant={item.type === "lost" ? "destructive" : "default"}
                    className={`shadow-lg font-medium ${
                      item.type === "lost" ? "bg-red-500" : "bg-green-500"
                    } text-white`}
                  >
                    {item.type === "lost" ? "Lost" : "Found"}
                  </Badge>
                  {item.reward && (
                    <Badge variant="secondary" className="mcc-accent text-brand-text-light shadow-lg font-medium">
                      {item.reward}
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 rounded-full px-3 py-1 backdrop-blur-sm">
                  <Eye className="w-3 h-3 text-white" />
                  <span className="text-xs text-white font-medium">{item.views}</span>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-xs font-medium border-brand-primary/30 mcc-text-primary">
                    {item.category}
                  </Badge>
                  <span className="text-xs text-gray-500 font-medium">{item.timeAgo}</span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <div>
                      <CardTitle className="text-lg mb-3 group-hover:text-brand-primary transition-colors cursor-pointer font-serif">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="mb-4 line-clamp-2 text-brand-text-dark">
                        {item.description}
                      </CardDescription>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl mcc-card">
                    <DialogHeader>
                      <DialogTitle className="text-2xl mcc-text-primary font-serif">{item.title}</DialogTitle>
                      <DialogDescription>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant={item.type === "lost" ? "destructive" : "default"} className="text-white">
                            {item.type === "lost" ? "Lost" : "Found"}
                          </Badge>
                          <Badge variant="outline" className="border-brand-primary/30 mcc-text-primary">
                            {item.category}
                          </Badge>
                          {item.reward && (
                            <Badge variant="secondary" className="mcc-accent text-brand-text-light">
                              Reward: {item.reward}
                            </Badge>
                          )}
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-72 object-cover rounded-xl shadow-lg"
                        />
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-3 mcc-text-primary">Description</h4>
                          <p className="text-brand-text-dark leading-relaxed">{item.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-blue-50 p-3 rounded-lg border border-brand-primary/20">
                            <span className="font-medium mcc-text-primary">Location:</span>
                            <p className="text-brand-text-dark mt-1">{item.location}</p>
                          </div>
                          <div className="bg-red-50 p-3 rounded-lg border border-brand-accent/20">
                            <span className="font-medium mcc-text-accent">Date:</span>
                            <p className="text-brand-text-dark mt-1">{new Date(item.date).toLocaleDateString()}</p>
                          </div>
                          {item.course && (
                            <div className="col-span-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                              <span className="font-medium text-yellow-800">Related Course:</span>
                              <p className="text-brand-text-dark mt-1">{item.course}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-gray-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <a href={`mailto:${item.contact}`} className="w-full">
                          <Button className="w-full mcc-accent hover:bg-red-800 shadow-lg font-medium">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact {item.type === "lost" ? "Owner" : "Finder"}
                          </Button>
                        </a>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="space-y-2 text-sm text-brand-text-dark mb-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 mcc-text-primary" />
                    <span className="truncate font-medium">
                      {item.building} - {item.floor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 mcc-text-accent" />
                    <span className="font-medium">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-yellow-600" />
                    <span className="truncate font-medium">{item.contact}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center gap-1 hover:bg-red-50 ${
                        likedItems.has(item.id) ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedItems.has(item.id) ? "fill-current" : ""}`} />
                      <span className="font-medium">{(item.likes || 0) + (likedItems.has(item.id) ? 1 : 0)}</span>
                    </Button>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">{item.views}</span>
                    </div>
                  </div>
                  <a href={`mailto:${item.contact}`}>
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

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 mcc-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Search className="w-16 h-16 text-brand-text-light" />
            </div>
            <h3 className="text-3xl font-bold mb-3 mcc-text-primary font-serif">No items found</h3>
            <p className="text-gray-500 text-lg mb-6">Try different keywords or browse all items.</p>
            <Button className="mcc-accent hover:bg-red-800 shadow-lg font-medium">Browse All Items</Button>
          </div>
        )}

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
    </div>
  )
}
