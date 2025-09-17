import { Navigation } from "@/components/navigation"
import { BusinessDetail } from "@/components/business-detail"

interface BusinessDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function BusinessDetailPage({ params }: BusinessDetailPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <BusinessDetail businessId={id} />
      </main>
    </div>
  )
}
