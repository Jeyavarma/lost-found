'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Users, 
  Clock,
  Download,
  Calendar,
  PieChart,
  Activity
} from 'lucide-react'
import Navigation from '@/components/navigation'
import { isAuthenticated, getUserData, getAuthToken } from '@/lib/auth'
import { BACKEND_URL } from '@/lib/config'

interface AnalyticsData {
  itemsTrend: any[]
  categoryStats: any[]
  locationStats: any[]
  userActivityStats: any[]
  departmentStats: any[]
  resolutionStats: {
    avgResolutionTime: number
    minResolutionTime: number
    maxResolutionTime: number
    totalResolved: number
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [exportType, setExportType] = useState('items')
  const [dateRange, setDateRange] = useState('30')

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
      const response = await fetch(`${BACKEND_URL}/api/analytics/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('Analytics fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    try {
      const token = getAuthToken()
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - parseInt(dateRange))
      
      const response = await fetch(
        `${BACKEND_URL}/api/analytics/export/${exportType}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${exportType}_report_${dateRange}days.json`
        a.click()
      }
    } catch (error) {
      console.error('Export error:', error)
    }
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
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mcc-text-primary font-serif mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Comprehensive insights and reports
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="items">Items</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="activities">Activities</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={exportData} className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="mcc-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Resolution Time</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {data?.resolutionStats.avgResolutionTime?.toFixed(1) || 0}h
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="mcc-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {data?.resolutionStats.totalResolved || 0}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="mcc-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categories Tracked</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {data?.categoryStats.length || 0}
                  </p>
                </div>
                <PieChart className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="mcc-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Locations</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {data?.locationStats.length || 0}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Performance */}
          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Category Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.categoryStats.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{category._id || 'Uncategorized'}</p>
                      <p className="text-sm text-gray-600">
                        {category.total} total • {category.resolved} resolved
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        className={`${
                          category.successRate > 70 ? 'bg-green-500' :
                          category.successRate > 40 ? 'bg-yellow-500' : 'bg-red-500'
                        } text-white`}
                      >
                        {category.successRate.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location Heatmap */}
          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Hotspots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.locationStats.slice(0, 10).map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{location._id}</p>
                      <p className="text-sm text-gray-600">
                        {location.lostCount} lost • {location.foundCount} found
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{location.count}</p>
                      <p className="text-xs text-gray-500">total items</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Activity */}
          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                User Activity (7 days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.userActivityStats.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border-b">
                    <span className="capitalize">{activity._id.replace('_', ' ')}</span>
                    <Badge variant="outline">{activity.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Activity */}
          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Department Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data?.departmentStats.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border-b">
                    <div>
                      <p className="font-medium">{dept._id || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">{dept.userCount} users</p>
                    </div>
                    <Badge className="bg-blue-500 text-white">
                      {dept.itemsReported} items
                    </Badge>
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