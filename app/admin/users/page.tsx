'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  Search,
  Shield,
  ShieldOff,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import Navigation from '@/components/navigation'
import { isAuthenticated, getUserData, getAuthToken } from '@/lib/auth'
import { BACKEND_URL } from '@/lib/config'

interface User {
  _id: string
  name: string
  email: string
  role: string
  department?: string
  studentId?: string
  phone?: string
  isActive: boolean
  suspendedUntil?: string
  suspensionReason?: string
  lastLogin: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [showActivityDialog, setShowActivityDialog] = useState(false)
  const [userActivities, setUserActivities] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const [suspensionData, setSuspensionData] = useState({
    reason: '',
    duration: 7 // days
  })
  
  const [messageData, setMessageData] = useState({
    subject: '',
    message: '',
    type: 'general'
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
      
      fetchUsers()
    }
    
    checkAuth()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchQuery, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const usersData = await response.json()
        setUsers(usersData)
      }
    } catch (error) {
      console.error('Users fetch error:', error)
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.studentId?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => user.isActive)
      } else if (statusFilter === 'suspended') {
        filtered = filtered.filter(user => !user.isActive)
      }
    }

    setFilteredUsers(filtered)
  }

  const handleSuspendUser = async () => {
    if (!selectedUser) return

    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${selectedUser._id}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          suspend: !selectedUser.isActive,
          reason: suspensionData.reason,
          duration: suspensionData.duration
        })
      })
      
      if (response.ok) {
        setMessage(`User ${selectedUser.isActive ? 'suspended' : 'unsuspended'} successfully`)
        setShowSuspendDialog(false)
        setSuspensionData({ reason: '', duration: 7 })
        fetchUsers()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update user status')
      }
    } catch (error) {
      setError('Failed to update user status')
    }
  }

  const handleSendMessage = async () => {
    if (!selectedUser) return

    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/messaging/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          toUserId: selectedUser._id,
          subject: messageData.subject,
          message: messageData.message,
          type: messageData.type
        })
      })
      
      if (response.ok) {
        setMessage('Message sent successfully')
        setShowMessageDialog(false)
        setMessageData({ subject: '', message: '', type: 'general' })
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to send message')
      }
    } catch (error) {
      setError('Failed to send message')
    }
  }

  const fetchUserActivity = async (userId: string) => {
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}/activity`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const activities = await response.json()
        setUserActivities(activities)
        setShowActivityDialog(true)
      }
    } catch (error) {
      setError('Failed to fetch user activity')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        setMessage('User deleted successfully')
        fetchUsers()
      } else {
        setError('Failed to delete user')
      }
    } catch (error) {
      setError('Failed to delete user')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
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
            User Management
          </h1>
          <p className="text-gray-600">
            Manage user accounts, permissions, and activities
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

        {/* Filters */}
        <Card className="mcc-card mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users by name, email, or student ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="mcc-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user._id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <Badge className={`${
                          user.role === 'admin' ? 'bg-red-500' :
                          user.role === 'staff' ? 'bg-blue-500' : 'bg-green-500'
                        } text-white`}>
                          {user.role}
                        </Badge>
                        <Badge className={`${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Suspended'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div>📧 {user.email}</div>
                        {user.studentId && <div>🆔 {user.studentId}</div>}
                        {user.department && <div>🏢 {user.department}</div>}
                        <div>📅 Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                        <div>🕒 Last Login: {new Date(user.lastLogin).toLocaleDateString()}</div>
                        {user.phone && <div>📞 {user.phone}</div>}
                      </div>
                      
                      {!user.isActive && user.suspensionReason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                          <strong>Suspended:</strong> {user.suspensionReason}
                          {user.suspendedUntil && (
                            <span> (until {new Date(user.suspendedUntil).toLocaleDateString()})</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fetchUserActivity(user._id)}
                      >
                        <Activity className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowMessageDialog(true)
                        }}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className={user.isActive ? 'text-red-600' : 'text-green-600'}
                        onClick={() => {
                          setSelectedUser(user)
                          setShowSuspendDialog(true)
                        }}
                      >
                        {user.isActive ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => deleteUser(user._id)}
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

        {/* Suspend/Unsuspend Dialog */}
        <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedUser?.isActive ? 'Suspend User' : 'Unsuspend User'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedUser?.isActive && (
                <>
                  <div>
                    <Label>Reason for Suspension</Label>
                    <Textarea
                      value={suspensionData.reason}
                      onChange={(e) => setSuspensionData({...suspensionData, reason: e.target.value})}
                      placeholder="Enter reason for suspension..."
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>Duration (days)</Label>
                    <Select 
                      value={suspensionData.duration.toString()} 
                      onValueChange={(value) => setSuspensionData({...suspensionData, duration: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="7">1 Week</SelectItem>
                        <SelectItem value="30">1 Month</SelectItem>
                        <SelectItem value="0">Permanent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSuspendUser} className="bg-red-500 hover:bg-red-600 text-white">
                  {selectedUser?.isActive ? 'Suspend User' : 'Unsuspend User'}
                </Button>
                <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Message Dialog */}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Message to {selectedUser?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Subject</Label>
                <Input
                  value={messageData.subject}
                  onChange={(e) => setMessageData({...messageData, subject: e.target.value})}
                  placeholder="Message subject..."
                  required
                />
              </div>
              
              <div>
                <Label>Message Type</Label>
                <Select value={messageData.type} onValueChange={(value) => setMessageData({...messageData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="verification">Verification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Message</Label>
                <Textarea
                  value={messageData.message}
                  onChange={(e) => setMessageData({...messageData, message: e.target.value})}
                  placeholder="Enter your message..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Send Message
                </Button>
                <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Activity Dialog */}
        <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Activity Log</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {userActivities.map((activity, index) => (
                <div key={index} className="border-b pb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{activity.action.replace('_', ' ')}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {activity.details && (
                    <div className="text-sm text-gray-600 mt-1">
                      {JSON.stringify(activity.details, null, 2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}