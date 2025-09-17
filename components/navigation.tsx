import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"

export function Navigation() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Building2 className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Gestión de Negocios</h1>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/">Registrar</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/negocios">Lista</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
