'use client'
import React, {useMemo} from 'react'
import Image from "next/image";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button";
import { toastError, toastSuccess } from '../toasts/toasts';
import { X } from 'lucide-react';

interface DeleteSingleImageProps {
    url: string,
    image_index: number,
    ads_id: number | string
    fetchAdsAgain: () => void,
}

export default function DeleteSingleImage({url, image_index, ads_id, fetchAdsAgain }: DeleteSingleImageProps) {


    const deletePhoto = useMemo(() => {
        return async (imageIndex: number) => {

                 const response = await fetch(`/api/mobile/delete-ads-photo-one-by-one/${ads_id}`, {
                     method: "DELETE",
                     credentials: "include",
                     headers: {'Content-Type': 'application/json'},
                     body: JSON.stringify({imageIndex})
                 })
                 const data = await response.json() as {errorMessage: string; successMessage:string;};
                 if (!response.ok) { 
                     toastError({
                       message: data?.errorMessage,
                    });
                    return
                 }
                 toastSuccess({
                    message: data?.successMessage,
                 });
                fetchAdsAgain()

        };
    }, [ads_id, fetchAdsAgain]);

    const imageSrc = useMemo(() => `${url}`, [url]);

    return (

        <div className="min-w-24 h-24 bg-sky-200 relative rounded-md overflow-hidden">
            <Image src={imageSrc}
                   alt={"phone"}
                   fill
                   priority={true}
                   sizes="(max-width: 5rem) 100vw, 5rem"
                   className="object-cover object-center"
            />


            <div className="cursor-pointer absolute top-1 right-1 p-1 bg-black text-white rounded-full">

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <X size={12} />
                       
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the photo from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button onClick={()=> deletePhoto(image_index)} >Delete</Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>

    )
}
