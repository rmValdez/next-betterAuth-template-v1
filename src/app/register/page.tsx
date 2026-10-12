"use client";

import React from "react";
import RegisterWorkflow from "@/features/auth/components/RegisterWorkflow";
import { useRouter } from "next/navigation";

export default function RegisterEntryRoot() {
  const router = useRouter();

  const handleRegisterSuccess = () => {
    router.push("/login");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center transition-colors"
      style={{ backgroundColor: "var(--background-secondary)" }}
    >
      <RegisterWorkflow onCompleteRegistration={handleRegisterSuccess} />
    </div>
  );
}
