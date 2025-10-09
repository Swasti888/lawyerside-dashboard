import { useState } from 'react'
import { MessageSquare, Upload, Bot, Send } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { mockClients, dataUtils } from '@/data/mockData'
import { LegalQuery } from '@/data/types'

interface NewQueryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onQueryCreated: (query: LegalQuery) => void
}

const availableModels = [
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Most capable model for complex legal analysis' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', description: 'Fast and efficient for simpler queries' },
  { id: 'gpt-4', name: 'GPT-4', description: 'OpenAI\'s most advanced model' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Balanced performance and speed' },
]

const queryTopics = [
  'Corporate Law',
  'Employment & Contractor Law',
  'Investment Law',
  'Intellectual Property',
  'Contract Law',
  'Compliance',
  'Tax Law',
  'Real Estate',
  'Litigation',
  'Other'
]

export default function NewQueryModal({
  open,
  onOpenChange,
  onQueryCreated,
}: NewQueryModalProps) {
  const [formData, setFormData] = useState({
    clientId: '',
    model: 'claude-3.5-sonnet',
    topic: '',
    queryType: 'documents', // 'documents' or 'internet'
    prompt: '',
  })
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.clientId || !formData.topic || !formData.prompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const selectedClient = mockClients.find(c => c.id === formData.clientId)
      const selectedModel = availableModels.find(m => m.id === formData.model)
      
      if (!selectedClient || !selectedModel) {
        throw new Error('Invalid client or model selection')
      }

      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newQuery = await dataUtils.addLegalQuery({
        clientId: formData.clientId,
        clientName: selectedClient.name,
        prompt: formData.prompt.trim(),
        summary: generateSummary(formData.prompt),
        fullAnswer: generateFullAnswer(formData.prompt, formData.topic),
        model: selectedModel.name,
        topic: formData.topic,
        tags: generateTags(formData.prompt, formData.topic),
        attachments: attachments.map(f => f.name),
        sections: generateSections(formData.prompt, formData.topic),
      })
      
      onQueryCreated(newQuery)
      onOpenChange(false)
      
      // Reset form
      setFormData({
        clientId: '',
        model: 'claude-3.5-sonnet',
        topic: '',
        queryType: 'documents',
        prompt: '',
      })
      setAttachments([])
      
      toast({
        title: "Query Processed",
        description: "Your legal query has been analyzed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process query",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const generateSummary = (prompt: string): string => {
    // Simple summary generation based on prompt
    const words = prompt.split(' ')
    if (words.length > 10) {
      return words.slice(0, 10).join(' ') + '...'
    }
    return prompt
  }

  const generateFullAnswer = (prompt: string, topic: string): string => {
    return `Based on your query regarding ${topic.toLowerCase()}, here is a comprehensive legal analysis...`
  }

  const generateTags = (prompt: string, topic: string): string[] => {
    const commonTags = ['legal advice', 'analysis', topic.toLowerCase()]
    
    // Extract additional tags from prompt
    const promptTags = []
    if (prompt.toLowerCase().includes('contract')) promptTags.push('contract')
    if (prompt.toLowerCase().includes('compliance')) promptTags.push('compliance')
    if (prompt.toLowerCase().includes('risk')) promptTags.push('risk')
    if (prompt.toLowerCase().includes('employment')) promptTags.push('employment')
    
    return [...commonTags, ...promptTags].slice(0, 5)
  }

  const generateSections = (prompt: string, topic: string) => {
    return {
      summary: `Analysis of ${topic.toLowerCase()} query with key legal considerations`,
      issues: [
        'Regulatory compliance requirements',
        'Potential legal risks',
        'Documentation needs'
      ],
      clausesToWatch: [
        'Key contractual provisions',
        'Liability limitations',
        'Termination clauses'
      ],
      notes: `Recommend consulting with ${topic.toLowerCase()} specialist for implementation details.`
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            New Legal Query
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Select 
                value={formData.clientId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}
              >
                <SelectTrigger className="focus-ring">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Legal Topic *</Label>
              <Select 
                value={formData.topic} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, topic: value }))}
              >
                <SelectTrigger className="focus-ring">
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {queryTopics.map(topic => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="queryType">Query Type *</Label>
              <Select 
                value={formData.queryType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, queryType: value }))}
              >
                <SelectTrigger className="focus-ring">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="documents">
                    Query Your Documents
                  </SelectItem>
                  <SelectItem value="internet">
                    Query Public Domain
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-sm text-muted-foreground">Select AI Model</Label>
              <Select 
                value={formData.model} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}
              >
                <SelectTrigger className="focus-ring h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <Bot className="h-3 w-3" />
                        <span className="text-sm">{model.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Your Legal Question *</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="Describe your legal question in detail. Include relevant context, specific concerns, and what kind of guidance you're seeking..."
              rows={6}
              className="focus-ring"
              required
            />
            <p className="text-xs text-muted-foreground">
              Be as specific as possible to get the most relevant legal analysis.
            </p>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
              <div className="text-center">
                <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <div className="text-sm text-muted-foreground mb-2">
                  Upload relevant documents (contracts, emails, etc.)
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.txt"
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
                  Choose Files
                </Button>
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                      <span>{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
              disabled={isSubmitting}
              className="focus-ring"
            >
              {isSubmitting ? (
                <>
                  <Bot className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Query
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
