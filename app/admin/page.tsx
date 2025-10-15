'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Package, 
  BarChart3, 
  Settings, 
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  Database
} from 'lucide-react'
import Link from 'next/link'
import { isAuthenticated, getUserData } from '@/lib/auth'
import { BACKEND_URL } from '@/lib/config'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    pendingItems: 0,
    resolvedItems: 0,
    todayReports: 0,
    successRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        window.location.href = '/login'
        return
      }
      
      const user = getUserData()
      if (user?.role !== 'admin') {
        window.location.href = '/dashboard'
        return
      }
    }

    const fetchStats = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-red-600 border-b-4 border-red-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-white mr-3" />
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-red-600">
                  User View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-serif">System Overview</h1>
          <p className="text-gray-600 mt-2">Manage your MCC Lost & Found system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Items</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingItems}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">{stats.successRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage users, roles, and permissions</p>
              <div className="space-y-2">
                <Link href="/admin/users">
                  <Button className="w-full" variant="outline">View All Users</Button>
                </Link>
                <Link href="/admin/staff">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Create Staff Login</Button>
                </Link>
                <Link href="/admin/dashboard">
                  <Button className="w-full" variant="outline">Create Student Account</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                Item Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage all lost and found items</p>
              <div className="space-y-2">
                <Link href="/admin/items">
                  <Button className="w-full" variant="outline">View All Items</Button>
                </Link>
                <Link href="/admin/items/pending">
                  <Button className="w-full" variant="outline">Pending Approval</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View system analytics and reports</p>
              <div className="space-y-2">
                <Link href="/admin/analytics">
                  <Button className="w-full" variant="outline">View Analytics</Button>
                </Link>
                <Link href="/admin/reports">
                  <Button className="w-full" variant="outline">Generate Reports</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-yellow-600" />
                Content Moderation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Moderate content and handle reports</p>
              <div className="space-y-2">
                <Link href="/admin/moderation">
                  <Button className="w-full" variant="outline">Review Content</Button>
                </Link>
                <Link href="/admin/feedback">
                  <Button className="w-full" variant="outline">User Feedback</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Configure system settings</p>
              <div className="space-y-2">
                <Link href="/admin/settings">
                  <Button className="w-full" variant="outline">System Config</Button>
                </Link>
                <Link href="/admin/categories">
                  <Button className="w-full" variant="outline">Manage Categories</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-red-600" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Backup and export data</p>
              <div className="space-y-2">
                <Link href="/admin/backup">
                  <Button className="w-full" variant="outline">Backup Data</Button>
                </Link>
                <Link href="/admin/export">
                  <Button className="w-full" variant="outline">Export Reports</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}