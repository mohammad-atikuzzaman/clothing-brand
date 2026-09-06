"use client";

import React, { useState } from "react";
import { X, Lock, Mail, User, CheckCircle2 } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { toast } from "sonner";

export const AuthModal: React.FC = () => {
  const { isAuthOpen, closeAuth, authDefaultTab } = useUIStore();
  const [tab, setTab] = useState<"login" | "register">(authDefaultTab || "login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync tab with defaultTab when modal opens
  React.useEffect(() => {
    if (authDefaultTab) {
      setTab(authDefaultTab);
    }
  }, [authDefaultTab]);

  if (!isAuthOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Successfully logged in to Izhaan Lifestyle!");
      closeAuth();
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Account created successfully! Welcome to Izhaan.");
      closeAuth();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={closeAuth}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white text-neutral-900 rounded-sm shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#161616] text-white border-b border-neutral-800">
          <div>
            <span className="text-xl font-serif font-bold tracking-[0.2em] block">
              IZHAAN
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#c19b65]">
              Customer Portal
            </span>
          </div>
          <button
            onClick={closeAuth}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-200 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              tab === "login"
                ? "border-[#c19b65] text-neutral-900 bg-neutral-50/50"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              tab === "register"
                ? "border-[#c19b65] text-neutral-900 bg-neutral-50/50"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1">
                  Email / Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded-xs accent-neutral-900" />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => toast.info("Password reset instructions sent to your email.")}
                  className="text-neutral-700 hover:text-[#c19b65] underline"
                >
                  Lost password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#161616] text-white py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#c19b65] hover:text-black transition-colors rounded-xs mt-2 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Log In"}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-neutral-500">
                  No account yet?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("register")}
                    className="text-[#c19b65] font-semibold hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1">
                  Mobile Number (Bangladesh)
                </label>
                <input
                  type="tel"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 uppercase tracking-wider mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xs focus:border-neutral-900 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 text-[11px] text-neutral-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  Your personal data will be used to support your experience throughout this website.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#161616] text-white py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#c19b65] hover:text-black transition-colors rounded-xs mt-2 disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register Now"}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-neutral-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    className="text-[#c19b65] font-semibold hover:underline"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
