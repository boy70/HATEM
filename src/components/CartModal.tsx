"use client";

import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "@/hooks/useWixClient";
import CheckoutForm from "./CheckoutForm"; // Make sure path is correct!

const CartModal = () => {
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem } = useCartStore();
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
  };

  if (!cart.lineItems) {
    return (
      <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
        <div>Cart is Empty</div>
      </div>
    );
  }

  const cartItems = cart.lineItems.map((item) => ({
    productName: item.productName?.original || "",
    quantity: item.quantity || 1,
    price: item.price?.amount || 0,
  }));

  return (
    <>
      <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
        <h2 className="text-xl">Shopping Cart</h2>
        
        {/* LIST */}
        <div className="flex flex-col gap-8">
          {cart.lineItems.map((item) => (
            <div className="flex gap-4" key={item._id}>
              {item.image && (
                <Image
                  src={wixMedia.getScaledToFillImageUrl(
                    item.image,
                    72,
                    96,
                    {}
                  )}
                  alt=""
                  width={72}
                  height={96}
                  className="object-cover rounded-md"
                />
              )}
              <div className="flex flex-col justify-between w-full">
                {/* TOP */}
                <div>
                  <div className="flex items-center justify-between gap-8">
                    <h3 className="font-semibold">{item.productName?.original}</h3>
                    <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                      {item.quantity && item.quantity > 1 && (
                        <div className="text-xs text-green-500">
                          {item.quantity} x{" "}
                        </div>
                      )}
                      ${item.price?.amount}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.availability?.status}
                  </div>
                </div>
                {/* BOTTOM */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Qty. {item.quantity}</span>
                  <span
                    className="text-blue-500 cursor-pointer"
                    style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                    onClick={() => removeItem(wixClient, item._id!)}
                  >
                    Remove
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM */}
        <div className="mt-6">
          <div className="flex items-center justify-between font-semibold">
            <span>Subtotal</span>
            <span>${cart.subtotal.amount}</span>
          </div>
          <p className="text-gray-500 text-sm mt-2 mb-4">
            Shipping & taxes calculated at checkout.
          </p>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            className="bg-lama text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-all"
          >
            Checkout
          </button>
        </div>
      </div>

      {/* Checkout Form Modal */}
      {isCheckoutOpen && (
        <CheckoutForm cartItems={cartItems} onClose={handleCloseCheckout} />
      )}
    </>
  );
};

export default CartModal;
