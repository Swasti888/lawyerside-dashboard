import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, Users, MessageSquare } from 'lucide-react'
import { mockInsights } from '@/data/mockData'

export default function InsightsPanel() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Insights</h2>

      {/* Top Templates Used */}
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Top Templates Used
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockInsights.topTemplates.map((template, index) => (
            <div key={template.templateId} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  #{index + 1}
                </span>
                <span className="text-sm font-medium">{template.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {template.count}
              </Badge>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-3 focus-ring">
            View All Templates
          </Button>
        </CardContent>
      </Card>

      {/* Top Query Topics */}
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Top Query Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockInsights.topQueryTopics.map((topic, index) => (
            <div key={topic.topic} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  #{index + 1}
                </span>
                <span className="text-sm font-medium">{topic.topic}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {topic.count}
              </Badge>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-3 focus-ring">
            View All Topics
          </Button>
        </CardContent>
      </Card>

      {/* Active Clients */}
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Most Active Clients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockInsights.activeClients.map((client, index) => (
            <div key={client.clientId} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  #{index + 1}
                </span>
                <span className="text-sm font-medium">{client.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {client.count} activities
              </Badge>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-3 focus-ring">
            View All Clients
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="card-hover">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start focus-ring">
            Reset Demo Data
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start focus-ring">
            Export Activity Report
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start focus-ring">
            Schedule Client Review
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
