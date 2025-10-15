'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Package, Edit, Trash2, Search, Calendar, MapPin, User, Eye } from 'lucide-react'
import Navigation from '@/components/navigation'
import { isAuthenticated, getUserData, getAuthToken } from '@/lib/auth'
import { BACKEND_URL } from '@/lib/config'

interface Item {
  _id: string
  title: string
  description: string
  category: string
  status: 'lost' | 'found'
  location: string
  date: string
  createdAt: string
  itemImageUrl?: string
  imageUrl?: string
  reportedBy?: {
    _id: string
    name: string
    email: string
  }
}

export default function AdminItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [viewingItem, setViewingItem] = useState<Item | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'lost',
    location: ''
  })

  const categories = [
    'Electronics', 'Books', 'Clothing', 'Accessories', 'Documents', 
    'Sports Equipment', 'Personal Items', 'Bags', 'Keys', 'Other'
  ]

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
      
      fetchItems()
    }
    
    checkAuth()
  }, [])

  useEffect(() => {
    let filtered = items
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reportedBy?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter)
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }
    
    setFilteredItems(filtered)
  }, [items, searchTerm, statusFilter, categoryFilter])

  const fetchItems = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return
    
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/items/${editingItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        fetchItems()
        setEditingItem(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating item:', error)
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
        fetchItems()
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0 || !confirm(`Delete ${selectedItems.length} items?`)) return
    
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/admin/bulk-delete-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemIds: selectedItems })
      })
      
      if (response.ok) {
        fetchItems()
        setSelectedItems([])
      }
    } catch (error) {
      console.error('Error bulk deleting items:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      status: 'lost',
      location: ''
    })
  }

  const startEdit = (item: Item) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      status: item.status,
      location: item.location
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading items...</p>
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
          <h1 className="text-3xl font-bold mcc-text-primary font-serif mb-2">Item Management</h1>
          <p className="text-gray-600">Manage all lost and found items</p>
        </div>

        <Card className="mcc-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Items ({filteredItems.length})
              </CardTitle>
              {selectedItems.length > 0 && (
                <Button onClick={handleBulkDelete} variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete ({selectedItems.length})
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                  <SelectItem value="found">Found</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedItems.includes(item._id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems([...selectedItems, item._id])
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item._id))
                          }
                        }}
                      />
                      {(item.itemImageUrl || item.imageUrl) && (
                        <img 
                          src={item.itemImageUrl || item.imageUrl} 
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{item.title}</h3>
                          <Badge className={item.status === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}>
                            {item.status}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {item.reportedBy?.name || 'Anonymous'}
                          </div>
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
                      <Button onClick={() => setViewingItem(item)} size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => startEdit(item)} size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDeleteItem(item._id)} size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        {editingItem && (
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateItem} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="found">Found</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                </div>
                <Button type="submit" className="w-full">Update Item</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* View Modal */}
        {viewingItem && (
          <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Item Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {(viewingItem.itemImageUrl || viewingItem.imageUrl) && (
                  <img 
                    src={viewingItem.itemImageUrl || viewingItem.imageUrl} 
                    alt={viewingItem.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{viewingItem.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge className={viewingItem.status === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}>
                      {viewingItem.status}
                    </Badge>
                    <Badge variant="outline">{viewingItem.category}</Badge>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="text-sm text-gray-600 mt-1">{viewingItem.description}</p>
                </div>
                <div>
                  <Label>Location</Label>
                  <p className="text-sm text-gray-600 mt-1">{viewingItem.location}</p>
                </div>
                <div>
                  <Label>Reported By</Label>
                  <p className="text-sm text-gray-600 mt-1">{viewingItem.reportedBy?.name} ({viewingItem.reportedBy?.email})</p>
                </div>
                <div>
                  <Label>Date Reported</Label>
                  <p className="text-sm text-gray-600 mt-1">{new Date(viewingItem.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}