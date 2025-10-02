import { Calendar, Eye, Users, Tag, Send, Edit, Share, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClientAlert } from '@/data/types'
import { formatDateTime } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { mockClients } from '@/data/mockData'

interface AlertPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alert: ClientAlert | null
}

export default function AlertPreviewModal({
  open,
  onOpenChange,
  alert,
}: AlertPreviewModalProps) {
  const { toast } = useToast()

  if (!alert) return null

  const getStatusColor = (status: ClientAlert['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-orange-100 text-orange-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: ClientAlert['status']) => {
    switch (status) {
      case 'published':
        return <Send className="h-3 w-3" />
      case 'draft':
        return <Edit className="h-3 w-3" />
      case 'archived':
        return <Eye className="h-3 w-3" />
    }
  }

  const getAudienceNames = () => {
    return alert.audience
      .map(clientId => mockClients.find(c => c.id === clientId)?.name)
      .filter(Boolean)
      .join(', ')
  }

  const handleEdit = () => {
    toast({
      title: "Edit Alert",
      description: "Opening alert editor...",
    })
  }

  const handleShare = () => {
    toast({
      title: "Share Alert",
      description: "Copying share link to clipboard...",
    })
  }

  const handleDownload = () => {
    toast({
      title: "Downloading",
      description: "Generating PDF version of the alert...",
    })
  }

  const handlePublish = () => {
    if (alert.status === 'draft') {
      toast({
        title: "Publishing Alert",
        description: "Your alert is being published to clients...",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Alert Preview
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Alert Header */}
          <div className="border-b pb-4 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getStatusColor(alert.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(alert.status)}
                      {alert.status}
                    </span>
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateTime(alert.publishedAt)}</span>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold mb-2">{alert.title}</h1>
                <p className="text-lg text-muted-foreground">{alert.summary}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{alert.views} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{alert.audience.length} recipients</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{alert.engagement} engagement</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {alert.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleEdit} className="focus-ring">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={handleShare} className="focus-ring">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownload} className="focus-ring">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              {alert.status === 'draft' && (
                <Button size="sm" onClick={handlePublish} className="focus-ring">
                  <Send className="h-4 w-4 mr-2" />
                  Publish Now
                </Button>
              )}
            </div>
          </div>

          {/* Alert Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              {/* Hero Image */}
              {alert.heroImage && (
                <div className="w-full h-48 bg-muted rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-muted-foreground/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Eye className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Hero Image Preview</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.heroImage}</p>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {alert.content}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">About This Alert</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Published:</span>
                      <span className="ml-2 text-muted-foreground">
                        {formatDateTime(alert.publishedAt)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge className={`ml-2 ${getStatusColor(alert.status)}`} variant="secondary">
                        {alert.status}
                      </Badge>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">Sent to:</span>
                      <span className="ml-2 text-muted-foreground">
                        {getAudienceNames() || 'No recipients selected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Stats */}
              {alert.status === 'published' && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Engagement Analytics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-lg font-bold text-blue-800">{alert.views}</p>
                          <p className="text-sm text-blue-600">Total Views</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-lg font-bold text-green-800">{alert.audience.length}</p>
                          <p className="text-sm text-green-600">Recipients</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2">
                        <Share className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-lg font-bold text-purple-800">{alert.engagement}</p>
                          <p className="text-sm text-purple-600">Engagement</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
