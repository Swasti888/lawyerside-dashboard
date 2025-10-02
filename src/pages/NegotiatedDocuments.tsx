import { useState } from 'react'
import { Search, Filter, FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DocumentCard from '@/components/documents/DocumentCard'
import DocumentDetailModal from '@/components/documents/DocumentDetailModal'
import { mockDocuments } from '@/data/mockData'
import { Document } from '@/data/types'

export default function NegotiatedDocuments() {
  const [searchTerm, setSearchTerm] = useState('')
  const [clientFilter, setClientFilter] = useState('all')
  const [templateFilter, setTemplateFilter] = useState('all')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  const clients = Array.from(new Set(mockDocuments.map(d => d.clientName)))
  const templates = Array.from(new Set(mockDocuments.map(d => d.templateName)))

  const openDocuments = mockDocuments.filter(doc => 
    doc.status === 'draft' || doc.status === 'in_negotiation'
  )

  const closedDocuments = mockDocuments.filter(doc => 
    doc.status === 'executed' || doc.status === 'cancelled'
  )

  const filterDocuments = (documents: Document[]) => {
    return documents.filter(doc => {
      const matchesSearch = doc.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesClient = clientFilter === 'all' || doc.clientName === clientFilter
      const matchesTemplate = templateFilter === 'all' || doc.templateName === templateFilter
      
      return matchesSearch && matchesClient && matchesTemplate
    })
  }

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document)
    setDetailModalOpen(true)
  }

  const getStatusStats = (documents: Document[]) => {
    const stats = documents.reduce((acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return stats
  }

  const openStats = getStatusStats(openDocuments)
  const closedStats = getStatusStats(closedDocuments)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Negotiated Documents</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage document negotiations with your clients.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 focus-ring"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-40 focus-ring">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map(client => (
                <SelectItem key={client} value={client}>
                  {client}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={templateFilter} onValueChange={setTemplateFilter}>
            <SelectTrigger className="w-48 focus-ring">
              <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Templates</SelectItem>
              {templates.map(template => (
                <SelectItem key={template} value={template}>
                  {template}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Document Tabs */}
      <Tabs defaultValue="open" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="open" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Open Documents
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">
              {filterDocuments(openDocuments).length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="closed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Closed Documents
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
              {filterDocuments(closedDocuments).length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Open Documents */}
        <TabsContent value="open" className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Draft: {openStats.draft || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span>In Negotiation: {openStats.in_negotiation || 0}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filterDocuments(openDocuments).map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onClick={() => handleDocumentClick(document)}
              />
            ))}
          </div>

          {filterDocuments(openDocuments).length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No open documents found</h3>
              <p className="text-muted-foreground">
                {searchTerm || clientFilter !== 'all' || templateFilter !== 'all' 
                  ? 'Try adjusting your search criteria.' 
                  : 'All your documents have been completed or there are no documents yet.'}
              </p>
            </div>
          )}
        </TabsContent>

        {/* Closed Documents */}
        <TabsContent value="closed" className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>Executed: {closedStats.executed || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Cancelled: {closedStats.cancelled || 0}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filterDocuments(closedDocuments).map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onClick={() => handleDocumentClick(document)}
              />
            ))}
          </div>

          {filterDocuments(closedDocuments).length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No closed documents found</h3>
              <p className="text-muted-foreground">
                {searchTerm || clientFilter !== 'all' || templateFilter !== 'all' 
                  ? 'Try adjusting your search criteria.' 
                  : 'No documents have been completed yet.'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Document Detail Modal */}
      <DocumentDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        document={selectedDocument}
      />
    </div>
  )
}
