"use client";

import Link from "next/link";
import { Loader2, Trash2, MapPin, Phone } from "lucide-react";
import { toastError, toastSuccess } from "../toasts/toasts";
import Image from "next/image";
import { useState } from "react";
import { formatPrice } from "@/lib/helpers/universal-functions";

interface SavedAdsCardProps {
  savedId: string;
  adsId: string;
  image: string;
  subCategory: string;
  slug: string;
  price: string | number;
  condition: string;
  title: string;
  location: string;
  phone: string;
  updateRemovedItem: (id: string) => void;
}

export default function BookmarkCard({
  savedId,
  adsId,
  subCategory,
  slug,
  image,
  price,
  title,
  condition,
  location,
  phone,
  updateRemovedItem,
}: SavedAdsCardProps) {
  const [loading, setLoading] = useState(false);

  const copyTextAlert = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(phone);
    toastSuccess({ message: "Phone number copied!" });
  };

  const removeOneSavedAds = async (e: React.MouseEvent, savedAdsID: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!savedAdsID) return toastError({ message: "Ad is not available" });

    setLoading(true);
    const response = await fetch(
      `/api/auth/account/delete/one/bookmark/${savedAdsID}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      toastError({ message: data?.errorMessage });
      return;
    }

    updateRemovedItem(savedAdsID);
    toastSuccess({ message: "Item removed from saved list" });
  };

  const isAvailable = Boolean(adsId);

  return (
    <div
      className={`group relative bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-lg transition-all duration-300 ${!isAvailable ? "opacity-60 grayscale" : ""}`}
    >
      {/* 1. IMAGE SECTION */}
      <Link
        href={isAvailable ? `/${subCategory}/${slug}` : "#"}
        className="block relative aspect-[4/3] bg-gray-100 overflow-hidden"
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Remove Button (Floating Top Right) */}
        <button
          onClick={(e) => removeOneSavedAds(e, savedId)}
          disabled={loading}
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 shadow-sm transition-all z-10"
          title="Remove from bookmarks"
        >
          {loading ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <Trash2 size={16} className="cursor-pointer" />
          )}
        </button>

        {/* Condition Badge (Floating Bottom Left) */}
        {condition && (
          <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white px-2 py-1 rounded-md backdrop-blur-md">
            {condition}
          </span>
        )}
      </Link>

      {/* 2. DETAILS SECTION */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-sky-600">
            {isAvailable ? formatPrice(price) : "Sold / Unavailable"}
          </h3>
        </div>

        <Link
          href={isAvailable ? `/${subCategory}/${slug}` : "#"}
          className="block"
        >
          <h4 className="text-gray-900 font-medium line-clamp-2 hover:text-sky-600 transition-colors h-10 leading-5">
            {title}
          </h4>
        </Link>

        {/* Metadata Row */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
          <div className="flex items-center text-gray-500 text-xs gap-1">
            <MapPin size={12} />
            <span className="line-clamp-1 max-w-[100px]">{location}</span>
          </div>

          {isAvailable && (
            <button
              onClick={copyTextAlert}
              className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1.5 rounded-md transition-colors"
            >
              <Phone size={12} />
              Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
