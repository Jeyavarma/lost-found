'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, Search, Sparkles, Zap } from 'lucide-react'
import { getAuthToken } from '@/lib/auth'
import { BACKEND_URL } from '@/lib/config'

interface AISearchProps {
  userStatus?: 'lost' | 'found'
}

export default function AISearchButton({ userStatus = 'lost' }: AISearchProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchData, setSearchData] = useState({
    query: '',
    category: '',
    location: '',
    status: userStatus
  })
  const [results, setResults] = useState<any[]>([])
  const [searchPerformed, setSearchPerformed] = useState(false)

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/ai/similar-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(searchData)
      })
      
      if (response.ok) {
        const data = await response.json()
        setResults(data.matches || [])
        setSearchPerformed(true)
      } else {
        alert('AI search failed. Please try again.')
      }
    } catch (error) {
      alert('Error performing AI search')
    } finally {
      setLoading(false)
    }
  }

  const resetSearch = () => {
    setResults([])
    setSearchPerformed(false)
    setSearchData({ ...searchData, query: '', category: '', location: '' })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
          <Brain className="w-4 h-4 mr-2" />
          Use AI for Search
          <Sparkles className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            AI-Powered Item Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!searchPerformed ? (
            <form onSubmit={handleAISearch} className="space-y-4">
              <div>
                <Label>Describe your {userStatus} item</Label>
                <Input
                  value={searchData.query}
                  onChange={(e) => setSearchData({...searchData, query: e.target.value})}
                  placeholder="e.g., black iPhone with cracked screen, blue Nike backpack..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Category (Optional)</Label>
                  <Select value={searchData.category} onValueChange={(value) => setSearchData({...searchData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Books">Books</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Documents">Documents</SelectItem>
                      <SelectItem value="Keys">Keys</SelectItem>
                      <SelectItem value="Sports Equipment">Sports Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Location (Optional)</Label>
                  <Select value={searchData.location} onValueChange={(value) => setSearchData({...searchData, location: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Library">Library</SelectItem>
                      <SelectItem value="Cafeteria">Cafeteria</SelectItem>
                      <SelectItem value="Main Building">Main Building</SelectItem>
                      <SelectItem value="Hostel A">Hostel A</SelectItem>
                      <SelectItem value="Hostel B">Hostel B</SelectItem>
                      <SelectItem value="Sports Complex">Sports Complex</SelectItem>
                      <SelectItem value="Auditorium">Auditorium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Search with AI
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  AI Found {results.length} Similar Items
                </h3>
                <Button onClick={resetSearch} variant="outline" size="sm">
                  New Search
                </Button>
              </div>
              
              {results.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No similar items found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search terms</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((item) => (
                    <Card key={item._id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{item.title}</h4>
                          <div className="flex gap-1">
                            <Badge className="bg-purple-100 text-purple-800">
                              {item.aiScore}% Match
                            </Badge>
                            <Badge className={item.status === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        
                        {item.imageUrl && (
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                        )}
                        
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>📍 {item.location}</p>
                          <p>📅 {new Date(item.createdAt).toLocaleDateString()}</p>
                          <p>🤖 {item.matchReason}</p>
                          <p>📧 Contact: {item.contactInfo || item.reportedBy?.email}</p>
                        </div>
                        
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" className="flex-1">
                            Contact Owner
                          </Button>
                          {item.confidence > 80 && (
                            <Badge className="bg-green-100 text-green-800 px-2 py-1">
                              High Confidence
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}