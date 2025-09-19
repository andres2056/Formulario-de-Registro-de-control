"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useBusinessStore } from "@/lib/store";
import { Building2, Phone, Calendar, DollarSign, Repeat, MapPin } from "lucide-react";

interface FormData {
  name: string;
  startDate: string;
  endDate: string;
  amountPaid: string;
  subscriptionType: string;
  phone: string;
  timesSubscribed: string;
  category: string;
}

interface FormErrors {
  name?: string;
  startDate?: string;
  endDate?: string;
  amountPaid?: string;
  subscriptionType?: string;
  phone?: string;
  timesSubscribed?: string;
  category?: string;
  dateRange?: string;
}

export function BusinessForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    startDate: "",
    endDate: "",
    amountPaid: "",
    subscriptionType: "",
    phone: "",
    timesSubscribed: "",
    category: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addBusiness } = useBusinessStore();
  const { toast } = useToast();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del negocio es obligatorio";
    }

    if (!formData.startDate) {
      newErrors.startDate = "La fecha de inicio es obligatoria";
    }

    if (!formData.endDate) {
      newErrors.endDate = "La fecha de término es obligatoria";
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (startDate >= endDate) {
        newErrors.dateRange = "La fecha de inicio debe ser anterior a la fecha de término";
      }
    }

    const amount = Number.parseFloat(formData.amountPaid);
    if (!formData.amountPaid || isNaN(amount) || amount <= 0) {
      newErrors.amountPaid = "El monto debe ser un número positivo";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El número de teléfono es obligatorio";
    }

    const times = Number.parseInt(formData.timesSubscribed);
    if (!formData.timesSubscribed || isNaN(times) || times <= 0) {
      newErrors.timesSubscribed = "Las veces suscrito debe ser un número positivo";
    }

    if (!formData.category) {
      newErrors.category = "Debe seleccionar una categoría";
    }

    if (!formData.subscriptionType) {
      newErrors.subscriptionType = "Debe seleccionar un tipo de suscripción";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      addBusiness({
        name: formData.name.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        amountPaid: Number.parseFloat(formData.amountPaid),
        subscriptionType: formData.subscriptionType,
        phone: formData.phone,
        timesSubscribed: Number.parseInt(formData.timesSubscribed),
        category: formData.category,
      });

      toast({
        title: "✅ Negocio registrado",
        description: "El negocio se ha registrado exitosamente",
      });

      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        amountPaid: "",
        subscriptionType: "",
        phone: "",
        timesSubscribed: "",
        category: "",
      });

      router.push("/negocios");
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Ocurrió un error al registrar el negocio",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    if ((field === "startDate" || field === "endDate") && errors.dateRange) {
      setErrors((prev) => ({ ...prev, dateRange: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-sky-50 py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-[#f97316] to-[#0ea5e9] text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8" />
            <div>
              <CardTitle className="text-2xl">Registrar Nuevo Negocio</CardTitle>
              <CardDescription className="text-orange-100">
                Complete la información del negocio y su suscripción
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del Negocio */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2 text-[#0ea5e9]">
                <Building2 className="h-4 w-4" />
                Nombre del Negocio *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ingrese el nombre del negocio"
                className={errors.name ? "border-destructive" : "border-gray-300 focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]"}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Categoría y Tipo de Suscripción */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium flex items-center gap-2 text-[#0ea5e9]">
                  <MapPin className="h-4 w-4" />
                  Categoría *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger className={errors.category ? "border-destructive" : "border-gray-300 focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]"}>
                    <SelectValue placeholder="Seleccione la categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Comercio">Comercio</SelectItem>
                    <SelectItem value="Servicios">Servicios</SelectItem>
                    <SelectItem value="Entretenimiento">Entretenimiento</SelectItem>
                    <SelectItem value="Alojamiento">Alojamiento</SelectItem>
                    <SelectItem value="Turismo">Turismo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscriptionType" className="text-sm font-medium flex items-center gap-2 text-[#0ea5e9]">
                  <Calendar className="h-4 w-4" />
                  Tipo de Suscripción *
                </Label>
                <Select
                  value={formData.subscriptionType}
                  onValueChange={(value) => handleInputChange("subscriptionType", value)}
                >
                  <SelectTrigger className={errors.subscriptionType ? "border-destructive" : "border-gray-300 focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]"}>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Anual">Anual</SelectItem>
                    <SelectItem value="Mensual">Mensual</SelectItem>
                  </SelectContent>
                </Select>
                {errors.subscriptionType && (
                  <p className="text-sm text-destructive">{errors.subscriptionType}</p>
                )}
              </div>
            </div>

            {/* Teléfono y Veces Suscrito */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2 text-[#0ea5e9]">
                  <Phone className="h-4 w-4" />
                  Número de Teléfono *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Ingrese el número de teléfono"
                  className={errors.phone ? "border-destructive" : "border-gray-300 focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]"}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timesSubscribed" className="text-sm font-medium flex items-center gap-2 text-[#0ea5e9]">
                  <Repeat className="h-4 w-4" />
                  Veces Suscrito *
                </Label>
                <Input
                  id="timesSubscribed"
                  type="number"
                  min="1"
                  value={formData.timesSubscribed}
                  onChange={(e) => handleInputChange("timesSubscribed", e.target.value)}
                  placeholder="0"
                  className={errors.timesSubscribed ? "border-destructive" : "border-gray-300 focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]"}
                />
                {errors.timesSubscribed && (
                  <p className="text-sm text-destructive">{errors.timesSubscribed}</p>
                )}
              </div>
            </div>

            {/* Fechas de Suscripción */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium flex items-center gap-2 text-[#0ea5e9]">
                  <Calendar className="h-4 w-4" />
                  Fecha de Inicio *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className={errors.startDate ? "border-destructive" : "border-gray-300 focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]"}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium flex items-center gap-2 text-[#0ea5e9]">
                  <Calendar className="h-4 w-4" />
                  Fecha de Término *
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className={errors.endDate ? "border-destructive" : "border-gray-300 focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]"}
                />
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate}</p>
                )}
              </div>
            </div>

            {errors.dateRange && (
              <div className="bg-destructive/10 border border-destructive rounded-lg p-3">
                <p className="text-sm text-destructive">{errors.dateRange}</p>
              </div>
            )}

            {/* Monto Pagado */}
            <div className="space-y-2">
              <Label htmlFor="amountPaid" className="text-sm font-medium flex items-center gap-2 text-[#0ea5e9]">
                <span>Bs</span>
                Monto Pagado *
              </Label>
              <Input
                id="amountPaid"
                type="number"
                step="0.01"
                min="0"
                value={formData.amountPaid}
                onChange={(e) => handleInputChange("amountPaid", e.target.value)}
                placeholder="0.00"
                className={errors.amountPaid ? "border-destructive" : "border-gray-300 focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]"}
              />
              {errors.amountPaid && (
                <p className="text-sm text-destructive">{errors.amountPaid}</p>
              )}
            </div>

            {/* Botón de Submit */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#f97316] to-[#0ea5e9] hover:from-[#ea580c] hover:to-[#0284c7] transition-all duration-200 transform hover:scale-105 text-white font-semibold"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Registrando...
                </div>
              ) : (
                "Registrar Negocio"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}