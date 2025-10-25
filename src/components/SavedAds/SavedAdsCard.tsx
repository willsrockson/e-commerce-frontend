"use client"

import Link from "next/link";
import {Copy, Loader2} from "lucide-react";
import { toastError, toastSuccess } from "../toasts/toasts";
import Image from "next/image";
import { useState } from "react";
import { currency } from "@/lib/helpers/universal-functions";

interface SavedAdsCardProps {
    saved_id: string;
    ads_id: string;
    image: string;
    sub_category: string;
    price: string | number;
    condition: string;
    title: string;
    location: string;
    phone: string;
    updateRemovedItem: (id: string )=> void
}


export default function SavedAdsCard({ saved_id, ads_id, sub_category, image, price, title, 
    condition, location, phone, updateRemovedItem }: SavedAdsCardProps) {
    const [loading, setLoading] = useState(false);
    const copyTextAlert = async() => {
        toastSuccess({
            message: "Copied",
        });
    }

    const removeOneSavedAds = async (savedAdsID: string )=>{
         if(!savedAdsID){
             return toastError({
                 message: "Ad is not available"
             });
         }
         setLoading(true); 

         const response = await fetch(`/api/account/me/delete/one/saved/ad/${savedAdsID}`, {
             method: "DELETE",
             headers: {'Content-Type': 'application/json'},
             credentials: 'include',
         });

        const data = await response.json() as { successMessage: string; errorMessage:string; };
        setLoading(false);
        if(!response.ok){
           toastError({
                message: data?.errorMessage
            });
           return;
        } 

        updateRemovedItem(savedAdsID);
        toastSuccess({
            message: data?.successMessage
        });


    }
   
    //aspect-square object-cover
    // <Link href={`/${sub_category}/${ads_id}`}>  </Link>

    return (
        <div className={`${!ads_id && 'opacity-70'} ${ads_id && 'border-sky-200'} w-full max-w-full min-h-fit md:max-w-md rounded-lg overflow-hidden border mb-4 break-inside-avoid shadow-sm`}>
            <div className="flex">
                
                    <div className={`${!ads_id && 'pointer-events-none opacity-40'} relative w-40 h-40 shrink-0`}>
                        <Link href={`/${sub_category}/${ads_id}`}>
                        <Image
                            src={image}
                            alt={title}
                            width={160}
                            height={160}
                            className="object-cover aspect-square rounded-l-lg"
                            sizes="300px"
                            priority
                        />
                        </Link>
                    </div>
                

                <div className="flex flex-col flex-1 justify-center px-4 py-3 space-y-1">
                    <p className="text-lg font-semibold text-sky-500">
                       {currency(price)}
                    </p>
                    <p className="text-gray-900 text-sm line-clamp-1">{title}</p>
                   
                   { ads_id ?
                    (<p
                        onClick={async () => {
                            await navigator.clipboard.writeText(phone);
                            await copyTextAlert();
                        }}
                        className="text-gray-700 w-fit text-xs flex items-center gap-1 cursor-pointer hover:text-sky-600"
                    >
                        Call <Copy size={12} />
                    </p>)
                     : (<p className="text-xs text-red-500 line-clamp-1">Ad is not available</p>)
                    }

                    <p className="text-gray-600 text-xs">{location}</p>
                    <p className="text-gray-600 text-xs">{condition}</p>

                    <button disabled={loading} onClick={()=>removeOneSavedAds(saved_id)} className="pt-1 ml-auto text-xs text-red-600 hover:underline cursor-pointer">
                        { loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Remove' }
                    </button>
                </div>
            </div>
        </div>
    );
}

                