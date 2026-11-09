import React from "react";
import { Sparkles, Truck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <aside
      aria-label="Announcement"
      className="bg-brand-900 text-brand-100 text-xs py-2 px-4 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Truck className="w-3.5 h-3.5 text-brand-400" aria-hidden="true" />
          <span>
            Fresh batches prepared daily. Free delivery on orders above ₹500. Cash on Delivery available across India.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-brand-300">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" aria-hidden="true" />
          <span>100% Homemade, No Industrial Preservatives</span>
        </div>
      </div>
    </aside>
  );
}
