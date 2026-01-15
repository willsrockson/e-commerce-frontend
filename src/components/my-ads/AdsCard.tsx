"use client";

import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "../toasts/toasts";
import Image from "next/image";
import { useState } from "react";
import { Loader2, Pencil, Trash2, MapPin, Power, Eye } from "lucide-react"; // Icons for actions
import { formatPrice } from "@/lib/helpers/universal-functions";
import { BackendResponseType } from "@/lib/interfaces";


export interface PublishedAdsCardType {
  id: string;
  image: string;
  price: string | number;
  title: string;
  removePost: (id: string) => void;
  deactivated: boolean;
  updateStatus: (id: string) => void;
  location: string;
  slug: string;
  subSlug: string;
  created_at: string;
}

export default function AdsCard({
  id,
  slug,
  subSlug,
  image,
  price,
  title,
  location,
  created_at,
  removePost,
  deactivated,
  updateStatus,
}: PublishedAdsCardType) {
  const [delState, setDelState] = useState<boolean>(false);
  const router = useRouter();

  const handleDeletePost = async (id: string) => {
    if (!id.trim()) return;
    setDelState(true);
    const res = await fetch(`/api/auth/account/delete/my/ads/one/${id}`, {
      credentials: "include",
      method: "DELETE",
    });
    const json = (await res.json()) as BackendResponseType;
    setDelState(false);
    if (!res.ok) {
      toastError({ message: `${json?.error.message}` });
      return;
    }
    removePost(id);
    toastSuccess({ message: `${json?.message}` });
  };

  const handleDeactivatePost = async (id: string) => {
    const res = await fetch(`/api/auth/account/deactivate/ad/${id}`, {
      credentials: "include",
    });
    const json = (await res.json()) as BackendResponseType;
    if (!res.ok) {
      toastError({ message: `${json?.error.message}` });
      return;
    }
    updateStatus(id);
    toastSuccess({ message: `${json?.message}` });
  };

  return (
    <div
      className={`group bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col ${deactivated ? "opacity-85" : ""}`}
    >
      {/* 1. IMAGE SECTION */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <Link href={`/${subSlug}/${slug}`}>
          <Image
            src={image}
            alt={title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${deactivated ? "grayscale" : ""}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </Link>

        {/* STATUS BADGE (Top Right) */}
        <div className="absolute top-2 right-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className={`flex items-center cursor-pointer gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-md shadow-sm transition-colors
                        ${
                          deactivated
                            ? "bg-gray-900/80 text-white hover:bg-gray-800"
                            : "bg-green-500/90 text-white hover:bg-green-600"
                        }`}
              >
                {deactivated ? <Power size={10} /> : <Eye size={10} />}
                {deactivated ? "Hidden" : "Active"}
              </button>
            </AlertDialogTrigger>
            {/* Status Dialog Logic */}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {deactivated ? "Publish Ad?" : "Hide Ad?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {deactivated
                    ? "This will make your ad visible to all buyers again."
                    : "Buyers won't be able to see this ad, but you can reactivate it anytime."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeactivatePost(id)}
                  className={
                    deactivated
                      ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                      : "bg-gray-700 hover:bg-gray-800 cursor-pointer"
                  }
                >
                  {deactivated ? "Go Live" : "Hide Now"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* 2. DETAILS SECTION */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <div className="flex justify-between items-start">
          <p className="text-lg font-bold text-sky-600">GH₵ {formatPrice(price)}</p>
        </div>

        <Link
          href={`/${subSlug}/${slug}`}
          className="hover:underline decoration-gray-400"
        >
          <h3 className="font-medium text-gray-900 truncate mb-1">
            {title}
          </h3>
        </Link>

        <div className="flex items-center text-xs text-gray-500 gap-1 mt-auto">
          <MapPin size={12} />
          <span className="line-clamp-1">{location}</span>
          <span className="mx-1">•</span>
          <span className="line-clamp-1">{created_at}</span>
        </div>
      </div>

      {/* 3. ACTIONS FOOTER */}
      <div className="grid grid-cols-2 gap-px bg-gray-100 border-t border-gray-100">
        <button
          onClick={() => router.push(`/${subSlug}/edit/${id}`)}
          className="flex items-center justify-center cursor-pointer gap-2 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <Pencil size={14} className="text-blue-500" /> Edit
        </button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex items-center justify-center cursor-pointer gap-2 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-red-50 hover:text-red-600 transition-colors">
              {delState ? (
                <Loader2 className="animate-spin h-3.5 w-3.5" />
              ) : (
                <Trash2
                  size={14}
                  className="text-red-400 group-hover:text-red-600"
                />
              )}
              Delete
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Advertisement?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The ad will be permanently
                removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeletePost(id)}
                className="bg-red-600 hover:bg-red-700 cursor-pointer"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
