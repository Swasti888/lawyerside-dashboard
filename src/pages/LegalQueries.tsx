import { useState } from 'react'
import { Plus, Search, Filter, MessageSquare, Bot, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import QueryCard from '@/components/queries/QueryCard'
import NewQueryModal from '@/components/queries/NewQueryModal'
import QueryDetailModal from '@/components/queries/QueryDetailModal'
import { mockLegalQueries } from '@/data/mockData'
import { LegalQuery } from '@/data/types'

export default function LegalQueries() {
  const [queries, setQueries] = useState(mockLegalQueries)
  const [searchTerm, setSearchTerm] = useState('')
  const [clientFilter, setClientFilter] = useState('all')
  const [topicFilter, setTopicFilter] = useState('all')
  const [modelFilter, setModelFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [newQueryModalOpen, setNewQueryModalOpen] = useState(false)
  const [selectedQuery, setSelectedQuery] = useState<LegalQuery | null>(null)
  const [queryDetailModalOpen, setQueryDetailModalOpen] = useState(false)

  const clients = Array.from(new Set(queries.map(q => q.clientName)))
  const topics = Array.from(new Set(queries.map(q => q.topic)))
  const models = Array.from(new Set(queries.map(q => q.model)))

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesClient = clientFilter === 'all' || query.clientName === clientFilter
    const matchesTopic = topicFilter === 'all' || query.topic === topicFilter
    const matchesModel = modelFilter === 'all' || query.model === modelFilter
    const matchesStatus = statusFilter === 'all' || query.status === statusFilter
    
    return matchesSearch && matchesClient && matchesTopic && matchesModel && matchesStatus
  })

  const handleQueryClick = (query: LegalQuery) => {
    setSelectedQuery(query)
    setQueryDetailModalOpen(true)
  }

  const handleNewQuery = (newQuery: LegalQuery) => {
    setQueries(prev => [newQuery, ...prev])
  }

  const getStatusStats = () => {
    return queries.reduce((acc, query) => {
      acc[query.status] = (acc[query.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  const stats = getStatusStats()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Legal Queries</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered legal research and analysis for your clients.
          </p>
        </div>
        <Button onClick={() => setNewQueryModalOpen(true)} className="focus-ring">
          <Plus className="h-4 w-4 mr-2" />
          New Query
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{queries.length}</p>
              <p className="text-sm text-muted-foreground">Total Queries</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.completed || 0}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{stats.pending || 0}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{clients.length}</p>
              <p className="text-sm text-muted-foreground">Active Clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 focus-ring"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
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

            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="w-48 focus-ring">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map(topic => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger className="w-40 focus-ring">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {models.map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 focus-ring">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>
          Showing {filteredQueries.length} of {queries.length} queries
        </span>
      </div>

      {/* Queries List */}
      <div className="space-y-4">
        {filteredQueries.map((query) => (
          <QueryCard
            key={query.id}
            query={query}
            onClick={() => handleQueryClick(query)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredQueries.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No queries found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || clientFilter !== 'all' || topicFilter !== 'all' || modelFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'Start by creating your first legal query.'}
          </p>
          {(searchTerm || clientFilter !== 'all' || topicFilter !== 'all' || modelFilter !== 'all' || statusFilter !== 'all') ? (
            <Button variant="outline" onClick={() => {
              setSearchTerm('')
              setClientFilter('all')
              setTopicFilter('all')
              setModelFilter('all')
              setStatusFilter('all')
            }}>
              Clear Filters
            </Button>
          ) : (
            <Button onClick={() => setNewQueryModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Query
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <NewQueryModal
        open={newQueryModalOpen}
        onOpenChange={setNewQueryModalOpen}
        onQueryCreated={handleNewQuery}
      />

      <QueryDetailModal
        open={queryDetailModalOpen}
        onOpenChange={setQueryDetailModalOpen}
        query={selectedQuery}
      />
    </div>
  )
}
