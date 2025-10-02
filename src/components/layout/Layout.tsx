import { ReactNode } from 'react'
import TopNavigation from './TopNavigation'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
