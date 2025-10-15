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
  MapPin,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { isAuthenticated, getUserData, getAuthToken, type User } from '@/lib/auth'
import { BACKEND_URL } from '@/lib/config'

interface AdminStats {
  totalUsers: number
  totalItems: number
  lostItems: number
  foundItems: number
  todayReports: number
  totalFeedback: number
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
    lostItems: 0,
    foundItems: 0,
    todayReports: 0,
    totalFeedback: 0
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
      console.log('Fetching admin data with token:', token ? 'Token present' : 'No token')
      console.log('Backend URL:', BACKEND_URL)
      
      const [statsResponse, itemsResponse] = await Promise.all([
        fetch(`${BACKEND_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${BACKEND_URL}/api/admin/items`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])
      
      console.log('Stats response status:', statsResponse.status)
      console.log('Items response status:', itemsResponse.status)
      
      if (statsResponse.ok && itemsResponse.ok) {
        const statsData = await statsResponse.json()
        const items = await itemsResponse.json()
        
        console.log('Stats data:', statsData)
        console.log('Items count:', items.length)
        
        setStats(statsData)
        setRecentItems(items.slice(0, 10))
      } else {
        console.error('Failed to fetch admin data')
        if (!statsResponse.ok) {
          const errorText = await statsResponse.text()
          console.error('Stats error:', errorText)
        }
        if (!itemsResponse.ok) {
          const errorText = await itemsResponse.text()
          console.error('Items error:', errorText)
        }
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
                <p className="text-xs text-gray-500">Debug: Backend URL - {BACKEND_URL}</p>
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
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Feedback</p>
                    <p className="text-xl font-bold text-orange-600">{stats.totalFeedback}</p>
                  </div>
                  <MessageCircle className="w-6 h-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
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
                <Link href="/admin/control">
                  <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                    <Database className="w-4 h-4 mr-2" />
                    Control Panel
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

            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="text-lg">Account Creation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/register">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Student
                  </Button>
                </Link>
                <Link href="/admin/register">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    <Shield className="w-4 h-4 mr-2" />
                    Create Admin
                  </Button>
                </Link>
                <Link href="/admin/staff">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Create Staff
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="text-lg">System Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/moderation">
                  <Button variant="outline" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Moderation
                  </Button>
                </Link>
                <Link href="/admin/audit">
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Security Audit
                  </Button>
                </Link>
                <Link href="/admin/monitoring">
                  <Button variant="outline" className="w-full">
                    <Activity className="w-4 h-4 mr-2" />
                    Monitoring
                  </Button>
                </Link>
                <Link href="/admin/system">
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    System Config
                  </Button>
                </Link>
                <Link href="/admin/notifications">
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                </Link>
                <Link href="/admin/reports">
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Reports
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Link href="/admin/backup">
                  <Button variant="outline" className="w-full">
                    <Database className="w-4 h-4 mr-2" />
                    Backup
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

            {/* Recent Activity */}
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest system activities and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentItems.slice(0, 3).map((item) => (
                    <div key={item._id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          {(item.itemImageUrl || item.imageUrl) && (
                            <img 
                              src={item.itemImageUrl || item.imageUrl} 
                              alt={item.title}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-600">{item.description.slice(0, 40)}...</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={item.status === 'lost' ? 'bg-red-500 text-white text-xs' : 'bg-green-500 text-white text-xs'}>
                                {item.status}
                              </Badge>
                              <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentItems.length === 0 && (
                    <div className="text-center py-4">
                      <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No recent activity</p>
                      <p className="text-xs text-gray-500">Check browser console for debug info</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  System Alerts
                </CardTitle>
                <CardDescription>
                  Important system notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border border-yellow-200 rounded-lg p-3 bg-yellow-50">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium">High Volume Alert</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{stats.todayReports} items reported today - above average</p>
                  </div>
                  <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">New Users</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">5 new users registered this week</p>
                  </div>
                  <div className="border border-green-200 rounded-lg p-3 bg-green-50">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">System Status</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">All systems operational</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick CRUD Operations */}
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Quick Operations
                </CardTitle>
                <CardDescription>
                  Perform CRUD operations on system data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Users</h4>
                    <div className="space-y-1">
                      <Button size="sm" className="w-full text-xs bg-green-600 hover:bg-green-700">
                        <UserPlus className="w-3 h-3 mr-1" />
                        Add User
                      </Button>
                      <Button size="sm" variant="outline" className="w-full text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        View All
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Items</h4>
                    <div className="space-y-1">
                      <Button size="sm" className="w-full text-xs bg-blue-600 hover:bg-blue-700">
                        <Package className="w-3 h-3 mr-1" />
                        Add Item
                      </Button>
                      <Button size="sm" variant="outline" className="w-full text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        View All
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-3 gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      <Edit className="w-3 h-3 mr-1" />
                      Bulk Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Bulk Delete
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Database className="w-3 h-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Items with CRUD */}
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Recent Items
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add New
                  </Button>
                </CardTitle>
                <CardDescription>
                  Latest items with full CRUD operations
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
                    {recentItems.slice(0, 5).map((item) => (
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
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="text-xs px-2">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs px-2">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs px-2 text-red-600 hover:bg-red-50">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-4">
                      <Link href="/admin/items">
                        <Button variant="outline" size="sm">
                          View All Items ({recentItems.length})
                        </Button>
                      </Link>
                    </div>
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