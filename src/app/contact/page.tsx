import React from "react";
import { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact Us & Kitchen Support | SnackCart",
  description:
    "Get in touch with SnackCart: customer support phone, dispatch inquiries, kitchen location in Bengaluru, and email.",
};

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Contact Customer Care
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Have a question about your order, delivery timeline, or bulk festive orders? We are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Information Cards */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-lg border border-stone-200 p-5 shadow-sm space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="text-stone-900 font-semibold block">Telephone Support</strong>
                <a href="tel:+919876543210" className="text-brand-700 font-medium hover:underline">
                  +91 98765 43210
                </a>
                <span className="text-stone-400 block text-[11px] mt-0.5">
                  Monday to Saturday: 9:00 AM - 6:00 PM IST
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-5 shadow-sm space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="text-stone-900 font-semibold block">Email Support</strong>
                <a href="mailto:support@snackcart.local" className="text-brand-700 font-medium hover:underline">
                  support@snackcart.local
                </a>
                <span className="text-stone-400 block text-[11px] mt-0.5">
                  Typical response within 24 business hours
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 p-5 shadow-sm space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="text-stone-900 font-semibold block">Kitchen & Packaging Facility</strong>
                <address className="not-italic text-stone-600 leading-relaxed mt-0.5">
                  SnackCart Kitchens, 42/1 12th Main Road, Indiranagar, Bengaluru, Karnataka 560038, India
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white rounded-lg border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600" aria-hidden="true" />
            Send us a Message
          </h2>

          <form className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Your Name" required placeholder="e.g. Anjali Sharma" />
              <Input label="Phone Number" required placeholder="e.g. 9876543210" />
            </div>

            <Input label="Email Address" type="email" required placeholder="name@example.com" />

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Your Inquiry or Message
              </label>
              <textarea
                rows={4}
                required
                placeholder="Please describe your query or reference an order number..."
                className="w-full text-xs p-2.5 rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <Button type="button" size="md">
              Submit Inquiry
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

