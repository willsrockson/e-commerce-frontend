'use client'
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Search, Trash2} from "lucide-react";
import useSWR from "swr";
import NoDataFound from "@/components/AdminDashboard/NoDataFound";

export interface UserProps {
    user_id: number,
    email: string,
    firstname: string,
    lastname: string,
    phone: string,
    phone2: string,
    created_at: string,
    storeaddress: string,
}


export default function UnverifiedUsers() {
    const fetcher = (url: URL) => fetch(url).then((res) => res.json());
    const {data, isLoading} = useSWR("/api/workspace/users/unverified", fetcher);


    return (
        <div className="w-full max-w-full px-6 pt-8">
            <div className="flex flex-col justify-start gap-8">
                <div className="w-fit">
                    <h1 className="text-2xl text-gray-700">Unverified Accounts</h1>
                </div>

                { isLoading ? "Loading..." :

                <div className="flex flex-col justify-start gap-8">

                    <div className="flex justify-start gap-4">

                        <div className="rounded-md bg-[#B7B1F2] px-5 py-5 w-full max-w-full h-fit border">
                            <p className="text-black font-bold text-3xl mb-1.5">{ data ? data?.length : 0 }</p>
                            <p className="text-gray-600 text-sm tracking-wide">Total unverified users</p>
                        </div>

                        <div className="rounded-md bg-[#ffff] px-5 py-5 w-full max-w-full h-fit border ">
                            <p className="text-black font-bold text-3xl mb-1.5">{`0000`}</p>
                            <p className="text-gray-600 text-sm tracking-wide">Active users</p>
                        </div>

                        <div className="rounded-md bg-[#ffff] px-5 py-5 w-full max-w-full h-fit border">
                            <p className="text-black font-bold text-3xl mb-1.5">{`0000`}</p>
                            <p className="text-gray-600 text-sm tracking-wide">Non-active users</p>
                        </div>

                        <div className="rounded-md bg-[#ffff] px-5 py-5 w-full max-w-full h-fit border">
                            <p className="text-black font-bold text-3xl mb-1.5">{`0000`}</p>
                            <p className="text-gray-600 text-sm tracking-wide">Blocked users</p>
                        </div>

                    </div>


                    <div className="flex justify-start items-center gap-4">
                        <Input placeholder="Finder user" className="w-1/2 h-12"/>
                        <Button className="h-11" type="submit"><Search/> Find user</Button>
                    </div>

                    <div>
                        <div className="grid grid-cols-8 place-items-center w-full mb-4">
                            <span>UserId</span>
                            <span>Email</span>
                            <span>Name</span>
                            <span>Phone</span>
                            <span>Phone2</span>
                            <span>CreatedAt</span>
                            <span>Store Address</span>
                            <span>Action</span>
                        </div>

                        <div className="flex flex-col gap-2 text-sm text-gray-600 overflow-y-scroll">

                            { data?.length === 0 ? <NoDataFound/> : data?.map((user: UserProps) => (

                                <div className="grid grid-cols-8 place-items-center w-full h-16 rounded-md bg-white" key={user.user_id}>
                                    <span>{user.user_id}</span>
                                    <span>{user.email}</span>
                                    <span>{user.firstname +" "+ user.lastname}</span>
                                    <span>{user.phone}</span>
                                    <span>{user.phone2}</span>
                                    <span>{user.created_at}</span>
                                    <span>{user.storeaddress}</span>
                                    <span><Trash2/></span>

                                </div>
                            ))}


                        </div>
                    </div>

                </div> }

            </div>


        </div>
    )
}
