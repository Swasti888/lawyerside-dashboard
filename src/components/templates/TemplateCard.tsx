import { useState } from 'react'
import { FileText, Share, History, Eye, Edit, MoreHorizontal, Upload, Bot } from 'lucide-react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Template } from '@/data/types'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface TemplateCardProps {
  template: Template
  viewMode: 'grid' | 'list'
  onShare: () => void
  onVersionHistory: () => void
}

export default function TemplateCard({
  template,
  viewMode,
  onShare,
  onVersionHistory,
}: TemplateCardProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenerateInitialDraft = async () => {
    setIsGenerating(true)
    // Simulate draft generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
    
    toast({
      title: "Draft Generated",
      description: `Initial draft created using ${template.name} template`,
    })
  }

  const handlePreview = () => {
    toast({
      title: "Preview",
      description: `Opening preview for ${template.name}`,
    })
  }

  const handleEdit = () => {
    toast({
      title: "Edit Template",
      description: `Opening editor for ${template.name}`,
    })
  }

  const getSourceIcon = () => {
    if (template.source === 'firm') {
      return (
        <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-bold">F</span>
        </div>
      )
    } else {
      return <Bot className="w-6 h-6 text-gray-400" />
    }
  }

  const getQualityBadge = () => {
    if (template.source === 'firm') {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Firm-sourced
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="border-gray-300 text-gray-600">
          AI-sourced – review with counsel
        </Badge>
      )
    }
  }

  if (viewMode === 'list') {
    return (
      <Card className="card-hover">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                {getSourceIcon()}
                <div className="min-w-0">
                  <h3 className="font-semibold text-base truncate">{template.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{template.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{template.category}</span>
                <span>v{template.version}</span>
                <span>{template.usageCount} uses</span>
                <span>{formatDate(template.updatedAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getQualityBadge()}
              <Button
                size="sm"
                onClick={handleGenerateInitialDraft}
                disabled={isGenerating}
                className="focus-ring"
              >
                {isGenerating ? 'Generating...' : 'Generate Draft'}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="focus-ring">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handlePreview}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onVersionHistory}>
                    <History className="h-4 w-4 mr-2" />
                    Version History
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onShare}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getSourceIcon()}
            <div className="min-w-0">
              <h3 className="font-semibold text-base truncate">{template.name}</h3>
              <Badge variant="outline" className="mt-1 text-xs">
                {template.category}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="focus-ring">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onVersionHistory}>
                <History className="h-4 w-4 mr-2" />
                Version History
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {template.description}
        </p>
        
        {getQualityBadge()}
        
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>v{template.version}</span>
            <span>{template.usageCount} uses</span>
          </div>
          <span>{formatDate(template.updatedAt)}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button
            className="flex-1 focus-ring"
            onClick={handleGenerateInitialDraft}
            disabled={isGenerating}
          >
            <FileText className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Initial Draft'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
