"use client"
import React from 'react'
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { Search } from "lucide-react";
import useSWR from "swr";

import {UserProps} from "@/components/AdminDashboard/UnverifiedUsers";
import NoDataFound from "@/components/AdminDashboard/NoDataFound";
import Link from "next/link";

export default function VerifiedSellers() {
    const fetcher = (url: URL) => fetch(url).then((res) => res.json());
    const {data, isLoading} = useSWR("/api/workspace/users/verified", fetcher);


    return (
        <div className="w-full max-w-full px-6 pt-8">
            <div className="flex flex-col justify-start gap-8">
                <div className="w-fit">
                    <h1 className="text-2xl text-gray-700"> Verified Account</h1>
                </div>
                {isLoading ? "Loading..." :
                    <div className="flex flex-col justify-start gap-8">
                        <div className="flex justify-start gap-4">

                            <div className="rounded-md bg-[#FCC6FF] px-5 py-5 w-full max-w-full h-fit border">
                                <p className="text-black font-bold text-3xl mb-1.5">{data?.length}</p>
                                <p className="text-gray-600 text-sm tracking-wide">Total verified account</p>
                            </div>

                            <div className="rounded-md bg-[#ffff] px-5 py-5 w-full max-w-full h-fit border ">
                                <p className="text-black font-bold text-3xl mb-1.5">{0}</p>
                                <p className="text-gray-600 text-sm tracking-wide">Revoke verification</p>
                            </div>

                            <div className="rounded-md bg-[#ffff] px-5 py-5 w-full max-w-full h-fit border opacity-0">
                                <p className="text-black font-bold text-3xl mb-1.5">{0}</p>
                                <p className="text-gray-600 text-sm tracking-wide">Non-active users</p>
                            </div>

                            <div className="rounded-md bg-[#ffff] px-5 py-5 w-full max-w-full h-fit border opacity-0">
                                <p className="text-black font-bold text-3xl mb-1.5">{0}</p>
                                <p className="text-gray-600 text-sm tracking-wide">Blocked users</p>
                            </div>

                        </div>


                        <div className="flex justify-start items-center gap-4">
                            <Input placeholder="Finder user" className="w-1/2 h-12"/>
                            <Button className="h-11" type="submit"><Search/> Find user</Button>
                        </div>

                        <div className="">
                            <div className="grid grid-cols-6 place-items-center w-full mb-4">
                                <span>Email</span>
                                <span>Name</span>
                                <span>Phone</span>
                                <span>Phone2</span>
                                <span>CreatedAt</span>
                                <span>Store Address</span>
                            </div>

                            <div className="flex flex-col gap-2 text-sm text-gray-600">

                                { data.length === 0 ? <NoDataFound/> : data.map((user: UserProps) => (
                                    <Link href={`/workspace/verified-users/${user.user_id}`} key={user.user_id}>
                                        <div className="grid grid-cols-6 place-items-center w-full h-16 rounded-md bg-white hover:bg-[#DCBFFF]">
                                            <span>{user.email}</span>
                                            <span>{user.firstname +" "+ user.lastname}</span>
                                            <span>{user.phone}</span>
                                            <span>{user.phone2}</span>
                                            <span>{user.created_at}</span>
                                            <span>{user.storeaddress}</span>
                                        </div>
                                    </Link>
                                ))}

                            </div>
                        </div>

                    </div>}
            </div>


        </div>
    )
}
