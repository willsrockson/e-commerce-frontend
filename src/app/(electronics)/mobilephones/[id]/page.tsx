"use client";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IMobilePhonesAdsFullType } from "@/lib/interfaces";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import {
  PhoneCall,
  MapPin,
  MessageSquareMore,
  MoveLeft,
  Copy,
  Bookmark
} from "lucide-react";
import useSWR from "swr";
import BeatLoaderUI from "@/components/loaders/BeatLoader";
import ProductsCard from "@/components/products-card";
import { IMobilePhonesHalfType } from "@/lib/interfaces";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useRef, useState } from "react";
import { toastError, toastSuccess } from "@/components/toasts/toasts";
import { useAsyncList } from "react-stately";
import { useInView } from "react-intersection-observer";
import { siteMaxWidth } from "@/lib/constants";

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

interface IBuyLater{
  ads_id: string;
  title: string; 
  phone_primary: string; 
  condition: string; 
  image_url:string; 
  price: number; 
  location: string;
}

interface IListResponse{
    relatedListing: [];
    onePhone: [];
    hasMore:boolean; 
    total:number;
    page: number;
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Phone() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const { data: adCounter, mutate: adCounterMutate } = useSWR<{ total: number }>(`/api/fetch/mobile/saved/ad/count/${params.id}`,fetcher);
  const { data: buyLData, mutate } = useSWR<{ buyLater: boolean }>(`/api/fetch/mobile/saved/ad/status/${params.id}`,fetcher);
  const [open, setOpen] = useState(false);
  
  const [data, setOnePhone] = useState<IMobilePhonesAdsFullType[] | null>(null);

  const [metadata, setMetadata] = useState({
         hasMore: false,
         total: 0,
         page: 1,
    })

  
  const list = useAsyncList<IMobilePhonesHalfType>({
          async load({ signal, cursor }) {
          const res = await fetch(cursor || `/api/fetch/mobile/phones/${params.id}?page=1`, {
          signal
          });
          const json = await res.json() as IListResponse;

          console.log(json);
          
          //Store metadata separately
          setOnePhone(json.onePhone )
          setMetadata({
              hasMore: json.hasMore,
              total: json.total,
              page: json.page
          });
          
          return {
          items: json.relatedListing,
          cursor: json.hasMore ? `/api/fetch/mobile/phones/${params.id}?page=${json.page + 1}`: undefined
          };
      }
      });

  
  const listRef = useRef(list);
  
      useEffect(()=>{
        listRef.current = list
      },[list])
          
  const { ref, inView,} = useInView({
         rootMargin: '200px',
         threshold: 0
    });  

  useEffect(()=> {
        if( listRef.current.items.length && inView && !listRef.current.isLoading ){
           listRef.current.loadMore(); 
        }    
    }, [inView])
   
  const addToBuyLater = async ({ads_id, title, condition, price, location, image_url, phone_primary}: IBuyLater) => {
    const res = await fetch(`/api/fetch/mobile/save/ad/${params.id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
           ads_id,
           title,
           condition,
           price,
           location,
           image_url,
           phone_primary
      })
    });
    if (!res.ok) {
      const data = await res.json() as { errorMessage: string; isValidUser: boolean;}
      console.log(data);
      
      if (data.isValidUser === false) {
        toastError({
            message: 'Please login to bookmark this item'
          })
        return;
      }
      toastError({
        message: data.errorMessage,
      });
      return;
    }

    const data = await res.json();
    await mutate({ buyLater: !buyLData?.buyLater }, true);
    await adCounterMutate({total: 1 }, true)
    toastSuccess({ message: `${data?.message}`});
  };

  const copyTextAlert = async () => {
    toastSuccess({ message: "Copied" });
  };

  return (
    <div className="w-full">
      <div className="w-full p-4">
        <div className={`w-full ${siteMaxWidth} px-4 m-auto pt-6 `}>
          <div className="flex items-center justify-start w-full mb-6 gap-3">
            <Badge
              className="bg-cardBg hover:bg-[#F4F3F3] text-gray-600 cursor-pointer"
              onClick={() => router.back()}
            >
              <MoveLeft />
            </Badge>

            <Badge
              className="bg-cardBg hover:bg-[#F4F3F3] text-gray-600 cursor-pointer py-1.5"
              onClick={() => router.push("/")}
            >
              Home
            </Badge>
          </div>

          { data === null || data?.length === 0 ? (
            < BeatLoaderUI 
              size={10}
              className="w-full max-w-7xl m-auto mb-6 flex justify-center pt-4"
              color={"#9DBDFF"} 
             />
          ) : (
            data?.map((phone) => (
              <div
                key={phone.ads_id}
                className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-2"
              >
                {/*Image-box  w-full max-h-[500px] relative overflow-hidden flex justify-center items-center rounded-lg bg-cardBg*/}
                <div className="w-full max-h-[600px] overflow-hidden rounded">
                  <Swiper
                    spaceBetween={2}
                    slidesPerView={1}
                    breakpoints={{
                      768: {
                        slidesPerView: 2, // show 2 images on screens ≥768px (e.g. tablets, desktops)
                      },
                    }}
                    navigation={true} // enable navigation
                    modules={[Navigation]}
                    className="mySwiper"
                  >
                    {phone.images.map((photo, index) => (
                      <SwiperSlide key={index}>
                        <div className="relative w-full h-[350px] md:h-[600px] aspect-3/2 overflow-hidden">
                          <Image
                            src={photo}
                            alt={`phone${index}`}
                            fill
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover w-full h-full cursor-pointer"
                            onClick={() => {
                              setOpen(true);
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {open && (
                    <Lightbox
                       plugins={[Counter]}
                       counter={{ container: { style: { top: 0, bottom: "unset" } } }}
                       open={open}
                       close={() => setOpen(false)}
                       slides={ phone.images.map((pic)=> {
                         return { src: pic }
                       })}
                      
                    />
                  )}
                </div>



                {/* Info of Items*/}
                <div className="w-full h-full flex flex-col gap-2">
                  <div className="w-full gap-2 flex flex-col sm:flex-row lg:flex-col md:justify-center items-center">
                    {/*Price*/}
                    <div className="w-full bg-[#9DBDFF] rounded transition-shadow duration-500 hover:shadow-lg">
                      <div className="flex flex-col py-4 items-center justify-center">
                        <p className="md:text-xl font-bold text-gray-600">
                          GH₵ {phone.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {phone.negotiable === "Yes" ? "Negotiable" : ""}
                        </p>
                      </div>
                    </div>

                    {/* Poster details */}
                    <div className="w-full bg-cardBg rounded-lg h-full transition-shadow duration-500 hover:shadow-lg">
                      <div className="flex justify-center py-4 gap-4">
                        <div>
                          <Avatar>
                            <AvatarImage
                              src={`${phone.avatarImageUrl}`}
                              alt={`${phone.fullname}`}
                            />
                            <AvatarFallback>
                              {phone.fullname?.split(" ")[0][0]}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex flex-col gap-y-2">
                          <section className="flex flex-col">
                            <span className="font-bold">{phone.storename}</span>
                            <span className="text-xs font-extralight text-gray-400">
                              Member since -{" "}
                              {new Date(phone.userCreatedAt).getFullYear()}
                            </span>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full border-2 border-dashed  rounded relative">
                    <div className="flex flex-col sm:flex-row justify-center p-4 gap-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="bg-[#9DBDFF]" variant={"outline"}>
                            <PhoneCall /> Reveal contact
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          onCloseAutoFocus={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }} // Remove black focus on the input field
                          className="w-[--radix-dropdown-menu-trigger-width] flex flex-col justify-center items-center"
                        >
                          {phone?.phonePrimary && (
                            <DropdownMenuItem>
                              {" "}
                              <PhoneCall /> {phone.phonePrimary}
                              <span
                                onClick={async () => {
                                  await navigator.clipboard.writeText(
                                    phone.phonePrimary
                                  );
                                  await copyTextAlert();
                                }}
                              >
                                <Copy />{" "}
                              </span>{" "}
                            </DropdownMenuItem>
                          )}

                          {phone?.phoneSecondary && (
                            <DropdownMenuItem>
                              {" "}
                              <PhoneCall /> {phone.phoneSecondary}
                              <span
                                onClick={async () => {
                                  await navigator.clipboard.writeText(
                                    phone.phoneSecondary ? phone.phoneSecondary : ""
                                  );
                                  await copyTextAlert();
                                }}
                              >
                                <Copy />{" "}
                              </span>{" "}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button disabled variant={"outline"}>
                        <MessageSquareMore />
                        Chat seller
                      </Button>
                    </div>
                  </div>

                  {/*Safety details*/}
                  <div className="w-full sm:w-fit sm:px-10 sm:py-5 lg:w-full border-2 border-dashed rounded">
                    <div className="flex flex-col justify-center items-center py-4">
                      <span className="font-bold">Safety tips</span>
                      <ul className="text-sm text-gray-600 list-disc">
                        <li>Choose a safe meeting location</li>
                        <li>Bring a friend if possible</li>
                        <li>Inspect the item carefully</li>
                        <li>Avoid carrying large amount of cash</li>
                        <li>Trust your instincts</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Items Details*/}
                <div className="flex flex-col gap-y-2 w-full max-h-fit h-full">
                  <div className="w-full ">
                    <div className="w-full space-y-5 py-5 flex flex-col justify-center items-center lg:items-start">
                      
                        <p className="text-2xl text-left sm:text-3xl font-bold tracking-tighter">
                          {phone.title}
                        </p>
                     
                      <p className="flex text-xs items-center gap-1 text-gray-600">
                        <MapPin size={13} />
                        {phone.region +
                          ", " +
                          phone.town +
                          ", " +
                          new Date(phone.createdAt).getDate() +
                          " " +
                          month[new Date(phone.createdAt).getMonth()] +
                          " " +
                          new Date(phone.createdAt).getFullYear()}
                      </p>

                      <div className="flex justify-center lg:justify-between items-center w-full gap-3">
                        <section className="flex items-center gap-2">
                          <Badge className="bg-white border-gray-200 text-black rounded-md px-2 py-1.5  hover:bg-white cursor-pointer">
                            Likes 2,000{" "}
                          </Badge>

                          {phone.userIdVerificationStatus === 'Verified' && (
                            <Badge className="bg-[#E0FBE2] rounded-md px-2 py-1.5 text-green-700 hover:bg-[#E0FBE2] cursor-pointer">
                              Verified store
                            </Badge>
                          )}
                        </section>
                          
                          
                          <Badge
                            onClick={()=> addToBuyLater({
                              ads_id: data[0]?.ads_id,
                              title: data[0]?.title,
                              condition: data[0]?.condition,
                              location: data[0]?.region +", "+data[0].town,
                              image_url: data[0]?.images[0],
                              phone_primary: data[0]?.phonePrimary,
                              price: data[0]?.price
                            })}
                            className={`${buyLData?.buyLater ? 'bg-[#E0FBE2] border-[#E0FBE2] hover:bg-[#E0FBE2]' : 'bg-gray-200 border-gray-200 hover:bg-gray-200'} text-black rounded-md px-2 py-1.5 cursor-pointer`}
                          >
                           { buyLData?.buyLater ? (<span className="flex items-center justify-center gap-1">
                            <Bookmark size={15}/> {adCounter?.total}</span>) :  (<span className="flex items-center justify-center gap-1">
                            <Bookmark size={15}/> {adCounter?.total}</span>)
                           }
                          </Badge>
                       
                      </div>
                    </div>

                    <div className="w-full border-b-2 border-dashed mb-5"></div>

                    {/* post details*/}
                    <div className="w-full ">
                      <div className="w-full grid grid-cols-3 md:place-items-start sm:grid-cols-5 text-gray-500 text-sm gap-4">
                        <section className="flex flex-col items-center">
                          <span className="text-black font-semibold">
                            {phone.brand}
                          </span>
                          <span className="text-xs sm:text-sm">Brand</span>
                        </section>

                        <section className="flex flex-col items-center">
                          <span className="text-black text-center font-semibold">
                            {phone.model}
                          </span>
                          <span className="text-xs sm:text-sm">Model</span>
                        </section>

                        <section className="flex flex-col items-center">
                          <span className="text-black font-semibold">
                            {phone.condition}
                          </span>
                          <span className="text-xs sm:text-sm">Condition</span>
                        </section>

                        <section className="flex flex-col items-center">
                          <span className="text-black font-semibold">
                            {phone.color}
                          </span>
                          <span className="text-xs sm:text-sm">Color</span>
                        </section>

                        <section className="flex flex-col items-center">
                          <span className="text-black font-semibold ">
                            {phone.storage}
                          </span>
                          <span className="text-xs sm:text-sm">Storage</span>
                        </section>

                        <section className="flex flex-col items-center">
                          <span className="text-black font-semibold">
                            {phone.ram}
                          </span>
                          <span className="text-xs sm:text-sm">Ram</span>
                        </section>

                        <section className="flex flex-col items-center">
                          <span className="text-black font-semibold">
                            {phone.exchangePossible}
                          </span>
                          <span className="text-xs sm:text-sm">Swappable</span>
                        </section>

                        <section className="flex flex-col items-center">
                          <span className="text-black font-semibold">
                            {phone.screenSize}
                          </span>
                          <span className="text-xs sm:text-sm">Screen Size</span>
                        </section>

                        <section className="flex flex-col items-center">
                          <span className="text-black font-semibold">
                            {phone.batterySize}
                          </span>
                          <span className="text-xs sm:text-sm">Battery Size</span>
                        </section>
                        
                        {
                          phone.batteryHealth && (
                             <section className="flex flex-col items-center">
                                <span className="text-black font-semibold">
                                  {phone.batteryHealth}
                                </span>
                                <span className="text-xs sm:text-sm">Battery Health</span>
                              </section>
                          )
                        }

                        {
                          phone.accessories && (
                             <section className="flex flex-col items-start">
                                <span className="text-black font-semibold text-left">
                                  {phone.accessories.map(as => as).toString()}
                                </span>
                                <span className="text-xs sm:text-sm">Accessories</span>
                              </section>
                          )
                        }
                        


                      </div>
                    </div>
                  </div>

                  <div className="w-full border-b-2 border-dashed my-5"></div>

                  <div className="w-full">
                    <div className="w-full">
                      <div className="flex flex-col max-w-full text-sm text-gray-600 gap-2">
                        <section className="flex">
                          <span>{phone.description}</span>
                        </section>

                        <div className="w-full border-b-2 border-dashed my-5"></div>

                        <section className="flex justify-between items-center">
                          <div className=" w-full flex justify-center py-2 gap-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  className="bg-[#9DBDFF]"
                                  variant={"outline"}
                                >
                                  <PhoneCall /> Reveal contact
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                onCloseAutoFocus={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }} // Remove black focus on the input field
                                className="w-[--radix-dropdown-menu-trigger-width] flex flex-col justify-center items-center"
                              >
                                {phone?.phonePrimary && (
                                  <DropdownMenuItem>
                                    {" "}
                                    <PhoneCall /> {phone.phonePrimary}
                                    <span
                                      onClick={async () => {
                                        await navigator.clipboard.writeText(
                                          phone.phonePrimary
                                        );
                                        await copyTextAlert();
                                      }}
                                    >
                                      <Copy />{" "}
                                    </span>{" "}
                                  </DropdownMenuItem>
                                )}

                                {phone?.phoneSecondary && (
                                  <DropdownMenuItem>
                                    {" "}
                                    <PhoneCall /> {phone.phoneSecondary}
                                    <span
                                      onClick={async () => {
                                        await navigator.clipboard.writeText(
                                          phone.phoneSecondary ? phone.phoneSecondary : ""
                                        );
                                        await copyTextAlert();
                                      }}
                                    >
                                      <Copy />{" "}
                                    </span>{" "}
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <Button disabled variant={"outline"}>
                              {" "}
                              <MessageSquareMore />
                              Chat seller{" "}
                            </Button>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>

                  {/* Similar phones*/}
                  <div className="w-full m-auto pb-32 pt-6">
                    <div className="w-full mb-2">
                      <p className="font-semibold text-lg text-gray-800">Related Listings</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {list.items?.length === 0 ? (
                        <span className="text-gray-400 text-sm">
                          No data found
                        </span>
                      ) : (
                       list.items.map((data) => (
                          <ProductsCard
                            key={data.ads_id}
                            id={`/mobilephones/${data.ads_id}`}
                            firstImageUrl={data.firstImage}
                            price={data.price}
                            title={data.title}
                            location={data.region + ", " + data.town}
                            condition={data.condition}
                            createdAt={data.createdAt}
                            isVerifiedStore={data.userIdVerificationStatus} 
                            description={data.description}                          
                            />
                        ))
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
                  </div>
                </div>

                <div></div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
