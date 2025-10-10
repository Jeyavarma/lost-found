"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Phone, Mail, MapPin, Calendar, User } from "lucide-react"

interface EventItem {
  _id: string
  title: string
  description: string
  status: 'lost' | 'found'
  location: string
  imageUrl?: string
  locationImageUrl?: string
  category?: string
  dateReported: string
  reportedBy: {
    name: string
    email: string
  }
  contactInfo: string
}

interface EventData {
  name: string
  totalItems: number
  lostCount: number
  foundCount: number
  status: string
  items: EventItem[]
}

const eventIcons: Record<string, string> = {
  'Madras Day Celebrations': '🏛️',
  'Annual Sports Meet': '🏆',
  'Cultural Festival': '🎭',
  'Freshers Day': '🎉',
  'College Day': '🎓',
  'Inter-Collegiate Events': '🏫',
  'Alumni Meet': '👥',
  'Science Exhibition': '🔬'
}

export default function DynamicEvents() {
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [selectedItem, setSelectedItem] = useState<EventItem | null>(null)
  const [eventItems, setEventItems] = useState<any>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEventItems = async (eventName: string) => {
    try {
      const response = await fetch(`/api/events/${encodeURIComponent(eventName)}`)
      if (response.ok) {
        const data = await response.json()
        setEventItems(data)
      }
    } catch (error) {
      console.error('Error fetching event items:', error)
    }
  }

  const fetchItemDetails = async (itemId: string) => {
    try {
      const response = await fetch(`/api/items/${itemId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedItem(data)
      }
    } catch (error) {
      console.error('Error fetching item details:', error)
    }
  }

  const handleViewItems = (event: EventData) => {
    setSelectedEvent(event)
    fetchEventItems(event.name)
  }

  const handleViewMore = (item: EventItem) => {
    fetchItemDetails(item._id)
  }

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.map((event) => (
          <Card key={event.name} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{eventIcons[event.name] || '📅'}</span>
                <div>
                  <CardTitle className="text-sm font-semibold">{event.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {event.totalItems} items
                    </Badge>
                    <Badge variant="secondary" className="text-xs text-green-600">
                      {event.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {getEventDescription(event.name)}
              </p>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => handleViewItems(event)}
              >
                View Items
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Event Items Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{eventIcons[selectedEvent?.name || ''] || '📅'}</span>
              {selectedEvent?.name}
            </DialogTitle>
          </DialogHeader>
          
          {eventItems && (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All ({eventItems.totalItems})</TabsTrigger>
                <TabsTrigger value="lost">Lost ({eventItems.lostCount})</TabsTrigger>
                <TabsTrigger value="found">Found ({eventItems.foundCount})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {eventItems.allItems.map((item: EventItem) => (
                  <ItemCard key={item._id} item={item} onViewMore={handleViewMore} />
                ))}
              </TabsContent>
              
              <TabsContent value="lost" className="space-y-4">
                {eventItems.lostItems.map((item: EventItem) => (
                  <ItemCard key={item._id} item={item} onViewMore={handleViewMore} />
                ))}
              </TabsContent>
              
              <TabsContent value="found" className="space-y-4">
                {eventItems.foundItems.map((item: EventItem) => (
                  <ItemCard key={item._id} item={item} onViewMore={handleViewMore} />
                ))}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Item Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Badge variant={selectedItem?.status === 'lost' ? 'destructive' : 'default'}>
                {selectedItem?.status?.toUpperCase()}
              </Badge>
              {selectedItem?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Item Photo</h4>
                  {selectedItem.imageUrl ? (
                    <img 
                      src={selectedItem.imageUrl} 
                      alt="Item" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                      No item photo available
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Location Photo</h4>
                  {selectedItem.locationImageUrl ? (
                    <img 
                      src={selectedItem.locationImageUrl} 
                      alt="Location" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                      No location photo available
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600">
                  {selectedItem.description || 'No description available'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedItem.location || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedItem.dateReported).toLocaleDateString() || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{selectedItem.category || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Button className="w-full" onClick={() => alert('Contact functionality coming soon!')}>
                    Contact Reporter
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function ItemCard({ item, onViewMore }: { item: EventItem; onViewMore: (item: EventItem) => void }) {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={item.status === 'lost' ? 'destructive' : 'default'}>
              {item.status.toUpperCase()}
            </Badge>
            <h3 className="font-semibold">{item.title}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {item.description || 'No description available'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onViewMore(item)}>
            <Eye className="w-4 h-4 mr-1" />
            View More
          </Button>
          <Button size="sm" onClick={() => alert('Contact functionality coming soon!')}>
            Contact
          </Button>
        </div>
      </div>
    </Card>
  )
}

function getEventDescription(eventName: string): string {
  const descriptions: Record<string, string> = {
    'Madras Day Celebrations': 'Annual heritage celebration with cultural programs where traditional costumes and accessories often go missing.',
    'Annual Sports Meet': 'Inter-college athletics competition where sports gear, water bottles, and personal items frequently get lost.',
    'Cultural Festival': 'Multi-day extravaganza with music, dance, and art performances where instruments and props go missing.',
    'Freshers Day': 'Welcome celebration for new students where excitement leads to misplaced phones, wallets, and accessories.',
    'College Day': 'Annual college day celebrations with prize distributions where certificates and personal items get misplaced.',
    'Inter-Collegiate Events': 'Competitions between colleges where participants often leave behind bags, books, and personal belongings.',
    'Alumni Meet': 'Annual gathering of former students where nostalgic items and personal belongings are frequently forgotten.',
    'Science Exhibition': 'Annual science fair where project materials, calculators, and lab equipment often go missing.'
  }
  return descriptions[eventName] || 'College event where items are frequently lost and found.'
}