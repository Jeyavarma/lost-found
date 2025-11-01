'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Database,
  Server,
  Monitor,
  Globe,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  Activity,
  Cloud,
  Zap
} from 'lucide-react'
import Navigation from '@/components/navigation'
import { isAuthenticated, getUserData, getAuthToken } from '@/lib/auth'
import { BACKEND_URL } from '@/lib/config'

interface SystemFlow {
  frontend: {
    deployment: string
    url: string
    status: string
    activeUsers: number
    lastDeploy: string
  }
  backend: {
    deployment: string
    url: string
    status: string
    uptime: number
    memoryUsage: number
    cpuUsage: number
  }
  database: {
    provider: string
    status: string
    totalUsers: number
    totalItems: number
  }
  connections: {
    frontendToBackend: {
      protocol: string
      cors: string
      authentication: string
      status: string
    }
    backendToDatabase: {
      protocol: string
      connection: string
      status: string
    }
  }
  liveData: {
    recentActivities: any[]
    recentTransactions: any[]
    recentLogins: any[]
  }
}

export default function SystemPage() {
  const [systemData, setSystemData] = useState<SystemFlow | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        window.location.href = '/login'
        return
      }
      
      const userData = getUserData()
      if (userData?.role !== 'admin') {
        window.location.href = '/dashboard'
        return
      }
      
      fetchSystemFlow()
    }
    
    checkAuth()
  }, [])

  const fetchSystemFlow = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch(`${BACKEND_URL}/api/system-flow/live-metrics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSystemData(data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('System flow fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading system architecture...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mcc-text-primary font-serif mb-2">
              Live System Architecture
            </h1>
            <p className="text-gray-600">
              Real-time connection: Vercel Frontend ↔ Render Backend ↔ MongoDB Atlas
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <Button onClick={fetchSystemFlow} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Architecture Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
          {/* Frontend - Vercel */}
          <Card className="mcc-card border-blue-200">
            <CardHeader className="bg-blue-50 text-center">
              <Monitor className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-blue-700 text-lg">Frontend</CardTitle>
              <Badge className="bg-blue-600 text-white">Vercel</Badge>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="text-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mx-auto mb-1" />
                  <div className="text-xs font-medium">Live</div>
                  <a 
                    href="https://lost-found-mcc.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline break-all"
                  >
                    lost-found-mcc.vercel.app
                  </a>
                </div>
                
                <div className="bg-white p-2 rounded border text-xs">
                  <div>Users: <strong>{systemData?.frontend.activeUsers || 0}</strong></div>
                  <div>Status: <strong className="text-green-600">active</strong></div>
                </div>
                
                <div className="text-center text-xs">
                  <div className="text-gray-500">Next.js 15</div>
                  <div>React + TypeScript</div>
                  <div>Tailwind CSS</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connection Arrow */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <ArrowRight className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-xs text-gray-600">
                <div>HTTPS</div>
                <div>JWT Auth</div>
                <div className="text-green-600 font-medium">Connected</div>
              </div>
            </div>
          </div>

          {/* Backend - Render */}
          <Card className="mcc-card border-green-200">
            <CardHeader className="bg-green-50 text-center">
              <Server className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-green-700 text-lg">Backend</CardTitle>
              <Badge className="bg-green-600 text-white">Render</Badge>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="text-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mx-auto mb-1" />
                  <div className="text-xs font-medium">Running</div>
                  <a 
                    href={BACKEND_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline break-all"
                  >
                    {BACKEND_URL.replace('https://', '')}
                  </a>
                </div>
                
                <div className="bg-white p-2 rounded border text-xs">
                  <div>Uptime: <strong>{formatUptime(systemData?.backend.uptime || 0)}</strong></div>
                  <div>Memory: <strong>{systemData?.backend.memoryUsage || 0}%</strong></div>
                  <div>CPU: <strong>{systemData?.backend.cpuUsage || 0}%</strong></div>
                </div>
                
                <div className="text-center text-xs">
                  <div className="text-gray-500">Express.js</div>
                  <div>Node.js Runtime</div>
                  <div>JWT + CORS</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connection Arrow */}
          <div className="flex items-center justify-center">
            <div className="text-center">
              <ArrowRight className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-xs text-gray-600">
                <div>MongoDB</div>
                <div>Mongoose</div>
                <div className="text-green-600 font-medium">Connected</div>
              </div>
            </div>
          </div>

          {/* Database - MongoDB Atlas */}
          <Card className="mcc-card border-purple-200">
            <CardHeader className="bg-purple-50 text-center">
              <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-purple-700 text-lg">Database</CardTitle>
              <Badge className="bg-purple-600 text-white">MongoDB Atlas</Badge>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="text-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mx-auto mb-1" />
                  <div className="text-xs font-medium">Connected</div>
                  <div className="text-xs text-purple-600">Cloud Database</div>
                </div>
                
                <div className="bg-white p-2 rounded border text-xs">
                  <div>Users: <strong>{systemData?.database.totalUsers || 0}</strong></div>
                  <div>Items: <strong>{systemData?.database.totalItems || 0}</strong></div>
                  <div>Status: <strong className="text-green-600">connected</strong></div>
                </div>
                
                <div className="text-center text-xs">
                  <div className="text-gray-500">Collections</div>
                  <div>users, items</div>
                  <div>activities, transactions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Data Streams */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {!systemData?.liveData?.recentActivities?.length ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Loading activities...
                  </div>
                ) : (
                  systemData.liveData.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <div>
                        <div className="font-medium capitalize">
                          {activity.action?.replace('_', ' ') || 'Activity'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {activity.user || 'User'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {!systemData?.liveData?.recentTransactions?.length ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Loading transactions...
                  </div>
                ) : (
                  systemData.liveData.recentTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <div>
                        <div className="font-medium">{transaction.item || 'Item'}</div>
                        <div className="text-xs text-gray-600 capitalize">
                          {transaction.status || 'status'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(transaction.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mcc-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Recent Logins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {!systemData?.liveData?.recentLogins?.length ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    Loading logins...
                  </div>
                ) : (
                  systemData.liveData.recentLogins.map((login, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <div>
                        <div className="font-medium">{login.user || 'User'}</div>
                        <div className="text-xs text-gray-600">
                          {login.ipAddress || 'IP'}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(login.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connection Details */}
        <Card className="mcc-card mt-6">
          <CardHeader>
            <CardTitle>Live Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-700 mb-2">Frontend → Backend</h4>
                <div className="space-y-1 text-sm">
                  <div>Protocol: <strong>HTTPS</strong></div>
                  <div>CORS: <strong>Enabled</strong></div>
                  <div>Auth: <strong>JWT Bearer</strong></div>
                  <div>Status: <strong className="text-green-600">Active</strong></div>
                  <div>Endpoint: <strong>{BACKEND_URL}</strong></div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">Backend → Database</h4>
                <div className="space-y-1 text-sm">
                  <div>Protocol: <strong>MongoDB</strong></div>
                  <div>Connection: <strong>Atlas Cloud</strong></div>
                  <div>Driver: <strong>Mongoose</strong></div>
                  <div>Status: <strong className="text-green-600">Connected</strong></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}