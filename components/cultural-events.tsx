"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Star, Music, Drama, Trophy } from "lucide-react"

const culturalEvents = [
  {
    id: 1,
    name: "Deepwoods 2024",
    tamil: "ஆண்டு விழா 2024",
    date: "2024-02-15",
    location: "Quadrangle",
    description: "Grand celebration of MCC's achievements with cultural performances, awards, and alumni meet.",
    tamilDescription: "கலாச்சார நிகழ்ச்சிகள், விருதுகள் மற்றும் முன்னாள் மாணவர் சந்திப்புடன் MCC இன் சாதனைகளின் பெரும் கொண்டாட்டம்.",
    category: "Cultural",
    status: "upcoming",
    lostItemsCount: 12,
    foundItemsCount: 8,
    icon: Star,
    color: "bg-yellow-500",
  },
  {
    id: 2,
    name: "Moonshadow",
    tamil: "மூன்ஷாடோ",
    date: "2024-01-20",
    location: "Selaiyur Hall",
    description: "The annual celebration of hall residents, featuring cultural performances along with debate and literary events.",
    tamilDescription: "குடியிருப்பு மண்டப மாணவர்களின் ஆண்டு விழா, கலாச்சார நிகழ்ச்சிகளுடன் விவாத மற்றும் இலக்கிய நிகழ்வுகளையும் கொண்டுள்ளது.",
    category: "cultural",
    status: "completed",
    lostItemsCount: 5,
    foundItemsCount: 7,
    icon: Drama,
    color: "bg-red-500",
  },
  {
    id: 3,
    name: "Inter-College Sports Meet",
    tamil: "கல்லூரிகளுக்கிடையேயான விளையாட்டு போட்டி",
    date: "2024-01-25",
    location: "pavillion",
    description: "Annual sports competition between colleges with cricket, football, basketball, and athletics.",
    tamilDescription: "கிரிக்கெட், கால்பந்து, கூடைப்பந்து மற்றும் தடகளத்துடன் கல்லூரிகளுக்கிடையேயான வருடாந்திர விளையாட்டு போட்டி.",
    category: "sports",
    status: "ongoing",
    lostItemsCount: 8,
    foundItemsCount: 3,
    icon: Trophy,
    color: "bg-green-500",
  },
  {
    id: 4,
    name: "Christmas Celebration",
    tamil: "கிறிஸ்துமஸ் கொண்டாட்டம்",
    date: "2023-12-25",
    location: "Chapel",
    description: "Traditional Christmas celebration with carol singing, nativity play, and community feast.",
    tamilDescription: "கரோல் பாடல், நேட்டிவிட்டி நாடகம் மற்றும் சமூக விருந்துடன் பாரம்பரிய கிறிஸ்துமஸ் கொண்டாட்டம்.",
    category: "Religious",
    status: "completed",
    lostItemsCount: 3,
    foundItemsCount: 5,
    icon: Music,
    color: "bg-blue-500",
  },
]

interface CulturalEventsProps {
  showTamil?: boolean
}

export default function CulturalEvents({ showTamil = false }: CulturalEventsProps) {
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [languageMode, setLanguageMode] = useState(showTamil)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "ongoing":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="mcc-card border-2 border-brand-primary/20">
      <CardHeader className="bg-gradient-to-r from-red-50 to-yellow-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold mcc-text-primary font-serif">
              {languageMode ? "கலாச்சார நிகழ்வுகள்" : "Cultural Events & Festivals"}
            </CardTitle>
            <p className="text-sm text-brand-text-dark mt-1">
              {languageMode
                ? "MCC கலாச்சார நிகழ்வுகள் மற்றும் தொடர்புடைய பொருட்கள்"
                : "MCC cultural events and related lost/found items"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguageMode(!languageMode)}
            className="border-brand-primary/30 mcc-text-primary hover:bg-blue-50"
          >
            {languageMode ? "English" : "தமிழ்"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {culturalEvents.map((event) => {
            const IconComponent = event.icon
            return (
              <Card
                key={event.id}
                className="border-2 border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 ${event.color} rounded-lg flex items-center justify-center shadow-md`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mcc-text-primary text-lg font-serif">
                        {languageMode ? event.tamil : event.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                        <Badge variant="outline" className="text-xs border-gray-300">
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-brand-text-dark mb-3 line-clamp-2">
                    {languageMode ? event.tamilDescription : event.description}
                  </p>

                  <div className="space-y-2 text-sm text-brand-text-dark mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 mcc-text-primary" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 mcc-text-accent" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-red-600 font-medium">
                          {event.lostItemsCount} {languageMode ? "தொலைந்தவை" : "Lost"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-green-600 font-medium">
                          {event.foundItemsCount} {languageMode ? "கண்டெடுக்கப்பட்டவை" : "Found"}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      {languageMode ? "விவரங்கள்" : "View Items"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader className="bg-gradient-to-r from-red-50 to-yellow-50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 ${selectedEvent.color} rounded-lg flex items-center justify-center shadow-md`}
                    >
                      <selectedEvent.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold mcc-text-primary font-serif">
                        {languageMode ? selectedEvent.tamil : selectedEvent.name}
                      </CardTitle>
                      <p className="text-sm text-brand-text-dark">
                        {selectedEvent.category} • {new Date(selectedEvent.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-brand-text-dark leading-relaxed">
                    {languageMode ? selectedEvent.tamilDescription : selectedEvent.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{selectedEvent.lostItemsCount}</div>
                      <div className="text-sm text-gray-600">{languageMode ? "தொலைந்த பொருட்கள்" : "Lost Items"}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedEvent.foundItemsCount}</div>
                      <div className="text-sm text-gray-600">
                        {languageMode ? "கண்டெடுக்கப்பட்ட பொருட்கள்" : "Found Items"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 mcc-accent hover:bg-red-800">
                      {languageMode ? "தொடர்புடைய பொருட்களைப் பார்க்கவும்" : "View Related Items"}
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      {languageMode ? "நிகழ்வு விவரங்கள்" : "Event Details"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
