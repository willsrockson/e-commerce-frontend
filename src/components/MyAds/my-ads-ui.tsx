"use client"

import {useRouter} from 'next/navigation'


import { IPublishedAdsByME } from '@/lib/interfaces';
import {useEffect, useRef, useState} from "react";
import {Badge} from "@/components/ui/badge";
import AdsCard from "@/components/MyAds/ads-card";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import BeatLoaderUI from '../loaders/BeatLoader';
import SelectSearchWithAdsCount from '../sharedUi/withAdsCount/select-search';
import { useForm } from 'react-hook-form';
import { labelTextColor } from '../RoutingComponents/Electronics/MobilePhones';
import { useAsyncList } from 'react-stately';
import { useInView } from 'react-intersection-observer';
import { siteMaxWidth } from '@/lib/constants';

const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

type ICountType = {
   main: { label:string; count: number; }[];
   sub: { label:string; count: number; }[];
}

interface CountData{
    countAds: ICountType;
}


interface IAllMyAdResponse{
    publishedAds: [];
    hasMore:boolean; 
    total:number;
    page: number;
    countAds: ICountType;
}

export default function MyAdsUi() {

    const {control, watch, setValue }= useForm({
        defaultValues: {
             main_category: '',
             sub_category: ''
        }
    })
    const [watchMainValue, watchSubValue] = watch(['main_category', 'sub_category'])
   

    const [myCount, setMyCount] = useState<CountData>({
             countAds: {
                 main:[{label: '', count: 0 }],
                 sub:[{label: '', count: 0 }], 
             }
        });

     const [metadata, setMetadata] = useState({
         hasMore: false,
         total: 0,
         page: 1,
    })    

    const list = useAsyncList<IPublishedAdsByME>({
            async load({ signal, cursor, filterText }) {
            const res = await fetch(cursor || `/api/account/me/ads?page=1&${filterText}`, {
            signal
            });
            const json = await res.json() as IAllMyAdResponse
            
            setMyCount({
                countAds: json.countAds
            })
              
            // Store metadata separately
            setMetadata({
                hasMore: json.hasMore,
                total: json.total,
                page: json.page,
            });
            
            return {
            items: json.publishedAds,
            cursor: json.hasMore ? `/api/account/me/ads?page=${json.page + 1}&${filterText}`: undefined
            };
         },
          getKey:(item) => item.ads_id, // The purpose of this is to have access to each item id for data mutation
        });

        const listRef = useRef(list);
        
            useEffect(()=>{
              listRef.current = list
            },[list])
        
        
            const { ref, inView,} = useInView({
                 rootMargin: '400px',
                 threshold: 0
            });
           
        
            useEffect(()=> {
        
                if( listRef.current.items.length && inView && !listRef.current.isLoading ){
                   console.log('List loaded');
                   listRef.current.loadMore(); 
                }    
            }, [inView])


    //Search
    const router = useRouter()



    const removePost = async (id: string) => {
        list.remove(id);
        setMetadata((prev)=>({...prev, total: prev.total - 1 }));
    };


    const updateStatus = async (id: string) => {  
         setTimeout(() => {
             const prev = list.items.find(i => i.ads_id === id);
             if (!prev) return;
             const updated = { ...prev, deactivated: !prev.deactivated };
             list.update(id, updated); 
         }, 150); 
  
    }


    useEffect(() => {
        const query = new URLSearchParams({}); 

        if(watchMainValue){
            query.set('main_category', watchMainValue);
        }
        if(watchSubValue){
            query.set('sub_category', watchSubValue);
        }
        
        listRef.current.setFilterText(query.toString());
        window.history.replaceState(null, '', `?${query.toString()}`);
    },[watchMainValue, watchSubValue]);





    return (
        <div className="w-full pt-6 border-t">


            <div className={`w-full max-w-[${siteMaxWidth}] m-auto mb-6`}>
                <Badge className="bg-cardBg rounded-lg hover:bg-[#F4F3F3] text-gray-600 cursor-pointer py-1.5"
                       onClick={() => router.push("/") }>Home
                </Badge>
            </div>


            <div className={`w-full max-w-[${siteMaxWidth}] m-auto grid lg:grid-cols-[1fr_3fr] gap-4 mb-20`}>

                {/*Grid first item #87A2FF */}
                <div className="w-full">
                    <form>
                    <div className="w-full flex flex-col justify-start">
                        <div
                            className="bg-[#5AB2FF] w-full flex justify-center py-3 items-center mb-4 rounded-lg">
                            <p className="text-gray-600 font-medium md:text-lg"> My Ads ⋆ { metadata.total } </p>
                        </div>

                        <section className="w-full mb-4">

                            {/*  2nd Card Below  */}
                            <div className="bg-gray-50 px-4 py-4 border flex flex-col lg:flex-col gap-4 rounded-lg min-w-72 lg:w-full">


                                      {/* Selection of Main category */}
                                        <section className="flex flex-col w-full">

                                            <Label className={labelTextColor} htmlFor="mainCategory">Main category</Label>
                                              <SelectSearchWithAdsCount 
                                                name='main_category'
                                                labelText='main category'
                                                setValue={setValue}
                                                control={control}
                                                placeholder='Show all'
                                                countedItems={myCount.countAds.main}
                                                
                                              />
                                        </section>
                     
                                        {/* Selection of Model */}
                                        <section className="flex flex-col w-full">
                                        
                                            <Label className={labelTextColor} htmlFor="subcategory">Sub category</Label>
                                            { watchMainValue ?
                                            (
                                                <SelectSearchWithAdsCount 
                                                    name='sub_category'
                                                    labelText='sub category'
                                                    setValue={setValue}
                                                    control={control}
                                                    placeholder='Show all'
                                                    countedItems={myCount.countAds.sub}   
                                                />
                                            ) 
                                            : 
                                            (<div className="w-full">
                                                { watchMainValue && <Label>Sub Category</Label> }
                                                <Input disabled className="w-full" placeholder="Show all"/>
                                            </div>)
                                            }
                                        </section>


                            </div> 


                        </section>

                       

                    </div>
                    </form>
                </div>

                <section className='w-full'>
                    { list.isLoading && list.items.length === 0 ? ( <BeatLoaderUI color='blue' size={10} /> ) :
                        ( <div className="w-full">
                            { list?.items.length === 0 && metadata.hasMore === false ? (<div className="w-full bg-empty-box bg-no-repeat bg-center h-72"></div>) :
                            
                               ( <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {
                                        list.items?.map((ad) =>
                                          (
                                            <AdsCard
                                                key={ad.ads_id}
                                                id={ad.ads_id}
                                                image={ad.firstImage}
                                                price={ad.price}
                                                title={ad.title}
                                                sub_category={ad.sub_category}
                                                removePost={removePost}
                                                updateStatus={updateStatus}
                                                deactivated={ad.deactivated}
                                                location={ad.region + ", " + ad.town}
                                                created_at={ new Date(ad.createdAt).getDate()
                                                     +" "+ month[new Date(ad.createdAt).getMonth()] 
                                                     +" "+new Date(ad.createdAt).getFullYear() } />
                                          )
                                        )

                                    }
                                   </div>
                                )            
                            }

                        </div> )

                   }

                     <div className={!metadata.hasMore ? "hidden" : "block"} ref={ref} >
                        <BeatLoaderUI color={"blue"} size={10} />
                     </div>  
                </section>
                

            </div>

        </div>
    )
}
