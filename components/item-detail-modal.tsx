"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, User, Package, Phone, Mail, MessageCircle } from "lucide-react"

interface Item {
  _id: string
  title: string
  description: string
  category: string
  status: 'lost' | 'found' | 'claimed' | 'verified'
  location: string
  date?: string
  createdAt: string
  itemImageUrl?: string
  imageUrl?: string
  reportedBy?: {
    _id: string
    name: string
    email: string
    phone?: string
  }
  contactInfo?: string
  matchScore?: number
}

interface ItemDetailModalProps {
  item: Item | null
  isOpen: boolean
  onClose: () => void
  onStartChat?: (item: Item) => void
}

export default function ItemDetailModal({ item, isOpen, onClose, onStartChat }: ItemDetailModalProps) {
  if (!item) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lost': return 'bg-red-500 text-white'
      case 'found': return 'bg-green-500 text-white'
      case 'claimed': return 'bg-orange-500 text-white'
      case 'verified': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Item Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Item Image */}
          {(item.itemImageUrl || item.imageUrl) && (
            <div className="flex justify-center">
              <img 
                src={item.itemImageUrl || item.imageUrl} 
                alt={item.title}
                className="max-w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <Badge className={getStatusColor(item.status)}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
                <Badge variant="outline">{item.category}</Badge>
                {item.matchScore && (
                  <Badge variant="outline" className="text-xs">
                    {item.matchScore >= 60 ? '🔥 High Match' : 
                     item.matchScore >= 40 ? '⭐ Good Match' : 
                     '💡 Possible Match'} ({item.matchScore}%)
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(item.date || item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{item.description}</p>
          </div>
          
          {/* Reporter Info */}
          {item.reportedBy && (
            <div>
              <h4 className="font-semibold mb-2">Reported By</h4>
              <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{item.reportedBy.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">{item.reportedBy.email}</span>
                </div>
                {item.reportedBy.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{item.reportedBy.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Contact Info */}
          {item.contactInfo && (
            <div>
              <h4 className="font-semibold mb-2">Contact Information</h4>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{item.contactInfo}</p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
            {onStartChat && (
              <Button 
                onClick={() => onStartChat(item)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
            )}
            {item.reportedBy?.email && (
              <Button 
                onClick={() => window.open(`mailto:${item.reportedBy?.email}?subject=Regarding ${item.title}&body=Hi ${item.reportedBy?.name}, I saw your ${item.status} item report for "${item.title}". `)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Reporter
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}