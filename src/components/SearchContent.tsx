"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link"; // 
import { MobilePhonesHalfType } from "@/lib/interfaces"; 
import ProductsCard from "@/components/ProductsCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import BeatLoaderUI from "@/components/loaders/BeatLoader";
import { useAsyncList } from "react-stately";
import { useInView } from "react-intersection-observer";
import { useForm } from "react-hook-form";
import PriceShared from "@/components/sharedUi/price";
import SelectSearchWithAdsCount from "@/components/sharedUi/withAdsCount/select-search";
import { siteMaxWidth } from "@/lib/constants";
import { Filter, SearchX, ChevronRight } from "lucide-react"; // Added ChevronRight

type IGenericCountType = {
  category: { label: string; count: number; value: string }[]; 
  region: { label: string; count: number }[];
  town: { label: string; count: number }[];
  condition: { label: string; count: number }[];
  negotiable: { label: string; count: number }[];
  verifiedSellers: { label: string; count: number }[];
};

interface CountData {
  countAds: IGenericCountType;
}

interface SearchResponse {
  items: [];
  hasMore: boolean;
  total: number;
  page: number;
  countAds: IGenericCountType;
}

export interface ISearchFormData {
  q: string;
  category: string;
  region: string;
  town: string;
  condition: string;
  priceMin: string;
  priceMax: string;
  negotiable: string;
  idVerified: string;
}

const labelTextColor = "text-xs font-bold text-gray-500 uppercase tracking-wider";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { register, control, setValue, watch, getValues } =
    useForm<ISearchFormData>({
      defaultValues: {
        q: searchParams.get("q") ?? "",
        category: searchParams.get("category") ?? "",
        region: searchParams.get("region") ?? "",
        town: searchParams.get("town") ?? "",
        condition: searchParams.get("condition") ?? "",
        priceMin: searchParams.get("price_min") ?? "",
        priceMax: searchParams.get("price_max") ?? "",
        negotiable: searchParams.get("negotiable") ?? "",
        idVerified: searchParams.get("id_verified") ?? "",
      },
    });

  const [
    watchRegionValue,
    watchTownValue,
    watchConditionValue,
    watchNegotiableValue,
    watchIdVerification,
  ] = watch([
    "region",
    "town",
    "condition",
    "negotiable",
    "idVerified",
  ]);

  const [trigger, setTrigger] = useState(0);
  
  // 3. INITIALIZE EMPTY COUNTS
  const [myCount, setMyCount] = useState<CountData>({
    countAds: {
      category: [],
      region: [],
      town: [],
      condition: [],
      negotiable: [],
      verifiedSellers: [],
    },
  });

  const [metadata, setMetadata] = useState({
    hasMore: false,
    total: 0,
    page: 1,
  });

  // 4. THE LOADER
  const list = useAsyncList<MobilePhonesHalfType>({
    async load({ signal, cursor, filterText }) {
      const currentQuery = searchParams.get("q") || "";
      
      const url = cursor || `/api/global-search?q=${currentQuery}&page=1&${filterText}`;

      const res = await fetch(url, { signal });
      const json = (await res.json()) as SearchResponse;

      setMyCount({ countAds: json.countAds });
      setMetadata({
        hasMore: json.hasMore,
        total: json.total,
        page: json.page,
      });

      return {
        items: json.items,
        cursor: json.hasMore
          ? `/api/global-search?q=${currentQuery}&page=${json.page + 1}&${filterText}`
          : undefined,
      };
    },
  });

  const listRef = useRef(list);

  useEffect(() => {
    listRef.current = list;
  }, [list]);

  const { ref, inView } = useInView({
    rootMargin: "500px",
    threshold: 0,
  });

  useEffect(() => {
    if (listRef.current.items.length && inView && !listRef.current.isLoading) {
      listRef.current.loadMore();
    }
  }, [inView]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    const query = new URLSearchParams({});

    const currentQ = searchParams.get("q");
    if (currentQ) query.set("q", currentQ);

    // Removed 'category' from here since it's handled via navigation now
    if (watchRegionValue) query.set("region", watchRegionValue);
    if (watchTownValue) query.set("town", watchTownValue);
    if (watchConditionValue) query.set("condition", watchConditionValue);
    if (getValues("priceMin")) query.set("price_min", getValues("priceMin").toString());
    if (getValues("priceMax")) query.set("price_max", getValues("priceMax").toString());
    if (watchNegotiableValue) query.set("negotiable", watchNegotiableValue);
    if (watchIdVerification) query.set("id_verified", watchIdVerification);

    listRef.current.setFilterText(query.toString());
    
    window.history.replaceState(null, "", `?${query.toString()}`);
  }, [
    getValues,
    trigger,
    watchRegionValue,
    watchTownValue,
    watchConditionValue,
    watchNegotiableValue,
    watchIdVerification,
    searchParams
  ]);

  const searchQuery = searchParams.get("q") || "";

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pt-6 bg-gray-50/30">
      <form>
        <div className={`w-full ${siteMaxWidth} m-auto mb-6 px-4`}>
          <Badge
            className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer py-1.5 shadow-sm"
            onClick={() => router.push("/")}
          >
            ← Back to Home
          </Badge>
        </div>

        <div className={`w-full ${siteMaxWidth} m-auto grid lg:grid-cols-[280px_1fr] gap-8 px-4 pb-44`}>
          
          {/* --- LEFT SIDEBAR --- */}
          <div className="w-full overflow-hidden">
            <aside className="w-screen lg:w-full lg:sticky lg:top-4 self-start h-fit lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto scrollbar-hide">
              <div className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
                <Filter size={18} /> Filters
              </div>

              <div className="flex flex-row gap-4 overflow-x-auto snap-x scrollbar-none pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 lg:pb-0 lg:flex-col lg:overflow-visible">
                
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-4 flex flex-col gap-4 rounded-xl min-w-70 lg:w-full">
                  <div className="w-full">
                    <Label className={labelTextColor}>Matched Categories</Label>
                    
                    <div className="flex flex-col gap-1 mt-3">
                        {myCount.countAds.category && myCount.countAds.category.length > 0 ? (
                            myCount.countAds.category.map((cat, index) => (
                                <Link
                                    key={index}
                                    href={`/${cat.value}${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
                                    className="flex items-center justify-between group p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-100"
                                >
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 truncate max-w-[180px]">
                                        {cat.label}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-gray-100 text-gray-500 py-0.5 px-2 rounded-full group-hover:bg-blue-200 group-hover:text-blue-700">
                                            {cat.count}
                                        </span>
                                        <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-400" />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic py-2">
                                {list.isLoading ? "Loading..." : "No categories found."}
                            </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* 2. Region & Town */}
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-4 flex flex-col gap-4 rounded-xl min-w-70 lg:w-full">
                  <div className="w-full">
                    <Label className={labelTextColor} htmlFor="region">Region</Label>
                    <SelectSearchWithAdsCount
                      name="region"
                      control={control}
                      countedItems={myCount.countAds.region}
                      setValue={setValue}
                      labelText="region"
                      className="w-full"
                      placeholder="All Regions"
                    />
                  </div>
                  <div className="w-full">
                    <Label className={labelTextColor} htmlFor="town">Town</Label>
                    {watchRegionValue ? (
                      <SelectSearchWithAdsCount
                        name="town"
                        control={control}
                        countedItems={myCount.countAds.town}
                        setValue={setValue}
                        labelText="town"
                        className="w-full"
                        placeholder="All Towns"
                      />
                    ) : (
                      <Input disabled className="w-full bg-gray-50" placeholder="Select region first" />
                    )}
                  </div>
                </div>

                {/* 3. Condition & Price */}
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-4 flex flex-col gap-4 rounded-xl min-w-70 lg:w-full">
                  <div className="w-full">
                    <Label className={labelTextColor} htmlFor="condition">Condition</Label>
                    <SelectSearchWithAdsCount
                      name="condition"
                      labelText="condition"
                      placeholder="Any Condition"
                      countedItems={myCount.countAds.condition}
                      setValue={setValue}
                      control={control}
                      className="w-full"
                    />
                  </div>

                  <div className="w-full">
                    <Label className={labelTextColor}>Price Range (GH₵)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-full">
                        <PriceShared name="priceMin" register={register} placeholder="Min" />
                      </div>
                      <span className="text-gray-400">-</span>
                      <div className="w-full">
                        <PriceShared name="priceMax" register={register} placeholder="Max" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span
                        onClick={() => { if (getValues("priceMin") || getValues("priceMax")) setTrigger(Date.now()); }}
                        className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline"
                      >
                        Apply
                      </span>
                      <span
                        onClick={() => { setValue("priceMax", ""); setValue("priceMin", ""); setTrigger(Date.now()); }}
                        className="text-xs text-gray-400 cursor-pointer hover:text-gray-600"
                      >
                        Clear
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Seller & Deal Status */}
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-4 flex flex-col gap-4 rounded-xl min-w-70 lg:w-full">
                  <div className="w-full">
                    <Label className={labelTextColor} htmlFor="negotiable">Negotiable</Label>
                    <SelectSearchWithAdsCount
                      name="negotiable"
                      labelText="negotiable"
                      placeholder="Show all"
                      countedItems={myCount.countAds.negotiable}
                      setValue={setValue}
                      control={control}
                      className="w-full"
                    />
                  </div>
                  <div className="w-full">
                    <Label className={labelTextColor} htmlFor="idVerified">Seller Status</Label>
                    <SelectSearchWithAdsCount
                      name="idVerified"
                      labelText="verified seller"
                      placeholder="Show all"
                      setValue={setValue}
                      countedItems={myCount.countAds.verifiedSellers}
                      control={control}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="w-4 shrink-0 lg:hidden"></div>
              </div>
            </aside>
          </div>

          {/* --- RIGHT CONTENT --- */}
          <div className="w-full h-full overflow-x-auto">
            <section className="w-full">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {searchQuery ? `Results for "${searchQuery}"` : "All Items"}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Found {metadata.total} results
                  </p>
                </div>
              </div>

              <section className="w-full h-full">
                {list.isLoading && list.items.length === 0 ? (
                  <div className="w-full min-h-40">
                    <BeatLoaderUI color={"blue"} size={10} className="w-full max-w-7xl m-auto mb-6 flex justify-center pt-4" />
                  </div>
                ) : (
                  <div className="w-full">
                    {list.items.length === 0 && metadata.hasMore === false ? (
                      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <SearchX className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                        <p className="text-gray-500 mt-1 text-sm">
                            We couldn&apos;t find anything for &quot;{searchQuery}&quot;. <br/> Try searching for something else or change the filters.
                        </p>
                        <button 
                            type="button"
                            onClick={() => router.push('/')}
                            className="mt-6 text-blue-600 font-medium hover:underline"
                        >
                            Clear search
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 w-full">
                        {list.items.map((item: MobilePhonesHalfType) => (
                          <ProductsCard
                            key={item.adsId}
                            // Ensuring correct link structure
                            id={`/${item.subSlug}/${item.slug}`} 
                            adsId={item.adsId}
                            firstImageUrl={item.firstImage}
                            price={item.price}
                            title={item.title}
                            location={item.region + ", " + item.town}
                            condition={item.condition}
                            createdAt={item.createdAt}
                            description={item.description}
                            isVerifiedStore={item.idVerified}
                          />
                        ))}
                      </div>
                    )}

                    <div className={!metadata.hasMore ? "hidden" : "block"} ref={ref}>
                      <BeatLoaderUI color={"blue"} size={10} className="w-full max-w-7xl m-auto mb-6 flex justify-center pt-10" />
                    </div>
                  </div>
                )}
              </section>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
}

