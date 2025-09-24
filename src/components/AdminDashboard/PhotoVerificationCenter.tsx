"use client"
import React, {useState} from 'react'
import {useParams, usePathname, useRouter} from "next/navigation";
import BeatLoaderUI from "@/components/loaders/BeatLoader";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {BadgeCheck, Ban} from "lucide-react";



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
import {toast} from "sonner";


interface VerificationDataProps {
    govimages: string[],
    businessregno: string,
    ghcardno: string,
    firstname: string,
    lastname: string,
}

export default function PhotoVerificationCenter() {
    const params = useParams<{ id: string }>();
    const [data, setData] = useState< [VerificationDataProps] | null >(null);
    const [approveBtnStatus, setApproveBtnStatus] = useState<boolean>(false);
    const [declineBtnStatus, setDeclineBtnStatus] = useState<boolean>(false);
    const [approveBtnName, setApproveBtnName] = useState<string>("");
    const router = useRouter();
    const pathname = usePathname()


    const handleApproveUser = async () =>{
        setApproveBtnStatus(true);
        const response = await fetch(`/api/workspace/users/approveUser/${params.id}`, {
            method: "POST",

        });
        const data = await response.json();
        if(!response.ok){
            setApproveBtnStatus(false);
            return toast.warning("Something went wrong", {
                style: {backgroundColor: "#FFD95F"},
                description: `${data?.errMessage}`
            })

        }
        if(response.ok){
            setApproveBtnStatus(false);
            router.back()
            toast.success("Success", {
                style: {backgroundColor: "#AEEA94"},
                description: `${data?.message}`
            })
        }

    }


    const handleRejectUser = async () =>{
        setDeclineBtnStatus(true)
        const response = await fetch(`/api/workspace/users/rejectUser/${params.id}`, {
            method: "POST",

        });
        const data = await response.json();
        if(!response.ok){
            setDeclineBtnStatus(false);
            router.refresh()
            return toast.warning("Something went wrong", {
                style: {backgroundColor: "#FFD95F"},
                description: `${data?.errMessage}`
            })

        }
        if(response.ok){
            setDeclineBtnStatus(false);
            router.back()
            toast.success("Success", {
                style: {backgroundColor: "#AEEA94"},
                description: `${data?.message}`
            })
        }

    }



    useState(()=>{
        if(pathname.startsWith("/workspace/verified-users")){
            setApproveBtnStatus(true);
            setApproveBtnName("Approved store")
        }else if(pathname.startsWith("/workspace/requests")){
            setApproveBtnName("Approving store ....")
        }
        const fetchIdInfo =async ()=>{
            const res = await fetch(`/api/workspace/users/getSubmittedIdInformation/${params.id}`);
            return await res.json();
        }
        fetchIdInfo()
            .then((idData )=>{
                setData(idData);
            })
            .catch(()=>{
                setData(null);
            })

    })

    if(data == null){
        return <BeatLoaderUI color={'blue'}/>
    }

    if(data.length <= 0){
        return <p>No data found</p>
    }

    console.log(data)
    return (
        <div className="w-full max-h-screen flex flex-col justify-center items-center p-4 ">
            <div className="py-2 px-5 bg-white border rounded-md m-2">
                {
                    data.map((item, index)=>(
                        <p key={index}>{item.firstname +" "+ item.lastname}</p>
                    ))
                }
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-[minmax(150px,300px)_minmax(150px,300px)_minmax(150px,300px)] gap-3">

                {
                    data[0].govimages.map((image: string, index:number)=>(

                        <div className="w-full h-[300px] overflow-hidden rounded-lg border p-1 shadow-sm" key={index}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={`${image}`} alt={`${index}`}

                                 style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                 className="rounded-md"
                            />
                        </div>
                    ))
                }



                <div
                    className="w-full h-full border rounded-lg flex flex-col justify-center items-center bg-[#F4F9F9] gap-2 p-10 shadow-sm">


                    <div className="pointer-events-none">
                        <Label>Ghana Card No.</Label>
                        <Input defaultValue={data[0].ghcardno}/>
                    </div>

                    <div className="pointer-events-none">
                        <Label>Business Reg No.</Label>
                        <Input defaultValue={data[0].businessregno}/>
                    </div>

                </div>


            </div>

            <div className="w-fit flex justify-center items-center bg-[#F4F9F9] gap-2 mt-10 py-5 px-8 rounded-lg">
                <div className="flex gap-8">

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button disabled={approveBtnStatus}><BadgeCheck/>{approveBtnStatus ? `${approveBtnName}`: "Approve ID"}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to verify this user?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Verifying this user will grant them full access to the platform. Ensure their information is correct before proceeding.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button onClick={handleApproveUser}>Continue</Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>


                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button disabled={declineBtnStatus} variant={"destructive"}><Ban/>{declineBtnStatus ? "Declining...": "Decline ID"}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to decline this verification request?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Declining this request means the store stays active but may struggle to attract buyers. Ensure you have reviewed their details carefully before proceeding.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button onClick={handleRejectUser}>Continue</Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
            </div>
        </div>
    )
}
