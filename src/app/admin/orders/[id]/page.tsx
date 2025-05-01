"use client"
import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"
import { Loader2, AlertCircle, Printer } from "lucide-react"
import dayjs from "dayjs"

// Define types for order data
type Order = {
  id: number
  created_at: string
  "Full Name": string
  "Phone Number": string
  "Delivery Address": string
  City: string
  "Postal Code": string
  "Comments/Notes": string
  "Product Ordered": string
  Quantity: string
  Price: number
  status: string
}

export default function OrderDetails({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isPrinting, setIsPrinting] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", params.id)
          .single()

        if (error) throw error
        setOrder(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => window.print(), 100)
  }

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline" /></div>
  if (error) return <div className="p-8 text-red-600"><AlertCircle className="inline mr-2" />{error}</div>
  if (!order) return <div className="p-8 text-center">Order not found</div>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
      <button 
        onClick={handlePrint}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
      >
        <Printer size={18} className="mr-2" />
        Print Order
      </button>

      {/* Main content (hidden when printing) */}
      <div className={isPrinting ? "hidden" : ""}>
        <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="font-semibold mb-2">Customer Information</h2>
            <p>{order["Full Name"]}</p>
            <p>Phone: {order["Phone Number"]}</p>
            <p>Address: {order["Delivery Address"]}</p>
            <p>{order.City}, {order["Postal Code"]}</p>
          </div>
          
          <div>
            <h2 className="font-semibold mb-2">Order Details</h2>
            <p>Date: {dayjs(order.created_at).format("MMM D, YYYY h:mm A")}</p>
            <p>Status: <span className="font-medium">{order.status.replace(/_/g, " ")}</span></p>
            <p>Total: ${order.Price.toFixed(2)}</p>
          </div>
        </div>

        <h3 className="font-semibold mb-2">Products</h3>
        <div className="border rounded-lg">
          {order["Product Ordered"]?.split(",").map((product, index) => (
            <div key={index} className="p-3 border-b last:border-b-0">
              {product.trim()} (Qty: {order.Quantity?.split(",")[index]?.trim() || 1})
            </div>
          ))}
        </div>

        {order["Comments/Notes"] && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Notes</h3>
            <p className="text-gray-600">{order["Comments/Notes"]}</p>
          </div>
        )}
      </div>

      {/* Print-only content */}
      <div className={isPrinting ? "print-content" : "hidden"}>
        <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="font-semibold mb-2">Customer Information</h2>
            <p>{order["Full Name"]}</p>
            <p>Phone: {order["Phone Number"]}</p>
            <p>Address: {order["Delivery Address"]}</p>
            <p>{order.City}, {order["Postal Code"]}</p>
          </div>
          
          <div>
            <h2 className="font-semibold mb-2">Order Details</h2>
            <p>Date: {dayjs(order.created_at).format("MMM D, YYYY h:mm A")}</p>
            <p>Status: <span className="font-medium">{order.status.replace(/_/g, " ")}</span></p>
            <p>Total: ${order.Price.toFixed(2)}</p>
          </div>
        </div>

        <h3 className="font-semibold mb-2">Products</h3>
        <div className="border rounded-lg">
          {order["Product Ordered"]?.split(",").map((product, index) => (
            <div key={index} className="p-3 border-b last:border-b-0">
              {product.trim()} (Qty: {order.Quantity?.split(",")[index]?.trim() || 1})
            </div>
          ))}
        </div>

        {order["Comments/Notes"] && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Notes</h3>
            <p className="text-gray-600">{order["Comments/Notes"]}</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content, .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  )
}