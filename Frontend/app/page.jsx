import { Dashboard } from "@/components/Dashboard"

export default function HomePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Resumen de ventas y estadísticas de tu pastelería
        </p>
      </div>
      <Dashboard />
    </div>
  )
}
