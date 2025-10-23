/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'
import {MapPinned} from "lucide-react";

export interface SearchCardProps {
    ad_id: string,
    images: string,
    price: string | number,
    title: string,
    region?: string,
    town?: string,
    condition: string,
    location: string,
    category: string,
}

export default function SearchCard({ad_id, images, title, price, location, condition, category}: SearchCardProps) {
    return (
        <div className="w-full max-h-fit bg-cardBg rounded-lg overflow-hidden">
           <Link href={`/${category}/${ad_id}`}>
              <div className="w-full flex">
                  <img src={`${images}`} alt={'item'}
                       className="w-32 object-cover aspect-square"
                  />
                  <div className="w-full flex flex-col gap-1 px-2.5">
                      <p className="text-blue-500 font-semibold pt-1.5">GH₵ {price}</p>
                      <p className="leading-4 text-xs">{title}</p>
                      <p className="text-gray-500 text-xs font-light flex items-center gap-1"><MapPinned size={12}/> {location}</p>
                      <p className="w-auto h-fit cursor-pointer rounded-none
                         text-xs bg-white hover:bg-white text-[#808080] font-extralight">{condition}</p>
                  </div>
              </div>
           </Link>

        </div>
    )
}
