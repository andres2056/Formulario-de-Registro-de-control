"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useBusinessStore } from "@/lib/store"
import { Eye, Phone } from "lucide-react"

export function BusinessList() {
  const { businesses } = useBusinessStore()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount)
  }

  const formatPhone = (phone: string) => {
    // Formatear número de teléfono para mejor visualización
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  if (businesses.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>No hay negocios registrados</CardTitle>
          <CardDescription>Comience registrando su primer negocio</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/">Registrar Negocio</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lista de Negocios</CardTitle>
            <CardDescription>
              {businesses.length} {businesses.length === 1 ? "negocio registrado" : "negocios registrados"}
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/">Registrar Nuevo</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Tipo Suscripción</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Término</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="text-center">Veces Suscrito</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businesses.map((business) => {
                // Calcular días restantes
                const endDate = new Date(business.endDate)
                const today = new Date()
                const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                
                return (
                  <TableRow key={business.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div>{business.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {business.category}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{business.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {formatPhone(business.phone)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={business.subscriptionType === "Anual" ? "default" : "secondary"}>
                        {business.subscriptionType}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(business.startDate)}</TableCell>
                    <TableCell>
                      <div>{formatDate(business.endDate)}</div>
                      <div className="text-sm text-muted-foreground">
                        {daysRemaining > 0 ? `${daysRemaining} días restantes` : 'Expirada'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(business.amountPaid)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{business.timesSubscribed}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/negocios/${business.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver {business.name}</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}