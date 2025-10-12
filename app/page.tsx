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
import Navigation from "@/components/navigation"





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
          fetch('/api/items'),
          fetch('/api/items/recent?limit=10')
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
      <Navigation />

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

      {/* Introduction Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Card className="mcc-card border-2 border-brand-primary/20 bg-gradient-to-br from-red-50 to-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 mcc-primary rounded-full flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-brand-text-light" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mcc-text-primary mb-4 font-serif">Why MCC Lost & Found?</h2>
              <p className="text-lg text-brand-text-dark mb-6 max-w-4xl mx-auto leading-relaxed">
                We understand how stressful it can be to lose important belongings on campus. Our platform connects the entire MCC community to help reunite students with their lost items quickly and efficiently.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-brand-text-dark mb-2">Easy Reporting</h3>
                  <p className="text-sm text-gray-600">Simple forms to report lost or found items with photos and detailed descriptions</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-brand-text-dark mb-2">Direct Contact</h3>
                  <p className="text-sm text-gray-600">Connect directly with finders or owners through secure email communication</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-brand-text-dark mb-2">Community Trust</h3>
                  <p className="text-sm text-gray-600">Built for MCC students by MCC students, fostering campus community spirit</p>
                </div>
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-3 mcc-text-primary font-serif">Browse Items</h2>
            <p className="text-brand-text-dark text-lg">Help your fellow MCC students find their belongings</p>
          </div>
          <Link href="/browse">
            <Button size="lg" className="mcc-accent hover:bg-red-800 px-8 py-3">
              View All Items
            </Button>
          </Link>
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
                      src={item.itemImageUrl || item.imageUrl}
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

        {/* Quick Actions */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 mcc-text-primary font-serif">Get Started</h2>
            <p className="text-brand-text-dark text-lg">Choose an action to help build our campus community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/report-lost">
              <Card className="mcc-card hover:shadow-xl transition-all duration-300 border-2 border-red-200 bg-red-50 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Search className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-red-700 mb-2 font-serif">Report Lost Item</h3>
                  <p className="text-sm text-red-600 mb-4">Lost something on campus? Let the community help you find it</p>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Link>
            <Link href="/report-found">
              <Card className="mcc-card hover:shadow-xl transition-all duration-300 border-2 border-green-200 bg-green-50 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700 mb-2 font-serif">Report Found Item</h3>
                  <p className="text-sm text-green-600 mb-4">Found something? Help reunite it with its owner</p>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    Report Now
                  </Button>
                </CardContent>
              </Card>
            </Link>
            <Link href="/browse">
              <Card className="mcc-card hover:shadow-xl transition-all duration-300 border-2 border-blue-200 bg-blue-50 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-700 mb-2 font-serif">Browse All Items</h3>
                  <p className="text-sm text-blue-600 mb-4">Search through all reported lost and found items</p>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Browse Now
                  </Button>
                </CardContent>
              </Card>
            </Link>
            <Link href="/feedback">
              <Card className="mcc-card hover:shadow-xl transition-all duration-300 border-2 border-purple-200 bg-purple-50 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-700 mb-2 font-serif">Share Feedback</h3>
                  <p className="text-sm text-purple-600 mb-4">Help us improve the platform with your suggestions</p>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Give Feedback
                  </Button>
                </CardContent>
              </Card>
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
                <li><Link href="/feedback" className="hover:text-white transition-colors">Feedback</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Campus Info</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="https://maps.google.com/?q=Madras+Christian+College,+East+Tambaram,+Chennai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">📍 East Tambaram, Chennai</a></li>
                <li>📞 044-2271 5566</li>
                <li><a href="https://www.mcc.edu.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">🌐 www.mcc.edu.in</a></li>
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
