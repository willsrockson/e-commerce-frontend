"use client"
import {useRouter, useSearchParams} from 'next/navigation'
import {IMobilePhonesHalfType} from "@/lib/interfaces";
import ProductsCard from "@/components/products-card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import { useEffect, useRef, useState} from "react";
import {Badge} from "@/components/ui/badge";
import BeatLoaderUI from "@/components/loaders/BeatLoader";
import {useAsyncList} from 'react-stately';
import { useInView } from "react-intersection-observer";
import { useForm } from "react-hook-form";
import PriceShared from "@/components/sharedUi/price";
import SelectSearchWithAdsCount from '@/components/sharedUi/withAdsCount/select-search';
import PopularBrands from './popular-brands';
import { siteMaxWidth } from '@/lib/constants';

type ICountType = {
   region: { label:string; count: number; }[];
   town: { label:string; count: number; }[];
   brand: { label:string; count: number; }[];
   model: { label:string; count: number; }[];
   condition: { label:string; count: number; }[];
   storage: { label:string; count: number; }[];
   color: { label:string; count: number; }[];
   ram: { label:string; count: number; }[];
   screenSize: { label:string; count: number; }[];
   exchangePossible: { label:string; count: number; }[];
   negotiable: { label:string; count: number; }[];
   verifiedSellers: { label:string; count: number; }[];
}

interface CountData{
    countAds: ICountType;
}

interface PhoneResponse{
    phones: [];
    hasMore:boolean; 
    total:number;
    page: number;
    countAds: ICountType;
}

export interface IFormDataTypes{
    region: string;
    town: string;
    brand: string;
    model: string;
    condition: string;
    price_min: string;
    price_max: string;
    ram: string;
    screen_size: string;
    storage: string;
    color: string;
    exchange_possible: string;
    negotiable: string;
    id_verification_status: string;
}

export const labelTextColor = "text-gray-600";

const popularBrands = [
         {
            imgUrl: '/images/popular-brands/mobilephones/apple.webp',
            brand: 'Apple'
         },
         {
            imgUrl: '/images/popular-brands/mobilephones/samsung.webp',
            brand: 'Samsung'
         },
         {
            imgUrl: '/images/popular-brands/mobilephones/google.webp',
            brand: 'Google'
         },
         {
            imgUrl: '/images/popular-brands/mobilephones/lg.webp',
            brand: 'Lg'
         },
         {
            imgUrl: '/images/popular-brands/mobilephones/xiaomi.webp',
            brand: 'Xiaomi'
         },
         {
            imgUrl: '/images/popular-brands/mobilephones/huawei.webp',
            brand: 'Huawei'
         },
         {
            imgUrl: '/images/popular-brands/mobilephones/tecno.webp',
            brand: 'Tecno'
         },
         {
            imgUrl: '/images/popular-brands/mobilephones/infinix.webp',
            brand: 'Infinix'
         }
    ]

export default function MobilePhones() {
    const searchParams = useSearchParams();

    const {register, control , setValue , watch, getValues, resetField } = useForm<IFormDataTypes>({
        defaultValues:{
            region: searchParams.get('region') ?? '',
            town: searchParams.get('town') ?? '',
            brand: searchParams.get('brand') ?? '',
            model: searchParams.get('model') ?? '',
            condition: searchParams.get('condition') ?? '',
            price_min:searchParams.get('price_min') ?? '',
            price_max: searchParams.get('price_max') ?? '',
            ram: searchParams.get('ram') ?? '',
            screen_size: searchParams.get('screen_size') ?? '',
            storage: searchParams.get('storage') ?? '',
            color: searchParams.get('color') ?? '',
            exchange_possible: searchParams.get('exchange_possible') ?? '',
            negotiable: searchParams.get('negotiable') ?? '',
            id_verification_status: searchParams.get('id_verification_status') ?? ''
        }
    })

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
        watchIdVerification
    ] = watch(["brand", "model", "region", "town", "condition", "storage", "color" ,"ram", "screen_size", "exchange_possible", "negotiable", "id_verification_status"]);
    
    const [trigger, setTrigger] = useState(0);
    const [myCount, setMyCount] = useState<CountData>({
         countAds: {
             region:[{label: '', count: 0 }],
             town:[{label: '', count: 0 }],
             brand:[{label: '', count: 0 }],
             model:[{label: '', count: 0 }],
             condition:[{label: '', count: 0 }],
             storage:[{label: '', count: 0 }],
             color:[{label: '', count: 0 }],
             ram:[{label: '', count: 0 }],
             screenSize:[{label: '', count: 0 }],
             exchangePossible:[{label: '', count: 0 }],
             negotiable:[{label: '', count: 0 }],
             verifiedSellers: [{label: '', count: 0 }]  
         }
    });
    const [metadata, setMetadata] = useState({
         hasMore: false,
         total: 0,
         page: 1,
    })

    const list = useAsyncList<IMobilePhonesHalfType>({
        async load({ signal, cursor, filterText }) {
        const res = await fetch(cursor || `/api/fetch/mobile/phones?page=1&${filterText}`, {
        signal
        });
        const json = await res.json() as PhoneResponse
        
        setMyCount({
            countAds: json.countAds
        })
          
        // Store metadata separately
        setMetadata({
            hasMore: json.hasMore,
            total: json.total,
            page: json.page
        });
        
        return {
        items: json.phones,
        cursor: json.hasMore ? `/api/fetch/mobile/phones?page=${json.page + 1}&${filterText}`: undefined
        };
    }
    });


    const listRef = useRef(list);

    useEffect(()=>{
      listRef.current = list
    },[list])


    const { ref, inView,} = useInView({
         rootMargin: '500px',
         threshold: 0
    });
   

    useEffect(()=> {

        if( listRef.current.items.length && inView && !listRef.current.isLoading ){
           listRef.current.loadMore(); 
        }    
    }, [inView])
    
    //Search
    const router = useRouter()
  
     
    useEffect(() => {
        
        const query = new URLSearchParams({
            //region: 'Greater Accra'
        })

        //listRef.current.reload();
        if(watchRegionValue){
             query.set('region', watchRegionValue);
        }
        if(watchTownValue ){
             query.set('town', watchTownValue);
        }
         if (watchBrandValue){
            query.set('brand', watchBrandValue);
        }
         if (watchModelValue){
            query.set('model', watchModelValue);
        }
         if (watchConditionValue){
            query.set('condition', watchConditionValue);
        }
        if(getValues('price_min')){
            query.set('price_min', getValues('price_min').toString());
        }
        if(getValues('price_max')){
            query.set('price_max', getValues('price_max').toString());
        }
        if(watchStorageValue){
           query.set('storage', watchStorageValue);
        }
        if(watchColorValue){
           query.set('color', watchColorValue);
        }
        if(watchRamValue){
            query.set('ram',watchRamValue );
        }
        if(watchScreenSizeValue){
            query.set('screen_size', watchScreenSizeValue );
        }
        if(watchExchangePossibleValue){
            query.set('exchange_possible', watchExchangePossibleValue );
        }
         if(watchNegotiableValue){
            query.set('negotiable', watchNegotiableValue );
        }
        if(watchIdVerification){
            query.set('id_verification_status', watchIdVerification );
        }

        listRef.current.setFilterText(query.toString());
        window.history.replaceState(null, '', `?${query.toString()}`); // This updates the browser url
        //window.scrollTo({top: 0, behavior: 'smooth' });

    },[getValues, trigger, router, watchBrandValue, watchConditionValue, watchModelValue, watchRegionValue, watchTownValue, watchRamValue, watchStorageValue, watchColorValue, watchScreenSizeValue, watchExchangePossibleValue, watchNegotiableValue, watchIdVerification]);
   
       

    // bg-[#EBF1F4]
    return (
        <div className="w-full min-h-[calc(100vh-4rem)] pt-6">
            <form>
                <div className={`w-full ${siteMaxWidth} m-auto mb-6 px-4`}>
                    <Badge
                        className="bg-cardBg rounded-lg hover:bg-[#F4F3F3] text-gray-600 cursor-pointer py-1.5"
                        onClick={() => router.push("/")}
                    >
                        Home
                    </Badge>
                </div>

                <div className={`w-full ${siteMaxWidth} m-auto grid lg:grid-cols-[1.5fr_3fr] xl:grid-cols-[1fr_3fr] gap-4 px-4 pb-44`}>
                    {/*Grid first item #87A2FF */}
                    <section className="w-full overflow-hidden">
                        <div className="w-full">
                            <div className="bg-[#9DBDFF] shadow-md w-full flex justify-center py-3 items-center mb-4 rounded-lg relative">
                                <p className="text-gray-600 font-medium md:text-lg">
                                    Search results ⋆ {metadata.total}{" "}
                                </p>
                            </div>

                            <div className="w-screen lg:w-full scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-100 scroll-smooth overflow-x-scroll flex flex-row lg:flex-col gap-4">
                                {/* 1st Card Below */}

                                <div className="bg-cardBg border shadow-md px-4 py-4 flex flex-col lg:flex-col gap-4 rounded-lg min-w-72 lg:w-full">
                                    {/* item 1 */}
                                    <div className="w-full">
                                        <Label
                                            className={labelTextColor}
                                            htmlFor="region"
                                        >
                                            Region
                                        </Label>
                                        <SelectSearchWithAdsCount
                                            name="region"
                                            control={control}
                                            countedItems={myCount.countAds.region}
                                            setValue={setValue}
                                            labelText="region"
                                            className="w-full"
                                            placeholder="Show all"
                                        />
                                    </div>

                                    {/* Item 2 */}
                                    <div className="w-full">
                                        <Label
                                            className={labelTextColor}
                                            htmlFor="town"
                                        >
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
                                                placeholder="Show all"
                                            />
                                        ) : (
                                            <div className="w-full">
                                                {watchRegionValue && (
                                                    <Label htmlFor="town">Town</Label>
                                                )}
                                                <Input
                                                    disabled
                                                    className="w-full"
                                                    placeholder="* select region first"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/*  2nd Card Below  */}

                                <div className="bg-cardBg border shadow-md px-4 py-4 flex flex-col lg:flex-col gap-4 rounded-lg min-w-72 lg:w-full">
                                    {/* item 1 */}
                                    <div className="w-full">
                                        <Label
                                            className={labelTextColor}
                                            htmlFor="brand"
                                        >
                                            Brand
                                        </Label>
                                        <SelectSearchWithAdsCount
                                            name="brand"
                                            labelText="brand"
                                            placeholder="Show all"
                                            countedItems={myCount.countAds.brand}
                                            setValue={setValue}
                                            control={control}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Item 2 */}

                                    <div>
                                        <Label
                                            className={labelTextColor}
                                            htmlFor="model"
                                        >
                                            Model
                                        </Label>
                                        {watchBrandValue ? (
                                            <SelectSearchWithAdsCount
                                                name="model"
                                                labelText="model"
                                                placeholder="Show all"
                                                countedItems={myCount.countAds.model}
                                                setValue={setValue}
                                                control={control}
                                                className="w-full"
                                            />
                                        ) : (
                                            <div className="w-full">
                                                {watchBrandValue && (
                                                    <Label htmlFor="model">Model</Label>
                                                )}
                                                <Input
                                                    disabled
                                                    className="w-full"
                                                    placeholder="* select brand first"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 3rd Card */}

                                <div className="bg-cardBg border shadow-md px-4 py-4 flex flex-col lg:flex-col gap-4 rounded-lg min-w-72 lg:w-full">
                                    {/* Item 1 */}
                                    <div className="w-full">
                                        <Label
                                            className={labelTextColor}
                                            htmlFor="condition"
                                        >
                                            Condition
                                        </Label>
                                        <SelectSearchWithAdsCount
                                            name="condition"
                                            labelText="condition"
                                            placeholder="Show all"
                                            countedItems={myCount.countAds.condition}
                                            setValue={setValue}
                                            control={control}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* item 2 */}
                                    <div className="w-full flex justify-center items-center gap-3">
                                        <div className="w-full">
                                            <Label
                                                className={labelTextColor}
                                                htmlFor="price_min"
                                            >
                                                Price
                                            </Label>
                                            <PriceShared
                                                name="price_min"
                                                register={register}
                                                placeholder="Min"
                                            />
                                        </div>

                                        <div className="w-full">
                                            <Label
                                                htmlFor="price_max"
                                                className="opacity-0"
                                            >
                                                Price
                                            </Label>
                                            <PriceShared
                                                name="price_max"
                                                register={register}
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-gray-400 text-xs px-1 flex justify-between cursor-pointer">
                                        <span
                                            onClick={() => {
                                                if (
                                                    getValues("price_max") ||
                                                    getValues("price_min")
                                                ) {
                                                    setValue("price_max", "");
                                                    setValue("price_min", "");
                                                    setTrigger(Date.now());
                                                }
                                            }}
                                        >
                                            Clear price
                                        </span>

                                        <span
                                            onClick={() => {
                                                if (
                                                    getValues("price_min") ||
                                                    getValues("price_max")
                                                ) {
                                                    setTrigger(Date.now());
                                                }
                                            }}
                                            className="text-xs text-blue-500"
                                        >
                                            Filter
                                        </span>
                                    </div>
                                </div>

                                {/* Card 4 */}

                                <div className="bg-cardBg border shadow-md px-4 py-4 flex flex-col lg:flex-col gap-4 rounded-lg min-w-72 lg:w-full ">
                                    {/* Item 1 */}
                                    <div className="w-full">
                                        <Label
                                            className={labelTextColor}
                                            htmlFor="storage"
                                        >
                                            Storage
                                        </Label>
                                        <SelectSearchWithAdsCount
                                            name="storage"
                                            labelText="storage"
                                            placeholder="Show all"
                                            countedItems={myCount.countAds.storage}
                                            setValue={setValue}
                                            control={control}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Item 2 */}

                                    <div>
                                        <Label
                                            className={labelTextColor}
                                            htmlFor="color"
                                        >
                                            Color
                                        </Label>
                                        {watchModelValue ? (
                                            <SelectSearchWithAdsCount
                                                name="color"
                                                labelText="color"
                                                placeholder="Show all"
                                                countedItems={myCount.countAds.color}
                                                setValue={setValue}
                                                control={control}
                                                className="w-full"
                                            />
                                        ) : (
                                            <div className="w-full">
                                                {watchModelValue && (
                                                    <Label htmlFor="color">Color</Label>
                                                )}
                                                <Input
                                                    disabled
                                                    className="w-full"
                                                    placeholder="* select model first"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card 5 */}

                                <div className="bg-cardBg border shadow-md px-4 py-4 flex flex-col lg:flex-col gap-4 rounded-lg min-w-72 lg:w-full ">
                                    {/* Item 1 */}
                                    <div className="w-full">
                                        <Label
                                            className={labelTextColor}
                                            htmlFor="ram"
                                        >
                                            Ram
                                        </Label>
                                        <SelectSearchWithAdsCount
                                            name="ram"
                                            labelText="ram"
                                            placeholder="Show all"
                                            countedItems={myCount.countAds.ram}
                                            setValue={setValue}
                                            control={control}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Item 2 */}
                                    <div className="w-full">
                                        <Label
                                            className={labelTextColor}
                                            htmlFor="screen_size"
                                        >
                                            Screen size
                                        </Label>
                                        <SelectSearchWithAdsCount
                                            name="screen_size"
                                            labelText="screen size"
                                            placeholder="Show all"
                                            countedItems={myCount.countAds.screenSize}
                                            setValue={setValue}
                                            control={control}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* Card 6 */}

                                <div className="bg-cardBg border shadow-md px-4 py-4 flex flex-col lg:flex-col gap-4 rounded-lg min-w-72 lg:w-full ">
                                    {/* Item 1 */}
                                    <div className="w-full">
                                        <Label
                                            className={labelTextColor}
                                            htmlFor="exchange_possible"
                                        >
                                            Exchange possible
                                        </Label>
                                        <SelectSearchWithAdsCount
                                            name="exchange_possible"
                                            labelText="exchange possible"
                                            placeholder="Show all"
                                            countedItems={myCount.countAds.exchangePossible}
                                            setValue={setValue}
                                            control={control}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Item 2 */}
                                    <div className="w-full">
                                        <Label
                                            className={labelTextColor}
                                            htmlFor="negotiable"
                                        >
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

                                {/* Card 7 */}

                                <div className="bg-cardBg border shadow-md px-4 py-4 flex flex-col lg:flex-col gap-4 rounded-lg min-w-72 lg:w-full ">
                                    {/* Item One */}
                                    <section className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="verified_seller">Seller status</Label>
                                        <SelectSearchWithAdsCount
                                            name="id_verification_status"
                                            labelText="verified seller"
                                            placeholder="Show all"
                                            setValue={setValue}
                                            countedItems={myCount.countAds.verifiedSellers}
                                            control={control}
                                            className="w-full"
                                        />
                                    </section>
                                </div>

                                {/* it another small card and serves as spacer so that the last card be fully shown */}
                                <div className="w-20 h-fit opacity-0">
                                    <p>Spacer</p>
                                </div>
                            </div>

                            {/* <div>
                                <Button onClick={()=> reset() } variant={"outline"}>
                                    <Trash2 size={16} /> Clear filters
                                </Button>
                            </div> */}
                        </div>
                    </section>

                    {/* Second grid */}
                    <section className="w-full h-full overflow-x-auto ">
                        <p className="font-semibold text-lg text-gray-800 mb-3">
                                Some popular brands
                            </p>
                        <div className="w-full min-h-fit overflow-x-auto mb-10">
                            
                            <PopularBrands
                                items={popularBrands}
                                setColor={(brand) => {
                                    if (watchBrandValue === brand) {
                                       resetField('brand');
                                    } else {
                                       setValue("brand", brand);
                                    }
                                }}
                              watchBrand={watchBrandValue}   
                            />
                        </div>

                        { (list.isLoading && list.items.length === 0) ? (
                            <div className="w-full min-h-40">
                                <BeatLoaderUI
                                    color={"blue"}
                                    size={10}
                                    className="w-full max-w-7xl m-auto mb-6 flex justify-center pt-4"
                                />
                            </div>
                          ) : (
                            <div className="w-full">
                                {/* <p className="mb-5 font-medium text-lg line-clamp-1">Mobile Phones in {queryData.region || 'Ghana'}{queryData.town ? ', '+queryData.town : ''}</p> */}
                                {( list.items.length === 0 && metadata.hasMore == false ) ? (
                                    <div className="w-full bg-empty-box bg-no-repeat bg-center h-72"></div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-2 w-full">
                                        {list.items.map((phone) => (
                                            <ProductsCard
                                                key={phone.ads_id}
                                                id={`/mobilephones/${phone.ads_id}`}
                                                firstImageUrl={phone.firstImage}
                                                price={phone.price}
                                                title={phone.title}
                                                location={phone.region + ", " + phone.town}
                                                condition={phone.condition}
                                                createdAt={phone.createdAt}
                                                description={phone.description}
                                                isVerifiedStore={phone.userIdVerificationStatus}
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
                                        className="w-full max-w-7xl m-auto mb-6 flex justify-center pt-4"
                                    />
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </form>
        </div>
    );
}


