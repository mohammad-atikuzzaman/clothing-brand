"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { User, Lock, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please enter email and password.");
      return;
    }
    toast.success("Successfully logged into Izhaan account!");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success("Account registered successfully! Welcome to Izhaan.");
    setActiveTab("login");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#161616] text-white py-12 sm:py-16 border-b border-neutral-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-[#c19b65] uppercase tracking-[0.25em] block mb-1">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold uppercase tracking-wider">
            My Account
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "My Account" }]} />

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 mt-6 justify-center text-xs font-bold uppercase tracking-wider gap-8">
          <button
            onClick={() => setActiveTab("login")}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === "login"
                ? "border-[#c19b65] text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === "register"
                ? "border-[#c19b65] text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Tab Contents */}
        <div className="max-w-md mx-auto py-10">
          {activeTab === "login" && (
            <div className="border border-neutral-200 rounded-xs p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-base font-serif font-bold text-neutral-900 uppercase tracking-wide mb-1">
                Welcome Back
              </h3>
              <p className="text-xs text-neutral-500 mb-6">
                Sign in to view your order history and manage your delivery address.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
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
                      className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
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
                      className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="rounded-xs accent-neutral-900" />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toast.info("Password reset instructions sent.")}
                    className="hover:underline text-neutral-700"
                  >
                    Lost password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#161616] hover:bg-black text-white py-3 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                >
                  Sign In
                </button>
              </form>
            </div>
          )}

          {activeTab === "register" && (
            <div className="border border-neutral-200 rounded-xs p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-base font-serif font-bold text-neutral-900 uppercase tracking-wide mb-1">
                Create Account
              </h3>
              <p className="text-xs text-neutral-500 mb-6">
                Register to track your Panjabi orders and get exclusive festive deals.
              </p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#161616] hover:bg-black text-white py-3 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                >
                  Create Account
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
