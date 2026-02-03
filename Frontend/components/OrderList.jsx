"use client"

import { useState, useMemo, useEffect } from "react"
import { useOrders } from "@/context/OrderContext"
import { OrderCard } from "@/components/OrderCard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, Package } from "lucide-react"

export function OrderList() {
  const { orders, isLoaded, refreshOrders } = useOrders()
  const [selectedDate, setSelectedDate] = useState("")
  const [statusFilter, setStatusFilter] = useState("pendiente")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    refreshOrders()
  }, [])
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Filtrar por fecha
      if (selectedDate && order.delivery_date !== selectedDate) {
        return false
      }

      // Filtrar por estado
      if (statusFilter !== "todos" && order.status !== statusFilter) {
        return false
      }

      // Filtrar por búsqueda
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          order.customer_name.toLowerCase().includes(search) ||
          order.product.toLowerCase().includes(search) ||
          order.phone.includes(search)
        )
      }

      return true
    })
  }, [orders, selectedDate, statusFilter, searchTerm])

  // Agrupar pedidos por fecha
  const groupedOrders = useMemo(() => {
    const groups = {}
    filteredOrders.forEach((order) => {
      const date = order.delivery_date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(order)
    })
    // Ordenar fechas
    return Object.entries(groups).sort((a, b) => new Date(a[0]) - new Date(b[0]))
  }, [filteredOrders])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">
          Cargando pedidos...
        </div>
      </div>
    )
  }

  const formatDateHeader = (dateStr) => {
    const date = new Date(dateStr + "T12:00:00")
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const todayStr = today.toISOString().split('T')[0]
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    if (dateStr === todayStr) {
      return "Hoy"
    } else if (dateStr === tomorrowStr) {
      return "Mañana"
    }

    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            {/* Búsqueda */}
            <div className="flex-1 space-y-2">
              <Label htmlFor="search" className="text-sm">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nombre, producto o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm">Fecha de entrega</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-9 w-full lg:w-48"
                />
              </div>
            </div>

            {/* Limpiar */}
            {(selectedDate || searchTerm) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDate("")
                  setSearchTerm("")
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>

          {/* Tabs de estado */}
          <div className="mt-4">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
                <TabsTrigger value="entregado">Entregados</TabsTrigger>
                <TabsTrigger value="cancelado">Cancelados</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Lista de pedidos */}
      {groupedOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-foreground">No hay pedidos</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              {selectedDate || searchTerm || statusFilter !== "todos"
                ? "No se encontraron pedidos con los filtros seleccionados"
                : "Aún no hay pedidos registrados"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupedOrders.map(([date, dateOrders]) => (
            <div key={date}>
              <h3 className="font-semibold text-foreground mb-3 capitalize flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {formatDateHeader(date)}
                <span className="text-sm font-normal text-muted-foreground">
                  ({dateOrders.length} {dateOrders.length === 1 ? "pedido" : "pedidos"})
                </span>
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {dateOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
