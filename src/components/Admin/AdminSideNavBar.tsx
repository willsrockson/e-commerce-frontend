"use client"
import React, {useEffect, useState} from 'react'
import {UserRound, BadgeCheck, Hand, LogOut} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";

export default function AdminSideNavBar() {
    const [unverifiedUsers, setUnverifiedUsers] = useState(false)
    const [requests, setRequests] = useState(false)
    const [verifiedUsers, setVerifiedUsers] = useState(false)
    const pathname = usePathname();

    const router = useRouter();


    const handLogout = async () => {
        const response = await fetch(`/api/workspace/users/logout`)
        if(response.ok){
            router.push("/workspace")
        }
    }

    useEffect(()=>{
        if (pathname === "/workspace") {
            setUnverifiedUsers(true);
            setRequests(false);
            setVerifiedUsers(false);
        } else if (pathname.startsWith("/workspace/requests")) {
            setUnverifiedUsers(false);
            setVerifiedUsers(false);
            setRequests(true);
        } else if (pathname === "/workspace/verified-users") {
            setUnverifiedUsers(false);
            setRequests(false);
            setVerifiedUsers(true);
        } else {
            setUnverifiedUsers(false);
        }

    },[pathname])


    return (
        <div className="relative h-full bg-black text-white px-3 pt-5">
             <div className="mb-12">
                 <div className="flex shrink-0 justify-start items-center gap-0.5 cursor-pointer">
                     <Image src="/images/blueLogo.png"
                            alt='brand-logo'
                            width={50}
                            height={50}
                            style={{cursor: "pointer"}}
                     />
                     <h1 className="text-testing text-lg tracking-wide font-bold uppercase">Tonmame</h1>
                 </div>
             </div>
             <div className="flex flex-col justify-start w-full gap-2">
                 <div className="px-3 text-gray-600">
                     <p> VERIFICATION</p>
                 </div>

                    <Link href={`/workspace/`}>
                         <div className={`${unverifiedUsers && `text-white` } flex justify-center gap-1 items-center w-fit h-fit p-3 text-gray-400 cursor-pointer`}
                          >
                             <UserRound size={14}/>
                             <p className="text-sm">Users</p>
                         </div>
                    </Link>

                 <Link href={`/workspace/requests/`}>
                     <div className={`${requests && `text-white` } flex justify-center gap-1 items-center w-fit h-fit p-3 cursor-pointer text-gray-400`}
                     >
                         <Hand size={14}/>
                         <p className="text-sm">Requests</p>
                     </div>
                 </Link>

                 <Link href={`/workspace/verified-users`}>
                     <div className={` ${verifiedUsers && `text-white` } flex justify-center gap-1 items-center w-fit h-fit p-3 text-gray-400 cursor-pointer`}
                     >
                         <BadgeCheck size={14}/>
                         <p className="text-sm">Verified users</p>
                     </div>
                 </Link>

             </div>

            <div className="absolute bottom-5 right-5">
                <p onClick={handLogout} className="cursor-pointer text-gray-400 hover:text-white"><LogOut/></p>
            </div>


        </div>
    )
}
