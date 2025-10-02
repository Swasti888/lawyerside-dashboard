import { useState } from 'react'
import { Send, Save, Upload, Image, Users, Tag as TagIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { mockClients, dataUtils } from '@/data/mockData'
import { ClientAlert } from '@/data/types'
import { getInitials } from '@/lib/utils'

interface ComposeAlertModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAlertCreated: (alert: ClientAlert) => void
}

export default function ComposeAlertModal({
  open,
  onOpenChange,
  onAlertCreated,
}: ComposeAlertModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    tags: [] as string[],
    audience: [] as string[],
  })
  const [currentTag, setCurrentTag] = useState('')
  const [heroImage, setHeroImage] = useState<File | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const { toast } = useToast()

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const toggleAudience = (clientId: string) => {
    setFormData(prev => ({
      ...prev,
      audience: prev.audience.includes(clientId)
        ? prev.audience.filter(id => id !== clientId)
        : [...prev.audience, clientId]
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setHeroImage(file)
      toast({
        title: "Image Uploaded",
        description: `${file.name} ready for use as hero image`,
      })
    }
  }

  const handleSaveDraft = async () => {
    if (!formData.title.trim() || !formData.summary.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a title and summary",
        variant: "destructive",
      })
      return
    }

    setIsSavingDraft(true)
    
    try {
      const newAlert = await dataUtils.publishClientAlert({
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        content: formData.content.trim() || formData.summary.trim(),
        tags: formData.tags,
        audience: formData.audience,
        heroImage: heroImage ? `/uploads/${heroImage.name}` : undefined,
        status: 'draft' as const,
      })
      
      // Override status to draft since dataUtils.publishClientAlert sets it to published
      newAlert.status = 'draft'
      
      onAlertCreated(newAlert)
      onOpenChange(false)
      resetForm()
      
      toast({
        title: "Draft Saved",
        description: "Your alert has been saved as a draft",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      })
    } finally {
      setIsSavingDraft(false)
    }
  }

  const handlePublish = async () => {
    if (!formData.title.trim() || !formData.summary.trim() || !formData.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before publishing",
        variant: "destructive",
      })
      return
    }

    if (formData.audience.length === 0) {
      toast({
        title: "No Audience Selected",
        description: "Please select at least one client to send this alert to",
        variant: "destructive",
      })
      return
    }

    setIsPublishing(true)
    
    try {
      const newAlert = await dataUtils.publishClientAlert({
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        content: formData.content.trim(),
        tags: formData.tags,
        audience: formData.audience,
        heroImage: heroImage ? `/uploads/${heroImage.name}` : undefined,
      })
      
      onAlertCreated(newAlert)
      onOpenChange(false)
      resetForm()
      
      toast({
        title: "Alert Published",
        description: `Your alert has been sent to ${formData.audience.length} client${formData.audience.length > 1 ? 's' : ''}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish alert",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      summary: '',
      content: '',
      tags: [],
      audience: [],
    })
    setCurrentTag('')
    setHeroImage(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Compose Client Alert
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Alert Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., New SEC Regulations Impact Startup Fundraising"
                className="focus-ring"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary *</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Brief summary that will appear in the alert preview..."
                rows={2}
                className="focus-ring"
                required
              />
            </div>
          </div>

          {/* Hero Image */}
          <div className="space-y-2">
            <Label>Hero Image (Optional)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                {heroImage ? (
                  <div className="space-y-2">
                    <Image className="h-8 w-8 text-green-600 mx-auto" />
                    <p className="text-sm font-medium text-green-800">{heroImage.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setHeroImage(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground mb-2">
                      Add a hero image to make your alert more engaging
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="hero-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('hero-image-upload')?.click()}
                      className="focus-ring"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Full Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write the full content of your alert here. You can include legal analysis, recommendations, and actionable insights for your clients..."
              rows={8}
              className="focus-ring"
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add a tag..."
                className="flex-1 focus-ring"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag} className="focus-ring">
                <TagIcon className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Audience Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <Label>Select Audience *</Label>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto border rounded-lg p-3">
              {mockClients.map((client) => {
                const isSelected = formData.audience.includes(client.id)
                
                return (
                  <div
                    key={client.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => toggleAudience(client.id)}
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
                    
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            {formData.audience.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Selected {formData.audience.length} client{formData.audience.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="focus-ring"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="focus-ring"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSavingDraft ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button 
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="focus-ring"
          >
            <Send className="h-4 w-4 mr-2" />
            {isPublishing ? 'Publishing...' : 'Publish Alert'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
