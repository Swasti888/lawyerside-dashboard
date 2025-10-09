import { useState } from 'react'
import { Share, History, Eye, Edit, MoreHorizontal, Bot, GitCompare } from 'lucide-react'
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

  const getSourceLogo = () => {
    // Special cases for specific templates
    if (template.name === 'SAFE') {
      return (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
            <path d="M2 17L12 22L22 17"/>
            <path d="M2 12L12 17L22 12"/>
          </svg>
        </div>
      )
    }
    
    if (template.name === 'Referral Agreement') {
      return (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-md">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )
    }
    
    // Law firm logos for different categories
    if (template.source === 'firm') {
      const getFirmLogo = () => {
        switch (template.category) {
          case 'Confidentiality':
            return (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.4 7 14.8 8.6 14.8 10V11.8C15.4 11.8 16 12.4 16 13V15C16 15.6 15.4 16 14.8 16H9.2C8.6 16 8 15.6 8 15V13C8 12.4 8.6 11.8 9.2 11.8V10C9.2 8.6 10.6 7 12 7ZM12 8.2C11.2 8.2 10.4 9 10.4 10V11.8H13.6V10C13.6 9 12.8 8.2 12 8.2Z"/>
                </svg>
              </div>
            )
          case 'Investment':
            return (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z"/>
                </svg>
              </div>
            )
          case 'Services':
            return (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                  <path d="M19 15L20.09 17.26L23 18L20.09 18.74L19 21L17.91 18.74L15 18L17.91 17.26L19 15Z"/>
                  <path d="M5 15L6.09 17.26L9 18L6.09 18.74L5 21L3.91 18.74L1 18L3.91 17.26L5 15Z"/>
                </svg>
              </div>
            )
          case 'Employment':
            return (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                </svg>
              </div>
            )
          case 'Equity':
            return (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13H5V11H3V13ZM3 17H5V15H3V17ZM3 9H5V7H3V9ZM7 13H21V11H7V13ZM7 17H21V15H7V17ZM7 9H21V7H7V9Z"/>
                </svg>
              </div>
            )
          case 'Partnership':
            return (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1L9 7V9C9 10.1 9.9 11 11 11V22H13V11C14.1 11 15 10.1 15 9Z"/>
                </svg>
              </div>
            )
          default:
            return (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6C4.89 2 4 2.89 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2M18 20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
            )
        }
      }
      return getFirmLogo()
    } else {
      return (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-md">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )
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
              {getSourceLogo()}
              <div className="min-w-0">
                <h3 className="font-semibold text-base truncate">{template.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{template.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Version: {template.version}</span>
              <span>{template.usageCount} uses</span>
              <span>{formatDate(template.updatedAt)}</span>
            </div>
          </div>

            <div className="flex items-center gap-2">
              {getQualityBadge()}
              <Button
                size="sm"
                variant="outline"
                onClick={handleGenerateInitialDraft}
                disabled={isGenerating}
                className="focus-ring"
              >
                <GitCompare className="h-4 w-4 mr-2" />
                Compare Against Another Document
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
            {getSourceLogo()}
            <div className="min-w-0">
              <h3 className="font-semibold text-base truncate">{template.name}</h3>
              <Badge variant="outline" className="mt-1 text-xs">
                Version: {template.version}
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
            variant="outline"
            className="flex-1 focus-ring"
            onClick={handleGenerateInitialDraft}
            disabled={isGenerating}
          >
            <GitCompare className="h-4 w-4 mr-2" />
            Compare Against Another Document
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
