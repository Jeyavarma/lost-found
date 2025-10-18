'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Users, Plus, Edit, Trash2, Search, Filter, Download, Key } from 'lucide-react'
import Navigation from '@/components/navigation'
import { isAuthenticated, getUserData, getAuthToken } from '@/lib/auth'
import { BACKEND_URL } from '@/lib/config'

interface User {
  _id: string
  name: string
  email: string
  role: 'student' | 'staff' | 'admin'
  phone?: string
  studentId?: string
  shift?: string
  department?: string
  year?: string
  rollNumber?: string
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
    studentId: '',
    shift: '',
    department: '',
    year: '',
    rollNumber: ''
  })
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetPasswordData, setResetPasswordData] = useState({ email: '', newPassword: '' })
  const [showEditUser, setShowEditUser] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)

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
    let filtered = users
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }
    
    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter])

  const fetchUsers = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
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
        alert(data.message)
        fetchUsers()
        setShowCreateModal(false)
        resetForm()
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user')
    }
  }



  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        fetchUsers()
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0 || !confirm(`Delete ${selectedUsers.length} users?`)) return
    
    try {
      const token = getAuthToken()
      const promises = selectedUsers.map(userId => 
        fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      )
      
      await Promise.all(promises)
      alert(`${selectedUsers.length} users deleted successfully`)
      fetchUsers()
      setSelectedUsers([])
    } catch (error) {
      console.error('Error bulk deleting users:', error)
      alert('Failed to delete users')
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
        body: JSON.stringify(resetPasswordData)
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        setShowResetPassword(false)
        setResetPasswordData({ email: '', newPassword: '' })
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to reset password')
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      alert('Error resetting password')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'student',
      phone: '',
      studentId: '',
      shift: '',
      department: '',
      year: '',
      rollNumber: ''
    })
  }

  const startEdit = (user: User) => {
    setEditingUserId(user._id)
    setShowEditUser(true)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      phone: user.phone || '',
      studentId: user.studentId || '',
      shift: user.shift || '',
      department: user.department || '',
      year: user.year || '',
      rollNumber: user.rollNumber || ''
    })
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUserId) return
    
    try {
      const token = getAuthToken()
      const updateData = { ...formData }
      if (!updateData.password) {
        delete updateData.password
      }
      
      const response = await fetch(`${BACKEND_URL}/api/admin/users/${editingUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(data.message)
        fetchUsers()
        setShowEditUser(false)
        setEditingUserId(null)
        resetForm()
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user')
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
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mcc-text-primary font-serif mb-2">User Management</h1>
          <p className="text-gray-600">Manage all system users</p>
        </div>

        <Card className="mcc-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Users ({filteredUsers.length})
              </CardTitle>
              <div className="flex gap-2">
                {selectedUsers.length > 0 && (
                  <Button onClick={handleBulkDelete} variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete ({selectedUsers.length})
                  </Button>
                )}
                <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Key className="w-4 h-4 mr-1" />
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
                        <Input 
                          type="email" 
                          value={resetPasswordData.email} 
                          onChange={(e) => setResetPasswordData({...resetPasswordData, email: e.target.value})} 
                          required 
                        />
                      </div>
                      <div>
                        <Label>New Password</Label>
                        <Input 
                          type="password" 
                          value={resetPasswordData.newPassword} 
                          onChange={(e) => setResetPasswordData({...resetPasswordData, newPassword: e.target.value})} 
                          required 
                        />
                      </div>
                      <Button type="submit" className="w-full">Reset Password</Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      <Plus className="w-4 h-4 mr-1" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
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
                      <div>
                        <Label>Phone</Label>
                        <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                      </div>
                      <div>
                        <Label>Student ID</Label>
                        <Input value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} />
                      </div>
                      <Button type="submit" className="w-full">Create User</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
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
            </div>

            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedUsers.includes(user._id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers([...selectedUsers, user._id])
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user._id))
                          }
                        }}
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge className={
                            user.role === 'admin' ? 'bg-red-500 text-white' :
                            user.role === 'staff' ? 'bg-blue-500 text-white' :
                            'bg-green-500 text-white'
                          }>
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.studentId && <p className="text-xs text-gray-500">ID: {user.studentId}</p>}
                        {user.department && <p className="text-xs text-gray-500">Dept: {user.department}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => startEdit(user)} size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDeleteUser(user._id)} size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit User Modal */}
        <Dialog open={showEditUser} onOpenChange={() => { setShowEditUser(false); setEditingUserId(null); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit User Details</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div>
                  <Label>Email Address *</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Role *</Label>
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
                <div>
                  <Label>Phone Number</Label>
                  <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Enter phone number" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Student ID</Label>
                  <Input value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})} placeholder="Enter student ID" />
                </div>
                <div>
                  <Label>Roll Number</Label>
                  <Input value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} placeholder="Enter roll number" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                      <SelectItem value="Civil">Civil</SelectItem>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Chemical">Chemical</SelectItem>
                      <SelectItem value="Biotechnology">Biotechnology</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Commerce">Commerce</SelectItem>
                      <SelectItem value="Economics">Economics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Year</Label>
                  <Select value={formData.year} onValueChange={(value) => setFormData({...formData, year: value})}>
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
                  <Select value={formData.shift} onValueChange={(value) => setFormData({...formData, shift: value})}>
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
              
              <div>
                <Label>New Password (leave empty to keep current)</Label>
                <Input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Enter new password or leave empty" />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                  Update User
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowEditUser(false); setEditingUserId(null); }}>
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