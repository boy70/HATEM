"use client";

import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface CheckoutFormProps {
  cartItems: {
    productName: string;
    quantity: number;
    price: number;
  }[];
  onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartItems, onClose }) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const productOrdered = cartItems.map(item => item.productName).join(", ");
  const quantity = cartItems.map(item => item.quantity).join(", ");
  const price = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    if (!fullName || !phoneNumber || !deliveryAddress || !city || !postalCode) {
      setErrorMessage("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    const phoneNumberInt = parseInt(phoneNumber);
    const postalCodeInt = parseInt(postalCode);

    if (isNaN(phoneNumberInt) || isNaN(postalCodeInt)) {
      setErrorMessage("Phone Number and Postal Code must be valid numbers.");
      setIsSubmitting(false);
      return;
    }

    // Validate phone number and postal code formats if necessary
    // Example: if (phoneNumber.length < 10) { ... }


    //sskjfnskdjnfksjdfnskdf 
    try {
      const { error } = await supabase.from("orders").insert([
        {
          "Full Name": fullName,
          "Phone Number": phoneNumberInt,
          "Delivery Address": deliveryAddress,
          "City": city,
          "Postal Code": postalCodeInt,
          "Comments/Notes": comments,
          "Product Ordered": productOrdered,
          "Quantity": quantity,
          "Price": price,
        },
      ]);

      if (error) {
        setErrorMessage("Failed to submit order: " + error.message);
      } else {
        setSuccessMessage("Order submitted successfully!");
        // Optionally clear form or close modal after success
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 overflow-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-4">Checkout Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lama"
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lama"
              required
            />
          </div>

          <div>
            <label htmlFor="deliveryAddress" className="block font-medium mb-1">
              Delivery Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="deliveryAddress"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lama"
              rows={2}
              required
            />
          </div>

          <div>
            <label htmlFor="city" className="block font-medium mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lama"
              required
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="block font-medium mb-1">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              id="postalCode"
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lama"
              required
            />
          </div>

          <div>
            <label htmlFor="comments" className="block font-medium mb-1">
              Comments / Notes
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lama"
              rows={2}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <p><strong>Products:</strong> {productOrdered}</p>
            <p><strong>Quantity:</strong> {quantity}</p>
            <p><strong>Total Price:</strong> ${price.toFixed(2)}</p>
          </div>

          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
          {successMessage && <p className="text-green-600">{successMessage}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-lama text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
