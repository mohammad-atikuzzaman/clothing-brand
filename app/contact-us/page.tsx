"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      toast.error("Please fill in your name, phone number, and message.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Thank you! Your message has been sent to Izhaan Lifestyle.");
    }, 600);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#161616] text-white py-14 sm:py-20 border-b border-neutral-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[11px] font-bold text-[#c19b65] uppercase tracking-[0.25em] block mb-2">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold uppercase tracking-wider">
            Contact Izhaan Lifestyle
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-3 max-w-xl mx-auto leading-relaxed">
            Have questions regarding sizing, custom orders, or parcel tracking? We are here to assist you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[{ label: "Contact Us" }]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 my-8">
          {/* Contact Details Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#c19b65] uppercase tracking-widest block mb-1">
                Direct Communication
              </span>
              <h2 className="text-2xl font-serif font-bold text-neutral-900 uppercase">
                We are Here for You
              </h2>
              <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Reach out directly to our dedicated customer support team via phone, email, or instant WhatsApp messaging.
              </p>
            </div>

            <div className="space-y-4">
              {/* Phone Card */}
              <div className="flex items-start gap-4 p-4 border border-neutral-200 rounded-xs bg-neutral-50/50">
                <div className="w-10 h-10 rounded-full bg-[#161616] text-[#c19b65] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Phone / Hotline
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">01811-496175</p>
                  <p className="text-[11px] text-neutral-400">Direct hotline support</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex items-start gap-4 p-4 border border-neutral-200 rounded-xs bg-neutral-50/50">
                <div className="w-10 h-10 rounded-full bg-[#161616] text-[#c19b65] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Email Address
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">izhaanlifestyle@gmail.com</p>
                  <p className="text-[11px] text-neutral-400">Response within 24 hours</p>
                </div>
              </div>

              {/* Location Card */}
              <div className="flex items-start gap-4 p-4 border border-neutral-200 rounded-xs bg-neutral-50/50">
                <div className="w-10 h-10 rounded-full bg-[#161616] text-[#c19b65] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Office & Showroom
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">Dhaka, Bangladesh</p>
                  <p className="text-[11px] text-neutral-400">Serving all 64 districts</p>
                </div>
              </div>

              {/* Hours Card */}
              <div className="flex items-start gap-4 p-4 border border-neutral-200 rounded-xs bg-neutral-50/50">
                <div className="w-10 h-10 rounded-full bg-[#161616] text-[#c19b65] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Customer Care Hours
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">10:00 AM – 10:00 PM (Daily)</p>
                  <p className="text-[11px] text-neutral-400">Including Friday & Saturday</p>
                </div>
              </div>
            </div>

            {/* Quick Instant Messaging */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/8801811496175"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xs text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
              <a
                href="https://m.me/izhaanclothing"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#0084FF] hover:bg-[#0074E0] text-white py-3 px-4 rounded-xs text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Messenger</span>
              </a>
            </div>
          </div>

          {/* Contact Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="border border-neutral-200 rounded-xs p-6 sm:p-8 bg-white shadow-xs">
              <h3 className="text-lg font-serif font-bold text-neutral-900 uppercase tracking-wide mb-1">
                Send Us a Message
              </h3>
              <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
                Fill out the form below with your inquiry, and our support team will get back to you promptly.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-3 bg-neutral-50 rounded-xs border border-neutral-200/80">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-neutral-900">Message Sent Successfully!</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    We have received your message and will respond to you shortly via phone or email.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="mt-4 inline-block bg-[#161616] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Asif Mahmud"
                        className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Product inquiry, sizing, or order"
                        className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here..."
                      className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#161616] hover:bg-black text-white py-3.5 px-6 text-xs font-bold uppercase tracking-widest rounded-xs flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Submit Message</span>
                        <Send className="w-3.5 h-3.5 text-[#c19b65]" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
