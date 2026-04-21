"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
};

// Simple thin black spinner component
function ThinSpinner() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: 30 }}
    >
      <span
        className="inline-block"
        style={{
          width: 28,
          height: 28,
          border: "2px solid #000",
          borderColor: "#000 transparent #000 transparent",
          borderRadius: "50%",
          animation: "spin-skinny 0.7s linear infinite",
        }}
      />
      <style>{`
        @keyframes spin-skinny {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
}

export default function AuthWrapper({ children }: Props) {
  const { loading, isAuthenticated, fetchMe } = useAuth();

  const pathname = usePathname();
  const router = useRouter();
  const initialized = useRef(false);

  const isAuthPage = pathname.startsWith("/auth");

  // run once on app load
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    fetchMe();
  }, [fetchMe]);

  // route protection
  useEffect(() => {
    if (loading) return;

    // public auth pages
    if (isAuthPage) {
      // already logged in? send away from login/register
      if (isAuthenticated) {
        router.replace("/");
      }
      return;
    }

    // protected pages
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [loading, isAuthenticated, isAuthPage, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3]">
        <ThinSpinner />
      </div>
    );
  }

  // avoid flicker during redirect
  if (!isAuthPage && !isAuthenticated) return null;

  return <>{children}</>;
}