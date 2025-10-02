import { MessageSquare, User, Calendar, Tag, Paperclip, Bot, Eye, Download, RotateCcw } from 'lucide-react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { LegalQuery } from '@/data/types'
import { formatRelativeTime, getInitials, truncateText } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface QueryCardProps {
  query: LegalQuery
  onClick: () => void
}

export default function QueryCard({ query, onClick }: QueryCardProps) {
  const { toast } = useToast()

  const getStatusColor = (status: LegalQuery['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getModelIcon = (model: string) => {
    if (model.includes('Claude')) {
      return <Bot className="h-4 w-4 text-purple-600" />
    } else if (model.includes('GPT')) {
      return <Bot className="h-4 w-4 text-green-600" />
    }
    return <Bot className="h-4 w-4 text-blue-600" />
  }

  const handleExportPDF = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast({
      title: "Exporting PDF",
      description: `Generating PDF for query: ${truncateText(query.summary, 50)}`,
    })
  }

  const handleReRun = (e: React.MouseEvent) => {
    e.stopPropagation()
    toast({
      title: "Re-running Query",
      description: "Query is being processed with the latest model",
    })
  }

  return (
    <Card className="card-hover cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="w-10 h-10">
              <AvatarImage src={`/${query.clientName.toLowerCase().replace(/\s+/g, '-')}-logo.png`} />
              <AvatarFallback>
                {getInitials(query.clientName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{query.clientName}</span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-muted-foreground text-sm">
                  {formatRelativeTime(query.createdAt)}
                </span>
              </div>
              <h3 className="font-semibold text-base truncate">{query.summary}</h3>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(query.status)}>
              {query.status}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getModelIcon(query.model)}
              <span>{query.model}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {/* Query Preview */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {query.prompt}
        </p>

        {/* Topic and Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {query.topic}
          </Badge>
          {query.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
          {query.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{query.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Attachments */}
        {query.attachments.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Paperclip className="h-3 w-3" />
            <span>{query.attachments.length} attachment{query.attachments.length > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Key Insights Preview */}
        {query.status === 'completed' && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="font-medium text-muted-foreground">Issues:</span>
                <span className="ml-1">{query.sections.issues.length}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Key Clauses:</span>
                <span className="ml-1">{query.sections.clausesToWatch.length}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Model:</span>
                <span className="ml-1">{query.model}</span>
              </div>
            </div>
          </div>
        )}
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
            Open
          </Button>
          
          {query.status === 'completed' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="focus-ring"
              onClick={handleExportPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="focus-ring"
            onClick={handleReRun}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Re-run
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
