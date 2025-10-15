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
    try {
      const token = getAuthToken()
      
      // Static data for demo
      setStats({
        totalUsers: 245,
        totalItems: 89,
        lostItems: 34,
        foundItems: 55,
        pendingClaims: 12,
        verifiedClaims: 23
      })
      
      setRecentItems([
        {
          _id: '1',
          title: 'iPhone 13 Pro',
          description: 'Black iPhone with cracked screen',
          category: 'Electronics',
          status: 'lost',
          location: 'Library',
          createdAt: new Date().toISOString(),
          reportedBy: { _id: '1', name: 'John Doe', email: 'john@mcc.edu' }
        },
        {
          _id: '2',
          title: 'Blue Backpack',
          description: 'Nike blue backpack with laptop',
          category: 'Bags',
          status: 'found',
          location: 'Cafeteria',
          createdAt: new Date().toISOString(),
          reportedBy: { _id: '2', name: 'Jane Smith', email: 'jane@mcc.edu' }
        }
      ])
      
      setPendingClaims([
        {
          _id: '1',
          itemId: '1',
          claimantId: '3',
          ownershipProof: 'I have the receipt and can describe the wallpaper',
          additionalInfo: 'Lost it yesterday during lunch break',
          status: 'pending',
          createdAt: new Date().toISOString(),
          item: {
            _id: '1',
            title: 'iPhone 13 Pro',
            description: 'Black iPhone with cracked screen',
            category: 'Electronics',
            status: 'lost',
            location: 'Library',
            createdAt: new Date().toISOString()
          },
          claimant: { name: 'Mike Johnson', email: 'mike@mcc.edu' }
        }
      ])
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(`${formData.role} account created successfully`)
    setFormData({ name: '', email: '', password: '', role: 'student', phone: '', studentId: '', department: '' })
    setShowCreateUser(false)
    fetchAdminData()
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Password reset email sent successfully')
    setResetEmail('')
    setShowResetPassword(false)
  }

  const handleClaimAction = async (claimId: string, action: 'approve' | 'reject') => {
    try {
      setMessage(`Claim ${action}d successfully`)
      setPendingClaims(prev => prev.filter(claim => claim._id !== claimId))
      setShowClaimDetails(null)
      fetchAdminData()
    } catch (error) {
      setError(`Failed to ${action} claim`)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      setMessage('Item deleted successfully')
      setRecentItems(prev => prev.filter(item => item._id !== itemId))
      fetchAdminData()
    } catch (error) {
      setError('Failed to delete item')
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
                <Button variant="outline" className="w-full text-sm">
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
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleClaimAction(claim._id, 'reject')}
                              className="bg-red-600 hover:bg-red-700 text-white"
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
                          <Button size="sm" variant="outline">
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
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Claim
                  </Button>
                  <Button 
                    onClick={() => handleClaimAction(showClaimDetails._id, 'reject')}
                    className="bg-red-600 hover:bg-red-700 text-white"
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
      </div>
    </div>
  )
}