import { FileText, Download, Share, Calendar, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ActivityPost } from '@/data/types'
import { mockDocuments } from '@/data/mockData'

interface DocumentPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: ActivityPost | null
}

export default function DocumentPreviewModal({
  open,
  onOpenChange,
  activity,
}: DocumentPreviewModalProps) {
  if (!activity || !activity.documentId) return null

  const document = mockDocuments.find(d => d.id === activity.documentId)
  if (!document) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'executed':
        return 'bg-green-100 text-green-800'
      case 'in_negotiation':
        return 'bg-orange-100 text-orange-800'
      case 'draft':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Preview - {document.templateName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Document Header */}
          <div className="border-b pb-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-semibold mb-2">{document.templateName}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{document.clientName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(document.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(document.status)}>
                  {document.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  v{document.currentVersion}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="focus-ring">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button size="sm" variant="outline" className="focus-ring">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" variant="outline" className="focus-ring">
                View All Versions
              </Button>
            </div>
          </div>

          {/* Document Preview */}
          <div className="flex-1 border rounded-lg bg-white">
            <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center space-y-4">
                <div className="w-24 h-32 mx-auto bg-white border-2 border-muted rounded-lg shadow-sm flex items-center justify-center">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">PDF Preview</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {document.templateName} - Final executed version
                  </p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>Document ID: {document.id}</p>
                    <p>Pages: 12</p>
                    <p>File size: 2.4 MB</p>
                    <p>Last modified: {new Date(document.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Metadata */}
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Template Used:</span>
                <span className="ml-2 text-muted-foreground">{document.templateName}</span>
              </div>
              <div>
                <span className="font-medium">Current Version:</span>
                <span className="ml-2 text-muted-foreground">v{document.currentVersion}</span>
              </div>
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-2 text-muted-foreground">
                  {new Date(document.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <Badge className={`ml-2 ${getStatusColor(document.status)}`} variant="secondary">
                  {document.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
