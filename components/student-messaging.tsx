"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MessageCircle, Send, Phone, Video, MoreHorizontal, Clock, CheckCheck } from "lucide-react"

const mockMessages = [
  {
    id: 1,
    sender: "Harish Kumar",
    senderEmail: "harish.kumar@mcc.edu.in",
    department: "Computer Science",
    message: "Hi! I saw your post about the found MacBook. Is it still available?",
    timestamp: "2 min ago",
    status: "delivered",
    itemRelated: 'MacBook Pro 13"',
    avatar: "HK",
  },
  {
    id: 2,
    sender: "Kiruba Devi",
    senderEmail: "kiruba.devi@mcc.edu.in",
    department: "Tamil Literature",
    message: "Thank you for finding my Tamil book! When can I collect it?",
    timestamp: "15 min ago",
    status: "read",
    itemRelated: "Tamil Literature Book",
    avatar: "KD",
  },
  {
    id: 3,
    sender: "Jeya Prakash",
    senderEmail: "jeya.prakash@mcc.edu.in",
    department: "Mathematics",
    message: "Is the calculator still missing? I think I saw it in the Math department.",
    timestamp: "1 hour ago",
    status: "sent",
    itemRelated: "Scientific Calculator",
    avatar: "JP",
  },
]

interface StudentMessagingProps {
  itemTitle?: string
  contactEmail?: string
}

export default function StudentMessaging({ itemTitle, contactEmail }: StudentMessagingProps) {
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")
  const [showNewChat, setShowNewChat] = useState(false)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Contact Actions */}
      <Card className="mcc-card border-2 border-green-200">
        <CardHeader className="bg-green-50 border-b">
          <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Quick Contact Options
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
              <MessageCircle className="w-4 h-4" />
              Send Message
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
              onClick={() => window.open(`https://wa.me/${contactEmail?.replace("@mcc.edu.in", "")}`, "_blank")}
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
            >
              <Video className="w-4 h-4" />
              Video Call
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card className="mcc-card border-2 border-brand-primary/20">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold mcc-text-primary">Recent Messages</CardTitle>
            <Dialog open={showNewChat} onOpenChange={setShowNewChat}>
              <DialogTrigger asChild>
                <Button size="sm" className="mcc-accent hover:bg-red-800">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  New Message
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="mcc-text-primary">Send Message</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mcc-text-primary">To:</label>
                    <Input placeholder="student.name@mcc.edu.in" className="mt-1" defaultValue={contactEmail} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mcc-text-primary">Subject:</label>
                    <Input
                      placeholder="About your lost/found item"
                      className="mt-1"
                      defaultValue={itemTitle ? `Regarding: ${itemTitle}` : ""}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mcc-text-primary">Message:</label>
                    <Textarea
                      placeholder="Type your message here..."
                      className="mt-1"
                      rows={4}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 mcc-accent hover:bg-red-800" onClick={handleSendMessage}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewChat(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedChat(message)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 border-2 border-brand-primary/20">
                    <AvatarFallback className="text-sm font-semibold bg-blue-100 mcc-text-primary">
                      {message.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold mcc-text-primary text-sm">{message.sender}</h4>
                        <Badge variant="outline" className="text-xs border-gray-300">
                          {message.department}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {message.timestamp}
                      </div>
                    </div>
                    <p className="text-sm text-brand-text-dark mb-2 line-clamp-2">{message.message}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                        Re: {message.itemRelated}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {message.status === "read" && <CheckCheck className="w-4 h-4 text-blue-500" />}
                        {message.status === "delivered" && <CheckCheck className="w-4 h-4 text-gray-400" />}
                        {message.status === "sent" && <Clock className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {selectedChat && (
        <Card className="mcc-card border-2 border-brand-primary/20">
          <CardHeader className="bg-blue-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-brand-primary/20">
                  <AvatarFallback className="text-sm font-semibold bg-blue-100 mcc-text-primary">
                    {selectedChat.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold mcc-text-primary">{selectedChat.sender}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedChat.department} • {selectedChat.senderEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4 mb-4">
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <p className="text-sm">{selectedChat.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedChat.timestamp}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Type your reply..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} className="mcc-accent hover:bg-red-800">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
