import { History, Calendar, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Template } from '@/data/types'
import { formatDateTime } from '@/lib/utils'

interface VersionHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: Template | null
}

export default function VersionHistoryModal({
  open,
  onOpenChange,
  template,
}: VersionHistoryModalProps) {
  if (!template) return null

  const handleViewVersion = (version: number) => {
    // Simulate version viewing
    console.log(`Viewing version ${version} of ${template.name}`)
  }

  const handleRestoreVersion = (version: number) => {
    // Simulate version restoration
    console.log(`Restoring to version ${version} of ${template.name}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History - {template.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Template Info */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Category: {template.category}</span>
                  <span>Current Version: v{template.version}</span>
                  <span>Usage: {template.usageCount} times</span>
                </div>
              </div>
              <Badge variant={template.source === 'firm' ? 'default' : 'secondary'}>
                {template.source === 'firm' ? 'Firm-sourced' : 'AI-generated'}
              </Badge>
            </div>
          </div>

          {/* Version Timeline */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Version Timeline</h4>
            
            <div className="space-y-4">
              {template.versions.slice().reverse().map((version, index) => {
                const isCurrentVersion = version.version === template.version
                
                return (
                  <div key={version.version} className="relative">
                    {/* Timeline line */}
                    {index < template.versions.length - 1 && (
                      <div className="absolute left-4 top-8 w-px h-full bg-border" />
                    )}
                    
                    <div className="flex items-start gap-4">
                      {/* Version indicator */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCurrentVersion 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {version.version}
                      </div>
                      
                      {/* Version details */}
                      <div className="flex-1 min-w-0">
                        <div className="bg-card border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">
                                  Version {version.version}
                                </span>
                                {isCurrentVersion && (
                                  <Badge variant="default" className="text-xs">
                                    Current
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDateTime(version.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewVersion(version.version)}
                                className="focus-ring"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              
                              {!isCurrentVersion && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRestoreVersion(version.version)}
                                  className="focus-ring"
                                >
                                  Restore
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            <p className="font-medium mb-1">Changes:</p>
                            <p>{version.changes}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Version Statistics */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-sm mb-3">Version Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Versions:</span>
                <span className="ml-2 font-medium">{template.versions.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">First Created:</span>
                <span className="ml-2 font-medium">
                  {formatDateTime(template.createdAt)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="ml-2 font-medium">
                  {formatDateTime(template.updatedAt)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Usage Count:</span>
                <span className="ml-2 font-medium">{template.usageCount}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
