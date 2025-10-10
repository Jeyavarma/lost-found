"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"

const events = [
  { name: "Deepwoods", date: "Feb 15-17", location: "Main Campus", status: "upcoming" },
  { name: "Moonshadow", date: "Mar 8-10", location: "Arts Block", status: "upcoming" },
  { name: "Octavia", date: "Apr 12-14", location: "Science Block", status: "upcoming" },
  { name: "Founders' Day", date: "May 20", location: "College Grounds", status: "upcoming" }
]

export default function EventHighlights() {
  return (
    <Card className="mcc-card border-2 border-brand-primary/20">
      <CardHeader>
        <CardTitle className="mcc-text-primary">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold mcc-text-primary">{event.name}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-3 h-3" />
                {event.date}
                <MapPin className="w-3 h-3" />
                {event.location}
              </div>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-300">
              {event.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}