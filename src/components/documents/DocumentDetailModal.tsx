import { useState } from 'react'
import { FileText, User, Calendar, Download, Share, Eye, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Document, ActivityPost } from '@/data/types'
import { formatDateTime, formatRelativeTime, getInitials } from '@/lib/utils'
import { mockActivityPosts } from '@/data/mockData'

interface DocumentDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: Document | null
}

export default function DocumentDetailModal({
  open,
  onOpenChange,
  document,
}: DocumentDetailModalProps) {
  const [expandedActivity, setExpandedActivity] = useState<Set<string>>(new Set())

  if (!document) return null

  const toggleActivity = (activityId: string) => {
    setExpandedActivity(prev => {
      const newSet = new Set(prev)
      if (newSet.has(activityId)) {
        newSet.delete(activityId)
      } else {
        newSet.add(activityId)
      }
      return newSet
    })
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

  const getVersionColor = (type: string) => {
    switch (type) {
      case 'template':
        return 'bg-purple-100 text-purple-800'
      case 'initial_draft':
        return 'bg-blue-100 text-blue-800'
      case 'negotiation_turn':
        return 'bg-orange-100 text-orange-800'
      case 'final':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Mock activity feed for this document
  const documentActivity = mockActivityPosts.filter(activity => 
    activity.documentId === document.id
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.templateName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Document Header */}
          <div className="border-b pb-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`/${document.clientName.toLowerCase().replace(/\s+/g, '-')}-logo.png`} />
                  <AvatarFallback>
                    {getInitials(document.clientName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{document.clientName}</h2>
                  <p className="text-sm text-muted-foreground">Client</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(document.status)}>
                  {document.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  Version {document.currentVersion}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {formatDateTime(document.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Updated: {formatDateTime(document.updatedAt)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="focus-ring">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button size="sm" variant="outline" className="focus-ring">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" variant="outline" className="focus-ring">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>

          {/* Document Content */}
          <Tabs defaultValue="activity" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">Activity Feed</TabsTrigger>
              <TabsTrigger value="versions">Version History</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="flex-1 mt-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {documentActivity.length > 0 ? (
                  documentActivity.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={activity.clientLogo} />
                            <AvatarFallback className="text-xs">
                              {getInitials(activity.clientName)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{activity.title}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(activity.createdAt)}
                              </span>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {activity.description}
                            </p>
                            
                            {activity.flags && activity.flags.length > 0 && (
                              <div className="flex gap-2 mb-2">
                                {activity.flags.map((flag, index) => (
                                  <Badge key={index} variant="destructive" className="text-xs">
                                    {flag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {activity.hasThread && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleActivity(activity.id)}
                                className="p-0 h-auto text-xs focus-ring"
                              >
                                {expandedActivity.has(activity.id) ? (
                                  <>
                                    <ChevronUp className="h-3 w-3 mr-1" />
                                    Hide Details
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-3 w-3 mr-1" />
                                    Show Details
                                  </>
                                )}
                              </Button>
                            )}
                            
                            {activity.hasThread && expandedActivity.has(activity.id) && activity.threadPosts && (
                              <div className="mt-3 ml-4 border-l-2 border-muted pl-4 space-y-2">
                                {activity.threadPosts.map((thread) => (
                                  <div key={thread.id} className="text-sm">
                                    <div className="font-medium">{thread.title}</div>
                                    <div className="text-muted-foreground">{thread.description}</div>
                                    {thread.content && (
                                      <div className="mt-1 p-2 bg-muted/50 rounded text-xs">
                                        {thread.content}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No activity recorded yet</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="versions" className="flex-1 mt-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {document.versions.slice().reverse().map((version, index) => (
                  <Card key={version.version}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            {version.version}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getVersionColor(version.type)} variant="secondary">
                                {version.type.replace('_', ' ')}
                              </Badge>
                              {version.version === document.currentVersion && (
                                <Badge variant="default" className="text-xs">Current</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(version.createdAt)} • {version.author}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="focus-ring">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {version.version !== document.currentVersion && (
                            <Button size="sm" variant="outline" className="focus-ring">
                              Compare
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {version.changes.length > 0 && (
                        <div className="mt-3 ml-11">
                          <p className="text-sm font-medium mb-1">Changes:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {version.changes.map((change, changeIndex) => (
                              <li key={changeIndex} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                                <span>{change}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details" className="flex-1 mt-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Document Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Template:</span>
                        <span>{document.templateName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client:</span>
                        <span>{document.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getStatusColor(document.status)} variant="secondary">
                          {document.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Version:</span>
                        <span>v{document.currentVersion}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Timeline</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{formatDateTime(document.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span>{formatDateTime(document.updatedAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Versions:</span>
                        <span>{document.versions.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
