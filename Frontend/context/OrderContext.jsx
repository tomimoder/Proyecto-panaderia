"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast'

const OrderContext = createContext(undefined)

const API_URL = "http://127.0.0.1:8000/api/v1/orders/"

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar pedidos desde el backend al iniciar
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(API_URL)
      setOrders(response.data)
      setIsLoaded(true)
    } catch (error) {
      console.error("Error al cargar pedidos:", error)
      setIsLoaded(true)
    }
  }

  const addOrder = async (orderData) => {
    try {
      const response = await axios.post(API_URL, orderData)
      setOrders([response.data, ...orders])
      return response.data
    } catch (error) {
      console.error("Error al crear pedido:", error)
      throw error
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.patch(`${API_URL}${orderId}/`, {
        status: status
      })
      
      setOrders(orders.map(order =>
        order.id === orderId ? response.data : order
      ))
      if (status == 'entregado'){
        toast.success('El pedido cambió su estado a entregado.')
      } else if(status == 'pendiente'){
        toast.success('El pedido cambió su estado a pendiente.')
      } else if(status == 'cancelado'){
        toast.success('El pedido cambió su estado a cancelado.')
      }
    } catch (error) {
      console.error("Error al actualizar pedido:", error)
      toast.error('No se pudo cambiar el estado del pedido')
      throw error
    }
  }

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`${API_URL}${orderId}/`)
      setOrders(orders.filter(order => order.id !== orderId))
      toast.success('Se eliminó el pedido de correctamente.')
    } catch (error) {
      console.error("Error al eliminar pedido:", error)
      toast.error('No se pudo eliminar el pedido.')
      throw error
    }
  }

  const getOrdersByDate = (date) => {
    return orders.filter((order) => order.delivery_date === date)
  }

  const getStatistics = () => {
    const today = new Date().toISOString().split('T')[0]
    const thisMonth = new Date().toISOString().slice(0, 7)
    
    const todayOrders = orders.filter(o => o.delivery_date === today)
    const monthOrders = orders.filter(o => o.delivery_date.startsWith(thisMonth))
    
    const totalRevenue = orders
      .filter(o => o.status === "entregado")
      .reduce((sum, o) => sum + (o.price * o.quantity), 0)
    
    const monthRevenue = monthOrders
      .filter(o => o.status === "entregado")
      .reduce((sum, o) => sum + (o.price * o.quantity), 0)

    const pendingOrders = orders.filter(o => o.status === "pendiente").length
    const deliveredOrders = orders.filter(o => o.status === "entregado").length
    const cancelledOrders = orders.filter(o => o.status === "cancelado").length

    // Ventas por día de la última semana
    const last7Days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    // Filtrar por la fecha en que SE ENTREGÓ (delivered_at)
    const dayOrders = orders.filter(o => {
      if (o.status !== "entregado" || !o.delivered_at) return false
      const deliveredDate = new Date(o.delivered_at).toISOString().split('T')[0]
      return deliveredDate === dateStr
    })
    
    const dayTotal = dayOrders.reduce((sum, o) => sum + (o.price * o.quantity), 0)
    
    last7Days.push({
      date: dateStr,
      day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
      total: dayTotal,
      orders: dayOrders.length,
    })
  }

    // Productos más vendidos
    const productCounts = {}
    orders.filter(o => o.status === "entregado").forEach(o => {
      productCounts[o.product] = (productCounts[o.product] || 0) + o.quantity
    })
    const topProducts = Object.entries(productCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      monthRevenue,
      last7Days,
      topProducts,
    }
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoaded,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        getOrdersByDate,
        getStatistics,
        refreshOrders: fetchOrders,
      }}
    >
      <Toaster position="top-right" />
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrders debe usarse dentro de OrderProvider")
  }
  return context
}