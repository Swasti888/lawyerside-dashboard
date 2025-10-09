import { useState } from 'react'
import { MessageSquare, Calendar, Upload, FileText, Link, Building, Mail, Phone, Clock, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export default function MyLegalCounsel() {
  const [quoteData, setQuoteData] = useState({
    matterDescription: '',
    estimatedHours: '',
    urgency: 'standard'
  })
  const { toast } = useToast()

  const handleScheduleMeeting = () => {
    toast({
      title: "Meeting Scheduled",
      description: "Calendar invite sent to Sarah Chen for next available slot",
    })
  }

  const handleMessageCounsel = () => {
    toast({
      title: "Message Sent",
      description: "Your message has been sent to Sarah Chen",
    })
  }

  const handleRequestTemplate = () => {
    toast({
      title: "Template Requested",
      description: "Template request has been sent to Sarah Chen",
    })
  }

  const handleGetQuote = () => {
    toast({
      title: "Quote Request Submitted",
      description: "Your quote request has been sent to Sarah Chen",
    })
    setQuoteData({ matterDescription: '', estimatedHours: '', urgency: 'standard' })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Legal Counsel</h1>
          <p className="text-muted-foreground mt-1">
            Connect with your dedicated legal counsel, Sarah Chen.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Counsel Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/sarah-headshot.jpg" alt="Sarah Chen" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl">Sarah Chen</CardTitle>
                    <Badge variant="secondary">Partner</Badge>
                  </div>
                  <CardDescription className="text-base mb-3">
                    Your dedicated legal counsel specializing in startup law, corporate governance, and investment transactions.
                  </CardDescription>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>Calex Legal Partners</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>sarah.chen@calexlaw.com</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleMessageCounsel}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message My Counsel
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleScheduleMeeting}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href="https://linkedin.com/in/sarahchen" target="_blank" rel="noopener noreferrer">
                        <Link className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Announcements
              </CardTitle>
              <CardDescription>
                Latest updates from Sarah and the Calex Legal Partners team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">New Template Available</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">MSA updated with new IP language</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-100">Client Highlights</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">Advised Senso on $20M Series A</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100">Legal Update</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300">Patent Board: AI can't hold inventorship</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">Networking Event</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Join us and XYZ VC at our office</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Request Template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Request Template
              </CardTitle>
              <CardDescription>
                Get a custom template from your legal counsel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleRequestTemplate} className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Request Template from My Counsel
              </Button>
            </CardContent>
          </Card>

          {/* Get Quote for New Matter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Get Quote for New Matter
              </CardTitle>
              <CardDescription>
                Request a quote for your new legal matter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="matter-description">Matter Description</Label>
                <Textarea
                  id="matter-description"
                  placeholder="Describe your legal matter..."
                  rows={3}
                  value={quoteData.matterDescription}
                  onChange={(e) => setQuoteData(prev => ({ ...prev, matterDescription: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Documents</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Upload relevant documents</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Choose Files
                  </Button>
                </div>
              </div>
              
              <Button onClick={handleGetQuote} className="w-full">
                <DollarSign className="h-4 w-4 mr-2" />
                Get Quote
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Matters</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Templates Shared</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Response Time</span>
                <span className="font-semibold">&lt; 2 hours</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
