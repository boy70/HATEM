import { OAuthStrategy, createClient } from "@wix/sdk";
import { collections, products } from "@wix/stores";
import { orders, currentCart } from "@wix/ecom";
import { cookies } from "next/headers";
import { members } from '@wix/members';
import { redirects } from '@wix/redirects';

export const wixClientServer = async () => {
  let refreshToken;

  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get("refreshToken");
    
    if (!tokenCookie?.value) {
      console.warn('No refresh token found in cookies');
      refreshToken = null;
    } else {
      refreshToken = JSON.parse(tokenCookie.value);
    }
  } catch (e) {
    console.error('Error parsing refresh token:', e);
    refreshToken = null;
  }

  if (!process.env.NEXT_PUBLIC_WIX_CLIENT_ID) {
    throw new Error('WIX_CLIENT_ID environment variable is not set');
  }

  const wixClient = createClient({
    modules: { 
      products, 
      collections, 
      orders, 
      members,
      currentCart,
      redirects
    },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID,
      tokens: {
        refreshToken: refreshToken || undefined,
        accessToken: { value: "", expiresAt: new Date(Date.now() + 3600000).getTime() },
      },
    }),
  });

  return wixClient;
};