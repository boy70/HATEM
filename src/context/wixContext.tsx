"use client";

import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import Cookies from "js-cookie";
import { createContext, ReactNode, useEffect } from "react";
import { redirects } from '@wix/redirects';

let refreshToken;
try {
  refreshToken = JSON.parse(Cookies.get("refreshToken") || "null");
} catch {
  refreshToken = null;
}

const wixClient = createClient({
  modules: {
    products,
    collections,
    currentCart,
    redirects
  },
  auth: OAuthStrategy({
    clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
    tokens: {
      refreshToken: refreshToken || undefined,
      accessToken: { value: "", expiresAt: new Date(Date.now() + 3600000).getTime() }
    },
  }),
});

export type WixClient = typeof wixClient;

export const WixClientContext = createContext<WixClient>(wixClient);

export const WixClientContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  useEffect(() => {
    // Refresh tokens when they change
    const handleTokenChange = () => {
      try {
        const newRefreshToken = JSON.parse(Cookies.get("refreshToken") || "null");
        if (newRefreshToken && newRefreshToken !== refreshToken) {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error handling token change:', error);
      }
    };

    window.addEventListener('storage', handleTokenChange);
    return () => window.removeEventListener('storage', handleTokenChange);
  }, []);

  return (
    <WixClientContext.Provider value={wixClient}>
      {children}
    </WixClientContext.Provider>
  );
};
