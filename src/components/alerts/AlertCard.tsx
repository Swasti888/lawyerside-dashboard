import { Calendar, Eye, Users, Tag, Send, Edit, Archive } from 'lucide-react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClientAlert } from '@/data/types'
import { formatRelativeTime, truncateText } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface AlertCardProps {
  alert: ClientAlert
  onClick: () => void
}

export default function AlertCard({ alert, onClick }: AlertCardProps) {
  const { toast } = useToast()

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
        return <Archive className="h-3 w-3" />
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast({
      title: "Edit Alert",
      description: `Opening editor for: ${truncateText(alert.title, 50)}`,
    })
  }

  const handlePublish = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (alert.status === 'draft') {
      toast({
        title: "Publishing Alert",
        description: `Publishing: ${truncateText(alert.title, 50)}`,
      })
    } else {
      toast({
        title: "Alert Already Published",
        description: "This alert is already live for clients",
      })
    }
  }

  return (
    <Card className="card-hover cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(alert.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(alert.status)}
                  {alert.status}
                </span>
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatRelativeTime(alert.publishedAt)}</span>
              </div>
            </div>
            <h3 className="font-semibold text-lg leading-tight mb-1">
              {alert.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {alert.summary}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {/* Hero Image Placeholder */}
        {alert.heroImage && (
          <div className="w-full h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-muted-foreground/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Eye className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Hero Image</p>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {alert.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
          {alert.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{alert.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{alert.views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{alert.audience.length} recipients</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span>{alert.engagement} engagement</span>
          </div>
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
              onClick()
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            {alert.status === 'draft' ? 'Preview' : 'View'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="focus-ring"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          
          {alert.status === 'draft' && (
            <Button 
              size="sm" 
              className="focus-ring"
              onClick={handlePublish}
            >
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
