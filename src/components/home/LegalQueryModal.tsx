import { MessageSquare, User, Calendar, Tag, Paperclip } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ActivityPost } from '@/data/types'
import { mockLegalQueries } from '@/data/mockData'

interface LegalQueryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: ActivityPost | null
}

export default function LegalQueryModal({
  open,
  onOpenChange,
  activity,
}: LegalQueryModalProps) {
  if (!activity || !activity.queryId) return null

  const query = mockLegalQueries.find(q => q.id === activity.queryId)
  if (!query) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Legal Query Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Query Header */}
          <div className="border-b pb-4 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{query.clientName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(query.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <Badge variant="secondary">{query.model}</Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">{query.topic}</Badge>
              {query.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            {query.attachments.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Paperclip className="h-4 w-4" />
                <span>{query.attachments.length} attachment(s)</span>
              </div>
            )}
          </div>

          {/* Query Content */}
          <Tabs defaultValue="prompt" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="prompt">Original Query</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="clauses">Key Clauses</TabsTrigger>
            </TabsList>

            <TabsContent value="prompt" className="flex-1 mt-4">
              <div className="border rounded-lg p-4 h-80 overflow-y-auto bg-muted/20">
                <h3 className="font-semibold mb-3">Client Query</h3>
                <div className="text-sm whitespace-pre-wrap">
                  {query.prompt}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="flex-1 mt-4">
              <div className="border rounded-lg p-4 h-80 overflow-y-auto">
                <h3 className="font-semibold mb-3">Legal Analysis Summary</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm">{query.sections.summary}</p>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm font-medium text-blue-800 mb-1">Key Recommendation</p>
                    <p className="text-sm text-blue-700">{query.sections.notes}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="issues" className="flex-1 mt-4">
              <div className="border rounded-lg p-4 h-80 overflow-y-auto">
                <h3 className="font-semibold mb-3">Legal Issues Identified</h3>
                <div className="space-y-3">
                  {query.sections.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-600 text-xs font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-800">{issue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clauses" className="flex-1 mt-4">
              <div className="border rounded-lg p-4 h-80 overflow-y-auto">
                <h3 className="font-semibold mb-3">Clauses to Watch</h3>
                <div className="space-y-3">
                  {query.sections.clausesToWatch.map((clause, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-yellow-600 text-xs font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">{clause}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
