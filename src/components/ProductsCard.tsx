"use client";

import { formatPrice } from "@/lib/helpers/universal-functions";
import { Badge } from "./ui/badge";
import { CircleCheckBig, Heart, MapPin } from "lucide-react"; // Added Heart & MapPin
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { toastError } from "./toasts/toasts";
import { BackendResponseType } from "@/lib/interfaces";
import { IoMdHeart } from "react-icons/io";
import { useState } from "react";

interface CardProps {
  id: string;
  adsId?: string;
  firstImageUrl: string;
  price: number | string;
  title: string;
  location: string;
  condition: string;
  description?: string;
  createdAt: string;
  isVerifiedStore: string;
}

enum VerificationStatus {
  "Not Verified" = "Not Verified",
  "Verified" = "Verified",
}

const getConditionColor = (condition: string) => {
  const normalized = condition.toLowerCase();
  if (normalized.includes("new"))
    return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
  if (normalized.includes("open box"))
    return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
  if (normalized.includes("refurbished"))
    return "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200";
  return "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200";
};

export default function ProductsCard({
  id,
  adsId = "",
  firstImageUrl,
  price,
  title,
  condition,
  location,
  createdAt,
  isVerifiedStore,
}: CardProps) {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const addToBookmark = async () => {
    if (!adsId?.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch(`/api/auth/account/products/to/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: adsId }),
        signal: controller.signal,
      });
      const json = (await res.json()) as BackendResponseType;
      if (!res.ok) {
        toastError({
          message: json.error.message ?? "Failed to add to bookmarks",
        });
        return;
      }
      setIsBookmarked(true);
    } catch {
      toastError({ message: "Failed to add to bookmarks" });
      return;
    }
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
      {/* 1. IMAGE SECTION */}
      <Link
        href={id}
        className="block relative aspect-[4/5] bg-gray-100 overflow-hidden"
      >
        <Image
          src={firstImageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={true}
          quality={85}
        />

        {/* Floating Heart (Top Right) */}
        <button
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all z-10"
          onClick={(e) => {
            e.preventDefault(); // Prevent navigating to product page
            addToBookmark();
          }}
        >
          {isBookmarked ? <IoMdHeart size={18} /> : <Heart size={18} />}
        </button>

        {/* Verified Badge (Top Left - Moved to balance the Heart) */}
        {isVerifiedStore === VerificationStatus.Verified && (
          <div className="absolute top-2 left-2 z-10">
            <div className="flex items-center bg-white/95 backdrop-blur text-blue-600 rounded-md text-[10px] font-bold px-2 py-1 gap-1 shadow-sm border border-blue-100">
              <CircleCheckBig size={12} className="fill-blue-100" />
              VERIFIED
            </div>
          </div>
        )}
      </Link>

      {/* 2. DETAILS SECTION */}
      <div className="p-3 flex flex-col flex-1 gap-1">
        {/* Price Row */}
        <div className="flex justify-between items-start">
          <span className="text-lg font-bold text-blue-600">
            GH₵ {formatPrice(price)}
          </span>
        </div>

        {/* Title (2 Lines max) */}
        <Link href={id} className="block">
          <h3 className="font-medium text-gray-900 text-sm leading-snug truncate hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>

        {/* Metadata Row (Location & Time Combined) */}
        <div className="flex items-center text-xs text-gray-500 mt-1 mb-2 gap-1">
          <MapPin size={12} className="shrink-0" />
          <span className="line-clamp-1">{location}</span>
          <span className="mx-1">•</span>
          <span className="whitespace-nowrap">{formatDate(createdAt)}</span>
        </div>

        {/* Footer: Condition Badge */}
        <div className="mt-auto border-t border-gray-50 flex items-center justify-between">
          <Badge
            variant="outline"
            className={`text-[10px] px-2 py-0.5 border-0 font-semibold ${getConditionColor(condition)}`}
          >
            {condition}
          </Badge>

          {/* Optional: Add 'Promoted' or other status here if needed */}
        </div>
      </div>
    </div>
  );
}
