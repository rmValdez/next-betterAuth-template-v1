"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Card } from "@/shared/components/ui/Card";
import { Loader2, UserPlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const MIN_PASSWORD_LENGTH = 8; // Better Auth default on the backend

/**
 * Sign-up form. Every new account is created as a USER — roles are assigned
 * server-side, so there is no role picker. Sign-up also starts a session.
 */
export default function RegisterWorkflow({
  onCompleteRegistration,
}: {
  onCompleteRegistration: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { register, isRegistering } = useAuth();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await register({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
      });
      toast.success("Registration complete! Welcome aboard.");
      onCompleteRegistration();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Registration failed. Try again.",
      );
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border text-xs bg-transparent focus:outline-none focus:border-sky-500";
  const labelClass = "text-[10px] font-bold uppercase tracking-wider text-zinc-400";

  return (
    <div className="max-w-md w-full mx-auto p-4 text-left">
      <Card className="p-6">
        <div className="mb-4 text-center">
          <h2 className="text-lg font-black tracking-tight">
            Create Your NextTemplate Account
          </h2>
          <p className="text-xs text-zinc-400">It only takes a minute</p>
        </div>
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className={inputClass}
                style={{ borderColor: "var(--border-light)" }}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className={inputClass}
                style={{ borderColor: "var(--border-light)" }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={inputClass}
              style={{ borderColor: "var(--border-light)" }}
            />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              value={formData.password}
              onChange={handleInputChange}
              className={inputClass}
              style={{ borderColor: "var(--border-light)" }}
            />
            <p className="text-[10px] text-zinc-400">
              At least {MIN_PASSWORD_LENGTH} characters
            </p>
          </div>

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full py-2.5 mt-2 rounded-lg text-xs font-bold text-white bg-[var(--brand-core)] hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isRegistering ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                Create Account
              </>
            )}
          </button>

          <div className="pt-2 text-center text-xs text-[var(--text-tertiary)]">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[var(--brand-core)] hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
