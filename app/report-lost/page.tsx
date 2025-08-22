"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Search, Shield, User, GraduationCap } from "lucide-react"

const categories = [
  "Electronics",
  "Textbooks & Academic Books",
  "ID Cards & Documents",
  "Keys & Access Cards",
  "Sports Equipment",
  "Cultural Items",
  "Tamil Literature Books",
  "Scientific Instruments",
  "Hostel Items",
  "Chapel Items",
  "Other",
]





export default function ReportLostPage() {
  const Map = useMemo(() => dynamic(
    () => import('@/components/ui/Map'),
    { 
      loading: () => <p>A map is loading</p>,
      ssr: false
    }
  ), [])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: { lat: 12.9223, lng: 80.1197 }, // Default to MCC
    locationName: "Madras Christian College",
    date: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    reward: "",
    department: "",
    hostel: "",
    culturalEvent: "",
  })

  // Check if user is authenticated (in real app, this would check actual auth state)
  useEffect(() => {
    // Simulate auth check
    const authToken = localStorage.getItem("authToken")
    if (authToken) {
      setIsAuthenticated(true)
      setShowLoginPrompt(false)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Lost item reported:", formData)
    alert("Lost item reported successfully! We'll notify you if someone finds it.")
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'location') {
      fetchLocationName(value.lat, value.lng);
    }
  }

  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      const locationName = data.display_name || 'Unknown Location';
      setFormData((prev) => ({ ...prev, locationName }));
    } catch (error) {
      console.error('Error fetching location name:', error);
      setFormData((prev) => ({ ...prev, locationName: 'Could not fetch location name' }));
    }
  };

  if (!isAuthenticated && showLoginPrompt) {
    return (
      <div className="min-h-screen bg-gray-50">
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

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="mcc-card border-2 border-red-200">
            <CardHeader className="bg-red-50 border-b border-red-200 text-center">
              <CardTitle className="text-2xl mcc-text-accent font-serif">Authentication Required</CardTitle>
              <CardDescription className="text-brand-text-dark">
                You must be logged in to report a lost item for verification purposes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mcc-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-brand-text-light" />
              </div>
              <h3 className="text-xl font-semibold mb-4 mcc-text-primary">Why do I need to login?</h3>
              <div className="text-left space-y-3 mb-8 text-brand-text-dark">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p>
                    <strong>Verify Identity:</strong> Ensures only legitimate MCC students can claim lost items
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p>
                    <strong>Prevent Fraud:</strong> Protects against false claims and unauthorized access
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p>
                    <strong>Secure Communication:</strong> Enables safe contact between finders and owners
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <p>
                    <strong>Track Progress:</strong> Monitor the status of your reported items
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <Link href="/login">
                  <Button className="w-full mcc-accent hover:bg-red-800 font-medium py-3">
                    <User className="w-4 h-4 mr-2" />
                    Login to Continue
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full border-brand-primary/30 mcc-text-primary hover:bg-blue-50 bg-transparent"
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Create New Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="mcc-card border-2 border-brand-primary/20">
          <CardHeader className="bg-gray-50/50">
            <CardTitle className="text-2xl sm:text-3xl mcc-text-primary font-serif">Report a Lost Item</CardTitle>
            <CardDescription className="text-brand-text-dark">Fill out this form to report an item you've lost. We'll help you find it!</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Item Details */}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200/80 pt-6">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200/80 pt-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="description" className="font-medium">Description *</Label>
                    <p className="text-xs text-gray-500 mt-1">Be as detailed as possible.</p>
                  </div>
                  <div className="md:col-span-2">
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Provide a detailed description including color, brand, size, distinctive features, etc."
                      rows={4}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200/80 pt-6">
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
                <h3 className="text-xl font-semibold mb-6 mcc-text-primary font-serif">2. Context & Location</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="location" className="font-medium">Last Seen Location *</Label>
                    <p className="text-xs text-gray-500 mt-1">Drag the pin to the exact spot.</p>
                  </div>
                  <div className="md:col-span-2">
                    <Map 
                      position={formData.location} 
                      onPositionChange={(newPos) => handleInputChange('location', newPos)} 
                    />
                    {formData.locationName && (
                      <div className="mt-2 p-2 bg-gray-100 rounded-md">
                        <p className="text-sm font-semibold">Selected Location:</p>
                        <p className="text-sm text-gray-700">{formData.locationName}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200/80 pt-6 mt-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="date" className="font-medium">Date Lost *</Label>
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
                    <Label htmlFor="department" className="font-medium">Your Department *</Label>
                  </div>
                  <div className="md:col-span-2">
                    <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology",
                          "Tamil Literature", "English Literature", "Economics", "Commerce",
                          "Psychology", "History", "Philosophy", "Sociology", "Physical Education",
                        ].map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200/80 pt-6 mt-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="hostel" className="font-medium">Hostel</Label>
                    <p className="text-xs text-gray-500 mt-1">If applicable.</p>
                  </div>
                  <div className="md:col-span-2">
                    <Select value={formData.hostel} onValueChange={(value) => handleInputChange("hostel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your hostel" />
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
                     <p className="text-xs text-gray-500 mt-1">If applicable.</p>
                  </div>
                  <div className="md:col-span-2">
                    <Select value={formData.culturalEvent} onValueChange={(value) => handleInputChange("culturalEvent", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event if applicable" />
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
              </div>

              <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200/80">
                <h3 className="text-xl font-semibold mb-6 mcc-text-primary font-serif">3. Contact Information</h3>
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
                  Report Lost Item
                </Button>
                <p className="text-xs text-gray-500 text-center">By submitting, you agree to share your contact details with the person who finds your item.</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
