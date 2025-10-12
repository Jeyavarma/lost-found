"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Zap } from "lucide-react"

interface ActivityItem {
  _id: string
  title: string
  description: string
  status: 'lost' | 'found'
  reportedBy: {
    name: string
    email: string
  }
  createdAt: string
}

export default function LiveActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/items/recent?limit=5')
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
    const interval = setInterval(fetchActivities, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getFormattedTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (loading) {
    return (
      <Card className="mcc-card border-2 border-brand-primary/20">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center gap-3 mcc-text-primary">
            <div className="w-8 h-8 mcc-accent rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-brand-text-light" />
            </div>
            Live Campus Activity
          </CardTitle>
          <CardDescription className="text-brand-text-dark">Real-time updates from the MCC community</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mcc-card border-2 border-brand-primary/20">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center gap-3 mcc-text-primary">
          <div className="w-8 h-8 mcc-accent rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-brand-text-light" />
          </div>
          Live Campus Activity
        </CardTitle>
        <CardDescription className="text-brand-text-dark">Real-time updates from the MCC community</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10 border-2 border-brand-primary/20">
                  <AvatarFallback className="text-sm font-semibold bg-blue-100 mcc-text-primary">
                    {getInitials(activity.reportedBy?.name || 'Anonymous')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1">
                  <p className="text-sm font-bold text-brand-text-dark line-clamp-1">
                    {activity.description.length > 60 ? `${activity.description.substring(0, 60)}...` : activity.description}
                  </p>
                  <span className="text-sm font-medium text-brand-text-dark mt-1">
                    <strong className="mcc-text-primary">{activity.reportedBy?.name || 'Anonymous'}</strong>{' '}
                    {activity.status === 'lost' ? 'reported lost' : 'found'}{' '}
                    <strong className="mcc-text-accent">{activity.title}</strong>
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end text-xs text-gray-500">
                <a href={`mailto:${activity.reportedBy?.email}`} className="text-sm text-blue-600 hover:underline mb-1 font-medium">
                  {activity.reportedBy?.email}
                </a>
                <span>{getFormattedDate(activity.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}