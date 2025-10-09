"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { X, Search, MessageCircle, Eye } from "lucide-react"
import ItemDetailsModal from "./item-details-modal"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event: {
    name: string
    icon: string
    gradient: string
  }
  items: any[]
}

export default function EventModal({ isOpen, onClose, event, items }: EventModalProps) {
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  
  const lostItems = items.filter(item => item.status === 'lost')
  const foundItems = items.filter(item => item.status === 'found')
  
  const filteredItems = filter === 'all' ? items : 
                       filter === 'lost' ? lostItems : foundItems

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <span className="text-2xl">{event.icon}</span>
            {event.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? `${event.gradient} text-white` : ''}
            >
              All ({items.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'lost' ? 'default' : 'outline'}
              onClick={() => setFilter('lost')}
              className={filter === 'lost' ? 'bg-red-900 hover:bg-red-800 text-white' : ''}
            >
              Lost ({lostItems.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'found' ? 'default' : 'outline'}
              onClick={() => setFilter('found')}
              className={filter === 'found' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
            >
              Found ({foundItems.length})
            </Button>
          </div>

          {/* Items List */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {filteredItems.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge 
                          variant={item.status === 'lost' ? 'destructive' : 'default'}
                          className={item.status === 'lost' ? 'bg-red-900' : 'bg-green-500'}
                        >
                          {item.status === 'lost' ? 'Lost' : 'Found'}
                        </Badge>
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.description || 'No description available'}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="hover:bg-red-900 hover:text-white transition-colors"
                        onClick={() => {
                          setSelectedItem(item)
                          setIsItemModalOpen(true)
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View More
                      </Button>
                      <a href={`mailto:${item.reportedBy?.email || item.email || 'contact@mcc.edu.in'}`}>
                        <Button size="sm" variant="outline" className="hover:bg-red-900 hover:text-white transition-colors">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No {filter === 'all' ? '' : filter} items found for this event</p>
            </div>
          )}
        </div>
        
        {selectedItem && (
          <ItemDetailsModal
            isOpen={isItemModalOpen}
            onClose={() => setIsItemModalOpen(false)}
            item={selectedItem}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}