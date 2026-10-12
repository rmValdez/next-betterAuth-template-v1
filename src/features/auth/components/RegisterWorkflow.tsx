"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Card } from "@/shared/components/ui/Card";
import { User, Code2, Loader2, UserPlus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import type { UserRole as ApiUserRole } from "../api/login.api";

type AuthStep = "ROLE_SELECT" | "FIELDS_FORM";
type RegisterRole = "user" | "developer";

export default function RegisterWorkflow({
  onCompleteRegistration,
}: {
  onCompleteRegistration: () => void;
}) {
  const [step, setStep] = useState<AuthStep>("ROLE_SELECT");
  const [role, setRole] = useState<RegisterRole>("user");
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

  const handleRoleSelect = (selectedRole: RegisterRole) => {
    setRole(selectedRole);
    setStep("FIELDS_FORM");
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await register(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        },
        role.toUpperCase() as ApiUserRole,
      );
      toast.success("Registration complete! Welcome aboard.");
      onCompleteRegistration();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Registration failed. Try again.",
      );
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-4 text-left">
      {step === "ROLE_SELECT" && (
        <Card className="p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-black tracking-tight">
              Create Your NextTemplate Account
            </h2>
            <p className="text-xs text-zinc-400">
              Select your workspace role to get started
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => handleRoleSelect("user")}
              className="flex items-center gap-4 p-4 border rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-left"
              style={{ borderColor: "var(--border-light)" }}
            >
              <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-500">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold">Standard User</div>
                <p className="text-[10px] text-zinc-400">
                  Standard account access to dashboards, profile, and workspaces.
                </p>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("developer")}
              className="flex items-center gap-4 p-4 border rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-left"
              style={{ borderColor: "var(--border-light)" }}
            >
              <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold">Developer Access</div>
                <p className="text-[10px] text-zinc-400">
                  Developer account with API sandbox access and system telemetry.
                </p>
              </div>
            </button>
          </div>
          <div className="pt-2 text-center text-xs text-[var(--text-tertiary)]">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[var(--brand-core)] hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      )}

      {step === "FIELDS_FORM" && (
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-base font-black">Account Details</h2>
            <p className="text-xs text-zinc-400">
              Registering account profile as a{" "}
              <span className="font-bold text-zinc-600 dark:text-zinc-300 capitalize">
                {role}
              </span>
            </p>
          </div>
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent focus:outline-none focus:border-sky-500"
                  style={{ borderColor: "var(--border-light)" }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent focus:outline-none focus:border-sky-500"
                  style={{ borderColor: "var(--border-light)" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent focus:outline-none focus:border-sky-500"
                style={{ borderColor: "var(--border-light)" }}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-lg border text-xs bg-transparent focus:outline-none focus:border-sky-500"
                style={{ borderColor: "var(--border-light)" }}
              />
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
                  Complete Registration
                </>
              )}
            </button>

            <div className="pt-2 text-center text-xs text-zinc-400">
              <button
                type="button"
                onClick={() => setStep("ROLE_SELECT")}
                className="hover:underline text-[11px]"
              >
                Back to role selection
              </button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
