import { MessageSquare, User, Calendar, Tag, Paperclip, Bot, Download, RotateCcw, Copy } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { LegalQuery } from '@/data/types'
import { formatDateTime, getInitials } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface QueryDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  query: LegalQuery | null
}

export default function QueryDetailModal({
  open,
  onOpenChange,
  query,
}: QueryDetailModalProps) {
  const { toast } = useToast()

  if (!query) return null

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

  const handleExportPDF = () => {
    toast({
      title: "Exporting PDF",
      description: "Generating comprehensive PDF report...",
    })
  }

  const handleReRun = () => {
    toast({
      title: "Re-running Query",
      description: "Query is being processed with the latest model version",
    })
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
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
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`/${query.clientName.toLowerCase().replace(/\s+/g, '-')}-logo.png`} />
                  <AvatarFallback>
                    {getInitials(query.clientName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{query.clientName}</h2>
                  <p className="text-sm text-muted-foreground">{query.summary}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(query.status)}>
                  {query.status}
                </Badge>
                <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
                  {getModelIcon(query.model)}
                  <span>{query.model}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDateTime(query.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span>{query.topic}</span>
              </div>
              {query.attachments.length > 0 && (
                <div className="flex items-center gap-1">
                  <Paperclip className="h-4 w-4" />
                  <span>{query.attachments.length} attachment{query.attachments.length > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {query.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={handleExportPDF} className="focus-ring">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button size="sm" variant="outline" onClick={handleReRun} className="focus-ring">
                <RotateCcw className="h-4 w-4 mr-2" />
                Re-run Query
              </Button>
            </div>
          </div>

          {/* Query Content */}
          <Tabs defaultValue="analysis" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="clauses">Key Clauses</TabsTrigger>
              <TabsTrigger value="templates">Template Prompts</TabsTrigger>
              <TabsTrigger value="original">Original Query</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="flex-1 mt-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Legal Analysis Summary</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(query.sections.summary)}
                      className="focus-ring"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">{query.sections.summary}</p>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Recommendations</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyToClipboard(query.sections.notes)}
                        className="focus-ring"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm text-blue-800">{query.sections.notes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="issues" className="flex-1 mt-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Legal Issues Identified</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyToClipboard(query.sections.issues.join('\n'))}
                    className="focus-ring"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy All
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {query.sections.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-600 text-xs font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-orange-800">{issue}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyToClipboard(issue)}
                        className="opacity-0 group-hover:opacity-100 focus-ring"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clauses" className="flex-1 mt-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Key Clauses to Watch</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyToClipboard(query.sections.clausesToWatch.join('\n'))}
                    className="focus-ring"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy All
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {query.sections.clausesToWatch.map((clause, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 group">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-yellow-600 text-xs font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800">{clause}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyToClipboard(clause)}
                        className="opacity-0 group-hover:opacity-100 focus-ring"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="flex-1 mt-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Template Prompts</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-800">Deviation Summary</h4>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 text-sm font-bold">2</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-orange-800">Highlight Issues</h4>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm font-bold">3</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800">Explain Provision</h4>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-sm font-bold">4</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-800">Revise Provision</h4>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="original" className="flex-1 mt-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Original Query</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopyToClipboard(query.prompt)}
                    className="focus-ring"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{query.prompt}</p>
                </div>

                {query.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Attachments</h4>
                    <div className="space-y-2">
                      {query.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                          <Paperclip className="h-4 w-4" />
                          <span>{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Topic:</span>
                      <span className="ml-2 text-muted-foreground">{query.topic}</span>
                    </div>
                    <div>
                      <span className="font-medium">Model Used:</span>
                      <span className="ml-2 text-muted-foreground">{query.model}</span>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge className={`ml-2 ${getStatusColor(query.status)}`} variant="secondary">
                        {query.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>
                      <span className="ml-2 text-muted-foreground">
                        {formatDateTime(query.createdAt)}
                      </span>
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
