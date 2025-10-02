import { useState } from 'react'
import { ChevronLeft, ChevronRight, FileText, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ActivityPost } from '@/data/types'
import { mockDocuments } from '@/data/mockData'

interface CompareVersionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activity: ActivityPost | null
}

export default function CompareVersionsModal({
  open,
  onOpenChange,
  activity,
}: CompareVersionsModalProps) {
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0)

  if (!activity || !activity.documentId) return null

  const document = mockDocuments.find(d => d.id === activity.documentId)
  if (!document) return null

  const versions = document.versions
  const currentVersion = versions[currentVersionIndex]

  const nextVersion = () => {
    if (currentVersionIndex < versions.length - 1) {
      setCurrentVersionIndex(currentVersionIndex + 1)
    }
  }

  const prevVersion = () => {
    if (currentVersionIndex > 0) {
      setCurrentVersionIndex(currentVersionIndex - 1)
    }
  }

  const getVersionLabel = (type: string) => {
    switch (type) {
      case 'template':
        return 'Template'
      case 'initial_draft':
        return 'Initial Draft'
      case 'negotiation_turn':
        return 'First Turn'
      case 'final':
        return 'Final Version'
      default:
        return 'Version'
    }
  }

  const getVersionColor = (type: string) => {
    switch (type) {
      case 'template':
        return 'bg-blue-100 text-blue-800'
      case 'initial_draft':
        return 'bg-green-100 text-green-800'
      case 'negotiation_turn':
        return 'bg-orange-100 text-orange-800'
      case 'final':
        return 'bg-purple-100 text-purple-800'
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
            Compare Versions - {document.templateName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Version Navigation */}
          <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={prevVersion}
              disabled={currentVersionIndex === 0}
              className="focus-ring"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Badge className={getVersionColor(currentVersion.type)}>
                {getVersionLabel(currentVersion.type)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {currentVersionIndex + 1} of {versions.length}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextVersion}
              disabled={currentVersionIndex === versions.length - 1}
              className="focus-ring"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Version Content */}
          <Tabs defaultValue="content" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Document Content</TabsTrigger>
              <TabsTrigger value="changes">Changes Made</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="flex-1 mt-4">
              <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-muted/20">
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold mb-3">
                    {getVersionLabel(currentVersion.type)}
                  </h3>
                  <div className="whitespace-pre-wrap text-sm">
                    {currentVersion.content}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="changes" className="flex-1 mt-4">
              <div className="border rounded-lg p-4 h-96 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-3">Changes in This Version</h3>
                {currentVersion.changes.length > 0 ? (
                  <ul className="space-y-2">
                    {currentVersion.changes.map((change, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">No changes recorded for this version.</p>
                )}

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>Author: {currentVersion.author}</span>
                    <span>•</span>
                    <span>{new Date(currentVersion.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Redline Diff Simulation */}
          {currentVersionIndex > 0 && (
            <div className="mt-4">
              <Button variant="outline" size="sm" className="focus-ring">
                <FileText className="h-4 w-4 mr-2" />
                View Redline Diff vs Previous Version
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
