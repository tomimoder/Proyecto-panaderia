import { OrderForm } from "@/components/OrderForm"

export default function NuevoPedidoPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Registrar Pedido</h1>
        <p className="text-muted-foreground mt-1">
          Anota un nuevo pedido para tu pastelería
        </p>
      </div>
      <OrderForm />
    </div>
  )
}
