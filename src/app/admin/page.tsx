"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const AdminDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    let { data: orders, error } = await supabase
      .from("orders")
      .select("*");

    if (error) {
      setError("Error fetching orders: " + error.message);
      setOrders([]);
    } else {
      setOrders(orders || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Panel - Orders Dashboard</h1>
      <div className="mb-4">
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-lama text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Refresh Orders"}
        </button>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length == 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {orders.length > 0 &&
                  Object.keys(orders[0]).map((key) => (
                    <th
                      key={key}
                      className="border border-gray-300 px-4 py-2 text-left capitalize"
                    >
                      {key.replace(/([A-Z])/g, " $1")}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.values(order).map((value, idx2) => (
                    <td key={idx2} className="border border-gray-300 px-4 py-2">
                      {typeof value === "number"
                        ? value.toFixed(2)
                        : value?.toString() || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
