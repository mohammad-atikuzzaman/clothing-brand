"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  User,
  Lock,
  Mail,
  Phone,
  Package,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  loginAction,
  registerAction,
  logoutAction,
} from "@/actions/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { getMyOrdersAction, SerializedOrder } from "@/actions/order";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function MyAccountPage() {
  const router = useRouter();
  const { user: currentUser, fetchUser, setUser, clearUser } = useAuthStore();
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [portalTab, setPortalTab] = useState<"orders" | "profile">("orders");
  const [orders, setOrders] = useState<SerializedOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const checkAuth = async () => {
    setInitialLoading(true);
    try {
      const user = await fetchUser();
      if (user) {
        loadOrders();
      }
    } catch {
      // ignore
    } finally {
      setInitialLoading(false);
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const myOrders = await getMyOrdersAction();
      setOrders(myOrders);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    if (!loginEmail || !loginPassword) {
      setErrorText("Please enter both email and password.");
      return;
    }

    setFormSubmitting(true);
    const toastId = toast.loading("Authenticating...");

    try {
      const res = await loginAction({ email: loginEmail, password: loginPassword });
      if (!res.success || !res.user) {
        setErrorText(res.message || "Invalid credentials.");
        toast.error(res.message || "Login failed", { id: toastId });
        return;
      }

      toast.success(`Welcome back, ${res.user.name}!`, { id: toastId });
      setUser(res.user);
      loadOrders();
      router.refresh();
    } catch (err: any) {
      setErrorText(err.message || "Login failed.");
      toast.error("Network or security error", { id: toastId });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");
    if (!regName || !regEmail || !regPassword) {
      setErrorText("Please fill in all required fields.");
      return;
    }

    setFormSubmitting(true);
    const toastId = toast.loading("Creating your account...");

    try {
      const res = await registerAction({
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      });

      if (!res.success || !res.user) {
        setErrorText(res.message || "Registration failed.");
        toast.error(res.message || "Could not register", { id: toastId });
        return;
      }

      toast.success(`Welcome, ${res.user.name}! Your account has been created.`, { id: toastId });
      setUser(res.user);
      loadOrders();
      router.refresh();
    } catch (err: any) {
      setErrorText(err.message || "Registration failed.");
      toast.error("Network or security error", { id: toastId });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleLogout = async () => {
    const toastId = toast.loading("Signing out...");
    try {
      await logoutAction();
      toast.success("Successfully signed out.", { id: toastId });
      clearUser();
      setOrders([]);
      router.refresh();
    } catch (err: any) {
      toast.error("Sign out error", { id: toastId });
    }
  };

  if (initialLoading) {
    return (
      <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#c19b65] animate-spin mb-3" />
        <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold">
          Verifying security credentials...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfbf9] min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#161616] text-white py-12 sm:py-16 border-b border-neutral-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs font-bold text-[#c19b65] uppercase tracking-[0.25em] block mb-1">
            {currentUser ? "Client Dashboard" : "Customer Portal"}
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold uppercase tracking-wider">
            {currentUser ? `Welcome, ${currentUser.name}` : "My Account"}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "My Account" }]} />

        {/* LOGGED IN VIEW */}
        {currentUser ? (
          <div className="mt-8 space-y-8">
            {/* User Overview Bar */}
            <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#161616] to-neutral-800 text-[#c19b65] flex items-center justify-center font-serif text-xl font-bold border border-[#c19b65]/30 shadow-sm">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-neutral-900">{currentUser.name}</h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        currentUser.role === "admin"
                          ? "bg-amber-500/10 text-amber-700 border border-amber-500/30"
                          : "bg-emerald-500/10 text-emerald-700 border border-emerald-500/30"
                      }`}
                    >
                      {currentUser.role === "admin" ? "Store Administrator" : "Verified Customer"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">{currentUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100">
                {currentUser.role === "admin" && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-black text-[#c19b65] text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Console</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-200/60"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Portal Tab Navigation */}
            <div className="flex border-b border-neutral-200 text-xs font-bold uppercase tracking-wider gap-8">
              <button
                onClick={() => setPortalTab("orders")}
                className={`pb-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                  portalTab === "orders"
                    ? "border-[#c19b65] text-neutral-900"
                    : "border-transparent text-neutral-400 hover:text-neutral-700"
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Orders ({orders.length})</span>
              </button>
              <button
                onClick={() => setPortalTab("profile")}
                className={`pb-3 border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                  portalTab === "profile"
                    ? "border-[#c19b65] text-neutral-900"
                    : "border-transparent text-neutral-400 hover:text-neutral-700"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile & Security</span>
              </button>
            </div>

            {/* Tab: Orders */}
            {portalTab === "orders" && (
              <div className="space-y-4">
                {ordersLoading ? (
                  <div className="p-12 text-center text-neutral-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#c19b65]" />
                    <span className="text-xs">Fetching your order history...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
                    <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-neutral-800">No orders placed yet</h3>
                    <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                      Explore our handcrafted signature Panjabi and menswear collections.
                    </p>
                    <Link
                      href="/shop"
                      className="mt-5 inline-block px-5 py-2.5 rounded-lg bg-[#c19b65] hover:bg-[#d5ad74] text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs hover:border-[#c19b65]/50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                          <div>
                            <span className="text-xs font-mono font-bold text-[#c19b65]">
                              {order.orderId}
                            </span>
                            <span className="text-xs text-neutral-400 ml-3">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider self-start sm:self-auto ${
                              order.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : order.status === "Shipped"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : order.status === "Cancelled"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="py-3 space-y-2">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-xs">
                              <div className="relative w-10 h-12 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={it.image}
                                  alt={it.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                  unoptimized
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold text-neutral-800 block truncate">
                                  {it.name}
                                </span>
                                <span className="text-[11px] text-neutral-500">
                                  Size: {it.selectedSize} × {it.quantity}
                                </span>
                              </div>
                              <span className="font-bold text-neutral-900">
                                ৳{(it.price * it.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Total Footer */}
                        <div className="border-t border-neutral-100 pt-3 flex items-center justify-between text-xs">
                          <span className="text-neutral-500">
                            Total ({order.items.length} {order.items.length === 1 ? "item" : "items"})
                          </span>
                          <span className="text-sm font-bold text-neutral-900">
                            ৳{order.total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Profile */}
            {portalTab === "profile" && (
              <div className="bg-white border border-neutral-200/80 rounded-xl p-6 sm:p-8 shadow-xs max-w-xl">
                <h3 className="text-base font-serif font-bold text-neutral-900 uppercase tracking-wide mb-4">
                  Account Details
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                      Full Name
                    </label>
                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-medium">
                      {currentUser.name}
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                      Email Address
                    </label>
                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-medium">
                      {currentUser.email}
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                      Phone Number
                    </label>
                    <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-medium">
                      {currentUser.phone || "Not provided"}
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-400 font-bold uppercase tracking-wider block mb-1">
                      Security Level & Permissions
                    </label>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Encrypted session active. Role: {currentUser.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* GUEST VIEW: LOGIN OR REGISTER */
          <div>
            {/* Navigation Tabs */}
            <div className="flex border-b border-neutral-200 mt-6 justify-center text-xs font-bold uppercase tracking-wider gap-8">
              <button
                onClick={() => {
                  setActiveTab("login");
                  setErrorText("");
                }}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === "login"
                    ? "border-[#c19b65] text-neutral-900"
                    : "border-transparent text-neutral-400 hover:text-neutral-700"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab("register");
                  setErrorText("");
                }}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
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
              {errorText && (
                <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-600 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorText}</span>
                </div>
              )}

              {activeTab === "login" && (
                <div className="border border-neutral-200/80 rounded-xl p-6 sm:p-8 bg-white shadow-xs">
                  <h3 className="text-base font-serif font-bold text-neutral-900 uppercase tracking-wide mb-1">
                    Welcome Back
                  </h3>
                  <p className="text-xs text-neutral-500 mb-6">
                    Sign in to view your order history and manage your delivery address.
                  </p>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="client@izhaan.com"
                          className="w-full pl-10 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:border-neutral-900 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:border-neutral-900 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full py-3 rounded-lg bg-[#161616] hover:bg-black text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {formSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#c19b65]" />
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "register" && (
                <div className="border border-neutral-200/80 rounded-xl p-6 sm:p-8 bg-white shadow-xs">
                  <h3 className="text-base font-serif font-bold text-neutral-900 uppercase tracking-wide mb-1">
                    Create Izhaan Account
                  </h3>
                  <p className="text-xs text-neutral-500 mb-6">
                    Join to track orders, save your delivery addresses, and receive private previews.
                  </p>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full pl-10 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:border-neutral-900 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="yourname@gmail.com"
                          className="w-full pl-10 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:border-neutral-900 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="017XXXXXXXX"
                          className="w-full pl-10 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:border-neutral-900 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Password (Min 8 chars, letters & numbers) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:border-neutral-900 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full py-3 rounded-lg bg-[#c19b65] hover:bg-[#d5ad74] text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      {formSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
