"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/features/auth/components/LoginForm";
import type { LoginRole } from "@/features/auth/types";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (role: LoginRole) => {
    if (role === "admin" || role === "super_admin") {
      router.push("/admin");
      return;
    }
    if (role === "developer") {
      router.push("/developer");
      return;
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[var(--background-primary)]">
      <div className="text-center space-y-1 mb-6">
        <div className="text-xl font-black tracking-tight">
          Next<span className="text-[var(--brand-core)]">Template</span>
        </div>
      </div>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}
