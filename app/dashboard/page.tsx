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
          const response = await fetch('https://lost-found-79xn.onrender.com/api/items/my-items', {
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
          const response = await fetch('https://lost-found-79xn.onrender.com/api/notifications', {
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Lost & Found Items</h2>
            
            <Tabs defaultValue="all-items" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-200 rounded-lg">
                <TabsTrigger value="potential-matches">Potential Matches</TabsTrigger>
                <TabsTrigger value="lost-items">Lost Items</TabsTrigger>
                <TabsTrigger value="found-items">Found Items</TabsTrigger>
                <TabsTrigger value="my-items">My Items</TabsTrigger>
              </TabsList>
              
              <TabsContent value="potential-matches">
                <PotentialMatchesCard />
              </TabsContent>
              <TabsContent value="lost-items">
                <LostItemsCard />
              </TabsContent>
              <TabsContent value="found-items">
                <FoundItemsCard />
              </TabsContent>
              <TabsContent value="my-items">
                {loading ? <p className="text-center p-4">Loading your items...</p> : error ? <p className="text-center p-4 text-red-500">{error}</p> : <MyItemsCard lostItems={lostItems} foundItems={foundItems} />}
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-4">
                <Link href="/report-lost" className="block">
                  <QuickActionCard 
                    title="Report Lost Item"
                    description="Lost something?"
                    icon={Package}
                    color="#1C13B3"
                  />
                </Link>
                <Link href="/report-found" className="block">
                  <QuickActionCard 
                    title="Report Found Item"
                    description="Found something?"
                    icon={PackageOpen}
                    color="#16A34A"
                  />
                </Link>
                <Link href="/browse" className="block">
                  <QuickActionCard 
                    title="Search Items"
                    description="Browse all items"
                    icon={Search}
                    color="#EA580C"
                  />
                </Link>
              </div>
              
              {/* Notifications */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Notifications</h3>
                <div className="space-y-2">
                  {notifications.slice(0, 3).map(notif => (
                    <div key={notif.id} className={`p-3 rounded-lg text-sm ${!notif.read ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50'}`}>
                      <p className="text-gray-700 text-xs">{notif.message}</p>
                      <p className="text-gray-500 text-xs mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components

const QuickActionCard = ({ title, description, icon: Icon, color }: { title: string, description: string, icon: React.ElementType, color: string }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 p-4" style={{ borderLeftColor: color }}>
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: `${color}1A`}}>
                <Icon className="w-5 h-5" style={{ color }}/>
            </div>
            <div>
                <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
                <p className="text-xs text-gray-600">{description}</p>
            </div>
        </div>
    </Card>
);

const PotentialMatchesCard = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://lost-found-79xn.onrender.com/api/items/potential-matches', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const items = await response.json();
        setMatches(items);
      } catch (error) {
        console.error('Error fetching matches:', error);
        // Fallback to all items if matches endpoint fails
        const response = await fetch('https://lost-found-79xn.onrender.com/api/items');
        const items = await response.json();
        setMatches(items.slice(0, 6)); // Show first 6 items as potential matches
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) return <p className="text-center p-4">Finding potential matches...</p>;

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">Items that might match your interests or recent activity</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((item: any) => (
          <ItemDisplayCard key={item._id} item={item} showMatchScore={true} />
        ))}
      </div>
    </div>
  );
};

const LostItemsCard = () => {
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const response = await fetch('https://lost-found-79xn.onrender.com/api/items');
        const items = await response.json();
        setLostItems(items.filter((item: any) => item.status === 'lost'));
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLostItems();
  }, []);

  if (loading) return <p className="text-center p-4">Loading lost items...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {lostItems.map((item: any) => (
        <ItemDisplayCard key={item._id} item={item} />
      ))}
    </div>
  );
};

const FoundItemsCard = () => {
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoundItems = async () => {
      try {
        const response = await fetch('https://lost-found-79xn.onrender.com/api/items');
        const items = await response.json();
        setFoundItems(items.filter((item: any) => item.status === 'found'));
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoundItems();
  }, []);

  if (loading) return <p className="text-center p-4">Loading found items...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {foundItems.map((item: any) => (
        <ItemDisplayCard key={item._id} item={item} />
      ))}
    </div>
  );
};

const MyItemsCard = ({ lostItems, foundItems }: { lostItems: any[], foundItems: any[] }) => (
  <div className="mt-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...lostItems, ...foundItems].map((item: any) => (
        <ItemDisplayCard key={item._id} item={item} isOwner={true} />
      ))}
    </div>
  </div>
);

const ItemDisplayCard = ({ item, isOwner = false, showMatchScore = false }: { item: any, isOwner?: boolean, showMatchScore?: boolean }) => (
  <Card className="hover:shadow-md transition-shadow">
    {/* Image Section */}
    {item.imageUrl && (
      <div className="relative h-48 w-full">
        <img 
          src={item.itemImageUrl || item.imageUrl || '/placeholder.svg'} 
          alt={item.title}
          className="w-full h-full object-cover rounded-t-lg"
        />
        {showMatchScore && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            95% Match
          </div>
        )}
      </div>
    )}
    
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <CardTitle className="text-lg font-semibold text-gray-800">{item.title}</CardTitle>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          item.status === 'lost' ? 'bg-red-100 text-red-800' : 
          item.status === 'found' ? 'bg-green-100 text-green-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {item.status.toUpperCase()}
        </span>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
      
      {/* Location Details */}
      <div className="bg-gray-50 p-3 rounded-lg mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700">📍 {item.location}</span>
        </div>
        {(item.locationDetails?.building || item.locationDetails?.floor || item.locationDetails?.room) && (
          <div className="text-xs text-gray-600 space-y-1">
            {item.locationDetails.building && <div>🏢 {item.locationDetails.building}</div>}
            {item.locationDetails.floor && <div>📊 {item.locationDetails.floor}</div>}
            {item.locationDetails.room && <div>🚪 {item.locationDetails.room}</div>}
          </div>
        )}
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        {item.timeReported && <span>⏰ {item.timeReported}</span>}
      </div>
      
      {showMatchScore && (
        <div className="mt-3 pt-3 border-t">
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
            Contact Owner
          </Button>
        </div>
      )}
      
      {isOwner && (
        <div className="mt-3 pt-3 border-t flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            Edit
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Mark Resolved
          </Button>
        </div>
      )}
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
