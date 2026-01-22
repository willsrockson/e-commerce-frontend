"use client";

import { useRouter } from "next/navigation";
import { IPublishedAdsByME } from "@/lib/interfaces";
import { useEffect, useRef, useState } from "react";
import AdsCard from "@/components/my-ads/AdsCard";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import BeatLoaderUI from "../loaders/BeatLoader";
import SelectSearchWithAdsCount from "../sharedUi/withAdsCount/select-search";
import { useForm } from "react-hook-form";
import { labelTextColor } from "../RoutingComponents/Electronics/MobilePhones";
import { useAsyncList } from "react-stately";
import { useInView } from "react-intersection-observer";
import { siteMaxWidth } from "@/lib/constants";
import { ArrowLeft, Filter } from "lucide-react";
import { PiMegaphoneFill } from "react-icons/pi";


const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ... (Keep your Type Interfaces here: ICountType, CountData, etc.) ...
type ICountType = {
  main: { label: string; count: number }[];
  sub: { label: string; count: number }[];
};

export interface CountData {
  countAds: ICountType;
}

export interface IAllMyAdResponse {
  publishedAds: [];
  hasMore: boolean;
  total: number;
  page: number;
  countAds: ICountType;
}

export default function MyAdsUi() {
  const router = useRouter();

  // --- Form & State Logic (Kept exactly the same as your code) ---
  const { control, watch, setValue } = useForm({
    defaultValues: { main_category: "", sub_category: "" },
  });
  const [watchMainValue, watchSubValue] = watch([
    "main_category",
    "sub_category",
  ]);

  const [myCount, setMyCount] = useState<CountData>({
    countAds: {
      main: [{ label: "", count: 0 }],
      sub: [{ label: "", count: 0 }],
    },
  });

  const [metadata, setMetadata] = useState({
    hasMore: false,
    total: 0,
    page: 1,
  });

  const list = useAsyncList<IPublishedAdsByME>({
    async load({ signal, cursor, filterText }) {
      const res = await fetch(
        cursor || `/api/auth/account/my/ads?page=1&${filterText}`,
        { signal },
      );
      const json = (await res.json()) as IAllMyAdResponse;
      setMyCount({ countAds: json.countAds });
      setMetadata({
        hasMore: json.hasMore,
        total: json.total,
        page: json.page,
      });
      return {
        items: json.publishedAds,
        cursor: json.hasMore
          ? `/api/auth/account/my/ads?page=${json.page + 1}&${filterText}`
          : undefined,
      };
    },
    getKey: (item) => item.adsId,
  });

  const listRef = useRef(list);
  useEffect(() => {
    listRef.current = list;
  }, [list]);

  const { ref, inView } = useInView({ rootMargin: "400px", threshold: 0 });

  useEffect(() => {
    if (listRef.current.items.length && inView && !listRef.current.isLoading) {
      listRef.current.loadMore();
    }
  }, [inView]);

  const removePost = async (id: string) => {
    list.remove(id);
    setMetadata((prev) => ({ ...prev, total: prev.total - 1 }));
  };

  const updateStatus = async (id: string) => {
    // Optimistic update
    const prev = list.items.find((i) => i.adsId === id);
    if (!prev) return;
    const updated = { ...prev, deactivated: !prev.deactivated };
    list.update(id, updated);
  };

  useEffect(() => {
    const query = new URLSearchParams({});
    if (watchMainValue) query.set("main_category", watchMainValue);
    if (watchSubValue) query.set("sub_category", watchSubValue);
    listRef.current.setFilterText(query.toString());
    window.history.replaceState(null, "", `?${query.toString()}`);
  }, [watchMainValue, watchSubValue]);

  return (
    <div className="w-full min-h-screen bg-gray-50/50 pb-20">
      <div className={`${siteMaxWidth} mx-auto px-4 py-6`}>
        {/* 1. Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-2 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              My Listings
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Manage your {metadata.total} active{" "}
              {metadata.total === 1 ? "ad" : "ads"}
            </p>
          </div>
        </div>

        {/* 2. Filters (Now a Grid above the ads) */}
        <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
            <Filter size={16} /> Filter Ads
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className={labelTextColor}>Category</Label>
              <SelectSearchWithAdsCount
                name="main_category"
                labelText="category"
                setValue={setValue}
                control={control}
                placeholder="All Categories"
                countedItems={myCount?.countAds?.main}
                className="w-full"
              />
            </div>
            <div className="space-y-1.5">
              <Label className={labelTextColor}>Sub Category</Label>
              {watchMainValue ? (
                <SelectSearchWithAdsCount
                  name="sub_category"
                  labelText="sub category"
                  setValue={setValue}
                  control={control}
                  placeholder="All Sub Categories"
                  countedItems={myCount.countAds.sub}
                  className="w-full"
                />
              ) : (
                <Input
                  disabled
                  placeholder="Select main category first"
                  className="bg-gray-50"
                />
              )}
            </div>
          </div>
        </div>

        {/* 3. The Grid Layout (Responsive) */}
        <section className="w-full">
          {list.isLoading && list.items.length === 0 ? (
            <div className="flex justify-center py-20">
              <BeatLoaderUI color="blue" size={15} />
            </div>
          ) : (
            <>
              {list?.items.length === 0 && !metadata.hasMore ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                    <PiMegaphoneFill />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    You haven&apos;t posted any ads yet
                  </h3>
                  <p className="text-gray-500 mt-1 mb-4">
                    Time to turn your items into cash!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {list.items?.map((ad) => (
                    <AdsCard
                      key={ad.adsId}
                      id={ad.adsId}
                      image={ad.firstImage}
                      price={ad.price}
                      title={ad.title}
                      slug={ad.slug}
                      subSlug={ad.subSlug}
                      removePost={removePost}
                      updateStatus={updateStatus}
                      deactivated={ad.deactivated}
                      location={`${ad.region}, ${ad.town}`}
                      created_at={`${new Date(ad.createdAt).getDate()} ${month[new Date(ad.createdAt).getMonth()]}, ${new Date(ad.createdAt).getFullYear()}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          <div
            className={`mt-8 flex justify-center ${!metadata.hasMore ? "hidden" : "block"}`}
            ref={ref}
          >
            <BeatLoaderUI color={"blue"} size={10} />
          </div>
        </section>
      </div>
    </div>
  );
}
