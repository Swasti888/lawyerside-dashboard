import { useState } from 'react'
import { Share, Users, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { mockClients, dataUtils } from '@/data/mockData'
import { Template } from '@/data/types'
import { getInitials } from '@/lib/utils'

interface ShareTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: Template | null
}

export default function ShareTemplateModal({
  open,
  onOpenChange,
  template,
}: ShareTemplateModalProps) {
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set())
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()

  if (!template) return null

  const handleClientToggle = (clientId: string) => {
    setSelectedClients(prev => {
      const newSet = new Set(prev)
      if (newSet.has(clientId)) {
        newSet.delete(clientId)
      } else {
        newSet.add(clientId)
      }
      return newSet
    })
  }

  const handleShare = async () => {
    if (selectedClients.size === 0) {
      toast({
        title: "No Clients Selected",
        description: "Please select at least one client to share with",
        variant: "destructive",
      })
      return
    }

    setIsSharing(true)
    
    try {
      await dataUtils.shareTemplate(template.id, Array.from(selectedClients))
      
      toast({
        title: "Template Shared",
        description: `${template.name} has been shared with ${selectedClients.size} client${selectedClients.size > 1 ? 's' : ''}`,
      })
      
      onOpenChange(false)
      setSelectedClients(new Set())
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share template",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share Template
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Info */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
            <p className="text-xs text-muted-foreground">{template.description}</p>
            
            {template.sharedWith.length > 0 && (
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  Already shared with {template.sharedWith.length} client{template.sharedWith.length > 1 ? 's' : ''}
                </Badge>
              </div>
            )}
          </div>

          {/* Client Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Select Clients</span>
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {mockClients.map((client) => {
                const isSelected = selectedClients.has(client.id)
                const isAlreadyShared = template.sharedWith.includes(client.id)
                
                return (
                  <div
                    key={client.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-primary/10 border border-primary/20' 
                        : isAlreadyShared
                        ? 'bg-muted/50 opacity-60'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => !isAlreadyShared && handleClientToggle(client.id)}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={client.logo} />
                      <AvatarFallback className="text-xs">
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{client.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                    </div>
                    
                    {isAlreadyShared ? (
                      <Badge variant="secondary" className="text-xs">
                        Shared
                      </Badge>
                    ) : isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selection Summary */}
          {selectedClients.size > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                Selected {selectedClients.size} client{selectedClients.size > 1 ? 's' : ''} for sharing
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="focus-ring"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleShare}
            disabled={selectedClients.size === 0 || isSharing}
            className="focus-ring"
          >
            {isSharing ? 'Sharing...' : `Share with ${selectedClients.size} client${selectedClients.size !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
