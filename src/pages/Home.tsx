import { FileText, Search, Bot, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  const handleGenerateDocument = () => {
    navigate('/templates')
  }

  const handleAnalyzeDocument = () => {
    navigate('/documents')
  }

  const handleQueryDocuments = () => {
    navigate('/queries')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Sarah. What would you like to do today?
          </p>
        </div>
      </div>

      {/* Three CTA Cards - ChatGPT Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Generate a Document */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20" onClick={handleGenerateDocument}>
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl">Generate a Document</CardTitle>
            <CardDescription>
              Create legal documents from templates or start from scratch
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Analyze a Document */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20" onClick={handleAnalyzeDocument}>
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl">Analyze a Document</CardTitle>
            <CardDescription>
              Review and analyze documents for issues and improvements
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Query Your Documents or the Internet */}
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20" onClick={handleQueryDocuments}>
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <Bot className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-xl">Query Your Documents or the Internet</CardTitle>
            <CardDescription>
              Ask questions about your documents or research legal topics
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full">
              Ask Question <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
