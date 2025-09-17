import { Navigation } from "@/components/navigation"
import { BusinessList } from "@/components/business-list"

export default function BusinessesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <BusinessList />
      </main>
    </div>
  )
}
