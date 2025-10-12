"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, MapPin, Users, Eye, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"

const eventTemplates = [
  { name: 'Deepwoods', icon: '🌲', description: 'Annual cultural fest with music, dance, and art performances where instruments and props go missing.', eventDate: 'Feb 15-17, 2024' },
  { name: 'Moonshadow', icon: '🌙', description: 'Evening cultural event with performances where personal items and accessories often get misplaced.', eventDate: 'Mar 8-10, 2024' },
  { name: 'Octavia', icon: '🎭', description: 'Literary and dramatic arts festival where books, scripts, and costumes frequently go missing.', eventDate: 'Apr 12-14, 2024' },
  { name: 'Barnes Hall Day', icon: '🏠', description: 'Hostel celebration where personal belongings and room items often get misplaced.', eventDate: 'May 20, 2024' },
  { name: 'Martin Hall Day', icon: '🏠', description: 'Hostel celebration with games and activities where sports equipment and personal items get lost.', eventDate: 'Jun 15, 2024' },
  { name: 'Games Fury', icon: '🎮', description: 'Inter-departmental gaming competition where gaming accessories and personal items go missing.', eventDate: 'Aug 10-12, 2024' },
  { name: 'Founders Day', icon: '🎆', description: 'Annual college foundation day celebration where formal attire and ceremonial items get misplaced.', eventDate: 'Sep 5, 2024' },
  { name: 'Cultural Festival', icon: '🎨', description: 'Multi-day cultural celebration with performances, exhibitions and competitions where personal items get misplaced.', eventDate: 'Mar 1-3, 2024' }
]

export default function EventHighlights() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [currentFilter, setCurrentFilter] = useState('all')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [eventsData, setEventsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEventData()
  }, [])

  const fetchEventData = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const eventData = await response.json()
        
        // Map backend event data to frontend template format
        const mappedEvents = eventData.map((backendEvent: any) => {
          const template = eventTemplates.find(t => t.name === backendEvent.name)
          return {
            ...template,
            id: backendEvent.name,
            title: backendEvent.name,
            itemCount: backendEvent.totalItems,
            items: backendEvent.items.map((item: any) => ({
              id: item._id,
              name: item.title,
              description: item.description,
              status: item.status,
              location: item.location,
              date: new Date(item.dateReported).toLocaleDateString(),
              imageUrl: item.imageUrl,
              locationImageUrl: item.locationImageUrl,
              category: item.category,
              contactInfo: item.contactInfo
            }))
          }
        })
        
        setEventsData(mappedEvents)
      }
    } catch (error) {
      console.error('Error fetching event data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const itemsPerPage = 4
  const totalSlides = Math.ceil(eventsData.length / itemsPerPage)
  const visibleEvents = eventsData.slice(currentSlide * itemsPerPage, (currentSlide + 1) * itemsPerPage)
  
  const filteredItems = selectedEvent ? 
    (currentFilter === 'all' ? selectedEvent.items : selectedEvent.items.filter((item: any) => item.status === currentFilter))
    : []

  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mcc-text-primary font-serif">Event Highlights</h2>
            <p className="text-brand-text-dark">Loading event data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (eventsData.length === 0) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mcc-text-primary font-serif">Event Highlights</h2>
            <p className="text-brand-text-dark">No event-related items found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold mcc-text-primary font-serif">Event Highlights</h2>
          <p className="text-brand-text-dark">Items commonly lost during MCC events and activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => {
              const container = document.getElementById('events-scroll-container')
              if (container) {
                container.scrollBy({ left: -320, behavior: 'smooth' })
              }
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => {
              const container = document.getElementById('events-scroll-container')
              if (container) {
                container.scrollBy({ left: 320, behavior: 'smooth' })
              }
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div id="events-scroll-container" className="overflow-x-auto pb-4 scroll-smooth">
        <div className="flex gap-6 min-w-max">
          {eventsData.map((event) => (
            <Card key={event.id} className="mcc-card hover:shadow-xl transition-all duration-300 border-2 border-brand-primary/20 group cursor-pointer relative w-80 flex-shrink-0">
              <div className="absolute top-4 right-4">
                <Badge className="bg-brand-primary text-white">{event.itemCount} items</Badge>
              </div>
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{event.icon}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Calendar className="w-4 h-4" />
                  {event.eventDate}
                </div>
                <h3 className="text-xl font-bold mcc-text-primary mb-3 font-serif">{event.title}</h3>
                <p className="text-brand-text-dark mb-6 line-clamp-3">{event.description}</p>
                <Button 
                  className="w-full mcc-accent hover:bg-[#640000]" 
                  onClick={() => setSelectedEvent(event)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Items
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>



      {/* Event Items Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex flex-row items-center gap-3">
            <span className="text-3xl">{selectedEvent?.icon}</span>
            <DialogTitle className="text-2xl mcc-text-primary">{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 border-b">
            {['all', 'lost', 'found'].map((filter) => (
              <Button
                key={filter}
                variant={currentFilter === filter ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentFilter(filter)}
                className={currentFilter === filter ? 'mcc-accent' : ''}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)} ({selectedEvent?.items.filter((item: any) => filter === 'all' || item.status === filter).length || 0})
              </Button>
            ))}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto space-y-4 p-1">
            {filteredItems.map((item: any) => (
              <div key={item.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Badge className={`mb-2 text-xs ${item.status === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {item.status.toUpperCase()}
                  </Badge>
                  <h4 className="font-semibold mcc-text-primary mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => window.open(`mailto:lostfound@mcc.edu.in?subject=Regarding ${item.name}&body=Hi, I am contacting you regarding the ${item.status} item: ${item.name}. Location: ${item.location}. Date: ${item.date}.`)}>
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <Badge className={`w-fit mb-2 ${selectedItem?.status === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {selectedItem?.status?.toUpperCase()}
            </Badge>
            <DialogTitle className="mcc-text-primary">{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Item Photo</h4>
                {selectedItem?.imageUrl ? (
                  <img 
                    src={selectedItem.imageUrl.startsWith('http') ? selectedItem.imageUrl : `https://lost-found-79xn.onrender.com${selectedItem.imageUrl}`} 
                    alt="Item" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center text-gray-400">
                    No item photo available
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Location Photo</h4>
                {selectedItem?.locationImageUrl ? (
                  <img 
                    src={selectedItem.locationImageUrl.startsWith('http') ? selectedItem.locationImageUrl : `https://lost-found-79xn.onrender.com${selectedItem.locationImageUrl}`} 
                    alt="Location" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center text-gray-400">
                    No location photo available
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{selectedItem?.description}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Location: {selectedItem?.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Date: {selectedItem?.date}</span>
              </div>
            </div>
            
            <Button className="w-full mcc-accent hover:bg-[#640000]" onClick={() => window.open(`mailto:lostfound@mcc.edu.in?subject=Regarding ${selectedItem?.name}&body=Hi, I am contacting you regarding the ${selectedItem?.status} item: ${selectedItem?.name}. Location: ${selectedItem?.location}. Date: ${selectedItem?.date}.`)}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Reporter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}