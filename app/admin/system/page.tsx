'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BACKEND_URL } from '@/lib/config';

interface SystemConfig {
  categories: string[];
  locations: string[];
  departments: string[];
  hostels: string[];
  autoMatchEnabled: boolean;
  emailNotifications: boolean;
  maxImageSize: number;
  sessionTimeout: number;
}

export default function SystemPage() {
  const [config, setConfig] = useState<SystemConfig>({
    categories: [],
    locations: [],
    departments: [],
    hostels: [],
    autoMatchEnabled: true,
    emailNotifications: true,
    maxImageSize: 5,
    sessionTimeout: 24
  });
  const [newCategory, setNewCategory] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemConfig();
  }, []);

  const fetchSystemConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/admin/system-config`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setConfig(data.config || config);
    } catch (error) {
      console.error('Failed to fetch system config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<SystemConfig>) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${BACKEND_URL}/api/admin/system-config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      setConfig({ ...config, ...updates });
    } catch (error) {
      console.error('Failed to update config:', error);
    }
  };

  const addCategory = () => {
    if (newCategory.trim()) {
      const updatedCategories = [...config.categories, newCategory.trim()];
      updateConfig({ categories: updatedCategories });
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    const updatedCategories = config.categories.filter(c => c !== category);
    updateConfig({ categories: updatedCategories });
  };

  const addLocation = () => {
    if (newLocation.trim()) {
      const updatedLocations = [...config.locations, newLocation.trim()];
      updateConfig({ locations: updatedLocations });
      setNewLocation('');
    }
  };

  const removeLocation = (location: string) => {
    const updatedLocations = config.locations.filter(l => l !== location);
    updateConfig({ locations: updatedLocations });
  };

  if (loading) return <div className="p-6">Loading system configuration...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">System Configuration</h1>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add new category..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                />
                <Button onClick={addCategory}>Add</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {config.categories.map((category) => (
                  <div key={category} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span>{category}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeCategory(category)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Locations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add new location..."
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLocation()}
                />
                <Button onClick={addLocation}>Add</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {config.locations.map((location) => (
                  <div key={location} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                    <span>{location}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeLocation(location)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Image Size (MB)</Label>
                  <Input
                    type="number"
                    value={config.maxImageSize}
                    onChange={(e) => updateConfig({ maxImageSize: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout (hours)</Label>
                  <Input
                    type="number"
                    value={config.sessionTimeout}
                    onChange={(e) => updateConfig({ sessionTimeout: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoMatch"
                    checked={config.autoMatchEnabled}
                    onChange={(e) => updateConfig({ autoMatchEnabled: e.target.checked })}
                  />
                  <Label htmlFor="autoMatch">Enable Auto-Matching</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={config.emailNotifications}
                    onChange={(e) => updateConfig({ emailNotifications: e.target.checked })}
                  />
                  <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}