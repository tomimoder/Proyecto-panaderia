"use client"

import { useState } from "react"
import { useOrders } from "@/context/OrderContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';

// Esto puede cambiarse a la BDD y crear una vista para poder agregar inventario
const productSuggestions = [
  "Pastel de Chocolate",
  "Pastel de Tres Leches",
  "Pastel Red Velvet",
  "Cupcakes (12 piezas)",
  "Pan de Elote",
  "Pastel de Zanahoria",
  "Cheesecake",
  "Galletas (docena)",
  "Brownies (6 piezas)",
  "Pastel de Fresas",
]

export function OrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { addOrder } = useOrders()
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    product: "",
    quantity: 1,
    price: "",
    delivery_date: "",
    notes: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "price" ? Number(value) || "" : value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.customer_name.trim()){
      newErrors.customer_name = "El nombre del cliente es requerido"
    }
    if (!formData.phone.trim()){
      newErrors.phone = "El telefono del cliente es requerido"
    }
    if (!formData.product.trim()){
      newErrors.product = "El producto es requerido"
    }
    if (!formData.quantity){
      newErrors.quantity = "La cantidad es requerida"
    }
    if (!formData.price){
      newErrors.price = "El precio es requerido"
    }
    if (!formData.delivery_date.trim()){
      newErrors.delivery_date = "La fecha de retiro es requerida"
    }

    setError(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()){
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await addOrder(formData)
      
      setShowSuccess(true)
      setFormData({
        customer_name: "",
        phone: "",
        product: "",
        quantity: 1,
        price: "",
        delivery_date: "",
        notes: "",
      })

      toast.success('Se ha registrado el pedido con éxito.')
      
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      console.log("Error completo", err);
      toast.error("No se ha podido registrar el pedido. Por favor intente")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      
      {showSuccess ? (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-success/20 p-4 mb-4">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Pedido Registrado
            </h3>
            <p className="text-muted-foreground text-center">
              El pedido ha sido guardado exitosamente
            </p>
            <Button
              className="mt-6"
              onClick={() => setShowSuccess(false)}
            >
              Agregar otro pedido
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Nuevo Pedido</CardTitle>
            <CardDescription>
              Complete los datos del cliente y del pedido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Datos del cliente */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground border-b border-border pb-2">
                  Datos del Cliente
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">Nombre del cliente *</Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      placeholder="Ej: María García"
                      value={formData.customer_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Ej: 555-1234"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Datos del pedido */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground border-b border-border pb-2">
                  Datos del Pedido
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="product">Producto *</Label>
                  <Input
                    id="product"
                    name="product"
                    placeholder="Ej: Pastel de Chocolate"
                    list="product-suggestions"
                    value={formData.product}
                    onChange={handleChange}
                    required
                  />
                  <datalist id="product-suggestions">
                    {productSuggestions.map((product) => (
                      <option key={product} value={product} />
                    ))}
                  </datalist>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Cantidad *</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Ej: 450"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery_date">Fecha de entrega *</Label>
                    <Input
                      id="delivery_date"
                      name="delivery_date"
                      type="date"
                      value={formData.delivery_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas adicionales</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Detalles especiales, decoración, mensaje, etc."
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Pedido"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  )
}