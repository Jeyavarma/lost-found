'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Users, 
  Package, 
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  UserPlus,
  Shield
} from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { BACKEND_URL } from '@/lib/config'

export default function AdminControl() {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [items, setItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (activeTab === 'users') {
        const response = await fetch(`${BACKEND_URL}/api/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        }
      } else {
        const response = await fetch(`${BACKEND_URL}/api/items`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setItems(data)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, type: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return
    
    try {
      const token = localStorage.getItem('token')
      const endpoint = type === 'user' ? `/api/admin/users/${id}` : `/api/items/${id}`
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        fetchData()
        alert(`${type} deleted successfully!`)
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const handleCreate = () => {
    if (activeTab === 'users') {
      window.location.href = '/admin/dashboard'
    } else {
      setShowCreateModal(true)
    }
  }

  const filteredData = activeTab === 'users' 
    ? users.filter((user: any) => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : items.filter((item: any) => 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold mcc-text-primary font-serif">Admin Control Panel</h1>
            <p className="text-gray-600">Full CRUD operations for all system data</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'bg-blue-600' : 'bg-gray-300'}
          >
            <Users className="w-4 h-4 mr-2" />
            Users ({users.length})
          </Button>
          <Button 
            onClick={() => setActiveTab('items')}
            className={activeTab === 'items' ? 'bg-green-600' : 'bg-gray-300'}
          >
            <Package className="w-4 h-4 mr-2" />
            Items ({items.length})
          </Button>
        </div>

        {/* Action Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create {activeTab.slice(0, -1)}
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{activeTab === 'users' ? 'System Users' : 'Lost & Found Items'}</span>
              <Badge variant="outline">{filteredData.length} records</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredData.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No {activeTab} found</p>
                  </div>
                ) : (
                  filteredData.map((record: any) => (
                    <div key={record._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      {activeTab === 'users' ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{record.name}</h3>
                              <p className="text-sm text-gray-600">{record.email}</p>
                              <div className="flex gap-2 mt-1">
                                <Badge className={
                                  record.role === 'admin' ? 'bg-red-500' :
                                  record.role === 'staff' ? 'bg-blue-500' : 'bg-green-500'
                                }>
                                  {record.role}
                                </Badge>
                                <Badge variant="outline">{record.department || 'N/A'}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(record._id, 'user')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                              {record.imageUrl ? (
                                <img src={record.imageUrl} alt={record.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold">{record.title}</h3>
                              <p className="text-sm text-gray-600">{record.description}</p>
                              <div className="flex gap-2 mt-1">
                                <Badge className={record.status === 'lost' ? 'bg-red-500' : 'bg-green-500'}>
                                  {record.status}
                                </Badge>
                                <Badge variant="outline">{record.category}</Badge>
                                <Badge variant="outline">{record.location}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(record._id, 'item')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Account Creation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <UserPlus className="w-5 h-5" />
                Create Student Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Create new student accounts with department assignment</p>
              <Link href="/admin/dashboard">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Create Student
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Shield className="w-5 h-5" />
                Create Admin Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Create new admin accounts with full system access</p>
              <Link href="/admin/register">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Create Admin
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Users className="w-5 h-5" />
                Create Staff Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Create staff accounts with verification permissions</p>
              <Link href="/admin/staff">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Create Staff
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}