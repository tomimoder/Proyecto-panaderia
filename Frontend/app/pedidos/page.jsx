import { OrderList } from "@/components/OrderList"

export default function PedidosPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona y visualiza todos los pedidos de tu pastelería
        </p>
      </div>
      <OrderList />
    </div>
  )
}
