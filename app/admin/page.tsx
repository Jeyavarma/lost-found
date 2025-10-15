'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  MessageCircle,
  Key,
  UserX,
  RefreshCw,
  Lock
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
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
    studentId: '',
    department: ''
  })
  const [resetEmail, setResetEmail] = useState('')

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
      
      const [statsResponse, itemsResponse] = await Promise.all([
        fetch(`${BACKEND_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${BACKEND_URL}/api/admin/items`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])
      
      if (statsResponse.ok && itemsResponse.ok) {
        const statsData = await statsResponse.json()
        const items = await itemsResponse.json()
        
        setStats(statsData)
        setRecentItems(items.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setMessage(`${formData.role} account created successfully`)
        setFormData({ name: '', email: '', password: '', role: 'student', phone: '', studentId: '', department: '' })
        setShowCreateUser(false)
        fetchAdminData()
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to create user')
      }
    } catch (error) {
      setError('Network error')
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: resetEmail })
      })
      
      if (response.ok) {
        setMessage('Password reset email sent successfully')
        setResetEmail('')
        setShowResetPassword(false)
      } else {
        setError('Failed to send reset email')
      }
    } catch (error) {
      setError('Network error')
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

        {message && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Stats Cards */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
                      <p className="text-sm font-medium text-gray-600">Lost Items</p>
                      <p className="text-2xl font-bold text-red-600">{stats.lostItems}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mcc-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Found Items</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.foundItems}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mcc-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.totalItems > 0 ? Math.round((stats.foundItems / stats.totalItems) * 100) : 0}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Admin Actions Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Admin Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Account</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateUser} className="space-y-4">
                      <div>
                        <Label>Name</Label>
                        <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Password</Label>
                        <Input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full">Create Account</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Key className="w-4 h-4 mr-2" />
                      Reset Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Reset User Password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div>
                        <Label>User Email</Label>
                        <Input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="Enter user email" required />
                      </div>
                      <Button type="submit" className="w-full">Send Reset Email</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

              </CardContent>
            </Card>

            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="text-lg">Management</CardTitle>
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
                    System Control
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="text-lg">System Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={fetchAdminData} variant="outline" className="w-full text-sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
                <Link href="/admin/settings">
                  <Button variant="outline" className="w-full text-sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Link href="/admin/backup">
                  <Button variant="outline" className="w-full text-sm">
                    <Database className="w-4 h-4 mr-2" />
                    Backup
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Recent Items */}
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Recent Items
                  </div>
                  <Link href="/admin/items">
                    <Button size="sm" variant="outline">
                      View All
                    </Button>
                  </Link>
                </CardTitle>
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
                      <div key={item._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
                                  {item.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{item.description.slice(0, 100)}...</p>
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
                            <Link href={`/admin/items`}>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Database</span>
                    </div>
                    <p className="text-sm text-gray-600">Connected and operational</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">API Server</span>
                    </div>
                    <p className="text-sm text-gray-600">Running smoothly</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Performance</span>
                    </div>
                    <p className="text-sm text-gray-600">Optimal response times</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/admin/users">
                    <Button className="w-full h-20 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 text-white">
                      <Users className="w-6 h-6 mb-2" />
                      <span className="text-sm">Users</span>
                    </Button>
                  </Link>
                  <Link href="/admin/items">
                    <Button className="w-full h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700 text-white">
                      <Package className="w-6 h-6 mb-2" />
                      <span className="text-sm">Items</span>
                    </Button>
                  </Link>
                  <Link href="/admin/analytics">
                    <Button className="w-full h-20 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700 text-white">
                      <BarChart3 className="w-6 h-6 mb-2" />
                      <span className="text-sm">Analytics</span>
                    </Button>
                  </Link>
                  <Link href="/admin/control">
                    <Button className="w-full h-20 flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-900 text-white">
                      <Database className="w-6 h-6 mb-2" />
                      <span className="text-sm">Control</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}