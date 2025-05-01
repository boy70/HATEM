"use client"
import React, { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import dayjs from "dayjs"
import {
  Search,
  RefreshCw,
  ChevronDown,
  Check,
  X,
  AlertCircle,
  Info,
  Loader2,
  Calendar
} from "lucide-react"
import { Menu } from "@headlessui/react"

const DateFilters = {
  ALL: "all",
  TODAY: "today",
  THIS_WEEK: "this_week",
  LAST_WEEK: "last_week",
  THIS_MONTH: "this_month",
  CUSTOM: "custom"
} as const

const Notification = ({ type, message, onClose }: { 
  type: string, 
  message: string, 
  onClose: () => void 
}) => (
  <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
    type === "success" 
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
      : "bg-rose-50 text-rose-700 border border-rose-200"
  }`}>
    {type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
      <X size={16} />
    </button>
  </div>
)

const StatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    pending: "bg-amber-100 text-amber-800",
    in_delivery: "bg-blue-100 text-blue-800",
    delivered: "bg-emerald-100 text-emerald-800",
    returned: "bg-rose-100 text-rose-800"
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      statusColors[status as keyof typeof statusColors] || statusColors.pending
    }`}>
      {status.replace(/_/g, " ")}
    </span>
  )
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
type DateFilterType = "all" | "today" | "this_week" | "last_week" | "this_month" | "custom"

const [dateFilter, setDateFilter] = useState<{
  type: DateFilterType
  start: string
  end: string
}>({
  type: "all",
  start: "",
  end: ""
})
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null)

  const getDateRange = (type: DateFilterType) => {
    const today = dayjs()
    switch (type) {
      case DateFilters.TODAY:
        return { 
          start: today.startOf('day').toISOString(),
          end: today.endOf('day').toISOString()
        }
      case DateFilters.THIS_WEEK:
        return {
          start: today.startOf('week').toISOString(),
          end: today.endOf('day').toISOString()
        }
      case DateFilters.LAST_WEEK:
        return {
          start: today.subtract(1, 'week').startOf('week').toISOString(),
          end: today.subtract(1, 'week').endOf('week').toISOString()
        }
      case DateFilters.THIS_MONTH:
        return {
          start: today.startOf('month').toISOString(),
          end: today.endOf('day').toISOString()
        }
      default:
        return { start: "", end: "" }
    }
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      // Apply date filters
      if (dateFilter.type !== DateFilters.ALL && dateFilter.type !== DateFilters.CUSTOM) {
        const range = getDateRange(dateFilter.type)
        query = query.gte('created_at', range.start).lte('created_at', range.end)
      }

      if (dateFilter.type === DateFilters.CUSTOM && dateFilter.start && dateFilter.end) {
        query = query
          .gte('created_at', dayjs(dateFilter.start).startOf('day').toISOString())
          .lte('created_at', dayjs(dateFilter.end).endOf('day').toISOString())
      }

      const { data, error } = await query

      if (error) throw error
      setOrders(data || [])
    } catch (err: any) {
      setNotification({ type: "error", message: err.message })
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, status: string) => {
    if (!confirm(`Update order #${id} to ${status.replace(/_/g, " ")}?`)) return
    
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)

      if (error) throw error
      
      setOrders(prev => prev.map(order => 
        order.id === id ? { ...order, status } : order
      ))
      
      setNotification({ 
        type: "success", 
        message: `Order #${id} status updated to ${status.replace(/_/g, " ")}`
      })
    } catch (err: any) {
      setNotification({ 
        type: "error", 
        message: "Failed to update status. Check console for details."
      })
      console.error("Update error:", err)
      fetchOrders()
    }
  }

  useEffect(() => { 
    if (dateFilter.type === "custom") {
      // handle custom date filter logic if needed
    } else {
      fetchOrders()
    }
  }, [dateFilter.type, dateFilter.start, dateFilter.end])

  const filteredOrders = orders.filter(order => {
    const searchMatch = Object.values(order).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
    const statusMatch = statusFilter === "all" || order.status === statusFilter
    return searchMatch && statusMatch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            
            <div className="w-full sm:w-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={fetchOrders}
                disabled={loading}
                className="p-2 rounded-lg bg-white border hover:bg-gray-50 disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          {/* Status Filter */}
          <div className="flex items-center bg-white rounded-lg border p-1">
            {["all", "pending", "in_delivery", "delivered", "returned"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-md text-sm ${
                  statusFilter === status 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {status === "all" ? "All Statuses" : status.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <Menu as="div" className="relative inline-block text-left">
            <div className="flex gap-2 items-center">
              <Menu.Button className="inline-flex justify-center items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                <Calendar size={18} />
                {dateFilter.type === DateFilters.CUSTOM 
                  ? "Custom Dates"
                  : Object.entries(DateFilters).find(
                      ([, value]) => value === dateFilter.type
                    )?.[0].replace(/_/g, " ")}
                <ChevronDown size={16} />
              </Menu.Button>

              {dateFilter.type === DateFilters.CUSTOM && (
                <div className="flex gap-2 items-center bg-white p-2 rounded-lg border">
                  <input
                    type="date"
                    value={dateFilter.start}
                    onChange={(e) => setDateFilter(prev => ({
                      ...prev,
                      start: e.target.value
                    }))}
                    className="text-sm p-1 border rounded"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={dateFilter.end}
                    onChange={(e) => setDateFilter(prev => ({
                      ...prev,
                      end: e.target.value
                    }))}
                    className="text-sm p-1 border rounded"
                  />
                </div>
              )}
            </div>

            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-lg border focus:outline-none">
              <div className="p-2">
                {Object.values(DateFilters).map((filter) => (
                  <Menu.Item key={filter}>
                    <button
                      onClick={() => setDateFilter(prev => ({
                        ...prev,
                        type: filter,
                        ...(filter !== DateFilters.CUSTOM && { start: "", end: "" })
                      }))}
                      className={`w-full text-left px-4 py-2 text-sm rounded-md ${
                        dateFilter.type === filter
                          ? "bg-blue-100 text-blue-800"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {filter === DateFilters.ALL ? "All Dates" : 
                       filter.replace(/_/g, " ")}
                    </button>
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Products</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const products = order["Product Ordered"]?.split(",") || []
                  const total = order.Price ? `$${parseFloat(order.Price).toFixed(2)}` : "$0.00"

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium">{order["Full Name"]}</span>
                          <span className="text-gray-500">{order["Phone Number"]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex flex-col">
                          {products.map((product: string, index: number) => (
                            <span key={index} className="truncate max-w-[200px]">
                              {product.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{total}</td>
                      <td className="px-4 py-3 text-sm"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {dayjs(order.created_at).format("MMM D, YYYY")}
                      </td>
                      <td className="px-4 py-3 text-sm space-y-1">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="text-sm rounded border px-2 py-1 bg-white focus:outline-none focus:ring-1"
                          disabled={loading}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_delivery">In Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="returned">Returned</option>
                        </select>
                        <a
                          href={`/admin/orders/${order.id}`}
                          className="flex items-center text-blue-600 hover:text-blue-900 text-sm"
                        >
                          <Info size={16} className="mr-1" /> Details
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="p-8 text-center text-gray-500">
              <Loader2 className="animate-spin inline-block mr-2" size={20} />
              Loading orders...
            </div>
          )}

          {!loading && filteredOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No orders found matching your criteria
            </div>
          )}
        </div>
      </main>
    </div>
  )
}