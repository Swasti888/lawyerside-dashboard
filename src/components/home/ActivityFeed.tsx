import { useState } from 'react'
import { MessageSquare, FileText, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Flag, Lightbulb } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { mockActivityPosts } from '@/data/mockData'
import { ActivityPost } from '@/data/types'
import { formatRelativeTime, getInitials } from '@/lib/utils'

interface ActivityFeedProps {
  onActivityClick: (activity: ActivityPost) => void
}

export default function ActivityFeed({ onActivityClick }: ActivityFeedProps) {
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set())

  const toggleThread = (activityId: string) => {
    setExpandedThreads(prev => {
      const newSet = new Set(prev)
      if (newSet.has(activityId)) {
        newSet.delete(activityId)
      } else {
        newSet.add(activityId)
      }
      return newSet
    })
  }

  const getActivityIcon = (type: ActivityPost['type']) => {
    switch (type) {
      case 'initial_draft':
        return <FileText className="h-4 w-4" />
      case 'first_turn':
      case 'turn_received':
        return <MessageSquare className="h-4 w-4" />
      case 'legal_query':
        return <AlertCircle className="h-4 w-4" />
      case 'executed_document':
        return <CheckCircle className="h-4 w-4" />
      case 'template_used':
        return <FileText className="h-4 w-4" />
      case 'draft_sent':
        return <MessageSquare className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: ActivityPost['type']) => {
    switch (type) {
      case 'initial_draft':
        return 'text-blue-600'
      case 'first_turn':
      case 'turn_received':
        return 'text-orange-600'
      case 'legal_query':
        return 'text-yellow-600'
      case 'executed_document':
        return 'text-green-600'
      case 'template_used':
        return 'text-purple-600'
      case 'draft_sent':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Activity Feed</h2>
        <Button variant="outline" size="sm" className="focus-ring">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {mockActivityPosts.map((activity) => (
          <Card key={activity.id} className="card-hover">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                {/* Client Avatar */}
                <Avatar className="w-10 h-10">
                  <AvatarImage src={activity.clientLogo} />
                  <AvatarFallback>
                    {getInitials(activity.clientName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </span>
                    <span className="font-medium text-sm">{activity.clientName}</span>
                    <span className="text-muted-foreground text-sm">•</span>
                    <span className="text-muted-foreground text-sm">
                      {formatRelativeTime(activity.createdAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-base mb-1">{activity.title}</h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-2">
                    {activity.description}
                  </p>

                  {/* Content (for email-like posts) */}
                  {activity.content && (
                    <div className="bg-muted/50 p-3 rounded-md text-sm mb-2">
                      {activity.content}
                    </div>
                  )}

                  {/* Flags and Opportunities */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {activity.flags?.map((flag, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        <Flag className="h-3 w-3 mr-1" />
                        {flag}
                      </Badge>
                    ))}
                    {activity.opportunities?.map((opportunity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Lightbulb className="h-3 w-3 mr-1" />
                        {opportunity}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onActivityClick(activity)}
                      className="focus-ring"
                    >
                      {activity.type === 'first_turn' && 'Compare Versions'}
                      {activity.type === 'legal_query' && 'View Query'}
                      {activity.type === 'executed_document' && 'View Document'}
                      {!['first_turn', 'legal_query', 'executed_document'].includes(activity.type) && 'View Details'}
                    </Button>

                    {activity.hasThread && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleThread(activity.id)}
                        className="focus-ring"
                      >
                        {expandedThreads.has(activity.id) ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Thread
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Show Thread ({activity.threadPosts?.length || 0})
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Thread Posts */}
            {activity.hasThread && expandedThreads.has(activity.id) && activity.threadPosts && (
              <CardContent className="pt-0">
                <div className="ml-13 border-l-2 border-muted pl-4 space-y-3">
                  {activity.threadPosts.map((threadPost) => (
                    <div key={threadPost.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`${getActivityColor(threadPost.type)}`}>
                          {getActivityIcon(threadPost.type)}
                        </span>
                        <span className="font-medium text-sm">{threadPost.title}</span>
                        <span className="text-muted-foreground text-xs">
                          {formatRelativeTime(threadPost.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground text-sm">
                        {threadPost.description}
                      </p>

                      {threadPost.content && (
                        <div className="bg-muted/50 p-2 rounded text-xs">
                          {threadPost.content}
                        </div>
                      )}

                      {threadPost.flags?.map((flag, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          <Flag className="h-3 w-3 mr-1" />
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
