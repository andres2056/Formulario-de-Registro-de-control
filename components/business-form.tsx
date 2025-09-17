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

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "El nombre del negocio es obligatorio";
    }

    // Validate start date
    if (!formData.startDate) {
      newErrors.startDate = "La fecha de inicio es obligatoria";
    }

    // Validate end date
    if (!formData.endDate) {
      newErrors.endDate = "La fecha de término es obligatoria";
    }

    // Validate date range
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (startDate >= endDate) {
        newErrors.dateRange =
          "La fecha de inicio debe ser anterior a la fecha de término";
      }
    }

    // Validate amount
    const amount = Number.parseFloat(formData.amountPaid);
    if (!formData.amountPaid || isNaN(amount) || amount <= 0) {
      newErrors.amountPaid = "El monto debe ser un número positivo";
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = "El número de teléfono es obligatorio";
    }

    // Validate times subscribed
    const times = Number.parseInt(formData.timesSubscribed);
    if (!formData.timesSubscribed || isNaN(times) || times <= 0) {
      newErrors.timesSubscribed = "Las veces suscrito debe ser un número positivo";
    }

    // Validate category
    if (!formData.category) {
      newErrors.category = "Debe seleccionar una categoría";
    }

    // Validate subscription type
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
        title: "Negocio registrado",
        description: "El negocio se ha registrado exitosamente",
      });

      // Reset form
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

      // Navigate to business list
      router.push("/negocios");
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar el negocio",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Clear date range error when either date changes
    if ((field === "startDate" || field === "endDate") && errors.dateRange) {
      setErrors((prev) => ({ ...prev, dateRange: undefined }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Nuevo Negocio</CardTitle>
        <CardDescription>
          Complete la información del negocio y su suscripción
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del Negocio */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Negocio *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Ingrese el nombre del negocio"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Categoría y Tipo de Suscripción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className={errors.category ? "border-destructive" : ""}>
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
              <Label htmlFor="subscriptionType">Tipo de Suscripción *</Label>
              <Select
                value={formData.subscriptionType}
                onValueChange={(value) => handleInputChange("subscriptionType", value)}
              >
                <SelectTrigger className={errors.subscriptionType ? "border-destructive" : ""}>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Número de Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Ingrese el número de teléfono"
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timesSubscribed">Veces Suscrito *</Label>
              <Input
                id="timesSubscribed"
                type="number"
                min="1"
                value={formData.timesSubscribed}
                onChange={(e) => handleInputChange("timesSubscribed", e.target.value)}
                placeholder="0"
                className={errors.timesSubscribed ? "border-destructive" : ""}
              />
              {errors.timesSubscribed && (
                <p className="text-sm text-destructive">{errors.timesSubscribed}</p>
              )}
            </div>
          </div>

          {/* Fecha de Inicio y Término de la Suscripción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de Inicio de Suscripción *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className={errors.startDate ? "border-destructive" : ""}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de Término de Suscripción *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className={errors.endDate ? "border-destructive" : ""}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate}</p>
              )}
            </div>
          </div>

          {errors.dateRange && (
            <p className="text-sm text-destructive">{errors.dateRange}</p>
          )}

          {/* Monto Pagado */}
          <div className="space-y-2">
            <Label htmlFor="amountPaid">Monto Pagado *</Label>
            <Input
              id="amountPaid"
              type="number"
              step="0.01"
              min="0"
              value={formData.amountPaid}
              onChange={(e) => handleInputChange("amountPaid", e.target.value)}
              placeholder="0.00"
              className={errors.amountPaid ? "border-destructive" : ""}
            />
            {errors.amountPaid && (
              <p className="text-sm text-destructive">{errors.amountPaid}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar Negocio"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}