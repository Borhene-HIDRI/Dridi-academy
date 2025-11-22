"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function AuthGuard({
  children,
  role
}: {
  children: React.ReactNode;
  role?: string; // "Admin" or "User"
}) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (role && user?.role !== role) {
      router.push("/");
      return;
    }

    setAllowed(true);
  }, [isAuthenticated, user, role, router]);

  if (!allowed) {
    return (
      <div className="text-white text-center py-20">
        Checking permissions...
      </div>
    );
  }

  return <>{children}</>;
}
