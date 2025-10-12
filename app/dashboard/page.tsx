"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Package, 
  Search, 
  MessageCircle, 
  Calendar,
  MapPin,
  Eye
} from "lucide-react"
import Navigation from "@/components/navigation"
import { isAuthenticated, getUserData, getAuthToken, type User as AuthUser } from "@/lib/auth"
import Link from "next/link"

interface Item {
  _id: string
  title: string
  description: string
  category: string
  status: 'lost' | 'found'
  location: string
  date: string
  createdAt: string
  itemImageUrl?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [myItems, setMyItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      if (!isAuthenticated()) {
        window.location.href = '/login'
        return
      }

      const userData = getUserData()
      setUser(userData)

      // Load user's items
      try {
        const token = getAuthToken()
        const response = await fetch('https://lost-found-79xn.onrender.com/api/items/my-items', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const items = await response.json()
          setMyItems(items)
        } else {
          setError('Failed to load your items')
        }
      } catch (err) {
        setError('Network error loading items')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [])

  const lostItems = myItems.filter(item => item.status === 'lost')
  const foundItems = myItems.filter(item => item.status === 'found')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mcc-text-primary font-serif mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your lost and found reports from your dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Cards */}
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lost Items</p>
                    <p className="text-xl font-bold text-red-600">{lostItems.length}</p>
                  </div>
                  <Search className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Found Items</p>
                    <p className="text-xl font-bold text-green-600">{foundItems.length}</p>
                  </div>
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-xl font-bold mcc-text-primary">{myItems.length}</p>
                  </div>
                  <MessageCircle className="w-6 h-6 mcc-text-primary" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/report-lost">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    <Search className="w-4 h-4 mr-2" />
                    Report Lost Item
                  </Button>
                </Link>
                <Link href="/report-found">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Package className="w-4 h-4 mr-2" />
                    Report Found Item
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Browse All Items
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">

            {/* Potential Matches */}
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Potential Matches
                </CardTitle>
                <CardDescription>
                  Items that might match your lost reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No potential matches found yet</p>
                  <p className="text-sm text-gray-500">We'll notify you when similar items are reported</p>
                </div>
              </CardContent>
            </Card>

            {/* Lost Items */}
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-red-600" />
                  My Lost Items
                </CardTitle>
                <CardDescription>
                  Items you've reported as lost
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lostItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No lost items reported</p>
                    <Link href="/report-lost">
                      <Button className="bg-red-600 hover:bg-red-700">
                        Report Lost Item
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lostItems.map((item) => (
                      <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            {item.itemImageUrl && (
                              <img 
                                src={item.itemImageUrl} 
                                alt={item.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{item.title}</h3>
                                <Badge className="bg-red-500 text-white">Lost</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {item.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(item.date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Found Items */}
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  My Found Items
                </CardTitle>
                <CardDescription>
                  Items you've reported as found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {foundItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No found items reported</p>
                    <Link href="/report-found">
                      <Button className="bg-green-600 hover:bg-green-700">
                        Report Found Item
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {foundItems.map((item) => (
                      <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            {item.itemImageUrl && (
                              <img 
                                src={item.itemImageUrl} 
                                alt={item.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{item.title}</h3>
                                <Badge className="bg-green-500 text-white">Found</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {item.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {item.date && new Date(item.date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}