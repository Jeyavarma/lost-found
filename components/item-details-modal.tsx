"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, User, MessageCircle, Phone, Mail } from "lucide-react"

interface ItemDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  item: any
}

export default function ItemDetailsModal({ isOpen, onClose, item }: ItemDetailsModalProps) {
  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Badge 
              variant={item.status === 'lost' ? 'destructive' : 'default'}
              className={item.status === 'lost' ? 'bg-red-900' : 'bg-green-500'}
            >
              {item.status === 'lost' ? 'Lost' : 'Found'}
            </Badge>
            {item.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Item Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Item Photo */}
            <div>
              <h3 className="font-semibold mb-2">Item Photo</h3>
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                {item.itemImage ? (
                  <img src={item.itemImage} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No item photo available
                  </div>
                )}
              </div>
            </div>
            
            {/* Location Photo */}
            <div>
              <h3 className="font-semibold mb-2">Location Photo</h3>
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                {item.locationImage ? (
                  <img src={item.locationImage} alt="Location" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No location photo available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{item.description || 'No description available'}</p>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Location: {item.location || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Date: {item.date || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Category: {item.category || 'Not specified'}</span>
                </div>
              </div>
            </CardContent>
          </Card>



          {/* Contact Button */}
          <div className="flex justify-center">
            <a href={`mailto:${item.reportedBy?.email || item.email || 'contact@mcc.edu.in'}`}>
              <Button className="bg-red-900 hover:bg-red-800 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Reporter
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}