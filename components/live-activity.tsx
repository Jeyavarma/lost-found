"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Zap, Eye } from "lucide-react"
import { BACKEND_URL } from "@/lib/config"

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
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAllModal, setShowAllModal] = useState(false)
  const [loadingAll, setLoadingAll] = useState(false)

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/items?sort=createdAt&order=desc&limit=5`)
      if (response.ok) {
        const data = await response.json()
        setActivities(Array.isArray(data) ? data.slice(0, 5) : [])
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllActivities = async () => {
    setLoadingAll(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/items?sort=createdAt&order=desc&limit=100`)
      if (response.ok) {
        const data = await response.json()
        setAllActivities(data)
      }
    } catch (error) {
      console.error('Error fetching all activities:', error)
    } finally {
      setLoadingAll(false)
    }
  }

  const handleViewAll = () => {
    setShowAllModal(true)
    if (allActivities.length === 0) {
      fetchAllActivities()
    }
  }

  useEffect(() => {
    fetchActivities()
    const interval = setInterval(fetchActivities, 30000)
    
    // Listen for item submission events to refresh immediately
    const handleItemSubmitted = () => {
      fetchActivities()
      // Also refresh all activities if modal is open
      if (showAllModal) {
        fetchAllActivities()
      }
    }
    
    window.addEventListener('itemSubmitted', handleItemSubmitted)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('itemSubmitted', handleItemSubmitted)
    }
  }, [showAllModal])

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
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl animate-pulse gap-3 sm:gap-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 sm:w-48"></div>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 sm:gap-3 mcc-text-primary text-lg sm:text-xl">
              <div className="w-6 h-6 sm:w-8 sm:h-8 mcc-accent rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-brand-text-light" />
              </div>
              Live Campus Activity
            </CardTitle>
            <CardDescription className="text-brand-text-dark text-sm">Real-time updates from the MCC community</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewAll}
            className="border-brand-primary text-brand-primary hover:bg-[#1c1b3b] hover:text-white shrink-0"
          >
            <Eye className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">View All</span>
            <span className="sm:hidden">All</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 border border-gray-200 gap-3 sm:gap-0"
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-brand-primary/20 shrink-0">
                  <AvatarFallback className="text-xs sm:text-sm font-semibold bg-blue-100 mcc-text-primary">
                    {getInitials(activity.reportedBy?.name || 'Anonymous')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-brand-text-dark line-clamp-2 sm:line-clamp-1">
                    {activity.description}
                  </p>
                  <span className="text-xs sm:text-sm font-medium text-brand-text-dark mt-1">
                    <strong className="mcc-text-primary">{activity.reportedBy?.name || 'Anonymous'}</strong>{' '}
                    {activity.status === 'lost' ? 'reported lost' : 'found'}{' '}
                    <strong className="mcc-text-accent">{activity.title}</strong>
                  </span>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-start text-xs text-gray-500 shrink-0">
                <a href={`mailto:${activity.reportedBy?.email}`} className="text-xs sm:text-sm text-blue-600 hover:underline mb-0 sm:mb-1 font-medium truncate max-w-[150px] sm:max-w-none">
                  {activity.reportedBy?.email}
                </a>
                <span className="text-xs">{getFormattedDate(activity.createdAt)}</span>
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

      <Dialog open={showAllModal} onOpenChange={setShowAllModal}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col mx-4 sm:mx-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 sm:gap-3 mcc-text-primary text-lg sm:text-xl">
              <div className="w-6 h-6 sm:w-8 sm:h-8 mcc-accent rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-brand-text-light" />
              </div>
              All Campus Activity
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 p-1">
            {loadingAll ? (
              <div className="space-y-3 sm:space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl animate-pulse gap-3 sm:gap-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-32 sm:w-48"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : (
              allActivities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 border border-gray-200 gap-3 sm:gap-0"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-brand-primary/20 shrink-0">
                      <AvatarFallback className="text-xs sm:text-sm font-semibold bg-blue-100 mcc-text-primary">
                        {getInitials(activity.reportedBy?.name || 'Anonymous')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-brand-text-dark">
                        {activity.description}
                      </p>
                      <span className="text-xs sm:text-sm font-medium text-brand-text-dark mt-1">
                        <strong className="mcc-text-primary">{activity.reportedBy?.name || 'Anonymous'}</strong>{' '}
                        {activity.status === 'lost' ? 'reported lost' : 'found'}{' '}
                        <strong className="mcc-text-accent">{activity.title}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-start text-xs text-gray-500 shrink-0">
                    <a href={`mailto:${activity.reportedBy?.email}`} className="text-xs sm:text-sm text-blue-600 hover:underline mb-0 sm:mb-1 font-medium truncate max-w-[150px] sm:max-w-none">
                      {activity.reportedBy?.email}
                    </a>
                    <span className="text-xs">{getFormattedDate(activity.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
            {!loadingAll && allActivities.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No activity found</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}