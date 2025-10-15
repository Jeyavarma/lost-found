'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Package, 
  Settings, 
  BarChart3,
  Shield,
  UserPlus,
  FileText,
  Database,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { isAuthenticated, getUserData, getAuthToken, type User } from '@/lib/auth'
import { BACKEND_URL } from '@/lib/config'

interface AdminStats {
  totalUsers: number
  totalItems: number
  pendingItems: number
  resolvedItems: number
  todayReports: number
  lostItems: number
  foundItems: number
}

interface Item {
  _id: string
  title: string
  description: string
  category: string
  status: 'lost' | 'found'
  location: string
  createdAt: string
  itemImageUrl?: string
  imageUrl?: string
  reportedBy?: {
    name: string
    email: string
  }
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalItems: 0,
    pendingItems: 0,
    resolvedItems: 0,
    todayReports: 0,
    lostItems: 0,
    foundItems: 0
  })
  const [recentItems, setRecentItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        window.location.href = '/login'
        return
      }
      
      const userData = getUserData()
      if (userData?.role !== 'admin') {
        window.location.href = '/dashboard'
        return
      }
      
      setUser(userData)
      fetchAdminData()
    }
    
    checkAuth()
  }, [])

  const fetchAdminData = async () => {
    try {
      const token = getAuthToken()
      
      // Fetch all items and users to calculate stats
      const [itemsResponse, usersResponse] = await Promise.all([
        fetch(`${BACKEND_URL}/api/items`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${BACKEND_URL}/api/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])
      
      if (itemsResponse.ok && usersResponse.ok) {
        const items = await itemsResponse.json()
        const users = await usersResponse.json()
        
        const today = new Date().toDateString()
        const todayItems = items.filter((item: Item) => 
          new Date(item.createdAt).toDateString() === today
        )
        
        const lostItems = items.filter((item: Item) => item.status === 'lost')
        const foundItems = items.filter((item: Item) => item.status === 'found')
        
        setStats({
          totalUsers: users.length,
          totalItems: items.length,
          pendingItems: lostItems.length,
          resolvedItems: foundItems.length,
          todayReports: todayItems.length,
          lostItems: lostItems.length,
          foundItems: foundItems.length
        })
        
        // Set recent items (last 10)
        setRecentItems(items.slice(0, 10))
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mcc-text-primary font-serif mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Admin Dashboard - Manage the MCC Lost & Found system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="text-lg">System Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-xl font-bold text-blue-600">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-xl font-bold text-green-600">{stats.totalItems}</p>
                  </div>
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lost Items</p>
                    <p className="text-xl font-bold text-red-600">{stats.lostItems}</p>
                  </div>
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Found Items</p>
                    <p className="text-xl font-bold text-purple-600">{stats.foundItems}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="text-lg">Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/users">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/items">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Package className="w-4 h-4 mr-2" />
                    Manage Items
                  </Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
                <Link href="/admin/staff">
                  <Button variant="outline" className="w-full">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Staff
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* System Overview */}
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Overview
                </CardTitle>
                <CardDescription>
                  Real-time system statistics and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Today's Reports</p>
                        <p className="text-2xl font-bold">{stats.todayReports}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Success Rate</p>
                        <p className="text-2xl font-bold">{stats.totalItems > 0 ? Math.round((stats.foundItems / stats.totalItems) * 100) : 0}%</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Active Users</p>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      </div>
                      <Users className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Items */}
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Recent Items
                </CardTitle>
                <CardDescription>
                  Latest items reported in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No recent items</p>
                    <p className="text-sm text-gray-500">Items will appear here as they are reported</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentItems.map((item) => (
                      <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            {(item.itemImageUrl || item.imageUrl) && (
                              <img 
                                src={item.itemImageUrl || item.imageUrl} 
                                alt={item.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{item.title}</h3>
                                <Badge className={item.status === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}>
                                  {item.status === 'lost' ? 'Lost' : 'Found'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>By: {item.reportedBy?.name || 'Anonymous'}</span>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {item.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </div>
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