'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, TrendingUp, Users, Package, Clock, CheckCircle, AlertTriangle, Calendar, Download, RefreshCw } from 'lucide-react'
import Navigation from '@/components/navigation'
import { isAuthenticated, getUserData, getAuthToken } from '@/lib/auth'
import { BACKEND_URL } from '@/lib/config'

interface AnalyticsData {
  totalUsers: number
  totalItems: number
  lostItems: number
  foundItems: number
  resolvedItems: number
  todayReports: number
  weeklyReports: number[]
  categoryStats: { category: string; count: number }[]
  locationStats: { location: string; count: number }[]
  userActivity: { date: string; reports: number; resolutions: number }[]
  topReporters: { name: string; email: string; count: number }[]
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalItems: 0,
    lostItems: 0,
    foundItems: 0,
    resolvedItems: 0,
    todayReports: 0,
    weeklyReports: [],
    categoryStats: [],
    locationStats: [],
    userActivity: [],
    topReporters: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [error, setError] = useState('')

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
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      
      // Fetch basic stats
      const statsResponse = await fetch(`${BACKEND_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        
        // Generate mock analytics data based on real stats
        const mockWeeklyReports = Array.from({length: 7}, () => Math.floor(Math.random() * 10) + 1)
        const mockCategoryStats = [
          { category: 'Electronics', count: Math.floor(statsData.totalItems * 0.3) },
          { category: 'Books', count: Math.floor(statsData.totalItems * 0.25) },
          { category: 'Clothing', count: Math.floor(statsData.totalItems * 0.2) },
          { category: 'Accessories', count: Math.floor(statsData.totalItems * 0.15) },
          { category: 'Documents', count: Math.floor(statsData.totalItems * 0.1) }
        ]
        
        const mockLocationStats = [
          { location: 'Library', count: Math.floor(statsData.totalItems * 0.25) },
          { location: 'Cafeteria', count: Math.floor(statsData.totalItems * 0.2) },
          { location: 'Main Building', count: Math.floor(statsData.totalItems * 0.18) },
          { location: 'Hostel A', count: Math.floor(statsData.totalItems * 0.15) },
          { location: 'Sports Complex', count: Math.floor(statsData.totalItems * 0.12) }
        ]
        
        const mockUserActivity = Array.from({length: 7}, (_, i) => ({
          date: new Date(Date.now() - (6-i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          reports: Math.floor(Math.random() * 8) + 2,
          resolutions: Math.floor(Math.random() * 5) + 1
        }))
        
        const mockTopReporters = [
          { name: 'Priya Sharma', email: 'priya@mcc.edu', count: 12 },
          { name: 'Rahul Kumar', email: 'rahul@mcc.edu', count: 8 },
          { name: 'Ananya Patel', email: 'ananya@mcc.edu', count: 6 },
          { name: 'Vikram Singh', email: 'vikram@mcc.edu', count: 5 },
          { name: 'Meera Reddy', email: 'meera@mcc.edu', count: 4 }
        ]
        
        setAnalytics({
          totalUsers: statsData.totalUsers,
          totalItems: statsData.totalItems,
          lostItems: statsData.lostItems,
          foundItems: statsData.foundItems,
          resolvedItems: statsData.resolvedItems || statsData.foundItems,
          todayReports: statsData.todayReports || 0,
          weeklyReports: mockWeeklyReports,
          categoryStats: mockCategoryStats,
          locationStats: mockLocationStats,
          userActivity: mockUserActivity,
          topReporters: mockTopReporters
        })
      } else {
        setError('Failed to fetch analytics data')
      }
    } catch (error) {
      setError('Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Users', analytics.totalUsers],
      ['Total Items', analytics.totalItems],
      ['Lost Items', analytics.lostItems],
      ['Found Items', analytics.foundItems],
      ['Resolved Items', analytics.resolvedItems],
      ['Today Reports', analytics.todayReports],
      ['', ''],
      ['Category', 'Count'],
      ...analytics.categoryStats.map(stat => [stat.category, stat.count]),
      ['', ''],
      ['Location', 'Count'],
      ...analytics.locationStats.map(stat => [stat.location, stat.count])
    ]
    
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mcc-analytics-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mcc-text-primary font-serif mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">System insights and performance metrics</p>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportData} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button onClick={fetchAnalytics} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="mcc-card">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{analytics.totalUsers}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </CardContent>
          </Card>
          
          <Card className="mcc-card">
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{analytics.totalItems}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </CardContent>
          </Card>
          
          <Card className="mcc-card">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{analytics.lostItems}</p>
              <p className="text-sm text-gray-600">Lost Items</p>
            </CardContent>
          </Card>
          
          <Card className="mcc-card">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{analytics.foundItems}</p>
              <p className="text-sm text-gray-600">Found Items</p>
            </CardContent>
          </Card>
          
          <Card className="mcc-card">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{analytics.resolvedItems}</p>
              <p className="text-sm text-gray-600">Resolved</p>
            </CardContent>
          </Card>
          
          <Card className="mcc-card">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-indigo-600">{analytics.todayReports}</p>
              <p className="text-sm text-gray-600">Today</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution */}
          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Items by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.categoryStats.map((stat, index) => (
                  <div key={stat.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-yellow-500' :
                        index === 3 ? 'bg-purple-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium">{stat.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-yellow-500' :
                            index === 3 ? 'bg-purple-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${(stat.count / analytics.totalItems) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold w-8">{stat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location Distribution */}
          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Items by Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.locationStats.map((stat, index) => (
                  <div key={stat.location} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${
                        index === 0 ? 'bg-indigo-500' :
                        index === 1 ? 'bg-pink-500' :
                        index === 2 ? 'bg-teal-500' :
                        index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="text-sm font-medium">{stat.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-indigo-500' :
                            index === 1 ? 'bg-pink-500' :
                            index === 2 ? 'bg-teal-500' :
                            index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                          }`}
                          style={{ width: `${(stat.count / analytics.totalItems) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold w-8">{stat.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Weekly Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.userActivity.map((activity, index) => (
                  <div key={activity.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{activity.date}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-blue-600">{activity.reports} reports</span>
                      <span className="text-green-600">{activity.resolutions} resolved</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topReporters.map((reporter, index) => (
                  <div key={reporter.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{reporter.name}</p>
                      <p className="text-xs text-gray-600">{reporter.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{reporter.count}</span>
                      <span className="text-xs text-gray-500">reports</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}