import { FileText, Calendar, User, Clock, CheckCircle, XCircle, Edit } from 'lucide-react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Document } from '@/data/types'
import { formatRelativeTime, getInitials } from '@/lib/utils'

interface DocumentCardProps {
  document: Document
  onClick: () => void
}

export default function DocumentCard({ document, onClick }: DocumentCardProps) {
  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4" />
      case 'in_negotiation':
        return <Clock className="h-4 w-4" />
      case 'executed':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-blue-100 text-blue-800'
      case 'in_negotiation':
        return 'bg-orange-100 text-orange-800'
      case 'executed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
    }
  }

  const getStatusLabel = (status: Document['status']) => {
    switch (status) {
      case 'draft':
        return 'Draft'
      case 'in_negotiation':
        return 'In Negotiation'
      case 'executed':
        return 'Executed'
      case 'cancelled':
        return 'Cancelled'
    }
  }

  return (
    <Card className="card-hover cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-semibold text-base truncate">{document.templateName}</h3>
              <p className="text-sm text-muted-foreground">Document ID: {document.id}</p>
            </div>
          </div>
          
          <Badge className={getStatusColor(document.status)}>
            <span className="flex items-center gap-1">
              {getStatusIcon(document.status)}
              {getStatusLabel(document.status)}
            </span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {/* Client Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-8 h-8">
            <AvatarImage src={`/${document.clientName.toLowerCase().replace(/\s+/g, '-')}-logo.png`} />
            <AvatarFallback className="text-xs">
              {getInitials(document.clientName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{document.clientName}</p>
            <p className="text-xs text-muted-foreground">Client</p>
          </div>
        </div>

        {/* Version Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span>Version {document.currentVersion}</span>
          <span>{document.versions.length} total versions</span>
        </div>

        {/* Progress Indicator */}
        <div className="w-full bg-muted rounded-full h-2 mb-3">
          <div 
            className={`h-2 rounded-full transition-all ${
              document.status === 'draft' ? 'bg-blue-500 w-1/4' :
              document.status === 'in_negotiation' ? 'bg-orange-500 w-3/4' :
              document.status === 'executed' ? 'bg-green-500 w-full' :
              'bg-red-500 w-full'
            }`}
          />
        </div>

        {/* Timestamps */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Created {formatRelativeTime(document.createdAt)}</span>
          </div>
          {document.updatedAt !== document.createdAt && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Updated {formatRelativeTime(document.updatedAt)}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 focus-ring"
            onClick={(e) => {
              e.stopPropagation()
              // Handle activity feed view
            }}
          >
            View Activity
          </Button>
          <Button 
            size="sm" 
            className="flex-1 focus-ring"
            onClick={(e) => {
              e.stopPropagation()
              // Handle version comparison
            }}
          >
            Compare Versions
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
