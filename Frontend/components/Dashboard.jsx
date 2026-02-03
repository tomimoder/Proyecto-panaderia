"use client"

import { useOrders, } from "@/context/OrderContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart,
} from "recharts"
import { 
  Package, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Calendar 
} from "lucide-react"
import { useEffect } from "react"

export function Dashboard() {
  const { isLoaded, getStatistics, refreshOrders  } = useOrders()

  useEffect(() => {
    refreshOrders()
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">
          Cargando estadísticas...
        </div>
      </div>
    )
  }

  const stats = getStatistics()

  const statusData = [
    { name: "Pendientes", value: stats.pendingOrders, fill: "#eab308" },
    { name: "Entregados", value: stats.deliveredOrders, fill: "#22c55e" },
    { name: "Cancelados", value: stats.cancelledOrders, fill: "#ef4444" },
  ]

  // Colores para el gráfico de barras
  const barColor = "#8b5cf6"

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Pedidos</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-6 w-6 text-warning-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-foreground">{stats.pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entregados</p>
                <p className="text-2xl font-bold text-foreground">{stats.deliveredOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Mes</p>
                <p className="text-2xl font-bold text-foreground">
                  ${stats.monthRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ventas últimos 7 días */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Ventas Últimos 7 Días
            </CardTitle>
            <CardDescription>
              Ingresos diarios de pedidos entregados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                total: {
                  label: "Ventas",
                  color: barColor,
                },
              }}
              className="h-[250px]"
            >
              
                <BarChart data={stats.last7Days}>
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: "var(--foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                  />
                  <YAxis 
                    tick={{ fill: "var(--foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]}
                  />
                  <Bar 
                    dataKey="total" 
                    fill={barColor}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Estado de pedidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Estado de Pedidos
            </CardTitle>
            <CardDescription>
              Distribución por estado actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                pendientes: { label: "Pendientes", color: "#eab308" },
                entregados: { label: "Entregados", color: "#22c55e" },
                cancelados: { label: "Cancelados", color: "#ef4444" },
              }}
              className="h-[250px]"
            >
              
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Productos más vendidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Productos Más Vendidos
          </CardTitle>
          <CardDescription>
            Top 5 productos por cantidad vendida
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.topProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aún no hay productos vendidos
            </p>
          ) : (
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{product.name}</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{
                          width: `${(product.count / stats.topProducts[0].count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {product.count} vendidos
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
