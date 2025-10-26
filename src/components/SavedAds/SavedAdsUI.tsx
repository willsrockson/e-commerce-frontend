"use client"
import {useRouter} from 'next/navigation'
import { ISavedAd } from '@/lib/interfaces';
import {Badge} from "@/components/ui/badge";
import SavedAdsCard from "@/components/SavedAds/SavedAdsCard";
import BeatLoaderUI from '../loaders/BeatLoader';
import useSWR from 'swr';
import { toastError, toastSuccess } from '../toasts/toasts';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { siteMaxWidth } from '@/lib/constants';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SavedAdsUI() {
      const { data, isLoading, error, mutate } = useSWR<ISavedAd[]>(`/api/account/me/saved/ads`,fetcher);
      const [loading, setLoading]= useState(false)
      const router = useRouter()


   
    

    // Delete all saved ads from the DB
    const deleteAllSavedAds = async () => {
        setLoading(true); 
        const res = await fetch(`/api/account/me/delete/all/saved/ads`,{
              method: "DELETE",
              credentials: "include",
          })
        const data = await res.json() as { successMessage: string; errorMessage:string; };
        setLoading(false); 
         if(!res.ok){
             toastError({ message: data?.errorMessage });
             return;
         }

        await mutate([], true);
        toastSuccess({ message: data?.successMessage });
    }


    // Updates myBuyLater state when the user removes an item
    const updateRemovedAd = async (id: string) => {
        await mutate(data?.filter(d => d.saved_id !== id) || (data), true);
    }


    // bg-[#EBF1F4]

    return (
        <div className="w-full min-h-[calc(100vh-5rem)] p-2 sm:p-6">


            <div className={`w-full ${siteMaxWidth} px-4 m-auto mb-6`}>
                <Badge className="bg-cardBg rounded-lg hover:bg-[#F4F3F3] text-gray-600 cursor-pointer py-1.5"
                       onClick={() => router.push("/") }>Home
                </Badge>
            </div>


            <div className={`w-full ${siteMaxWidth} px-4 m-auto grid lg:grid-cols-[1fr_3fr] gap-4`}>

                {/*Grid first item #87A2FF */}
                <section className=" ">
                    <div className="overflow-hidden">
                        <div
                            className="bg-blue-200 w-full flex justify-center py-3 items-center mb-4 rounded-lg">
                            <p className="text-sky-500 font-medium md:text-lg"> Bookmarks ⋆ { data ? data?.length : 0 } </p>
                        </div>

                       
                       { (data && data?.length > 1) &&
                        (<div>
                            <button disabled={loading} onClick={deleteAllSavedAds} 
                              className="bg-red-100 text-red-500 px-3 text-sm py-1 rounded-md w-fit mb-5 line-clamp-1 cursor-pointer"> 
                               { loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Remove all' }
                              </button>

                        </div>)
                       }

                    </div>

                </section>
                
                
                <section className='w-full'>

                         { isLoading || error ? ( <BeatLoaderUI color='blue' size={10} /> ) :
                            ( <div className="w-full">
    
                                { data?.length === 0 ? (<div className="w-full bg-empty-box bg-no-repeat bg-center h-72"></div>) :
                                
                                ( <div className='w-full'>
                                    
                                      <div className="columns-1 md:columns-2 gap-4">
                                        {
                                            data?.map((ad) =>
                                            (
                                                <SavedAdsCard
                                                    key={ad.saved_id}
                                                    saved_id={ad.saved_id}
                                                    ads_id={ad.ads_id ?? ''}
                                                    image={ad.imageUrl}
                                                    sub_category={ad.subCategory}
                                                    price={ad.price}
                                                    condition={ad.condition}
                                                    title={ad.title}
                                                    location={ad.location}
                                                    phone={ad.phonePrimary}
                                                    updateRemovedItem={(value)=> updateRemovedAd(value) }
                                                  />
                                            )
                                            )
    
                                        }
                                       </div>
                                    </div>)            
                                }
                            </div> )
    
                        }
               </section>

            </div>


        </div>
    )
}
