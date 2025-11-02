'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { BACKEND_URL } from '@/lib/config'
import { getAuthToken } from '@/lib/auth'

interface ContactButtonProps {
  itemId: string
  itemTitle: string
  onChatCreated?: (roomId: string) => void
}

export default function ContactButton({ itemId, itemTitle, onChatCreated }: ContactButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleContact = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/chat/room/${itemId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const room = await response.json()
        onChatCreated?.(room._id)
        
        // Redirect to dashboard messages tab
        window.location.href = '/dashboard?tab=messages'
      } else {
        alert('Failed to start conversation')
      }
    } catch (error) {
      console.error('Contact error:', error)
      alert('Error starting conversation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleContact}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      ) : (
        <MessageCircle className="w-4 h-4 mr-2" />
      )}
      Contact
    </Button>
  )
}