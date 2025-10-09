import { useState } from 'react'
import { Plus, Search, Filter, Eye, Edit, Send, Users, Clock, Calendar, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ComposeAlertModal from '@/components/alerts/ComposeAlertModal'
import AlertPreviewModal from '@/components/alerts/AlertPreviewModal'
import { mockClientAlerts } from '@/data/mockData'
import { ClientAlert } from '@/data/types'

export default function ClientAlerts() {
  const [alerts, setAlerts] = useState(mockClientAlerts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [composeModalOpen, setComposeModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<ClientAlert | null>(null)

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const publishedAlerts = filteredAlerts.filter(alert => alert.status === 'published')
  const draftAlerts = filteredAlerts.filter(alert => alert.status === 'draft')

  const handleAlertClick = (alert: ClientAlert) => {
    setSelectedAlert(alert)
    setPreviewModalOpen(true)
  }

  const handleNewAlert = (newAlert: ClientAlert) => {
    setAlerts(prev => [newAlert, ...prev])
  }

  const getStatusStats = () => {
    return alerts.reduce((acc, alert) => {
      acc[alert.status] = (acc[alert.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  const stats = getStatusStats()
  const totalViews = alerts.reduce((sum, alert) => sum + alert.views, 0)
  const totalEngagement = alerts.reduce((sum, alert) => sum + alert.engagement, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Legal Insights</h1>
          <p className="text-muted-foreground mt-1">
            Articles and updates from our legal experts
          </p>
        </div>
        <Button onClick={() => setComposeModalOpen(true)} className="focus-ring">
          <Plus className="h-4 w-4 mr-2" />
          Compose Article
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 focus-ring"
            />
          </div>

          {/* Category Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 focus-ring">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Articles</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedAlerts.map((alert) => (
          <Card 
            key={alert.id} 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
            onClick={() => handleAlertClick(alert)}
          >
            <CardContent className="p-0">
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-2 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
                    <Send className="h-8 w-8 text-muted-foreground/60" />
                  </div>
                  <p className="text-sm">Article Image</p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {alert.tags[0] || 'Legal Update'}
                  </Badge>
                </div>
                
                <h3 className="font-semibold tracking-tight text-xl mb-2 line-clamp-2">
                  {alert.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {alert.summary}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {Math.ceil(alert.content.length / 500)} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(alert.publishedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* CALEX Brand Card */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
          <CardContent className="p-0">
            <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">C</span>
                </div>
                <h3 className="font-bold text-xl text-primary">CALEX</h3>
                <p className="text-sm text-muted-foreground">Legal Partners</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground text-sm text-center">
                Your trusted legal counsel for startup growth and corporate excellence.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {publishedAlerts.length === 0 && (
        <div className="text-center py-12">
          <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search criteria.' 
              : 'Start by creating your first legal insight article.'}
          </p>
          {!(searchTerm || statusFilter !== 'all') && (
            <Button onClick={() => setComposeModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Compose Article
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <ComposeAlertModal
        open={composeModalOpen}
        onOpenChange={setComposeModalOpen}
        onAlertCreated={handleNewAlert}
      />

      <AlertPreviewModal
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        alert={selectedAlert}
      />
    </div>
  )
}
