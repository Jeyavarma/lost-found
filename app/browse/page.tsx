"use client"

import { useState, useEffect } from "react"
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

const culturalEvents = [
  "All Events",
  "Deepwoods",
  "Moonshadow",
  "Octavia",
  "Barnes Hall Day",
  "Martin Hall Day",
  "Games Fury",
  "Founders Day"
]

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [typeFilter, setTypeFilter] = useState("All")
  const [buildingFilter, setBuildingFilter] = useState("All Buildings")
  const [urgencyFilter, setUrgencyFilter] = useState("All")
  const [eventFilter, setEventFilter] = useState("All Events")
  const [showRewardOnly, setShowRewardOnly] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [allItems, setAllItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('https://lost-found-79xn.onrender.com/api/items')
        if (response.ok) {
          const data = await response.json()
          setAllItems(data)
        }
      } catch (error) {
        console.error('Error fetching items:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  const filteredItems = allItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "All Categories" || 
      (item.category && item.category.toLowerCase().trim() === categoryFilter.toLowerCase().trim()) ||
      (!item.category && categoryFilter === "Other")
    const matchesType = typeFilter === "All" || item.status === typeFilter
    const matchesBuilding = buildingFilter === "All Buildings" || 
      (item.location && item.location.toLowerCase().includes(buildingFilter.toLowerCase()))
    const matchesEvent = eventFilter === "All Events" || 
      (item.eventName && item.eventName === eventFilter)

    return matchesSearch && matchesCategory && matchesType && matchesBuilding && matchesEvent
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default:
        return 0
    }
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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 mcc-text-primary font-serif">Browse All Items</h1>
          <p className="text-sm sm:text-md lg:text-lg text-brand-text-dark">Discover lost and found items from across MCC campus</p>
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
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 mb-6 lg:mb-0`}>
            <Card className="sticky top-24 mcc-card border-2 border-brand-primary/20 max-h-[calc(100vh-7rem)] flex flex-col">
              <CardHeader className="bg-gray-50 border-b flex-shrink-0">
                <CardTitle className="flex items-center gap-2 mcc-text-primary">
                  <SlidersHorizontal className="w-5 h-5" />
                  Advanced Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
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

                {/* Cultural Event */}
                <div>
                  <Label className="text-sm font-medium mb-2 block mcc-text-primary">Cultural Event</Label>
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {culturalEvents.map((event) => (
                        <SelectItem key={event} value={event}>
                          {event}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <div>
                <p className="text-sm sm:text-base text-brand-text-dark">
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
                  <span className="hidden sm:inline ml-1">Grid</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "mcc-primary text-brand-text-light" : ""}
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">List</span>
                </Button>
              </div>
            </div>

            {/* Items Display */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-40 sm:h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-3 sm:p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {sortedItems.map((item) => (
                  <Card
                    key={item._id}
                    className="mcc-card hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden border-2 border-gray-200"
                  >
                    <div className="relative">
                      <img
                        src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `https://lost-found-79xn.onrender.com${item.imageUrl}`) : "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className={`absolute top-2 left-2 w-3 h-3 rounded-full ${getUrgencyColor(item.urgency)} animate-pulse`}
                      ></div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Badge
                          variant={item.status === "lost" ? "destructive" : "default"}
                          className={`shadow-md ${item.status === "lost" ? "bg-red-500" : "bg-green-500"} text-white`}
                        >
                          {item.status === "lost" ? "Lost" : "Found"}
                        </Badge>

                      </div>

                    </div>

                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs border-brand-primary/30 mcc-text-primary">
                          {item.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>

                      <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-brand-primary transition-colors font-serif">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="mb-3 line-clamp-2 text-brand-text-dark">
                        {item.description}
                      </CardDescription>

                      <div className="space-y-1 text-xs sm:text-sm text-brand-text-dark mb-3 sm:mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 mcc-text-primary" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 mcc-text-accent" />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>



                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(item._id)}
                            className={`flex items-center gap-1 ${likedItems.has(item._id) ? "text-red-500" : "text-gray-500"}`}
                          >
                            <Heart className={`w-4 h-4 ${likedItems.has(item._id) ? "fill-current" : ""}`} />
                            {likedItems.has(item._id) ? 1 : 0}
                          </Button>

                        </div>
                        <a href={`mailto:${item.reportedBy?.email || item.email}`}>
                          <Button size="sm" className="mcc-accent hover:bg-red-800">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedItems.map((item) => (
                  <Card
                    key={item._id}
                    className="mcc-card hover:shadow-lg transition-all duration-300 border-2 border-gray-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="relative">
                          <img
                            src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `https://lost-found-79xn.onrender.com${item.imageUrl}`) : "/placeholder.svg"}
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
                                  variant={item.status === "lost" ? "destructive" : "default"}
                                  className={item.status === "lost" ? "bg-red-500 text-white" : "bg-green-500 text-white"}
                                >
                                  {item.status === "lost" ? "Lost" : "Found"}
                                </Badge>
                                <Badge variant="outline" className="border-brand-primary/30 mcc-text-primary">
                                  {item.category}
                                </Badge>

                              </div>
                            </div>
                            <span className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-brand-text-dark mb-3 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-brand-text-dark">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 mcc-text-primary" />
                                {item.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 mcc-text-accent" />
                                {new Date(item.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                0
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {likedItems.has(item._id) ? 1 : 0}
                              </div>
                            </div>
                            <a href={`mailto:${item.reportedBy?.email || item.email}`}>
                              <Button size="sm" className="mcc-accent hover:bg-red-800 text-xs sm:text-sm">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Contact
                              </Button>
                            </a>
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
                    setEventFilter("All Events")
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
