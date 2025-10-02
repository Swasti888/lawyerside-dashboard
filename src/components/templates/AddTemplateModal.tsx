import { useState } from 'react'
import { Upload, FileText } from 'lucide-react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { dataUtils } from '@/data/mockData'
import { Template } from '@/data/types'

interface AddTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTemplateAdded: (template: Template) => void
}

export default function AddTemplateModal({
  open,
  onOpenChange,
  onTemplateAdded,
}: AddTemplateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    source: 'firm' as 'firm' | 'ai',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const categories = ['Confidentiality', 'Investment', 'Employment', 'Services', 'Partnership', 'Equity']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const newTemplate = await dataUtils.addTemplate({
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        source: formData.source,
        version: 1,
        sharedWith: [],
      })
      
      onTemplateAdded(newTemplate)
      onOpenChange(false)
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        source: 'firm',
      })
      setUploadedFile(null)
      
      toast({
        title: "Template Added",
        description: `${newTemplate.name} has been added to your library`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add template",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      toast({
        title: "File Uploaded",
        description: `${file.name} ready for processing`,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Template</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Master Services Agreement"
                className="focus-ring"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="focus-ring">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the purpose and use cases for this template"
              rows={3}
              className="focus-ring"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source *</Label>
            <Select 
              value={formData.source} 
              onValueChange={(value: 'firm' | 'ai') => setFormData(prev => ({ ...prev, source: value }))}
            >
              <SelectTrigger className="focus-ring">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="firm">Firm-sourced (High Quality)</SelectItem>
                <SelectItem value="ai">AI-generated (Review Required)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload Template File</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <div className="text-sm text-muted-foreground mb-2">
                  {uploadedFile ? (
                    <span className="text-foreground font-medium">{uploadedFile.name}</span>
                  ) : (
                    "Drop your template file here or click to browse"
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="focus-ring"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="focus-ring"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="focus-ring"
            >
              {isLoading ? 'Adding...' : 'Add Template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
