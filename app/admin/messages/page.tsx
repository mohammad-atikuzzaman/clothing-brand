"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Phone,
  MessageCircle,
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
  Search,
} from "lucide-react";
import { useAdminStore, ContactMessage } from "@/store/useAdminStore";
import { toast } from "sonner";

export default function AdminMessagesPage() {
  const { messages, updateMessageStatus, deleteMessage } = useAdminStore();
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMessages = messages.filter((m) => {
    const matchesFilter = filter === "All" ? true : m.status === filter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      m.message.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const handleStatus = (id: string, status: ContactMessage["status"]) => {
    updateMessageStatus(id, status);
    toast.success(`Message marked as ${status}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this inquiry?")) {
      deleteMessage(id);
      toast.success("Inquiry removed.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider font-serif">
            Customer Inquiries & Messages
          </h2>
          <p className="text-xs text-neutral-400">
            Messages received via the public Contact Us form.
          </p>
        </div>

        <div className="text-xs text-neutral-400">
          Showing <span className="font-bold text-white">{filteredMessages.length}</span> of{" "}
          <span className="font-bold text-white">{messages.length}</span> messages
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#131722] p-4 rounded-xl border border-neutral-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {["All", "Unread", "Replied", "Archived"].map((tab) => {
              const count =
                tab === "All"
                  ? messages.length
                  : messages.filter((m) => m.status === tab).length;

              const isSelected = filter === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#c19b65] text-black font-semibold shadow-xs"
                      : "bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800"
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? "bg-black/20 text-black font-bold"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, phone, or question..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-900/80 border border-neutral-800 text-xs text-white rounded-lg focus:outline-none focus:border-[#c19b65] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="bg-[#131722] rounded-xl border border-neutral-800/80 p-12 text-center text-neutral-500 text-xs">
            No customer inquiries found for this filter.
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 rounded-xl border transition-all ${
                msg.status === "Unread"
                  ? "bg-[#161a26] border-[#c19b65]/40 shadow-sm"
                  : "bg-[#131722] border-neutral-800/80 opacity-90"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800/70">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-[#c19b65] font-bold text-xs">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {msg.name}
                      </span>
                      {msg.company && (
                        <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                          {msg.company}
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          msg.status === "Unread"
                            ? "bg-[#c19b65]/20 text-[#c19b65]"
                            : msg.status === "Replied"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-neutral-800 text-neutral-400"
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500">
                      {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Direct Action Connectors */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <a
                    href={`tel:${msg.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#c19b65]" />
                    <span>Call {msg.phone}</span>
                  </a>

                  <a
                    href={`https://wa.me/88${msg.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  {msg.email && (
                    <a
                      href={`mailto:${msg.email}`}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                      title={`Email ${msg.email}`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Message Body */}
              <div className="pt-3 text-xs text-neutral-200 leading-relaxed">
                <p>{msg.message}</p>
              </div>

              {/* Status toggles & Delete */}
              <div className="pt-3 mt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {msg.status !== "Replied" && (
                    <button
                      onClick={() => handleStatus(msg.id, "Replied")}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:underline"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark as Replied</span>
                    </button>
                  )}
                  {msg.status !== "Unread" && (
                    <button
                      onClick={() => handleStatus(msg.id, "Unread")}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#c19b65] hover:underline"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Mark as Unread</span>
                    </button>
                  )}
                  {msg.status !== "Archived" && (
                    <button
                      onClick={() => handleStatus(msg.id, "Archived")}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400 hover:underline"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archive</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
