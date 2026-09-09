"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Lock, Mail, AlertTriangle, Loader2, ArrowRight } from "lucide-react";
import { loginAction } from "@/actions/auth";
import { toast } from "sonner";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    errorParam === "forbidden"
      ? "Access Denied: You must sign in with an Administrator account."
      : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both administrative email and password.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Verifying administrative credentials...");

    try {
      const res = await loginAction({ email, password });

      if (!res.success || !res.user) {
        setErrorMessage(res.message || "Invalid administrative credentials.");
        toast.error(res.message || "Login failed", { id: toastId });
        return;
      }

      if (res.user.role !== "admin") {
        setErrorMessage("Forbidden: Your account does not have administrator privileges.");
        toast.error("Access forbidden. Admin role required.", { id: toastId });
        return;
      }

      toast.success(`Welcome back, ${res.user.name}!`, { id: toastId });
      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "A security error occurred. Please try again.");
      toast.error("Connection or security error.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f15] flex flex-col justify-center items-center p-4 relative overflow-hidden text-neutral-200 selection:bg-[#c19b65] selection:text-black">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#c19b65]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-md bg-[#161a26] border border-neutral-800/80 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
        {/* Header Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-700/60 flex items-center justify-center mb-4 text-[#c19b65] shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c19b65] block mb-1">
            Secure Access Gateway
          </span>
          <h1 className="text-2xl font-serif font-bold text-white tracking-wider">
            IZHAAN ADMIN
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Enterprise Command Center & Store Management
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-400 animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@izhaan.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/90 border border-neutral-800 text-white rounded-xl focus:outline-none focus:border-[#c19b65] focus:ring-1 focus:ring-[#c19b65] transition-all text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-900/90 border border-neutral-800 text-white rounded-xl focus:outline-none focus:border-[#c19b65] focus:ring-1 focus:ring-[#c19b65] transition-all text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#c19b65] hover:bg-[#d5ad74] text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#c19b65]/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Footer Notice */}
        <div className="mt-8 pt-4 border-t border-neutral-800/60 text-center">
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            Protected with brute-force lockout, encrypted JWT sessions, and IP security.
            Unauthorized access attempts are monitored and recorded.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d0f15] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#c19b65] animate-spin" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
