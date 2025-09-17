"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useBusinessStore } from "@/lib/store"
import { ArrowLeft, Building2, Calendar, CreditCard, RotateCcw } from "lucide-react"

interface BusinessDetailProps {
  businessId: string
}

export function BusinessDetail({ businessId }: BusinessDetailProps) {
  const { getBusinessById } = useBusinessStore()
  const business = getBusinessById(businessId)

  if (!business) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Negocio no encontrado</CardTitle>
          <CardDescription>El negocio que busca no existe o ha sido eliminado</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/negocios">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la Lista
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const calculateDuration = () => {
    const start = new Date(business.startDate)
    const end = new Date(business.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 30) {
      return `${diffDays} días`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} ${months === 1 ? "mes" : "meses"}`
    } else {
      const years = Math.floor(diffDays / 365)
      const remainingMonths = Math.floor((diffDays % 365) / 30)
      return `${years} ${years === 1 ? "año" : "años"}${remainingMonths > 0 ? ` y ${remainingMonths} ${remainingMonths === 1 ? "mes" : "meses"}` : ""}`
    }
  }

  const isActive = () => {
    const today = new Date()
    const start = new Date(business.startDate)
    const end = new Date(business.endDate)
    return today >= start && today <= end
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/negocios">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <p className="text-muted-foreground">Detalles de la suscripción</p>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Estado de la Suscripción
            </CardTitle>
            <Badge variant={isActive() ? "default" : "secondary"}>{isActive() ? "Activa" : "Inactiva"}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Tipo de Suscripción
                </h3>
                <div className="mt-1">
                  <Badge variant={business.subscriptionType === "Anual" ? "default" : "secondary"} className="text-sm">
                    {business.subscriptionType}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Duración</h3>
                <p className="mt-1 text-lg">{calculateDuration()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Monto Pagado
                </h3>
                <p className="mt-1 text-2xl font-bold font-mono">{formatCurrency(business.amountPaid)}</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Veces Suscrito
                </h3>
                <p className="mt-1 text-lg">
                  {business.subscriptionCount} {business.subscriptionCount === 1 ? "vez" : "veces"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dates Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Fechas de Suscripción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Fecha de Inicio</h3>
              <p className="mt-1 text-lg capitalize">{formatDate(business.startDate)}</p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Fecha de Término</h3>
              <p className="mt-1 text-lg capitalize">{formatDate(business.endDate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/negocios">Ver Todos los Negocios</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Registrar Nuevo Negocio</Link>
        </Button>
      </div>
    </div>
  )
}
