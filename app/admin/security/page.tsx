"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Ban,
  Unlock,
  AlertTriangle,
  RefreshCw,
  Plus,
  Clock,
  Activity,
  History,
  CheckCircle2,
} from "lucide-react";
import {
  getBlockedIpsAction,
  unblockIpAction,
  manuallyBlockIpAction,
  getSecurityLogsAction,
  BlockedIpItem,
  SecurityLogItem,
} from "@/actions/security";
import { toast } from "sonner";

export default function AdminSecurityPage() {
  const [blockedIps, setBlockedIps] = useState<BlockedIpItem[]>([]);
  const [logs, setLogs] = useState<SecurityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"blocked" | "logs">("blocked");

  // Manual block modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetIp, setTargetIp] = useState("");
  const [reason, setReason] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [isPermanent, setIsPermanent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ipsRes, logsRes] = await Promise.all([
        getBlockedIpsAction(),
        getSecurityLogsAction(50),
      ]);

      if (ipsRes.success) setBlockedIps(ipsRes.data);
      if (logsRes.success) setLogs(logsRes.data);
    } catch (err: any) {
      toast.error("Failed to load security status: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUnblock = async (ip: string) => {
    const toastId = toast.loading(`Unblocking IP ${ip}...`);
    try {
      const res = await unblockIpAction(ip);
      if (res.success) {
        toast.success(`IP ${ip} successfully unblocked`, { id: toastId });
        loadData();
      } else {
        toast.error(res.error || "Failed to unblock", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleManualBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetIp || !reason) {
      toast.error("Please provide both IP and Reason.");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(`Blocking IP ${targetIp}...`);

    try {
      const res = await manuallyBlockIpAction({
        ip: targetIp,
        reason,
        durationMinutes: isPermanent ? undefined : durationMinutes,
        isPermanent,
      });

      if (res.success) {
        toast.success(`IP ${targetIp} has been restricted`, { id: toastId });
        setIsModalOpen(false);
        setTargetIp("");
        setReason("");
        loadData();
      } else {
        toast.error(res.error || "Failed to block IP", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-white max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c19b65]">
              Security & Defense
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Firewall Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            IP Access Control & Security Logs
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Automated brute-force mitigation, IP blacklists, and real-time security telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-neutral-700/50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#c19b65]" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#c19b65] hover:bg-[#d5ad74] text-neutral-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-[#c19b65]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Ban IP Address</span>
          </button>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#161a26] border border-neutral-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
            <Ban className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-neutral-400 font-medium block">Currently Blocked IPs</span>
            <span className="text-2xl font-bold text-white tracking-tight">
              {blockedIps.length}
            </span>
          </div>
        </div>

        <div className="bg-[#161a26] border border-neutral-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-neutral-400 font-medium block">Recent Threat Events</span>
            <span className="text-2xl font-bold text-white tracking-tight">
              {logs.filter((l) => l.eventType.includes("fail") || l.eventType.includes("ban")).length}
            </span>
          </div>
        </div>

        <div className="bg-[#161a26] border border-neutral-800 p-5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-neutral-400 font-medium block">Protection Layer</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" />
              Sliding Window + DB Lock
            </span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-neutral-800 text-xs font-semibold uppercase tracking-wider gap-6">
        <button
          onClick={() => setActiveTab("blocked")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "blocked"
              ? "border-[#c19b65] text-[#c19b65]"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <Ban className="w-4 h-4" />
          <span>Restricted IP Addresses ({blockedIps.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === "logs"
              ? "border-[#c19b65] text-[#c19b65]"
              : "border-transparent text-neutral-400 hover:text-white"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Security Audit Log ({logs.length})</span>
        </button>
      </div>

      {/* Tab 1: Blocked IPs Table */}
      {activeTab === "blocked" && (
        <div className="bg-[#161a26] border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
          {blockedIps.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">
              <ShieldCheck className="w-12 h-12 text-emerald-500/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-neutral-300">No active IP bans</p>
              <p className="text-xs text-neutral-500 mt-1">
                Your application network is secure. All incoming traffic is within normal thresholds.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Failed Attempts</th>
                    <th className="py-3 px-4">Expires</th>
                    <th className="py-3 px-4">Banned By</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {blockedIps.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#c19b65]">
                        {item.ip}
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        {item.reason}
                      </td>
                      <td className="py-3 px-4 text-neutral-400">
                        {item.failedAttempts} attempts
                      </td>
                      <td className="py-3 px-4">
                        {item.isPermanent ? (
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px]">
                            Permanent
                          </span>
                        ) : item.bannedUntil ? (
                          <span className="text-neutral-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            {new Date(item.bannedUntil).toLocaleTimeString()} (
                            {new Date(item.bannedUntil).toLocaleDateString()})
                          </span>
                        ) : (
                          "Expired"
                        )}
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[11px]">
                        {item.bannedBy}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleUnblock(item.ip)}
                          className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-colors flex items-center gap-1.5 ml-auto border border-neutral-700/50"
                        >
                          <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Unblock</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Security Logs Stream */}
      {activeTab === "logs" && (
        <div className="bg-[#161a26] border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">
              <Activity className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm">No security audit logs recorded yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4">Origin IP</th>
                    <th className="py-3 px-4">Target / Email</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {logs.map((log) => {
                    const isFailure = log.eventType.includes("fail") || log.eventType.includes("ban");
                    return (
                      <tr key={log.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isFailure
                                ? "bg-red-500/15 text-red-400 border border-red-500/30"
                                : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            }`}
                          >
                            {log.eventType.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-neutral-300">
                          {log.ip}
                        </td>
                        <td className="py-3 px-4 text-neutral-300">
                          {log.email || "-"}
                        </td>
                        <td className="py-3 px-4 text-neutral-400 max-w-xs truncate" title={log.details}>
                          {log.details}
                        </td>
                        <td className="py-3 px-4 text-right text-neutral-400 text-[11px] whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Manual IP Ban Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#161a26] border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in-50 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Block IP Address</h3>
                <p className="text-xs text-neutral-400">Restrict access to all store endpoints</p>
              </div>
            </div>

            <form onSubmit={handleManualBlock} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  IPv4 or IPv6 Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={targetIp}
                  onChange={(e) => setTargetIp(e.target.value)}
                  placeholder="e.g. 192.168.1.100"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-xl focus:outline-none focus:border-[#c19b65] font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  Reason for restriction <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Automated scraper / Brute force attack"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-xl focus:outline-none focus:border-[#c19b65]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  disabled={isPermanent}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  min={1}
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-xl focus:outline-none focus:border-[#c19b65] disabled:opacity-40"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="permanent"
                  checked={isPermanent}
                  onChange={(e) => setIsPermanent(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-[#c19b65] focus:ring-[#c19b65]"
                />
                <label htmlFor="permanent" className="text-neutral-300 font-medium cursor-pointer">
                  Permanent Restriction (Indefinite blacklist)
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
                >
                  {submitting ? "Applying..." : "Enforce Ban"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
