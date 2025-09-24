"use client"

import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useRouter} from "next/navigation";
import { toastError, toastSuccess } from "../toasts/toasts";
import Image from "next/image";
import { useState } from "react";
import { Loader2 } from "lucide-react";



export interface PublishedAdsCardType {
    id: string;
    image: string;
    price: string | number;
    title: string;
    removePost: (id: string) => void;
    deactivated: boolean;
    updateStatus: (id: string) => void;
    location: string;
    sub_category: string;
    created_at: string;
}


export default function AdsCard({id, sub_category, image, price, title, location, created_at, removePost, deactivated, updateStatus}: PublishedAdsCardType) {

    const [delState, setDelState] = useState<boolean>(false);
    const router = useRouter();

    const handleDeletePost = async (id: string) => {
        if(!id.trim()) return;
        setDelState(true)
        const res = await fetch(`/api/account/me/delete/ad/${id}`, {
                credentials: 'include',
                method: 'DELETE'
            })
        const data = await res.json() as { successMessage: string; errorMessage: string;};
        setDelState(false);
        if (!res.ok) {  
            toastError({
                message: `${data?.errorMessage}`
            });
            return;
        }

        removePost(id);
        toastSuccess({
            message: `${data?.successMessage}`
        });

    }

    const handleDeactivatePost = async (id: string) => {
        const res = await fetch(`/api/account/me/deactivate/ad/${id}`, {
           credentials: 'include'
        })
        const data = await res.json() as { successMessage: string; errorMessage: string;};
        if (!res.ok) {
            toastError({ message: `${data?.errorMessage}`})
            return;
        }

        updateStatus(id);
        toastSuccess({
            message: `${data?.successMessage}`
        })


    }

    const handleEditPost = (id: string)=>{
         router.push(`/${sub_category.replace(/\s/g, "").toLowerCase()}/edit/${id}`);
    }


    return (

        <div className="w-full border bg-green overflow-hidden max-h-fit shadow transition-shadow duration-200 hover:shadow-md rounded-lg bg-[#ffff]">
            <div className="flex w-full border-b">
                 <div className="relative w-40 h-40 shrink-0">
                <Link href={`/${sub_category.replace(/\s/g, "").toLowerCase()}/${id}`}>
                      <Image
                        src={image}
                        alt={title}
                        width={160}
                        height={160}
                        className="object-cover aspect-square"
                        sizes="300px"
                        priority
                    />
                </Link>
               </div> 
                <div className="w-full space-y-3 flex flex-col justify-center px-4">
                    <p className="text-lg text-sky-500 font-bold leading-none">GH₵ {price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    <h3 className="font-medium text-sm line-clamp-1 leading-none">{title}</h3>
                    <div className="text-xs text-muted-foreground space-y-3 leading-none">
                        <p>{location}</p>
                        <p>{created_at}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-between w-full px-3.5 pb-3 pt-3">
                <div className="flex items-center gap-3">
                    {/*<p className="text-green-500 text-sm ">Edit</p>*/}


                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button disabled={delState} className="text-red-500 text-sm cursor-pointer hover:underline font-semibold">
                                {delState ? <Loader2 className="animate-spin h-4 w-4 mr-2" />: 'Delete'}
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Remove Advertisement?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Deleting this ad will make it unavailable for buyers. Ensure you want to proceed
                                    before confirming.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <button disabled={delState} onClick={() => handleDeletePost(id)}
                                       className="bg-red-500 text-sm cursor-pointer ">Delete</button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>


                    <p onClick={()=>handleEditPost(id)} className="text-sky-500 text-sm cursor-pointer hover:underline font-semibold">Edit</p>

                </div>

                <div className="flex items-center gap-2">

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <div className="cursor-pointer"> {deactivated ? (
                                <div className="flex justify-center items-center gap-1">
                                    <span className="relative flex size-3">
                                       <span
                                       className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                       <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
                                   </span>

                                </div>
                                ) : (
                                <div className="flex justify-center items-center gap-1">
                                    <span className="relative flex size-3">
                                    <span
                                    className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                              </span>
                                </div>
                            )}  </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    { deactivated ? 
                                      "Activating this ad will make it visible to buyers. Be sure your details are correct before going live."  
                                      : 
                                      "Deactivating this ad will hide it from buyers. You can reactivate it whenever you’re ready to sell."   
                                }
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <p onClick={() => handleDeactivatePost(id)}
                                       className={`${deactivated ? 'bg-sky-400 hover:bg-sky-500' : 'bg-red-400 hover:bg-red-500'} text-sm cursor-pointer `}>
                                        {deactivated ? 'Go live' : 'Deactivate'}</p>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>

            </div>
        </div>

    )
}
