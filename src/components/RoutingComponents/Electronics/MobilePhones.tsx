"use client";
import { useRouter, useSearchParams } from "next/navigation";
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
import PopularBrands from "./popular-brands";
import { siteMaxWidth } from "@/lib/constants";
import { Filter } from "lucide-react";

type ICountType = {
  region: { label: string; count: number }[];
  town: { label: string; count: number }[];
  brand: { label: string; count: number }[];
  model: { label: string; count: number }[];
  condition: { label: string; count: number }[];
  storage: { label: string; count: number }[];
  color: { label: string; count: number }[];
  ram: { label: string; count: number }[];
  screenSize: { label: string; count: number }[];
  exchangePossible: { label: string; count: number }[];
  negotiable: { label: string; count: number }[];
  verifiedSellers: { label: string; count: number }[];
};

interface CountData {
  countAds: ICountType;
}

interface PhoneResponse {
  phones: [];
  hasMore: boolean;
  total: number;
  page: number;
  countAds: ICountType;
}

export interface IFormDataTypes {
  region: string;
  town: string;
  brand: string;
  model: string;
  condition: string;
  priceMin: string;
  priceMax: string;
  ram: string;
  screenSize: string;
  storage: string;
  color: string;
  exchangePossible: string;
  negotiable: string;
  idVerified: string;
}

export const labelTextColor = "text-gray-600";

const popularBrands = [
  { imgUrl: "/images/popular-brands/mobilephones/apple.webp", brand: "Apple" },
  {
    imgUrl: "/images/popular-brands/mobilephones/samsung.webp",
    brand: "Samsung",
  },
  {
    imgUrl: "/images/popular-brands/mobilephones/google.webp",
    brand: "Google",
  },
  { imgUrl: "/images/popular-brands/mobilephones/lg.webp", brand: "Lg" },
  {
    imgUrl: "/images/popular-brands/mobilephones/xiaomi.webp",
    brand: "Xiaomi",
  },
  {
    imgUrl: "/images/popular-brands/mobilephones/huawei.webp",
    brand: "Huawei",
  },
  { imgUrl: "/images/popular-brands/mobilephones/tecno.webp", brand: "Tecno" },
  {
    imgUrl: "/images/popular-brands/mobilephones/infinix.webp",
    brand: "Infinix",
  },
];

export default function MobilePhones() {
  const searchParams = useSearchParams();

  const { register, control, setValue, watch, getValues, resetField } =
    useForm<IFormDataTypes>({
      defaultValues: {
        region: searchParams.get("region") ?? "",
        town: searchParams.get("town") ?? "",
        brand: searchParams.get("brand") ?? "",
        model: searchParams.get("model") ?? "",
        condition: searchParams.get("condition") ?? "",
        priceMin: searchParams.get("price_min") ?? "",
        priceMax: searchParams.get("price_max") ?? "",
        ram: searchParams.get("ram") ?? "",
        screenSize: searchParams.get("screen_size") ?? "",
        storage: searchParams.get("storage") ?? "",
        color: searchParams.get("color") ?? "",
        exchangePossible: searchParams.get("exchange_possible") ?? "",
        negotiable: searchParams.get("negotiable") ?? "",
        idVerified: searchParams.get("id_verified") ?? "",
      },
    });

  const [
    watchBrandValue,
    watchModelValue,
    watchRegionValue,
    watchTownValue,
    watchConditionValue,
    watchStorageValue,
    watchColorValue,
    watchRamValue,
    watchScreenSizeValue,
    watchExchangePossibleValue,
    watchNegotiableValue,
    watchIdVerification,
  ] = watch([
    "brand",
    "model",
    "region",
    "town",
    "condition",
    "storage",
    "color",
    "ram",
    "screenSize",
    "exchangePossible",
    "negotiable",
    "idVerified",
  ]);

  const [trigger, setTrigger] = useState(0);
  const [myCount, setMyCount] = useState<CountData>({
    countAds: {
      region: [{ label: "", count: 0 }],
      town: [{ label: "", count: 0 }],
      brand: [{ label: "", count: 0 }],
      model: [{ label: "", count: 0 }],
      condition: [{ label: "", count: 0 }],
      storage: [{ label: "", count: 0 }],
      color: [{ label: "", count: 0 }],
      ram: [{ label: "", count: 0 }],
      screenSize: [{ label: "", count: 0 }],
      exchangePossible: [{ label: "", count: 0 }],
      negotiable: [{ label: "", count: 0 }],
      verifiedSellers: [{ label: "", count: 0 }],
    },
  });
  const [metadata, setMetadata] = useState({
    hasMore: false,
    total: 0,
    page: 1,
  });

  const list = useAsyncList<MobilePhonesHalfType>({
    async load({ signal, cursor, filterText }) {
      const res = await fetch(
        cursor || `/api/fetch/mobile/phones?page=1&${filterText}`,
        {
          signal,
        },
      );
      const json = (await res.json()) as PhoneResponse;

      setMyCount({
        countAds: json.countAds,
      });

      setMetadata({
        hasMore: json.hasMore,
        total: json.total,
        page: json.page,
      });

      return {
        items: json.phones,
        cursor: json.hasMore
          ? `/api/fetch/mobile/phones?page=${json.page + 1}&${filterText}`
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

  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    const query = new URLSearchParams({});

    if (watchRegionValue) query.set("region", watchRegionValue);
    if (watchTownValue) query.set("town", watchTownValue);
    if (watchBrandValue) query.set("brand", watchBrandValue);
    if (watchModelValue) query.set("model", watchModelValue);
    if (watchConditionValue) query.set("condition", watchConditionValue);
    if (getValues("priceMin"))
      query.set("price_min", getValues("priceMin").toString());
    if (getValues("priceMax"))
      query.set("price_max", getValues("priceMax").toString());
    if (watchStorageValue) query.set("storage", watchStorageValue);
    if (watchColorValue) query.set("color", watchColorValue);
    if (watchRamValue) query.set("ram", watchRamValue);
    if (watchScreenSizeValue) query.set("screen_size", watchScreenSizeValue);
    if (watchExchangePossibleValue)
      query.set("exchange_possible", watchExchangePossibleValue);
    if (watchNegotiableValue) query.set("negotiable", watchNegotiableValue);
    if (watchIdVerification) query.set("id_verified", watchIdVerification);

    listRef.current.setFilterText(query.toString());
    window.history.replaceState(null, "", `?${query.toString()}`);
  }, [
    getValues,
    trigger,
    router,
    watchBrandValue,
    watchConditionValue,
    watchModelValue,
    watchRegionValue,
    watchTownValue,
    watchRamValue,
    watchStorageValue,
    watchColorValue,
    watchScreenSizeValue,
    watchExchangePossibleValue,
    watchNegotiableValue,
    watchIdVerification,
  ]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pt-6 bg-gray-50/30">
      <form>
        {/* Breadcrumb */}
        <div className={`w-full ${siteMaxWidth} m-auto mb-6 px-4`}>
          <Badge
            className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 cursor-pointer py-1.5 shadow-sm"
            onClick={() => router.push("/")}
          >
            ← Back to Home
          </Badge>
        </div>

        {/* LAYOUT GRID:
           lg:grid-cols-[280px_1fr] -> Creates the sidebar (280px) and content area on Desktop
           flex-col -> Stacks them on Mobile
           overflow-x-hidden -> Prevents body scroll issues
        */}
        <div
          className={`w-full ${siteMaxWidth} m-auto grid lg:grid-cols-[280px_1fr] gap-8 px-4 pb-44`}
        >
          {/* --- LEFT SIDEBAR (STICKY on Desktop, SCROLLABLE on Mobile) --- */}
          <div className="w-full overflow-hidden">
            <aside className="w-screen lg:w-full lg:sticky lg:top-4 self-start h-fit lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto scrollbar-hide">
              <div className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
                <Filter size={18} /> Filters
              </div>

              {/* THE MAGIC SCROLL CONTAINER:
                flex-row: Horizontal on Mobile
                overflow-x-auto: Scrollable X on Mobile
                snap-x: Snappy feel on Mobile
                -mx-4 px-4: Allows scroll to touch screen edges while keeping content padded
                lg:flex-col: Stacks vertically on Desktop
                lg:overflow-visible: Removes scroll on Desktop (uses sticky)
            */}
              <div className="flex flex-row gap-4 overflow-x-auto snap-x scrollbar-none pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 lg:pb-0 lg:flex-col lg:overflow-visible">
                {/* Card 1: Region & Town (2 Inputs) */}
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-4 flex flex-col lg:flex-col gap-4 rounded-xl min-w-70 lg:w-full">
                  <div className="w-full">
                    <Label className={labelTextColor} htmlFor="region">
                      Region
                    </Label>
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
                    <Label className={labelTextColor} htmlFor="town">
                      Town
                    </Label>
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
                      <Input
                        disabled
                        className="w-full bg-gray-50"
                        placeholder="Select region first"
                      />
                    )}
                  </div>
                </div>

                {/* Card 2: Brand & Model (2 Inputs) */}
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-4 flex flex-col lg:flex-col gap-4 rounded-xl min-w-70 lg:w-full">
                  <div className="w-full">
                    <Label className={labelTextColor} htmlFor="brand">
                      Brand
                    </Label>
                    <SelectSearchWithAdsCount
                      name="brand"
                      labelText="brand"
                      placeholder="All Brands"
                      countedItems={myCount.countAds.brand}
                      setValue={setValue}
                      control={control}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className={labelTextColor} htmlFor="model">
                      Model
                    </Label>
                    {watchBrandValue ? (
                      <SelectSearchWithAdsCount
                        name="model"
                        labelText="model"
                        placeholder="All Models"
                        countedItems={myCount.countAds.model}
                        setValue={setValue}
                        control={control}
                        className="w-full"
                      />
                    ) : (
                      <Input
                        disabled
                        className="w-full bg-gray-50"
                        placeholder="Select brand first"
                      />
                    )}
                  </div>
                </div>

                {/* Card 3: Condition & Price (2 Inputs) */}
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-4 flex flex-col lg:flex-col gap-4 rounded-xl min-w-70 lg:w-full">
                  <div className="w-full">
                    <Label className={labelTextColor} htmlFor="condition">
                      Condition
                    </Label>
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
                        <PriceShared
                          name="priceMin"
                          register={register}
                          placeholder="Min"
                        />
                      </div>
                      <span className="text-gray-400">-</span>
                      <div className="w-full">
                        <PriceShared
                          name="priceMax"
                          register={register}
                          placeholder="Max"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span
                        onClick={() => {
                          if (getValues("priceMin") || getValues("priceMax")) {
                            setTrigger(Date.now());
                          }
                        }}
                        className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline"
                      >
                        Apply Filter
                      </span>
                      <span
                        onClick={() => {
                          setValue("priceMax", "");
                          setValue("priceMin", "");
                          setTrigger(Date.now());
                        }}
                        className="text-xs text-gray-400 cursor-pointer hover:text-gray-600"
                      >
                        Clear
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Specs A - Storage & RAM (2 Inputs) */}
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-4 flex flex-col lg:flex-col gap-4 rounded-xl min-w-70 lg:w-full">
                  <div className="w-full">
                    <Label className={labelTextColor} htmlFor="storage">
                      Storage
                    </Label>
                    <SelectSearchWithAdsCount
                      name="storage"
                      labelText="storage"
                      placeholder="Any Storage"
                      countedItems={myCount.countAds.storage}
                      setValue={setValue}
                      control={control}
                      className="w-full"
                    />
                  </div>
                  <div className="w-full">
                    <Label className={labelTextColor} htmlFor="ram">
                      Ram
                    </Label>
                    <SelectSearchWithAdsCount
                      name="ram"
                      labelText="ram"
                      placeholder="Any RAM"
                      countedItems={myCount.countAds.ram}
                      setValue={setValue}
                      control={control}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Card 5: Specs B - Color & Screen (2 Inputs) */}
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-4 flex flex-col lg:flex-col gap-4 rounded-xl min-w-70 lg:w-full">
                  <div>
                    <Label className={labelTextColor} htmlFor="color">
                      Color
                    </Label>
                    {watchModelValue ? (
                      <SelectSearchWithAdsCount
                        name="color"
                        labelText="color"
                        placeholder="Any Color"
                        countedItems={myCount.countAds.color}
                        setValue={setValue}
                        control={control}
                        className="w-full"
                      />
                    ) : (
                      <Input
                        disabled
                        className="w-full bg-gray-50"
                        placeholder="Select model first"
                      />
                    )}
                  </div>
                  <div className="w-full">
                    <Label className={labelTextColor} htmlFor="screenSize">
                      Screen size
                    </Label>
                    <SelectSearchWithAdsCount
                      name="screenSize"
                      labelText="screen size"
                      placeholder="Any Size"
                      countedItems={myCount.countAds.screenSize}
                      setValue={setValue}
                      control={control}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Card 6: Deal Options (2 Inputs) */}
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-4 flex flex-col lg:flex-col gap-4 rounded-xl min-w-70 lg:w-full">
                  <div className="w-full">
                    <Label
                      className={labelTextColor}
                      htmlFor="exchangePossible"
                    >
                      Exchange possible
                    </Label>
                    <SelectSearchWithAdsCount
                      name="exchangePossible"
                      labelText="exchange possible"
                      placeholder="Show all"
                      countedItems={myCount.countAds.exchangePossible}
                      setValue={setValue}
                      control={control}
                      className="w-full"
                    />
                  </div>
                  <div className="w-full">
                    <Label className={labelTextColor} htmlFor="negotiable">
                      Negotiable
                    </Label>
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
                </div>

                {/* Card 7: Seller Status (1 Input - Last One) */}
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-4 flex flex-col lg:flex-col gap-4 rounded-xl min-w-70 lg:w-full">
                  <section className="grid w-full items-center gap-1.5">
                    <Label htmlFor="verified_seller">Seller status</Label>
                    <SelectSearchWithAdsCount
                      name="idVerified"
                      labelText="verified seller"
                      placeholder="Show all"
                      setValue={setValue}
                      countedItems={myCount.countAds.verifiedSellers}
                      control={control}
                      className="w-full"
                    />
                  </section>
                </div>

                {/* Spacer for Mobile Scroll End so last card isn't cut off */}
                <div className="w-4 shrink-0 lg:hidden"></div>
              </div>
            </aside>
          </div>

          {/* --- RIGHT CONTENT (Results) --- */}
          <div className="w-full h-full overflow-x-auto">
            <section className="w-full">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Mobile Phones
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Showing {list.items.length} of {metadata.total} results
                  </p>
                </div>
              </div>

              <section className="w-full h-full">
                <p className="font-semibold text-sm text-gray-600 mb-3">
                  Popular brands
                </p>
                <div className="w-full min-h-fit overflow-x-auto mb-8 pb-2">
                  <PopularBrands
                    items={popularBrands}
                    setColor={(brand) => {
                      if (watchBrandValue === brand) {
                        resetField("brand");
                      } else {
                        setValue("brand", brand);
                      }
                    }}
                    watchBrand={watchBrandValue}
                  />
                </div>

                {list.isLoading && list.items.length === 0 ? (
                  <div className="w-full min-h-40">
                    <BeatLoaderUI
                      color={"blue"}
                      size={10}
                      className="w-full max-w-7xl m-auto mb-6 flex justify-center pt-4"
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    {list.items.length === 0 && metadata.hasMore == false ? (
                      <div className="w-full bg-empty-box bg-no-repeat bg-center h-72 opacity-50 grayscale"></div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 w-full">
                        {list.items.map((phone) => (
                          <ProductsCard
                            key={phone.adsId}
                            id={`/mobile-phones/${phone.slug}`}
                            adsId={phone.adsId}
                            firstImageUrl={phone.firstImage}
                            price={phone.price}
                            title={phone.title}
                            location={phone.region + ", " + phone.town}
                            condition={phone.condition}
                            createdAt={phone.createdAt}
                            description={phone.description}
                            isVerifiedStore={phone.idVerified}
                          />
                        ))}
                      </div>
                    )}

                    <div
                      className={!metadata.hasMore ? "hidden" : "block"}
                      ref={ref}
                    >
                      <BeatLoaderUI
                        color={"blue"}
                        size={10}
                        className="w-full max-w-7xl m-auto mb-6 flex justify-center pt-10"
                      />
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
