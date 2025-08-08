"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bell, FileText, Search, PlusCircle, User, LogOut, Package, PackageOpen, Archive } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define an interface for the item object
interface Notification {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Item {
  id: number;
  title: string;
  date: string;
  status: string;
  location: string;
  type: 'lost' | 'found';
}





export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [lostItems, setLostItems] = useState<Item[]>([]);
  const [foundItems, setFoundItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    if (!token) {
      router.push('/login');
    } else {
      setUserName(name || 'Student');
      
      const fetchUserItems = async () => {
        try {
          setLoading(true);
          const response = await fetch('http://localhost:5001/api/items/my-items', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch your items. Please try again later.');
          }

          const items: Item[] = await response.json();
          // Assuming the item model has a 'type' field to distinguish between 'lost' and 'found'
          setLostItems(items.filter(item => item.type === 'lost'));
          setFoundItems(items.filter(item => item.type === 'found'));
          setError('');
        } catch (err: any) {
          setError(err.message);
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchUserItems();

      const fetchNotifications = async () => {
        try {
          const response = await fetch('http://localhost:5001/api/notifications', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Failed to fetch notifications.');
          }
          const data: Notification[] = await response.json();
          setNotifications(data);
        } catch (err) {
          console.error(err);
        }
      };

      fetchNotifications();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#1C13B3] rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Welcome, {userName}!</h1>
                    <p className="text-sm text-gray-500">Here's your dashboard overview.</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-6 w-6 text-gray-600" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </Button>
              <Button onClick={handleLogout} variant="outline" className="border-gray-300">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Hub */}
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">What would you like to do?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/report-lost" className="block h-full">
                    <ActionCard 
                        title="Report a Lost Item"
                        description="Let us know what you've lost so we can help you find it."
                        icon={Package}
                        color="#1C13B3"
                    />
                </Link>
                <Link href="/report-found" className="block h-full">
                    <ActionCard 
                        title="Report a Found Item"
                        description="Report an item you've found to help it get back to its owner."
                        icon={PackageOpen}
                        color="#16A34A"
                    />
                </Link>
                <Link href="/browse" className="block h-full">
                    <ActionCard 
                        title="Search All Items"
                        description="Browse through all reported lost and found items on campus."
                        icon={Search}
                        color="#EA580C"
                    />
                </Link>
            </div>
        </section>

        {/* User's Activity Section */}
        <section>
            <Tabs defaultValue="lost-items" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-200 rounded-lg">
                <TabsTrigger value="lost-items">My Lost Items</TabsTrigger>
                <TabsTrigger value="found-items">My Found Items</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              <TabsContent value="lost-items">
                {loading ? <p className="text-center p-4">Loading your items...</p> : error ? <p className="text-center p-4 text-red-500">{error}</p> : <ItemCard title="My Reported Lost Items" items={lostItems} />}
              </TabsContent>
              <TabsContent value="found-items">
                {loading ? <p className="text-center p-4">Loading your items...</p> : error ? <p className="text-center p-4 text-red-500">{error}</p> : <ItemCard title="My Reported Found Items" items={foundItems} />}
              </TabsContent>
              <TabsContent value="notifications">
                <NotificationCard notifications={notifications} />
              </TabsContent>
            </Tabs>
        </section>
      </main>
    </div>
  );
}

// Helper Components

const ActionCard = ({ title, description, icon: Icon, color }: { title: string, description: string, icon: React.ElementType, color: string }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4" style={{ borderLeftColor: color }}>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <div className="p-3 rounded-full bg-opacity-10" style={{ backgroundColor: `${color}1A`}}>
                <Icon className="w-6 h-6" style={{ color }}/>
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-gray-600">{description}</p>
        </CardContent>
    </Card>
);

const ItemCard = ({ title, items }: { title: string, items: any[] }) => (
    <Card className="mt-4">
        <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {items.length > 0 ? items.map(item => (
                    <li key={item.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div>
                            <p className="font-semibold text-gray-800">{item.title}</p>
                            <p className="text-sm text-gray-500">Last seen at {item.location} on {item.date}</p>
                        </div>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full mt-2 sm:mt-0 ${getStatusColor(item.status)}`}>
                            {item.status}
                        </span>
                    </li>
                )) : <p className="text-gray-500">No items to display.</p>}
            </ul>
        </CardContent>
    </Card>
);

const NotificationCard = ({ notifications }: { notifications: any[] }) => (
    <Card className="mt-4">
        <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-2">
                {notifications.map(notif => (
                    <li key={notif.id} className={`flex items-start gap-4 p-4 rounded-lg ${!notif.read ? 'bg-blue-50' : 'bg-white'}`}>
                        <div className={`mt-1 p-2 rounded-full ${!notif.read ? 'bg-blue-200' : 'bg-gray-200'}`}>
                            <Bell className={`h-5 w-5 ${!notif.read ? 'text-blue-600' : 'text-gray-500'}`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-700">{notif.message}</p>
                            <p className="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleString()}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Searching':
            return 'bg-yellow-100 text-yellow-800';
        case 'Found, pending verification':
            return 'bg-blue-100 text-blue-800';
        case 'Reported':
            return 'bg-green-100 text-green-800';
        case 'Claimed':
            return 'bg-gray-200 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}
