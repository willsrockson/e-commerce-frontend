import React from 'react'
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function VerifiedStoreSuccess() {
    return (
        <div className="w-full h-fit bg-[#ffff] flex flex-col items-center justify-center gap-4 pt-4 rounded-lg">
            <Image width={80} height={80} src={`/images/icons/verifiedStore.png`} alt={`verifiedStore`} />
            <div className="max-w-md mx-auto text-center">
                <p className=" sm:text-lg text-gray-600">Your store has been verified</p>
            </div>
            <div>
                <Link href="/myshop">
                    <Button variant={'outline'} >Visit shop</Button>
                </Link>
            </div>
        </div>
    )
}
