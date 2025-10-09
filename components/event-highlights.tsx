"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, TrendingUp, Clock } from "lucide-react"
import EventModal from "./event-modal"

const events = [
  {
    id: "madras-day",
    name: "Madras Day Celebrations",
    description: "Annual heritage celebration with cultural programs where traditional costumes and accessories often go missing.",
    icon: "🏛️",
    gradient: "bg-red-900",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    id: "sports-meet",
    name: "Annual Sports Meet",
    description: "Inter-college athletics competition where sports gear, water bottles, and personal items frequently get lost.",
    icon: "🏆",
    gradient: "bg-red-900",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    id: "cultural-festival",
    name: "Cultural Festival",
    description: "Multi-day extravaganza with music, dance, and art performances where instruments and props go missing.",
    icon: "🎭",
    gradient: "bg-red-900",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    id: "freshers-day",
    name: "Freshers Day",
    description: "Welcome celebration for new students where excitement leads to misplaced phones, wallets, and accessories.",
    icon: "🎉",
    gradient: "bg-red-900",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    id: "college-day",
    name: "College Day",
    description: "Annual college day celebrations with prize distributions where certificates and personal items get misplaced.",
    icon: "🎓",
    gradient: "bg-red-900",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    id: "inter-collegiate",
    name: "Inter-Collegiate Events",
    description: "Competitions between colleges where participants often leave behind bags, books, and personal belongings.",
    icon: "🏫",
    gradient: "bg-red-900",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    id: "alumni-meet",
    name: "Alumni Meet",
    description: "Annual gathering of former students where nostalgic items and personal belongings are frequently forgotten.",
    icon: "👥",
    gradient: "bg-red-900",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    id: "science-exhibition",
    name: "Science Exhibition",
    description: "Annual science fair where project materials, calculators, and lab equipment often go missing.",
    icon: "🔬",
    gradient: "bg-red-900",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  }
]

export default function EventHighlights() {
  const [eventItems, setEventItems] = useState<{[key: string]: any[]}>({})
  const [loading, setLoading] = useState(true)
  const [totalEventItems, setTotalEventItems] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Dummy data for testing
    const dummyItems = [
      { culturalEvent: "Madras Day Celebrations", title: "Traditional Costume", description: "Red silk saree with gold border, lost during dance performance", location: "Main Stage Area", date: "2024-08-15", category: "Clothing", itemImage: "/placeholder.svg?height=200&width=200&text=Saree", locationImage: "/placeholder.svg?height=200&width=200&text=Stage", reportedBy: { name: "Priya Sharma", email: "priya.dance@mcc.edu.in" }, status: "lost" },
      { culturalEvent: "Madras Day Celebrations", title: "Gold Earrings", description: "Traditional temple jewelry found near stage area", location: "Backstage", date: "2024-08-15", category: "Jewelry", reportedBy: { name: "Admin Staff", email: "admin@mcc.edu.in" }, status: "found" },
      { culturalEvent: "Madras Day Celebrations", title: "Heritage Book", description: "Tamil literature book with handwritten notes", location: "Library Hall", date: "2024-08-15", category: "Books", reportedBy: { name: "Tamil Dept", email: "" }, status: "lost" },
      { culturalEvent: "Annual Sports Meet", title: "Cricket Bat", status: "lost" },
      { culturalEvent: "Annual Sports Meet", title: "Water Bottle", status: "found" },
      { culturalEvent: "Annual Sports Meet", title: "Sports Shoes", status: "lost" },
      { culturalEvent: "Annual Sports Meet", title: "Team Jersey", status: "found" },
      { culturalEvent: "Annual Sports Meet", title: "Stopwatch", status: "lost" },
      { culturalEvent: "Cultural Festival", title: "Guitar", status: "lost" },
      { culturalEvent: "Cultural Festival", title: "Dance Costume", status: "found" },
      { culturalEvent: "Cultural Festival", title: "Microphone", status: "lost" },
      { culturalEvent: "Freshers Day", title: "iPhone 14", status: "lost" },
      { culturalEvent: "Freshers Day", title: "Wallet", status: "found" },
      { culturalEvent: "College Day", title: "Certificate Folder", status: "lost" },
      { culturalEvent: "College Day", title: "Medal", status: "found" },
      { culturalEvent: "Inter-Collegiate Events", title: "Laptop Bag", status: "lost" },
      { culturalEvent: "Inter-Collegiate Events", title: "ID Card", status: "found" },
      { culturalEvent: "Alumni Meet", title: "Photo Album", status: "lost" },
      { culturalEvent: "Alumni Meet", title: "Business Card Holder", status: "found" },
      { culturalEvent: "Science Exhibition", title: "Calculator", status: "lost" },
      { culturalEvent: "Science Exhibition", title: "Lab Notebook", status: "found" }
    ]
    
    setTimeout(() => {
      // Group items by cultural event
      const grouped = events.reduce((acc, event) => {
        acc[event.id] = dummyItems.filter((item: any) => 
          item.culturalEvent && 
          item.culturalEvent.toLowerCase().includes(event.name.toLowerCase().replace(/\s+/g, ' '))
        )
        return acc
      }, {} as {[key: string]: any[]})
      
      setEventItems(grouped)
      setTotalEventItems(Object.values(grouped).reduce((sum, items) => sum + items.length, 0))
      setLoading(false)
    }, 1000)
  }, [])

  const handleViewEventItems = (event: any, items: any[]) => {
    setSelectedEvent({...event, items})
    setIsModalOpen(true)
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mcc-text-primary font-serif mb-2">Event Highlights</h2>
          <p className="text-brand-text-dark">Items commonly lost during MCC events and activities</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>{loading ? 'Loading...' : `${totalEventItems} event-related items`}</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max">
          {events.map((event) => {
            const itemCount = eventItems[event.id]?.length || 0
            const hasItems = itemCount > 0
            
            return (
              <Card key={event.id} className={`mcc-card hover:shadow-xl transition-all duration-500 border-2 ${event.borderColor} ${event.bgColor} group overflow-hidden w-80 flex-shrink-0`}>
              <CardHeader className="pb-3 relative">
                <div className={`absolute top-0 right-0 w-20 h-20 ${event.gradient} opacity-10 rounded-full -mr-10 -mt-10`}></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{event.icon}</div>
                  <div className="flex flex-col items-end">
                    <Badge variant={hasItems ? "default" : "secondary"} className={`text-xs mb-1 ${hasItems ? event.gradient + ' text-white' : ''}`}>
                      {loading ? '...' : `${itemCount} items`}
                    </Badge>
                    {hasItems && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>Active</span>
                      </div>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg font-serif group-hover:text-gray-800 transition-colors">{event.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-4 line-clamp-3 leading-relaxed">
                  {event.description}
                </CardDescription>
                <Button 
                  size="sm" 
                  variant={hasItems ? "default" : "outline"}
                  className={`w-full transition-all duration-300 ${hasItems ? `${event.gradient} hover:shadow-lg text-white border-0` : 'hover:bg-gray-50'}`}
                  onClick={() => handleViewEventItems(event, eventItems[event.id] || [])}
                  disabled={loading}
                >
                  <Users className="w-4 h-4 mr-2" />
                  {hasItems ? 'View Items' : 'No Items Yet'}
                </Button>
              </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      
      {!loading && totalEventItems === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 mt-6">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Event Items Yet</h3>
          <p className="text-gray-500">Items lost during events will appear here</p>
        </div>
      )}
      
      {selectedEvent && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
          items={selectedEvent.items || []}
        />
      )}
    </div>
  )
}