"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import MccCampusMap from "@/components/mcc-campus-map"
import { ArrowLeft, Upload, Search, User, GraduationCap } from "lucide-react"

const categories = ["ID Card", "Mobile Phone", "Laptop", "Wallet", "Keys", "Books", "Clothing", "Jewelry", "Other"]

const locations = [
  "Bishop Heber Hall",
  "Selaiyur Hall",
  "St. Thomas's Hall",
  "Barnes Hall",
  "Martin Hall",
  "Main Auditorium",
  "ICF Ground (Cricket/Athletics)",
  "Quadrangle",
  "Miller Library",
  "Main Canteen",
  "Zoology Department",
  "Botany Department",
  "Physics Department",
  "Chemistry Department",
  "Near Main Gate (Velachery Road)",
  "Near Air Force Station Road Gate",
  "Other",
];

export default function ReportFoundPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showOptionalLogin, setShowOptionalLogin] = useState(true)

  // Check if user is authenticated
  useEffect(() => {
    const authToken = localStorage.getItem("authToken")
    if (authToken) {
      setIsAuthenticated(true)
      setShowOptionalLogin(false)
    }
  }, [])

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    date: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    currentLocation: "",
    department: "",
    hostel: "",
    culturalEvent: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Found item reported:", formData)
    alert("Found item reported successfully! The owner will be notified.")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="mcc-primary border-b-4 border-brand-accent shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-4">
                <div className="w-12 h-12 mcc-accent rounded-lg flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 text-brand-text-light" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-brand-text-light font-serif">MCC Lost & Found</span>
                  <span className="text-xs text-gray-300 font-medium">Madras Christian College</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" className="flex items-center gap-2 text-brand-text-light hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {showOptionalLogin && !isAuthenticated && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="mcc-card border-2 border-green-200">
            <CardHeader className="bg-green-50 border-b border-green-200">
              <CardTitle className="text-green-800 font-serif flex items-center gap-2">
                <User className="w-5 h-5" />
                Optional: Login for Better Experience
              </CardTitle>
              <CardDescription className="text-brand-text-dark">
                While not required, logging in helps track your contributions and get notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Link href="/login">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowOptionalLogin(false)}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  Continue Without Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="mcc-card border-2 border-brand-primary/20">
          <CardHeader className="bg-gray-50/50">
            <CardTitle className="text-2xl sm:text-3xl mcc-text-primary font-serif">Report a Found Item</CardTitle>
            <CardDescription className="text-brand-text-dark">Found something? Help reunite it with its owner by filling out this form.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200/80">
                <h3 className="text-xl font-semibold mb-6 mcc-text-primary font-serif">1. Item Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="title" className="font-medium">Item Name *</Label>
                    <p className="text-xs text-gray-500 mt-1">A short, clear title.</p>
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., iPhone 14, Blue Backpack, Car Keys"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200/80 pt-6 mt-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="category" className="font-medium">Category *</Label>
                    <p className="text-xs text-gray-500 mt-1">Helps in classifying the item.</p>
                  </div>
                  <div className="md:col-span-2">
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200/80 pt-6 mt-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="description" className="font-medium">Description *</Label>
                    <p className="text-xs text-gray-500 mt-1">Be as detailed as possible.</p>
                  </div>
                  <div className="md:col-span-2">
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Provide a detailed description including color, brand, size, distinctive, etc."
                      rows={4}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200/80 pt-6 mt-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="image" className="font-medium">Upload Image</Label>
                    <p className="text-xs text-gray-500 mt-1">A picture can be very helpful.</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-primary transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      <Input id="image" type="file" className="hidden" accept="image/*" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200/80">
                <h3 className="text-xl font-semibold mb-6 mcc-text-primary font-serif">2. Where & When It Was Found</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="location" className="font-medium">Found Location *</Label>
                  </div>
                  <div className="md:col-span-2">
                    <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200/80 pt-6 mt-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="date" className="font-medium">Date Found *</Label>
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200/80 pt-6 mt-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="currentLocation" className="font-medium">Current Location of Item *</Label>
                    <p className="text-xs text-gray-500 mt-1">Where is the item now?</p>
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      id="currentLocation"
                      value={formData.currentLocation}
                      onChange={(e) => handleInputChange("currentLocation", e.target.value)}
                      placeholder="e.g., Security Office, My Dorm Room, etc."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200/80 pt-6 mt-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="department" className="font-medium">Associated Department</Label>
                     <p className="text-xs text-gray-500 mt-1">If relevant.</p>
                  </div>
                  <div className="md:col-span-2">
                    <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology",
                          "Tamil Literature", "English Literature", "Economics", "Commerce",
                          "Psychology", "History", "Philosophy", "Sociology", "Physical Education", "Not Applicable"
                        ].map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200/80 pt-6 mt-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="hostel" className="font-medium">Associated Hostel</Label>
                    <p className="text-xs text-gray-500 mt-1">If relevant.</p>
                  </div>
                  <div className="md:col-span-2">
                    <Select value={formData.hostel} onValueChange={(value) => handleInputChange("hostel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a hostel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-applicable">Not Applicable</SelectItem>
                        <SelectItem value="kamaraj">Kamaraj Hostel (Boys)</SelectItem>
                        <SelectItem value="periyar">Periyar Hostel (Boys)</SelectItem>
                        <SelectItem value="bharathi">Bharathi Hostel (Girls)</SelectItem>
                        <SelectItem value="avvaiyar">Avvaiyar Hostel (Girls)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200/80 pt-6 mt-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="culturalEvent" className="font-medium">Related Cultural Event</Label>
                     <p className="text-xs text-gray-500 mt-1">If relevant.</p>
                  </div>
                  <div className="md:col-span-2">
                    <Select value={formData.culturalEvent} onValueChange={(value) => handleInputChange("culturalEvent", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not Related to Any Event</SelectItem>
                        <SelectItem value="annual-day">Annual Day 2024</SelectItem>
                        <SelectItem value="tamil-meet">Tamil Literary Meet</SelectItem>
                        <SelectItem value="sports-meet">Inter-College Sports Meet</SelectItem>
                        <SelectItem value="christmas">Christmas Celebration</SelectItem>
                        <SelectItem value="science-exhibition">Science Exhibition</SelectItem>
                        <SelectItem value="cultural-festival">Cultural Festival</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="md:col-span-3 mt-6 pt-6 border-t border-gray-200/80">
                  <MccCampusMap />
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200/80 mt-8">
                <h3 className="text-xl font-semibold mb-6 mcc-text-primary font-serif">3. Your Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="contactName" className="font-medium">Your Name *</Label>
                  </div>
                  <div className="md:col-span-2">
                    <Input 
                      id="contactName" 
                      placeholder="Full Name" 
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-6 border-t border-gray-200/80">
                  <div className="md:col-span-1">
                    <Label htmlFor="contactEmail" className="font-medium">Email Address *</Label>
                  </div>
                  <div className="md:col-span-2">
                    <Input 
                      id="contactEmail" 
                      type="email" 
                      placeholder="your.email@college.edu" 
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-6 border-t border-gray-200/80">
                  <div className="md:col-span-1">
                    <Label htmlFor="contactPhone" className="font-medium">Phone Number</Label>
                    <p className="text-xs text-gray-500 mt-1">Optional, for faster contact.</p>
                  </div>
                  <div className="md:col-span-2">
                    <Input 
                      id="contactPhone" 
                      placeholder="+91 00000 00000" 
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 pt-6">
                 <Button type="submit" size="lg" className="w-full md:w-auto mcc-accent hover:bg-red-800 font-semibold py-3 px-8 text-lg">
                  Report Found Item
                </Button>
                <p className="text-xs text-gray-500 text-center">By submitting, you agree to be contacted by the item's owner.</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
