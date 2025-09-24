"use client"
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Success() {
    return (
        <div className="w-full h-fit bg-[#ffff] flex flex-col items-center justify-center gap-4 py-10 rounded-lg">
            <Image width={80} height={80} src={`/images/icons/success.png`} alt={`success`} />
             <div className="max-w-md mx-auto text-center">
                 <p className=" sm:text-lg text-gray-600">Your password has been updated successfully</p>
             </div>
             <div>
                 <Link href="/myshop">
                     <Button variant={'outline'} >Visit shop</Button>
                 </Link>
             </div>
        </div>
    )
}
