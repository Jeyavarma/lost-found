"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Search,
  MapPin,
  Calendar,
  ArrowLeft,
  Heart,
  Eye,
  MessageCircle,
  SlidersHorizontal,
  Grid,
  List,
  GraduationCap,
} from "lucide-react"

// Enhanced college items with MCC student names and no price field
const allItems = [
  {
    id: 1,
    title: 'MacBook Pro 13" M2 (CS Major)',
    category: "Electronics",
    type: "lost",
    location: "Computer Science Building - Room 204",
    date: "2024-01-15",
    description:
      "Silver MacBook Pro with programming stickers (React, Python, GitHub). Has my final project on it! Very urgent as I have a presentation tomorrow.",
    contact: "harish.kumar@mcc.edu.in",
    image: "/placeholder.svg?height=200&width=200&text=MacBook+Pro",
    urgency: "high",
    reward: "$100",
    views: 234,
    likes: 45,
    course: "CS 401 - Software Engineering",
    building: "Computer Science",
    floor: "2nd Floor",
    timeAgo: "2 hours ago",
    tags: ["laptop", "programming", "urgent", "reward", "presentation"],
  },
  {
    id: 2,
    title: "Student ID Card - Kiruba Shankar",
    category: "ID Cards",
    type: "found",
    location: "Student Union - Food Court",
    date: "2024-01-15",
    description:
      "Found student ID for Kiruba Shankar, Biology major, Class of 2025. Card was near the Starbucks counter.",
    contact: "suresh.nathan@mcc.edu.in",
    image: "/placeholder.svg?height=200&width=200&text=Student+ID",
    urgency: "high",
    views: 156,
    likes: 28,
    building: "Student Union",
    floor: "1st Floor",
    timeAgo: "4 hours ago",
    tags: ["id-card", "biology", "urgent", "dining"],
  },
  {
    id: 3,
    title: "TI-84 Plus CE Graphing Calculator",
    category: "Academic",
    type: "lost",
    location: "Mathematics Building - Exam Hall B",
    date: "2024-01-14",
    description:
      "Black TI-84 Plus CE calculator with custom programs installed. Name 'Jeya Prakash' written on back. Lost during Calculus II midterm!",
    contact: "jeya.prakash@mcc.edu.in",
    image: "/placeholder.svg?height=200&width=200&text=Calculator",
    urgency: "high",
    reward: "$30",
    views: 189,
    likes: 37,
    course: "MATH 202 - Calculus II",
    building: "Mathematics",
    floor: "Ground Floor",
    timeAgo: "1 day ago",
    tags: ["calculator", "math", "exam", "urgent", "programs"],
  },
  {
    id: 4,
    title: "Organic Chemistry Textbook (Clayden 8th Ed)",
    category: "Textbooks",
    type: "found",
    location: "Science Library - Study Room 3",
    date: "2024-01-14",
    description:
      "Organic Chemistry by Clayden et al., 8th edition. Extensively highlighted with handwritten notes throughout. Found abandoned on study desk.",
    contact: "kiruba.devi@mcc.edu.in",
    image: "/placeholder.svg?height=200&width=200&text=Chemistry+Book",
    urgency: "medium",
    views: 98,
    likes: 19,
    course: "CHEM 301 - Organic Chemistry",
    building: "Science Library",
    floor: "2nd Floor",
    timeAgo: "1 day ago",
    tags: ["textbook", "chemistry", "expensive", "notes"],
  },
]

const categories = [
  "All Categories",
  "Electronics",
  "Textbooks",
  "ID Cards",
  "Keys",
  "Academic",
  "Personal Items",
  "Clothing",
  "Sports Equipment",
  "Other",
]

const buildings = [
  "All Buildings",
  "Computer Science",
  "Mathematics",
  "Science Library",
  "Student Union",
  "Recreation Center",
  "Dining Hall",
  "Engineering",
  "Library",
]

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [typeFilter, setTypeFilter] = useState("All")
  const [buildingFilter, setBuildingFilter] = useState("All Buildings")
  const [urgencyFilter, setUrgencyFilter] = useState("All")
  const [showRewardOnly, setShowRewardOnly] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter
    const matchesType = typeFilter === "All" || item.type === typeFilter
    const matchesBuilding = buildingFilter === "All Buildings" || item.building === buildingFilter
    const matchesUrgency = urgencyFilter === "All" || item.urgency === urgencyFilter
    const matchesReward = !showRewardOnly || item.reward

    return matchesSearch && matchesCategory && matchesType && matchesBuilding && matchesUrgency && matchesReward
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "most-viewed":
        return b.views - a.views
      case "most-liked":
        return b.likes - a.likes
      case "urgency":
        const urgencyOrder = { high: 3, medium: 2, low: 1 }
        return (
          urgencyOrder[b.urgency as keyof typeof urgencyOrder] - urgencyOrder[a.urgency as keyof typeof urgencyOrder]
        )
      default:
        return 0
    }
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
              <Link href="/" className="flex items-center space-x-4">
                <div className="w-12 h-12 mcc-accent rounded-lg flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-brand-text-light" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-brand-text-light font-serif">MCC Lost & Found</span>
                  <span className="text-xs text-gray-300 font-medium">Madras Christian College</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" className="flex items-center gap-2 text-brand-text-light hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 mcc-text-primary font-serif">Browse All Items</h1>
          <p className="text-md sm:text-lg text-brand-text-dark">Discover lost and found items from across MCC campus</p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-80`}>
            <Card className="sticky top-24 mcc-card border-2 border-brand-primary/20">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center gap-2 mcc-text-primary">
                  <SlidersHorizontal className="w-5 h-5" />
                  Advanced Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Search */}
                <div>
                  <Label className="text-sm font-medium mb-2 block mcc-text-primary">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-300"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label className="text-sm font-medium mb-2 block mcc-text-primary">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type */}
                <div>
                  <Label className="text-sm font-medium mb-2 block mcc-text-primary">Type</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Items</SelectItem>
                      <SelectItem value="lost">Lost Items</SelectItem>
                      <SelectItem value="found">Found Items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Building */}
                <div>
                  <Label className="text-sm font-medium mb-2 block mcc-text-primary">Building</Label>
                  <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((building) => (
                        <SelectItem key={building} value={building}>
                          {building}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Urgency */}
                <div>
                  <Label className="text-sm font-medium mb-2 block mcc-text-primary">Urgency</Label>
                  <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Urgency</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reward Only */}
                <div className="flex items-center space-x-2">
                  <Switch id="reward-only" checked={showRewardOnly} onCheckedChange={setShowRewardOnly} />
                  <Label htmlFor="reward-only" className="text-sm mcc-text-primary">
                    Show items with rewards only
                  </Label>
                </div>

                {/* Sort By */}
                <div>
                  <Label className="text-sm font-medium mb-2 block mcc-text-primary">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="most-viewed">Most Viewed</SelectItem>
                      <SelectItem value="most-liked">Most Liked</SelectItem>
                      <SelectItem value="urgency">By Urgency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-brand-text-dark">
                  Showing <span className="font-semibold mcc-text-primary">{sortedItems.length}</span> of{" "}
                  <span className="font-semibold mcc-text-primary">{allItems.length}</span> items
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "mcc-primary text-brand-text-light" : ""}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "mcc-primary text-brand-text-light" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Items Display */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedItems.map((item) => (
                  <Card
                    key={item.id}
                    className="mcc-card hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden border-2 border-gray-200"
                  >
                    <div className="relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className={`absolute top-2 left-2 w-3 h-3 rounded-full ${getUrgencyColor(item.urgency)} animate-pulse`}
                      ></div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Badge
                          variant={item.type === "lost" ? "destructive" : "default"}
                          className={`shadow-md ${item.type === "lost" ? "bg-red-500" : "bg-green-500"} text-white`}
                        >
                          {item.type === "lost" ? "Lost" : "Found"}
                        </Badge>
                        {item.reward && (
                          <Badge variant="secondary" className="mcc-accent text-brand-text-light shadow-md">
                            {item.reward}
                          </Badge>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
                        <Eye className="w-3 h-3 text-white" />
                        <span className="text-xs text-white">{item.views}</span>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs border-brand-primary/30 mcc-text-primary">
                          {item.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{item.timeAgo}</span>
                      </div>

                      <CardTitle className="text-lg mb-2 group-hover:text-brand-primary transition-colors font-serif">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="mb-3 line-clamp-2 text-brand-text-dark">
                        {item.description}
                      </CardDescription>

                      <div className="space-y-1 text-sm text-brand-text-dark mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 mcc-text-primary" />
                          <span className="truncate">{item.building}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 mcc-text-accent" />
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(item.id)}
                            className={`flex items-center gap-1 ${likedItems.has(item.id) ? "text-red-500" : "text-gray-500"}`}
                          >
                            <Heart className={`w-4 h-4 ${likedItems.has(item.id) ? "fill-current" : ""}`} />
                            {item.likes + (likedItems.has(item.id) ? 1 : 0)}
                          </Button>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Eye className="w-4 h-4" />
                            {item.views}
                          </div>
                        </div>
                        <Button size="sm" className="mcc-accent hover:bg-red-800">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedItems.map((item) => (
                  <Card
                    key={item.id}
                    className="mcc-card hover:shadow-lg transition-all duration-300 border-2 border-gray-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="relative">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div
                            className={`absolute top-1 left-1 w-2 h-2 rounded-full ${getUrgencyColor(item.urgency)} animate-pulse`}
                          ></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold mb-1 mcc-text-primary font-serif">{item.title}</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant={item.type === "lost" ? "destructive" : "default"}
                                  className={item.type === "lost" ? "bg-red-500 text-white" : "bg-green-500 text-white"}
                                >
                                  {item.type === "lost" ? "Lost" : "Found"}
                                </Badge>
                                <Badge variant="outline" className="border-brand-primary/30 mcc-text-primary">
                                  {item.category}
                                </Badge>
                                {item.reward && (
                                  <Badge variant="secondary" className="mcc-accent text-brand-text-light">
                                    {item.reward}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">{item.timeAgo}</span>
                          </div>
                          <p className="text-brand-text-dark mb-3 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-brand-text-dark">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 mcc-text-primary" />
                                {item.building}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 mcc-text-accent" />
                                {new Date(item.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {item.views}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {item.likes}
                              </div>
                            </div>
                            <Button size="sm" className="mcc-accent hover:bg-red-800">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {sortedItems.length === 0 && (
              <div className="text-center py-16">
                <div className="w-32 h-32 mcc-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Search className="w-16 h-16 text-brand-text-light" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 mcc-text-primary font-serif">No items found</h3>
                <p className="text-gray-500 text-lg mb-4">Try adjusting your filters or search terms.</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setCategoryFilter("All Categories")
                    setTypeFilter("All")
                    setBuildingFilter("All Buildings")
                    setUrgencyFilter("All")
                    setShowRewardOnly(false)
                  }}
                  className="mcc-accent hover:bg-red-800"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
