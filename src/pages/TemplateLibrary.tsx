import { useState } from 'react'
import { Plus, Search, Grid3X3, List, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import TemplateCard from '@/components/templates/TemplateCard'
import AddTemplateModal from '@/components/templates/AddTemplateModal'
import ShareTemplateModal from '@/components/templates/ShareTemplateModal'
import VersionHistoryModal from '@/components/templates/VersionHistoryModal'
import { mockTemplates } from '@/data/mockData'
import { Template } from '@/data/types'

export default function TemplateLibrary() {
  const [templates, setTemplates] = useState(mockTemplates)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [versionModalOpen, setVersionModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
    const matchesSource = sourceFilter === 'all' || template.source === sourceFilter
    
    return matchesSearch && matchesCategory && matchesSource
  })

  const handleShareTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setShareModalOpen(true)
  }

  const handleVersionHistory = (template: Template) => {
    setSelectedTemplate(template)
    setVersionModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage your legal document templates and share them with clients.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="focus-ring">
            Request Template from My Counsel
          </Button>
          <Button onClick={() => setAddModalOpen(true)} className="focus-ring">
            <Plus className="h-4 w-4 mr-2" />
            Add / Create New Template
          </Button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 focus-ring"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 focus-ring">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-32 focus-ring">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="firm">Firm</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="focus-ring"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="focus-ring"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>
          Showing {filteredTemplates.length} of {templates.length} templates
        </span>
      </div>

      {/* Templates Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }>
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            viewMode={viewMode}
            onShare={() => handleShareTemplate(template)}
            onVersionHistory={() => handleVersionHistory(template)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters.
          </p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('')
            setCategoryFilter('all')
            setSourceFilter('all')
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Modals */}
      <AddTemplateModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onTemplateAdded={(newTemplate) => {
          setTemplates(prev => [...prev, newTemplate])
        }}
      />

      <ShareTemplateModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        template={selectedTemplate}
      />

      <VersionHistoryModal
        open={versionModalOpen}
        onOpenChange={setVersionModalOpen}
        template={selectedTemplate}
      />
    </div>
  )
}
