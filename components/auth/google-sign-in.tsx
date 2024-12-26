"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Script from "next/script";

export function GoogleSignIn() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleSignInWithGoogle = async (response: any) => {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) {
        console.error('Error signing in with Google:', error);
        return;
      }

      // Force a router refresh to update the header
      router.push('/protected');
      router.refresh();
    };

    // Add the handler to the window object so Google's SDK can find it
    (window as any).handleSignInWithGoogle = handleSignInWithGoogle;

    // Initialize Google Sign-In if the script is already loaded
    if ((window as any).google?.accounts) {
      initializeGoogleSignIn();
    }
  }, [router, supabase.auth]);

  const initializeGoogleSignIn = () => {
    (window as any).google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: (window as any).handleSignInWithGoogle,
    });

    // Clear the container first to prevent duplicate buttons
    const buttonContainer = document.getElementById("googleButton");
    if (buttonContainer) {
      buttonContainer.innerHTML = '';
    }

    (window as any).google.accounts.id.renderButton(
      document.getElementById("googleButton"),
      { 
        theme: "outline",
        size: "large",
        type: "standard",
        shape: "pill",
        text: "signin_with",
        logo_alignment: "left",
        width: buttonContainer?.offsetWidth
      }
    );
  };

  return (
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="afterInteractive"
        onLoad={initializeGoogleSignIn}
      />
      <div id="googleButton" className="w-full mt-4" />
    </>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}