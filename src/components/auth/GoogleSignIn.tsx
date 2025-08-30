import { useEffect, useRef, useState } from "react";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Google Identity Services loader and button renderer
// No Firebase or Supabase

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleSignInProps {
  role: UserRole;
  onSuccess?: () => void;
}

export const GoogleSignIn = ({ role, onSuccess }: GoogleSignInProps) => {
  const { loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const divRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!clientId) return; // not configured yet

    const ensureScript = () => new Promise<void>((resolve, reject) => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity script'));
      document.head.appendChild(script);
    });

    ensureScript()
      .then(() => {
        if (!window.google) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: { credential: string }) => {
            const ok = await loginWithGoogle(response.credential, role);
            if (ok) {
              toast({ title: 'Google Sign-in Successful' });
              onSuccess?.();
            } else {
              toast({ title: 'Google Sign-in Failed', description: 'Please try again.', variant: 'destructive' });
            }
          },
          auto_select: false,
          ux_mode: 'popup',
        });
        setReady(true);
      })
      .catch(() => {
        toast({ title: 'Could not load Google Sign-in', description: 'Check your network and try again.', variant: 'destructive' });
      });
  }, [clientId, loginWithGoogle, role, toast, onSuccess]);

  useEffect(() => {
    if (!ready || !divRef.current || !window.google) return;
    try {
      window.google.accounts.id.renderButton(divRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'pill',
        text: 'continue_with',
      });
    } catch (e) {
      // fallback noop
    }
  }, [ready]);

  if (!clientId) {
    return (
      <div className="text-sm text-red-300">
        Google login is not configured yet. Follow the steps below to add your Google Client ID.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div ref={divRef} />
      {!ready && (
        <Button disabled className="btn-secondary w-full">Loading Google...</Button>
      )}
    </div>
  );
};

