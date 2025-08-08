"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Phone, Send } from "lucide-react"

interface WhatsAppContactProps {
  contactEmail: string
  itemTitle: string
  itemType: "lost" | "found"
}

export default function WhatsAppContact({ contactEmail, itemTitle, itemType }: WhatsAppContactProps) {
  const [message, setMessage] = useState("")
  const [showCustomMessage, setShowCustomMessage] = useState(false)

  // Extract name from email for WhatsApp
  const contactName = contactEmail.split("@")[0].replace(".", " ")

  // Generate WhatsApp number (assuming format)
  const whatsappNumber =
    "91" +
    contactEmail
      .split("@")[0]
      .replace(/[^0-9]/g, "")
      .slice(-10)

  const quickMessages = [
    {
      text: `Hi! I saw your post about the ${itemType} ${itemTitle}. Is it still available?`,
      tamil: `வணக்கம்! ${itemTitle} பற்றிய உங்கள் பதிவைப் பார்த்தேன். இது இன்னும் கிடைக்குமா?`,
    },
    {
      text: `Hello, I think I found your ${itemTitle}. Can we meet to verify?`,
      tamil: `வணக்கம், உங்கள் ${itemTitle} கண்டுபிடித்துள்ளேன். சரிபார்க்க சந்திக்கலாமா?`,
    },
    {
      text: `Hi, I have some questions about the ${itemTitle} you ${itemType === "lost" ? "lost" : "found"}.`,
      tamil: `வணக்கம், நீங்கள் ${itemType === "lost" ? "தொலைத்த" : "கண்டெடுத்த"} ${itemTitle} பற்றி சில கேள்விகள் உள்ளன.`,
    },
  ]

  const sendWhatsAppMessage = (messageText: string) => {
    const encodedMessage = encodeURIComponent(messageText)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Card className="mcc-card border-2 border-green-200">
      <CardHeader className="bg-green-50 border-b">
        <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          WhatsApp Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="text-sm text-brand-text-dark">
            <p className="font-medium">Contact: {contactName}</p>
            <p className="text-gray-600">Regarding: {itemTitle}</p>
          </div>

          {/* Quick Message Templates */}
          <div className="space-y-2">
            <h4 className="font-medium text-green-800">Quick Messages:</h4>
            {quickMessages.map((msg, index) => (
              <div key={index} className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start h-auto p-3 border-green-300 hover:bg-green-50 bg-transparent"
                  onClick={() => sendWhatsAppMessage(msg.text)}
                >
                  <div className="text-xs text-left">
                    <div className="font-medium">{msg.text}</div>
                    <div className="text-gray-500 mt-1">{msg.tamil}</div>
                  </div>
                </Button>
              </div>
            ))}
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomMessage(!showCustomMessage)}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              {showCustomMessage ? "Hide Custom Message" : "Write Custom Message"}
            </Button>

            {showCustomMessage && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Type your custom message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="border-green-300 focus:border-green-500"
                />
                <Button
                  onClick={() => sendWhatsAppMessage(message)}
                  disabled={!message.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send via WhatsApp
                </Button>
              </div>
            )}
          </div>

          {/* Direct WhatsApp Button */}
          <Button
            onClick={() => sendWhatsAppMessage(`Hi! I'm contacting you about the ${itemTitle} from MCC Lost & Found.`)}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Phone className="w-4 h-4 mr-2" />
            Open WhatsApp Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
