import { useState } from 'react'
import { Plus, Search, Filter, Eye, Edit, Send, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AlertCard from '@/components/alerts/AlertCard'
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
          <h1 className="text-3xl font-bold tracking-tight">Client Alerts</h1>
          <p className="text-muted-foreground mt-1">
            Create and publish legal updates and insights for your clients.
          </p>
        </div>
        <Button onClick={() => setComposeModalOpen(true)} className="focus-ring">
          <Plus className="h-4 w-4 mr-2" />
          Compose Alert
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.published || 0}</p>
              <p className="text-sm text-muted-foreground">Published</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{stats.draft || 0}</p>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{totalViews}</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{totalEngagement}</p>
              <p className="text-sm text-muted-foreground">Engagement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 focus-ring"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 focus-ring">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>
          Showing {filteredAlerts.length} of {alerts.length} alerts
        </span>
      </div>

      {/* Alerts Tabs */}
      <Tabs defaultValue="published" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="published" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Published
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
              {publishedAlerts.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="drafts" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Drafts
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">
              {draftAlerts.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Published Alerts */}
        <TabsContent value="published" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {publishedAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onClick={() => handleAlertClick(alert)}
              />
            ))}
          </div>

          {publishedAlerts.length === 0 && (
            <div className="text-center py-12">
              <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No published alerts</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria.' 
                  : 'Start by creating your first client alert.'}
              </p>
              {!(searchTerm || statusFilter !== 'all') && (
                <Button onClick={() => setComposeModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Compose Alert
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        {/* Draft Alerts */}
        <TabsContent value="drafts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {draftAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onClick={() => handleAlertClick(alert)}
              />
            ))}
          </div>

          {draftAlerts.length === 0 && (
            <div className="text-center py-12">
              <Edit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No draft alerts</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria.' 
                  : 'All your alerts have been published or you haven\'t created any drafts yet.'}
              </p>
              {!(searchTerm || statusFilter !== 'all') && (
                <Button onClick={() => setComposeModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Draft
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

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
