"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  ChevronDown,
  Navigation,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is Izhaan Lifestyle?",
    answer:
      "Izhaan Lifestyle is a Bangladeshi fashion brand that offers stylish and premium panjabi collections for men. The brand focuses on combining traditional designs with modern fashion trends to create comfortable and elegant outfits for different occasions.",
  },
  {
    question: "What products does Izhaan Lifestyle offer?",
    answer:
      "Izhaan Lifestyle offers a wide variety of premium Panjabis, including our exclusive Signature Line, Core Classics, Smart Casuals, and festive royal editions crafted with fine embroidery and luxury combed cotton jacquard fabrics.",
  },
  {
    question: "Where can I buy Izhaan Lifestyle panjabi?",
    answer:
      "You can order directly from our official website with nationwide Cash on Delivery (COD) across all 64 districts in Bangladesh, or reach out to us on WhatsApp and Facebook Messenger for direct ordering assistance.",
  },
  {
    question: "What is the price range of Izhaan Lifestyle panjabi?",
    answer:
      "Our collection starts from ৳990 (limited flash sale offers) up to ৳2,950 for our luxury hand-embroidered royal panjabi editions. We ensure high-end craftsmanship at reasonable prices.",
  },
  {
    question: "How can I contact Izhaan Lifestyle?",
    answer:
      "You can call our direct customer care hotline at 01811-496175, email us at izhaanlifestyle@gmail.com, or message us directly via WhatsApp and Facebook Messenger for instant response.",
  },
];

import { submitContactMessage } from "@/actions/contact";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0); // First FAQ open by default like original site

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      toast.error("Please fill in your name, phone number, and message.");
      return;
    }

    setLoading(true);
    try {
      const res = await submitContactMessage({
        name,
        email: email.trim() || undefined,
        phone,
        company: company.trim() || undefined,
        message,
      });

      if (!res.success) {
        toast.error(res.error || "Failed to send message. Please check the fields.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      toast.success("Thank you! Your message has been sent to Izhaan Lifestyle.");
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Full-width Google Maps Section (Matching reference site) */}
      <div className="relative w-full bg-neutral-100 border-b border-neutral-200">
        <iframe
          src="https://maps.google.com/maps?q=Banani%20Road%2011%2C%20Dhaka%2C%20Bangladesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Izhaan Lifestyle Location Map"
          className="w-full h-[320px] sm:h-[400px] lg:h-[460px] block"
        />

        {/* Floating Location Card Overlay */}
        <div className="hidden sm:flex items-center gap-3 absolute bottom-4 left-6 bg-[#161616]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-sm shadow-xl border border-neutral-800 z-10 text-xs">
          <div className="w-8 h-8 rounded-full bg-[#c19b65]/20 text-[#c19b65] flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold tracking-wider uppercase text-neutral-100 flex items-center gap-1.5">
              <span>Izhaan Lifestyle</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-[#c19b65] text-black font-semibold rounded-xs">
                Banani, Dhaka
              </span>
            </div>
            <div className="text-[11px] text-neutral-400">
              Road 11, Banani, Dhaka-1213, Bangladesh
            </div>
          </div>
          <a
            href="https://maps.google.com/?q=Road+11+Banani+Dhaka+Bangladesh"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-[#c19b65] rounded-xs text-[11px] font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Directions</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrumbs items={[{ label: "Contact Us" }]} />

        {/* 2-Column Main Section (FAQ Accordion on Left, Contact Form on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 my-8">
          {/* Left Column: Frequently Asked Questions (Accordion) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#c19b65] uppercase tracking-widest block mb-1">
                Information Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 uppercase tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-neutral-500 mt-2">
                Find quick answers to our most common customer inquiries below.
              </p>
            </div>

            {/* Accordion List */}
            <div className="divide-y divide-neutral-200 border-y border-neutral-200">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className="py-4">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between text-left gap-4 group focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`text-sm sm:text-base font-medium transition-colors ${
                          isOpen ? "text-[#c19b65] font-semibold" : "text-neutral-900 group-hover:text-[#c19b65]"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-neutral-500 transition-transform duration-200 flex-shrink-0 ${
                          isOpen ? "rotate-180 text-[#c19b65]" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed pr-4 animate-in fade-in-50 duration-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct Contact Summary */}
            <div className="pt-2 p-5 bg-neutral-50 border border-neutral-200/80 rounded-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block">
                Still have questions?
              </span>
              <p className="text-xs text-neutral-500">
                Our support team is available everyday from 10:00 AM to 10:00 PM to help with sizing, custom requirements, and fast parcel tracking.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="tel:01811496175"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-xs text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c19b65]" />
                  <span>01811-496175</span>
                </a>
                <a
                  href="https://wa.me/8801811496175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366]/15 text-[#1b873f] border border-[#25D366]/40 rounded-xs text-xs font-semibold hover:bg-[#25D366]/25 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-6">
            <div className="border border-neutral-200 rounded-xs p-6 sm:p-8 bg-white shadow-xs">
              <span className="text-xs font-bold text-[#c19b65] uppercase tracking-widest block mb-1">
                Information About Us
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 uppercase tracking-tight mb-2">
                Contact Us For Any Questions
              </h2>
              <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
                Feel free to contact us with your inquiry. We typically respond within a few hours.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-3 bg-neutral-50 rounded-xs border border-neutral-200/80">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-neutral-900">Message Sent Successfully!</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    We have received your message and our team will get in touch with you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="mt-4 inline-block bg-[#161616] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-black transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                        Your Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                        Company
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Company name (optional)"
                        className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-700 mb-1.5">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your inquiry or question here..."
                      className="w-full px-3.5 py-2.5 text-xs border border-neutral-300 rounded-xs focus:outline-none focus:border-neutral-900 transition-colors resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-[#161616] hover:bg-black text-white py-3 px-8 text-xs font-bold uppercase tracking-widest rounded-xs flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <span>Ask a Question</span>
                        <Send className="w-3.5 h-3.5 text-[#c19b65]" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Feature Support Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-neutral-200">
          <div className="flex items-start gap-3.5 p-4 border border-neutral-200 rounded-xs bg-neutral-50/60">
            <div className="w-10 h-10 rounded-full bg-[#161616] text-[#c19b65] flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Hotline Care
              </h4>
              <p className="text-xs text-neutral-700 font-semibold mt-0.5">01811-496175</p>
              <p className="text-[11px] text-neutral-400">Everyday 10am - 10pm</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 border border-neutral-200 rounded-xs bg-neutral-50/60">
            <div className="w-10 h-10 rounded-full bg-[#161616] text-[#c19b65] flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Official Email
              </h4>
              <p className="text-xs text-neutral-700 font-semibold mt-0.5">izhaanlifestyle@gmail.com</p>
              <p className="text-[11px] text-neutral-400">Response in 24 hours</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 border border-neutral-200 rounded-xs bg-neutral-50/60">
            <div className="w-10 h-10 rounded-full bg-[#161616] text-[#c19b65] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Showroom & Hub
              </h4>
              <p className="text-xs text-neutral-700 font-semibold mt-0.5">Dhaka, Bangladesh</p>
              <p className="text-[11px] text-neutral-400">Nationwide 64 districts</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 border border-neutral-200 rounded-xs bg-neutral-50/60">
            <div className="w-10 h-10 rounded-full bg-[#161616] text-[#c19b65] flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Fast Delivery
              </h4>
              <p className="text-xs text-neutral-700 font-semibold mt-0.5">2-3 Days Delivery</p>
              <p className="text-[11px] text-neutral-400">Cash on Delivery available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
