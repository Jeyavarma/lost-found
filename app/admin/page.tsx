'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, 
  Package, 
  Settings, 
  BarChart3,
  Shield,
  UserPlus,
  Database,
  Activity,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Key,
  RefreshCw,
  AlertTriangle,
  Clock,
  MessageSquare,
  FileCheck,
  XCircle,
  Search
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
  pendingClaims: number
  verifiedClaims: number
}

interface Item {
  _id: string
  title: string
  description: string
  category: string
  status: 'lost' | 'found' | 'claimed' | 'verified'
  location: string
  createdAt: string
  itemImageUrl?: string
  imageUrl?: string
  reportedBy?: {
    _id: string
    name: string
    email: string
  }
  claimedBy?: {
    _id: string
    name: string
    email: string
  }
  claimDate?: string
  verificationStatus?: 'pending' | 'approved' | 'rejected'
  adminNotes?: string
}

interface Claim {
  _id: string
  itemId: string
  claimantId: string
  ownershipProof: string
  additionalInfo: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  item: Item
  claimant: {
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
    pendingClaims: 0,
    verifiedClaims: 0
  })
  const [recentItems, setRecentItems] = useState<Item[]>([])
  const [pendingClaims, setPendingClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showClaimDetails, setShowClaimDetails] = useState<Claim | null>(null)
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
  const [adminNotes, setAdminNotes] = useState('')
  const [showEditUser, setShowEditUser] = useState(false)
  const [editUserData, setEditUserData] = useState({
    _id: '',
    name: '',
    email: '',
    role: 'student',
    phone: '',
    studentId: '',
    department: '',
    year: '',
    shift: ''
  })
  const [showEditItem, setShowEditItem] = useState(false)
  const [editItemData, setEditItemData] = useState({
    _id: '',
    title: '',
    description: '',
    category: '',
    status: '',
    location: '',
    contactInfo: ''
  })

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
    setLoading(true)
    setError('')
    try {
      const token = getAuthToken()
      console.log('🔗 Backend URL:', BACKEND_URL)
      console.log('🔑 Token:', token ? 'Present' : 'Missing')
      
      // Test basic connectivity first
      console.log('🧪 Testing backend connectivity...')
      const testResponse = await fetch(`${BACKEND_URL}/api/admin/test`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      console.log('🧪 Test response:', testResponse.status)
      
      if (!testResponse.ok) {
        const testError = await testResponse.text()
        console.error('❌ Backend connection failed:', testError)
        setError(`Backend connection failed: ${testResponse.status} - ${testError}`)
        return
      }
      
      // Fetch live data from backend
      console.log('📊 Fetching admin stats...')
      const statsResponse = await fetch(`${BACKEND_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      console.log('📊 Stats response:', statsResponse.status)
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        console.log('✅ Stats data received:', statsData)
        setStats({
          totalUsers: statsData.totalUsers || 0,
          totalItems: statsData.totalItems || 0,
          lostItems: statsData.lostItems || 0,
          foundItems: statsData.foundItems || 0,
          pendingClaims: statsData.pendingItems || 0,
          verifiedClaims: statsData.resolvedItems || 0
        })
      } else {
        const errorText = await statsResponse.text()
        console.error('❌ Stats API error:', errorText)
        setError(`Stats API failed: ${statsResponse.status} - ${errorText}`)
        return
      }
      
      // Fetch recent items
      console.log('📦 Fetching recent items...')
      const itemsResponse = await fetch(`${BACKEND_URL}/api/admin/recent-items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      console.log('📦 Items response:', itemsResponse.status)
      
      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json()
        console.log('✅ Items data received:', itemsData?.length || 0, 'items')
        setRecentItems(itemsData || [])
      } else {
        const errorText = await itemsResponse.text()
        console.error('⚠️ Items API error (non-critical):', errorText)
      }
      
      // Fetch pending claims
      console.log('⏳ Fetching pending claims...')
      const claimsResponse = await fetch(`${BACKEND_URL}/api/admin/claims/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      console.log('⏳ Claims response:', claimsResponse.status)
      
      if (claimsResponse.ok) {
        const claimsData = await claimsResponse.json()
        console.log('✅ Claims data received:', claimsData?.length || 0, 'claims')
        // Convert claims to display format
        const formattedClaims = (claimsData || []).map((item: any) => ({
          _id: item._id,
          itemId: item._id,
          claimantId: item.claimedBy?._id || 'unknown',
          ownershipProof: item.ownershipProof || 'No proof provided',
          additionalInfo: item.additionalClaimInfo || item.description,
          status: 'pending',
          createdAt: item.claimDate || item.createdAt,
          item: item,
          claimant: {
            name: item.claimedBy?.name || 'Anonymous',
            email: item.claimedBy?.email || 'unknown@mcc.edu'
          }
        }))
        setPendingClaims(formattedClaims)
      } else {
        console.error('⚠️ Claims API error (non-critical):', claimsResponse.status)
      }
      
      console.log('🎉 Admin data loaded successfully!')
    } catch (error) {
      console.error('💥 Critical error fetching admin data:', error)
      setError(`Network error: ${error}. Check if backend is running at ${BACKEND_URL}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
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
        const data = await response.json()
        setMessage(data.message)
        setFormData({ name: '', email: '', password: '', role: 'student', phone: '', studentId: '', department: '' })
        setShowCreateUser(false)
        fetchAdminData()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create user')
      }
    } catch (error) {
      setError('Failed to create user')
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: resetEmail, newPassword: 'MCC@2024' })
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessage(data.message)
        setResetEmail('')
        setShowResetPassword(false)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to reset password')
      }
    } catch (error) {
      setError('Failed to reset password')
    }
  }

  const handleClaimAction = async (claimId: string, action: 'approve' | 'reject') => {
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/claims/${claimId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ adminNotes })
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessage(data.message)
        setPendingClaims(prev => prev.filter(claim => claim._id !== claimId))
        setShowClaimDetails(null)
        setAdminNotes('')
        fetchAdminData()
      } else {
        const errorData = await response.json()
        setError(errorData.error || `Failed to ${action} claim`)
      }
    } catch (error) {
      setError(`Failed to ${action} claim`)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        setMessage('Item deleted successfully')
        setRecentItems(prev => prev.filter(item => item._id !== itemId))
        fetchAdminData()
      } else {
        setError('Failed to delete item')
      }
    } catch (error) {
      setError('Failed to delete item')
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${editUserData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editUserData)
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessage(data.message)
        setShowEditUser(false)
        setEditUserData({ _id: '', name: '', email: '', role: 'student', phone: '', studentId: '', department: '', year: '', shift: '' })
        fetchAdminData()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update user')
      }
    } catch (error) {
      setError('Failed to update user')
    }
  }

  const openEditUser = async (userId: string) => {
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setEditUserData({
          _id: userData._id,
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'student',
          phone: userData.phone || '',
          studentId: userData.studentId || '',
          department: userData.department || '',
          year: userData.year || '',
          shift: userData.shift || ''
        })
        setShowEditUser(true)
      } else {
        setError('Failed to fetch user details')
      }
    } catch (error) {
      setError('Failed to fetch user details')
    }
  }

  const handleEditItem = (item: Item) => {
    setEditItemData({
      _id: item._id,
      title: item.title,
      description: item.description,
      category: item.category,
      status: item.status,
      location: item.location,
      contactInfo: item.reportedBy?.email || ''
    })
    setShowEditItem(true)
  }

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/items/${editItemData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editItemData)
      })
      
      if (response.ok) {
        setMessage('Item updated successfully')
        setShowEditItem(false)
        setEditItemData({ _id: '', title: '', description: '', category: '', status: '', location: '', contactInfo: '' })
        fetchAdminData()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update item')
      }
    } catch (error) {
      setError('Failed to update item')
    }
  }

  if (loading && stats.totalUsers === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-12">
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
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mcc-text-primary font-serif mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage the MCC Lost & Found system
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

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="mcc-card">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
              <p className="text-sm text-gray-600">Users</p>
            </CardContent>
          </Card>
          
          <Card className="mcc-card">
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{stats.totalItems}</p>
              <p className="text-sm text-gray-600">Items</p>
            </CardContent>
          </Card>
          
          <Card className="mcc-card">
            <CardContent className="p-4 text-center">
              <Search className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{stats.lostItems}</p>
              <p className="text-sm text-gray-600">Lost</p>
            </CardContent>
          </Card>
          
          <Card className="mcc-card">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{stats.foundItems}</p>
              <p className="text-sm text-gray-600">Found</p>
            </CardContent>
          </Card>
          
          <Card className="mcc-card">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{stats.pendingClaims}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </CardContent>
          </Card>
          
          <Card className="mcc-card">
            <CardContent className="p-4 text-center">
              <FileCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{stats.verifiedClaims}</p>
              <p className="text-sm text-gray-600">Verified</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Admin Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
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

            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="text-lg">Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin/users">
                  <Button className="w-full text-sm" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Users
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button className="w-full text-sm" variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/items">
                  <Button className="w-full text-sm" variant="outline">
                    <Package className="w-4 h-4 mr-2" />
                    Items
                  </Button>
                </Link>
                <Link href="/admin/analytics">
                  <Button className="w-full text-sm" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
                <Link href="/admin/control">
                  <Button className="w-full text-sm" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="mcc-card">
              <CardHeader>
                <CardTitle className="text-lg">System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={fetchAdminData} variant="outline" className="w-full text-sm" disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button onClick={async () => {
                  try {
                    const token = getAuthToken()
                    const response = await fetch(`${BACKEND_URL}/api/admin/test`, {
                      headers: { 'Authorization': `Bearer ${token}` }
                    })
                    const data = await response.json()
                    alert(`Connection test: ${response.ok ? 'SUCCESS' : 'FAILED'}\n${JSON.stringify(data, null, 2)}`)
                  } catch (error) {
                    alert(`Connection test FAILED: ${error}`)
                  }
                }} variant="outline" className="w-full text-sm">
                  <Activity className="w-4 h-4 mr-2" />
                  Test API
                </Button>
                <Button onClick={async () => {
                  if (!confirm('Populate production database with sample data?')) return
                  try {
                    const response = await fetch(`${BACKEND_URL}/api/seed/populate`, {
                      method: 'POST'
                    })
                    const data = await response.json()
                    alert(`Database populated: ${data.users} users, ${data.items} items`)
                    fetchAdminData()
                  } catch (error) {
                    alert(`Failed to populate database: ${error}`)
                  }
                }} variant="outline" className="w-full text-sm">
                  <Database className="w-4 h-4 mr-2" />
                  Populate DB
                </Button>
                <Button onClick={async () => {
                  try {
                    const token = getAuthToken()
                    const response = await fetch(`${BACKEND_URL}/api/admin/export-database`, {
                      headers: { 'Authorization': `Bearer ${token}` }
                    })
                    
                    if (response.ok) {
                      const blob = await response.blob()
                      const url = window.URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `mcc-backup-${new Date().toISOString().split('T')[0]}.json`
                      a.click()
                      window.URL.revokeObjectURL(url)
                      setMessage('Database backup downloaded successfully')
                    } else {
                      setError('Failed to create backup')
                    }
                  } catch (error) {
                    setError('Failed to create backup')
                  }
                }} variant="outline" className="w-full text-sm">
                  <Database className="w-4 h-4 mr-2" />
                  Backup
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Pending Claims - Priority Section */}
            <Card className="mcc-card border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="w-5 h-5" />
                  Pending Claims ({pendingClaims.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingClaims.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600">No pending claims</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingClaims.map((claim) => (
                      <div key={claim._id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{claim.item.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">Claimed by: {claim.claimant.name}</p>
                            <p className="text-sm text-gray-700">Proof: {claim.ownershipProof}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => setShowClaimDetails(claim)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleClaimAction(claim._id, 'approve')}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleClaimAction(claim._id, 'reject')}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

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
                <div className="space-y-3">
                  {recentItems.map((item) => (
                    <div key={item._id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{item.title}</h4>
                            <Badge className={item.status === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}>
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{item.reportedBy?.name}</span>
                            <span>{item.location}</span>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600"
                            onClick={() => handleDeleteItem(item._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Claim Details Modal */}
        {showClaimDetails && (
          <Dialog open={!!showClaimDetails} onOpenChange={() => setShowClaimDetails(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Claim Verification</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Item Details</h4>
                    <p><strong>Title:</strong> {showClaimDetails.item.title}</p>
                    <p><strong>Description:</strong> {showClaimDetails.item.description}</p>
                    <p><strong>Location:</strong> {showClaimDetails.item.location}</p>
                    <p><strong>Category:</strong> {showClaimDetails.item.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Claimant Details</h4>
                    <p><strong>Name:</strong> {showClaimDetails.claimant.name}</p>
                    <p><strong>Email:</strong> {showClaimDetails.claimant.email}</p>
                    <p><strong>Claim Date:</strong> {new Date(showClaimDetails.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Ownership Proof</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded">{showClaimDetails.ownershipProof}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Additional Information</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded">{showClaimDetails.additionalInfo}</p>
                </div>
                
                <div>
                  <Label htmlFor="adminNotes">Admin Notes</Label>
                  <Textarea 
                    id="adminNotes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add verification notes..."
                    className="mt-1"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => handleClaimAction(showClaimDetails._id, 'approve')}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Claim
                  </Button>
                  <Button 
                    onClick={() => handleClaimAction(showClaimDetails._id, 'reject')}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Claim
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowClaimDetails(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit User Modal */}
        <Dialog open={showEditUser} onOpenChange={setShowEditUser}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit User Details</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input value={editUserData.name} onChange={(e) => setEditUserData({...editUserData, name: e.target.value})} required />
                </div>
                <div>
                  <Label>Email Address *</Label>
                  <Input type="email" value={editUserData.email} onChange={(e) => setEditUserData({...editUserData, email: e.target.value})} required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Role *</Label>
                  <Select value={editUserData.role} onValueChange={(value) => setEditUserData({...editUserData, role: value})}>
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
                <div>
                  <Label>Phone Number</Label>
                  <Input value={editUserData.phone} onChange={(e) => setEditUserData({...editUserData, phone: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Student ID</Label>
                  <Input value={editUserData.studentId} onChange={(e) => setEditUserData({...editUserData, studentId: e.target.value})} />
                </div>
                <div>
                  <Label>Department</Label>
                  <Select value={editUserData.department} onValueChange={(value) => setEditUserData({...editUserData, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                      <SelectItem value="Civil">Civil</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Commerce">Commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Year</Label>
                  <Select value={editUserData.year} onValueChange={(value) => setEditUserData({...editUserData, year: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="I">I Year</SelectItem>
                      <SelectItem value="II">II Year</SelectItem>
                      <SelectItem value="III">III Year</SelectItem>
                      <SelectItem value="IV">IV Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Shift</Label>
                  <Select value={editUserData.shift} onValueChange={(value) => setEditUserData({...editUserData, shift: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Afternoon">Afternoon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                  Update User
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowEditUser(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Item Modal */}
        <Dialog open={showEditItem} onOpenChange={setShowEditItem}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input 
                    value={editItemData.title} 
                    onChange={(e) => setEditItemData({...editItemData, title: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select value={editItemData.category} onValueChange={(value) => setEditItemData({...editItemData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Books">Books</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Documents">Documents</SelectItem>
                      <SelectItem value="Keys">Keys</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Description *</Label>
                <Textarea 
                  value={editItemData.description} 
                  onChange={(e) => setEditItemData({...editItemData, description: e.target.value})} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Status *</Label>
                  <Select value={editItemData.status} onValueChange={(value) => setEditItemData({...editItemData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="found">Found</SelectItem>
                      <SelectItem value="claimed">Claimed</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location *</Label>
                  <Input 
                    value={editItemData.location} 
                    onChange={(e) => setEditItemData({...editItemData, location: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                  Update Item
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowEditItem(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}