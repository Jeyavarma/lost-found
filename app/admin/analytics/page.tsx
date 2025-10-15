'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, Users, Package, Calendar, MapPin, PieChart, Activity } from 'lucide-react'
import Navigation from '@/components/navigation'
import { isAuthenticated, getUserData, getAuthToken } from '@/lib/auth'
import { BACKEND_URL } from '@/lib/config'

interface Stats {
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
  category: string
  status: 'lost' | 'found'
  location: string
  createdAt: string
}

interface User {
  _id: string
  name: string
  role: string
  department?: string
  createdAt: string
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalItems: 0,
    lostItems: 0,
    foundItems: 0,
    todayReports: 0,
    totalFeedback: 0
  })
  const [items, setItems] = useState<Item[]>([])
  const [users, setUsers] = useState<User[]>([])
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
      
      fetchAnalytics()
    }
    
    checkAuth()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const token = getAuthToken()
      
      const [statsResponse, itemsResponse, usersResponse] = await Promise.all([
        fetch(`${BACKEND_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${BACKEND_URL}/api/admin/items`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${BACKEND_URL}/api/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])
      
      if (statsResponse.ok && itemsResponse.ok && usersResponse.ok) {
        const statsData = await statsResponse.json()
        const itemsData = await itemsResponse.json()
        const usersData = await usersResponse.json()
        
        setStats(statsData)
        setItems(itemsData)
        setUsers(usersData)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate category distribution
  const categoryStats = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate location distribution
  const locationStats = items.reduce((acc, item) => {
    acc[item.location] = (acc[item.location] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate monthly trends
  const monthlyStats = items.reduce((acc, item) => {
    const month = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    if (!acc[month]) acc[month] = { lost: 0, found: 0 }
    acc[month][item.status]++
    return acc
  }, {} as Record<string, { lost: number, found: number }>)

  // Calculate user role distribution
  const roleStats = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate department distribution
  const departmentStats = users.reduce((acc, user) => {
    if (user.department) {
      acc[user.department] = (acc[user.department] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const successRate = stats.totalItems > 0 ? Math.round((stats.foundItems / stats.totalItems) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mcc-text-primary font-serif mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">System performance and usage statistics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="mcc-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="mcc-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalItems}</p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="mcc-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{successRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="mcc-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Reports</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.todayReports}</p>
                </div>
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution */}
          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="font-medium">Lost Items</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{stats.lostItems}</p>
                    <p className="text-xs text-gray-500">{stats.totalItems > 0 ? Math.round((stats.lostItems / stats.totalItems) * 100) : 0}%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="font-medium">Found Items</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{stats.foundItems}</p>
                    <p className="text-xs text-gray-500">{stats.totalItems > 0 ? Math.round((stats.foundItems / stats.totalItems) * 100) : 0}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Roles */}
          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(roleStats).map(([role, count]) => (
                  <div key={role} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Badge className={
                        role === 'admin' ? 'bg-red-500 text-white' :
                        role === 'staff' ? 'bg-blue-500 text-white' :
                        'bg-green-500 text-white'
                      }>
                        {role}
                      </Badge>
                    </div>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Categories */}
          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(categoryStats)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / Math.max(...Object.values(categoryStats))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Locations */}
          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Top Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(locationStats)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([location, count]) => (
                    <div key={location} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">{location}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(count / Math.max(...Object.values(locationStats))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card className="mcc-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(monthlyStats)
                .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                .slice(-6)
                .map(([month, data]) => (
                  <div key={month} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{month}</h4>
                      <span className="text-sm text-gray-500">Total: {data.lost + data.found}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span className="text-sm">Lost</span>
                        <span className="font-semibold text-red-600">{data.lost}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">Found</span>
                        <span className="font-semibold text-green-600">{data.found}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        {Object.keys(departmentStats).length > 0 && (
          <Card className="mcc-card mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Department Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(departmentStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([department, count]) => (
                    <div key={department} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{department}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}