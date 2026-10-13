"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[var(--background-primary)]">
      <div className="text-center space-y-1 mb-6">
        <div className="text-xl font-black tracking-tight">
          Next<span className="text-[var(--brand-core)]">Template</span>
        </div>
      </div>
      <LoginForm onLoginSuccess={() => router.push("/dashboard")} />
    </div>
  );
}
