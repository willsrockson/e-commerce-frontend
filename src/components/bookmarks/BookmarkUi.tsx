"use client";
import { useRouter } from "next/navigation";
import { BackendResponseType, ISavedAd } from "@/lib/interfaces";
import BookmarkCard from "@/components/bookmarks/BookmarkCard";
import BeatLoaderUI from "../loaders/BeatLoader";
import useSWR from "swr";
import { toastError, toastSuccess } from "../toasts/toasts";
import { useState } from "react";
import { Loader2, Trash2, ArrowLeft, ShoppingCart } from "lucide-react"; // Added Icons
import { siteMaxWidth } from "@/lib/constants";
import { Button } from "@/components/ui/button"; // Assuming you have shadcn button

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BookmarkUi() {
  const { data, isLoading, error, mutate } = useSWR<ISavedAd[]>(
    `/api/auth/account/bookmarks`,
    fetcher,
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Delete all saved ads from the DB
  const deleteAllSavedAds = async () => {
    if (!confirm("Are you sure you want to clear your wishlist?")) return;
    setLoading(true);
    const res = await fetch(`/api/auth/account/delete/all/bookmark`, {
      method: "DELETE",
      credentials: "include",
    });
    const json = (await res.json()) as BackendResponseType;
    setLoading(false);
    if (!res.ok) {
      toastError({ message: json?.error.message });
      return;
    }

    await mutate([], true);
    toastSuccess({ message: json?.message });
  };

  const updateRemovedAd = async (id: string) => {
    await mutate(data?.filter((d) => d.savedId !== id) || data, true);
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] bg-gray-50/50">
      <div className={`${siteMaxWidth} mx-auto px-4 py-8`}>
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Home
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              My Saved Items
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {data ? data.length : 0} {data?.length === 1 ? "item" : "items"}{" "}
              saved for later
            </p>
          </div>

          {data && data.length > 0 && (
            <Button
              variant="outline"
              disabled={loading}
              onClick={deleteAllSavedAds}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Remove All
            </Button>
          )}
        </div>

        {/* --- CONTENT SECTION --- */}
        <section className="w-full">
          {isLoading || error ? (
            <div className="flex justify-center py-20">
              <BeatLoaderUI color="blue" size={15} />
            </div>
          ) : (
            <>
              {data?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 flex items-center justify-center opacity-50">
                    <span className="text-4xl"><ShoppingCart/></span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Start browsing to add items here.
                  </p>
                </div>
              ) : (
                // --- THE NEW GRID LAYOUT ---
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {data?.map((ad) => (
                    <BookmarkCard
                      key={ad.savedId}
                      savedId={ad.savedId}
                      adsId={ad.adsId ?? ""}
                      slug={ad.slug}
                      image={ad.imageUrl}
                      subCategory={ad.subCategory}
                      price={ad.price}
                      condition={ad.condition}
                      title={ad.title}
                      location={ad.location}
                      phone={ad.phonePrimary}
                      updateRemovedItem={(value) => updateRemovedAd(value)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
