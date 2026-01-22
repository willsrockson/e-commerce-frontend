"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
   MapPin,
   Calendar,
   Star,
   ShieldCheck,
   Filter,
   PackageOpen,
   MoreHorizontal,
   LinkIcon,
   Flag,
} from "lucide-react";
import { MdWhatsapp } from "react-icons/md";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteMaxWidth } from "@/lib/constants";
import ProductsCard from "@/components/ProductsCard";
import BeatLoaderUI from "@/components/loaders/BeatLoader";
import SelectSearchWithAdsCount from "@/components/sharedUi/withAdsCount/select-search";
import { useForm } from "react-hook-form";

import { IPublishedAdsByME, UserProfileData, MobilePhonesHalfType } from "@/lib/interfaces";
import useSWR from "swr";
import { CountData, IAllMyAdResponse } from "@/components/my-ads/AdsUi";
import { useAsyncList } from "react-stately";
import { useInView } from "react-intersection-observer";
import CopyPhoneNumber from "@/components/CopyPhoneNumber";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toastSuccess } from "@/components/toasts/toasts";
import ShopSkeletonLoader from "@/components/ShopSkeletonLoader";
import StoreNotFound from "@/components/StoreNotFound";


// Will work on implementing rating later
const MOCK_STORE = {
   rating: 4.8,
   reviewCount: 124,
   stats: {
      sold: 450,
      active: 42,
   },
};

type ProfileData = {
   profile: UserProfileData;
   phones: MobilePhonesHalfType[]
}

type Tabs = "home" | "all" | "reviews" | "about";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Shop() {
   const params = useParams<{ id: string }>();
   const [activeTab, setActiveTab] = useState<"home" | "all" | "reviews" | "about">("home");


   // Starting here is for View all Ads 
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
        cursor || `/api/profile/shop/${params.id}/ads?page=1&${filterText}`,
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

  useEffect(() => {
    const query = new URLSearchParams({});
    if (watchMainValue) query.set("main_category", watchMainValue);
    if (watchSubValue) query.set("sub_category", watchSubValue);
    listRef.current.setFilterText(query.toString());
    window.history.replaceState(null, "", `?${query.toString()}`);
  }, [watchMainValue, watchSubValue]);

  // View all Ads code ends here
  
   const { data: store, isLoading: isStoreLoading, error } = useSWR<ProfileData>(
      `/api/profile/settings/${params.id}`,
      fetcher,
   );

   useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   }, [activeTab]);
   
   
   if (isStoreLoading || error) {
      return <ShopSkeletonLoader />
   }else if(!store?.profile){
      return <StoreNotFound slug={params.id} />
   }
   
   
   return (
      <div className="w-full min-h-screen bg-gray-50 pb-24 md:pb-10">
         {/* 1. STORE HEADER SECTION */}
         <div className="bg-white border-b shadow-sm">
            <div className={`${siteMaxWidth} mx-auto px-4 py-6`}>
               <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Avatar */}
                  <div className="relative">
                     <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md">
                        <AvatarImage
                           src={store?.profile.imageUrl ?? ""}
                           alt={store?.profile.storeName ?? "Avatar"}
                        />
                        <AvatarFallback>{store?.profile.fullName.substring(0, 2)}</AvatarFallback>
                     </Avatar>
                     {store?.profile.idVerified === "verified" && (
                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
                           <ShieldCheck className="fill-green-100 text-green-600 h-6 w-6" />
                        </div>
                     )}
                  </div>

                  {/* Store Info */}
                  <div className="flex-1 space-y-2 w-full">
                     <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                              {store?.profile.storeName}
                              {store?.profile.idVerified === "verified" && (
                                 <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                                    Verified Seller
                                 </Badge>
                              )}
                           </h1>

                           <div className="flex flex-wrap gap-y-1 gap-x-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                 <MapPin size={14} />{" "}
                                 {store?.profile.storeAddress ?? "Online Store"}
                              </span>
                              <span className="flex items-center gap-1">
                                 <Calendar size={14} /> Member since{" "}
                                 {new Date(
                                    store?.profile ? store?.profile.userCreatedAt : "",
                                 ).getFullYear()}
                              </span>
                              <span className="flex items-center gap-1 text-yellow-600 font-medium">
                                 <Star
                                    size={14}
                                    className="fill-yellow-500 text-yellow-500"
                                 />
                                 {MOCK_STORE.rating} ({MOCK_STORE.reviewCount} reviews)
                              </span>
                           </div>
                        </div>

                        {/* Desktop Action Buttons Hidden on Mobile */}
                        <div className="hidden md:flex gap-3 items-center">
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-gray-600"
                                 >
                                    <MoreHorizontal size={20} />
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                 <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                       navigator.clipboard.writeText(window.location.href);
                                       toastSuccess({ message: "Store link copied" });
                                    }}
                                 >
                                    <LinkIcon className="mr-2 h-4 w-4" /> Copy Store Link
                                 </DropdownMenuItem>
                                 <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                                    <Flag className="mr-2 h-4 w-4" /> Report this Store
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>

                           {/* WhatsApp */}
                           <Button
                              variant="outline"
                              className="gap-2 border-green-600 text-green-700 hover:bg-green-50"
                              onClick={() =>
                                 window.open(
                                    `https://wa.me/${store?.profile.phonePrimary}?text=Hi...`,
                                    "_blank",
                                 )
                              }
                           >
                              <MdWhatsapp /> Chat
                           </Button>

                           <CopyPhoneNumber
                              phonePrimary={store?.profile.phonePrimary ?? ""}
                              phoneSecondary={store?.profile.phoneSecondary ?? ""}
                           />
                        </div>
                     </div>
                  </div>
               </div>

               {/* 2. TABS NAVIGATION */}
               <div className="flex items-center gap-6 mt-8 border-b border-gray-100 overflow-x-auto no-scrollbar">
                  {["home", "all", "reviews", "about"].map((tab) => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab as Tabs)}
                        className={`pb-3 text-sm font-medium capitalize whitespace-nowrap transition-all border-b-2 ${
                           activeTab === tab
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-800"
                        }`}
                     >
                        {tab === "all" ? "All Items" : tab}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* 3. MAIN CONTENT AREA */}
         <div className={`${siteMaxWidth} mx-auto px-4 py-6`}>
            {/* TAB: HOME */}
            {activeTab === "home" && (
               <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Recent Section */}
                  {store?.phones.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                           <PackageOpen size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No active listings</h3>
                        <p className="text-gray-500 mt-1 mb-4">
                           This seller hasn&apos;t posted any items yet. Check back later.
                        </p>
                     </div>
                  ) : (
                     <section>
                        <div className="flex justify-between items-center mb-4">
                           <h2 className="text-xl font-bold text-gray-800">Just Arrived</h2>
                           <Button
                              variant="link"
                              onClick={() => setActiveTab("all")}
                           >
                              View All &rarr;
                           </Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                           {store?.phones.map((item) => (
                              <ProductsCard
                                 key={item.adsId}
                                 id={`/${item.subSlug}/${item.slug}`}
                                 adsId={item.adsId}
                                 firstImageUrl={item.firstImage}
                                 price={item.price}
                                 title={item.title}
                                 location={item.region + ", " + item.town}
                                 condition={item.condition}
                                 createdAt={item.createdAt}
                                 isVerifiedStore={item.idVerified}
                                 description={item.description}
                              />
                           ))}
                        </div>
                     </section>
                  )}
               </div>
            )}

            {/* TAB ALL ITEMS */}
            {activeTab === "all" && (
               <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Filter Bar */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
                     <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
                        <Filter size={16} /> Filter Store Inventory
                     </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                              Category
                           </Label>
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
                           <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                              Sub Category
                           </Label>
                           {watchMainValue ? (
                              <SelectSearchWithAdsCount
                                 name="sub_category"
                                 labelText="sub category"
                                 setValue={setValue}
                                 control={control}
                                 placeholder="All Subcategories"
                                 countedItems={myCount.countAds.sub}
                                 className="w-full"
                              />
                           ) : (
                              <Input
                                 disabled
                                 placeholder="Select category first"
                                 className="bg-gray-50"
                              />
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Grid Results */}
                  <section className="w-full">
                     {list.isLoading && list.items.length === 0 ? (
                        <div className="flex justify-center py-20">
                           <BeatLoaderUI
                              color="blue"
                              size={15}
                           />
                        </div>
                     ) : (
                        <>
                           {list?.items.length === 0 && !metadata.hasMore ? (
                              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
                                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                                    <PackageOpen size={32} />
                                 </div>
                                 <h3 className="text-lg font-medium text-gray-900">
                                    No active listings
                                 </h3>
                                 <p className="text-gray-500 mt-1 mb-4">
                                    This seller hasn&apos;t posted any items yet. Check back later.
                                 </p>
                              </div>
                           ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                 {list.items?.map((item) => (
                                    <ProductsCard
                                       isVerifiedStore="unverified"
                                       key={item.adsId}
                                       id={`/${item.subSlug}/${item.slug}`}
                                       adsId={item.adsId}
                                       firstImageUrl={item.firstImage}
                                       price={item.price}
                                       title={item.title}
                                       location={item.region + ", " + item.town}
                                       condition={item.condition}
                                       createdAt={item.createdAt}
                                       description={item.description}
                                    />
                                 ))}
                              </div>
                           )}
                        </>
                     )}

                     {/* Load More Trigger */}
                     <div
                        className={`mt-8 flex justify-center ${!metadata.hasMore ? "hidden" : "block"}`}
                        ref={ref}
                     >
                        <BeatLoaderUI
                           color={"blue"}
                           size={10}
                        />
                     </div>
                  </section>
               </div>
            )}

            {/* TAB REVIEWS */}
            {activeTab === "reviews" && (
               <div className="max-w-2xl animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
                  <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-lg mb-6">
                     <div className="text-4xl font-bold text-blue-600">{MOCK_STORE.rating}</div>
                     <div className="flex flex-col">
                        <div className="flex text-yellow-500">
                           <Star
                              fill="currentColor"
                              size={16}
                           />
                           <Star
                              fill="currentColor"
                              size={16}
                           />
                           <Star
                              fill="currentColor"
                              size={16}
                           />
                           <Star
                              fill="currentColor"
                              size={16}
                           />
                           <Star size={16} />
                        </div>
                        <span className="text-sm text-gray-600">
                           Based on {MOCK_STORE.reviewCount} verified purchases
                        </span>
                     </div>
                  </div>
                  {/* Review List Placeholder */}
                  <div className="space-y-4">
                     {[1, 2].map((review) => (
                        <div
                           key={review}
                           className="border-b pb-4"
                        >
                           <div className="flex items-center gap-2 mb-1">
                              <Avatar className="h-8 w-8">
                                 <AvatarFallback>JD</AvatarFallback>
                              </Avatar>
                              <span className="font-semibold text-sm">John Doe</span>
                              <span className="text-xs text-gray-400">2 days ago</span>
                           </div>
                           <p className="text-gray-700 text-sm">
                              Bought a phone here, exactly as described. The delivery was fast!
                           </p>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* TAB ABOUT */}
            {activeTab === "about" && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                  <div>
                     <h2 className="text-xl font-bold mb-4">About Us</h2>
                     <p className="text-gray-600 leading-relaxed mb-6">
                        {store?.profile.storeDescription}
                     </p>
                     <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-700">
                           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <MapPin size={16} />
                           </div>
                           <span>{store?.profile.storeAddress}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <Calendar size={16} />
                           </div>
                           <span>{store?.profile.openHours}</span>
                        </div>
                     </div>
                  </div>
                  {/* Placeholder for Map */}
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                     <MapPin
                        size={32}
                        className="mr-2"
                     />{" "}
                     Map View Unavailable
                  </div>
               </div>
            )}
         </div>

         {/* MOBILE STICKY ACTION BAR Visible only on mobile */}
         <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden z-50 flex justify-center gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Button
                     variant="ghost"
                     size="icon"
                     className="text-gray-400 hover:text-gray-600"
                  >
                     <MoreHorizontal size={20} />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                  <DropdownMenuItem
                     onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toastSuccess({ message: "Store link copied" });
                     }}
                  >
                     <LinkIcon className="mr-2 h-4 w-4" /> Copy Store Link
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                     <Flag className="mr-2 h-4 w-4" /> Report this Store
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>

            {/* WhatsApp */}
            <Button
               variant="outline"
               className="gap-2 border-green-600 text-green-700 hover:bg-green-50"
               onClick={() =>
                  window.open(`https://wa.me/${store?.profile.phonePrimary}?text=Hi...`, "_blank")
               }
            >
               <MdWhatsapp /> Chat
            </Button>
            <CopyPhoneNumber
               phonePrimary={store?.profile.phonePrimary ?? ""}
               phoneSecondary={store?.profile.phoneSecondary ?? ""}
            />
         </div>
      </div>
   );
}
