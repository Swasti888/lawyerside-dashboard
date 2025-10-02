import { useState } from 'react'
import ProfileCard from '@/components/home/ProfileCard'
import ActivityFeed from '@/components/home/ActivityFeed'
import InsightsPanel from '@/components/home/InsightsPanel'
import CompareVersionsModal from '@/components/home/CompareVersionsModal'
import LegalQueryModal from '@/components/home/LegalQueryModal'
import DocumentPreviewModal from '@/components/home/DocumentPreviewModal'
import { ActivityPost } from '@/data/types'

export default function Home() {
  const [selectedActivity, setSelectedActivity] = useState<ActivityPost | null>(null)
  const [compareModalOpen, setCompareModalOpen] = useState(false)
  const [queryModalOpen, setQueryModalOpen] = useState(false)
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false)

  const handleActivityClick = (activity: ActivityPost) => {
    setSelectedActivity(activity)
    
    if (activity.type === 'first_turn' && activity.documentId) {
      setCompareModalOpen(true)
    } else if (activity.type === 'legal_query' && activity.queryId) {
      setQueryModalOpen(true)
    } else if (activity.type === 'executed_document' && activity.documentId) {
      setDocumentPreviewOpen(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Sarah. Here's what's happening with your legal practice.
          </p>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Profile (3 columns) */}
        <div className="lg:col-span-3">
          <ProfileCard />
        </div>

        {/* Column 2: Activity Feed (6 columns) */}
        <div className="lg:col-span-6">
          <ActivityFeed onActivityClick={handleActivityClick} />
        </div>

        {/* Column 3: Insights (3 columns) */}
        <div className="lg:col-span-3">
          <InsightsPanel />
        </div>
      </div>

      {/* Modals */}
      <CompareVersionsModal
        open={compareModalOpen}
        onOpenChange={setCompareModalOpen}
        activity={selectedActivity}
      />
      
      <LegalQueryModal
        open={queryModalOpen}
        onOpenChange={setQueryModalOpen}
        activity={selectedActivity}
      />
      
      <DocumentPreviewModal
        open={documentPreviewOpen}
        onOpenChange={setDocumentPreviewOpen}
        activity={selectedActivity}
      />
    </div>
  )
}
