"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Toggle } from "@/components/ui/toggle"
import { useBusinessStore } from "@/lib/store"
import { Eye, Phone, Calendar, Repeat, MapPin, Building2, Power } from "lucide-react"

export function BusinessList() {
  const { businesses } = useBusinessStore()
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>({})

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
    }).format(amount)
  }

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  const getStatusBadge = (endDate: string) => {
    const end = new Date(endDate)
    const today = new Date()
    const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysRemaining > 30) return { label: "Activa", variant: "default" as const }
    if (daysRemaining > 0) return { label: "Por vencer", variant: "secondary" as const }
    return { label: "Expirada", variant: "destructive" as const }
  }

  const isBusinessActive = (startDate: string, endDate: string): boolean => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Está activo si hoy está entre la fecha de inicio y fin
    return today >= start && today <= end;
  };

  // Efecto para calcular el estado activo/inactivo inicial
  useEffect(() => {
    const initialActiveStates: Record<string, boolean> = {}
    businesses.forEach(business => {
      initialActiveStates[business.id] = isBusinessActive(business.startDate, business.endDate)
    })
    setActiveStates(initialActiveStates)
  }, [businesses])

  // Efecto para actualizar automáticamente el estado cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedStates: Record<string, boolean> = {}
      businesses.forEach(business => {
        updatedStates[business.id] = isBusinessActive(business.startDate, business.endDate)
      })
      setActiveStates(updatedStates)
    }, 60000) // Actualiza cada minuto

    return () => clearInterval(interval)
  }, [businesses])

  if (businesses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-sky-50 py-8 px-4">
        <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-[#f97316] to-[#0ea5e9] text-white rounded-t-lg text-center">
            <div className="flex items-center justify-center gap-3">
              <Building2 className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">No hay negocios registrados</CardTitle>
                <CardDescription className="text-orange-100">
                  Comience registrando su primer negocio
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center p-8">
            <Button asChild className="bg-gradient-to-r from-[#f97316] to-[#0ea5e9] hover:from-[#ea580c] hover:to-[#0284c7] text-white">
              <Link href="/">Registrar Negocio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-sky-50 py-8 px-4">
      <Card className="w-full max-w-7xl mx-auto shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-[#f97316] to-[#0ea5e9] text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">Lista de Negocios</CardTitle>
                <CardDescription className="text-orange-100">
                  {businesses.length} {businesses.length === 1 ? "negocio registrado" : "negocios registrados"}
                </CardDescription>
              </div>
            </div>
            <Button asChild className="bg-white text-[#0ea5e9] hover:bg-gray-100 border-0">
              <Link href="/">Registrar Nuevo</Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[#0ea5e9] font-semibold">Negocio</TableHead>
                  <TableHead className="text-[#0ea5e9] font-semibold">Categoría</TableHead>
                  <TableHead className="text-[#0ea5e9] font-semibold">Teléfono</TableHead>
                  <TableHead className="text-[#0ea5e9] font-semibold">Suscripción</TableHead>
                  <TableHead className="text-[#0ea5e9] font-semibold">Inicio</TableHead>
                  <TableHead className="text-[#0ea5e9] font-semibold">Término</TableHead>
                  <TableHead className="text-[#0ea5e9] font-semibold text-right">Monto</TableHead>
                  <TableHead className="text-[#0ea5e9] font-semibold text-center">Veces</TableHead>
                  <TableHead className="text-[#0ea5e9] font-semibold text-center">Estado</TableHead>
                  <TableHead className="text-[#0ea5e9] font-semibold text-center">Acciones</TableHead>
                  <TableHead className="text-[#0ea5e9] font-semibold text-center">Activado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => {
                  const status = getStatusBadge(business.endDate)
                  const endDate = new Date(business.endDate)
                  const today = new Date()
                  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

                  return (
                    <TableRow key={business.id} className="hover:bg-orange-50/50 transition-colors">
                      <TableCell>
                        <div className="font-medium text-gray-900">{business.name}</div>
                        <div className="text-sm text-gray-500">{business.category}</div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-[#0ea5e9] border-[#0ea5e9]">
                          {business.category}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="h-4 w-4 text-[#0ea5e9]" />
                          {formatPhone(business.phone)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={business.subscriptionType === "Anual" ? "default" : "secondary"}
                          className={business.subscriptionType === "Anual"
                            ? "bg-[#f97316] text-white"
                            : "bg-[#0ea5e9] text-white"}
                        >
                          {business.subscriptionType}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-[#0ea5e9]" />
                          {formatDate(business.startDate)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 text-[#0ea5e9]" />
                          {formatDate(business.endDate)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {daysRemaining > 0 ? `${daysRemaining} días restantes` : 'Expirada'}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 font-mono text-gray-900">
                          <span className="text-[#0ea5e9]">Bs</span>
                          {formatCurrency(business.amountPaid)}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Repeat className="h-4 w-4 text-[#0ea5e9]" />
                          <Badge variant="outline" className="bg-orange-50 text-[#f97316] border-[#f97316]">
                            {business.timesSubscribed}
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant={status.variant}>
                          {status.label}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-[#0ea5e9] hover:text-[#f97316] hover:bg-orange-50"
                        >
                          <Link href={`/negocios/${business.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver {business.name}</span>
                          </Link>
                        </Button>
                      </TableCell>

                      <TableCell className="text-center">
                        <Toggle
                          pressed={activeStates[business.id] || false}
                          onPressedChange={(pressed) => {
                            setActiveStates(prev => ({
                              ...prev,
                              [business.id]: pressed
                            }))
                          }}
                          className={`w-12 h-6 rounded-full transition-all duration-200 ${activeStates[business.id]
                            ? 'bg-[#0ea5e9] hover:bg-[#0284c7]'
                            : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        >
                          <Power className={`h-3 w-3 transition-all duration-200 ${activeStates[business.id]
                            ? 'text-white translate-x-3'
                            : 'text-gray-500 -translate-x-3'
                            }`} />
                        </Toggle>
                        <div className="text-xs text-gray-500 mt-1">
                          {activeStates[business.id] ? 'Activado' : 'Desactivado'}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Estadísticas rápidas */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-[#f97316] to-orange-400 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">{businesses.length}</div>
              <div className="text-sm">Total Negocios</div>
            </div>

            <div className="bg-gradient-to-r from-[#0ea5e9] to-blue-400 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">
                {businesses.filter(b => new Date(b.endDate) > new Date()).length}
              </div>
              <div className="text-sm">Suscripciones Activas</div>
            </div>

            <div className="bg-gradient-to-r from-[#f97316] to-orange-400 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">
                {formatCurrency(businesses.reduce((sum, b) => sum + b.amountPaid, 0))}
              </div>
              <div className="text-sm">Ingresos Totales</div>
            </div>

            <div className="bg-gradient-to-r from-[#0ea5e9] to-blue-400 rounded-lg p-4 text-white">
              <div className="text-2xl font-bold">
                {formatCurrency(businesses.reduce((sum, b) => sum + b.amountPaid, 0) / businesses.length || 0)}
              </div>
              <div className="text-sm">Promedio por Negocio</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}