"use client"

import { useOrders } from "@/context/OrderContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Phone, 
  Calendar,
  Trash2,
  Package
} from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig = {
  pendiente: {
    label: "Pendiente",
    icon: Clock,
    className: "bg-warning/20 text-warning-foreground border-warning/30",
  },
  entregado: {
    label: "Entregado",
    icon: CheckCircle,
    className: "bg-success/20 text-success border-success/30",
  },
  cancelado: {
    label: "Cancelado",
    icon: XCircle,
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
}

export function OrderCard({ order }) {
  const { updateOrderStatus, deleteOrder } = useOrders()
  const status = statusConfig[order.status]
  const StatusIcon = status.icon

  const formattedDate = new Date(order.delivery_date + "T12:00:00").toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  const total = order.price * order.quantity

  const isEditable = order.status === "pendiente"

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      order.status === "cancelado" && "opacity-60"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={cn("flex items-center gap-1", status.className)}>
                <StatusIcon className="h-3 w-3" />
                {status.label}
              </Badge>
            </div>

            {/* Cliente */}
            <h3 className="font-semibold text-foreground truncate">
              {order.customer_name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <Phone className="h-3 w-3" />
              {order.phone}
            </div>

            {/* Producto */}
            <div className="mt-3 p-3 bg-secondary/50 rounded-lg">
              <div className="flex items-start gap-2">
                <Package className="h-4 w-4 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {order.product}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.quantity} x ${order.price.toLocaleString()} = 
                    <span className="font-semibold text-primary ml-1">
                      ${total.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Notas */}
            {order.notes && (
              <p className="mt-2 text-sm text-muted-foreground italic">
                "{order.notes}"
              </p>
            )}

            {/* Fecha entrega */}
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-foreground capitalize">{formattedDate}</span>
            </div>
          </div>

          {/* Acciones */}
        {isEditable && (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Acciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {order.status !== "entregado" && (
                  <DropdownMenuItem
                    onClick={() => updateOrderStatus(order.id, "entregado")}
                    className="text-success"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar entregado
                  </DropdownMenuItem>
                )}
                {order.status !== "pendiente" && (
                  <DropdownMenuItem
                    onClick={() => updateOrderStatus(order.id, "pendiente")}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Marcar pendiente
                  </DropdownMenuItem>
                )}
                {order.status !== "cancelado" && (
                  <DropdownMenuItem
                    onClick={() => updateOrderStatus(order.id, "cancelado")}
                    className="text-destructive"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelar pedido
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar pedido
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar pedido</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. El pedido de {order.customer_name} será eliminado permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteOrder(order.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
