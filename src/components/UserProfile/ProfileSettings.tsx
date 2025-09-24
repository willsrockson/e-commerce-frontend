"use client"
import {Input} from "@/components/ui/input";
import {CircleCheck, Pen} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import useSWR, {mutate} from "swr";
import {useEffect, useState} from "react";
import BeatLoaderUI from "@/components/loaders/BeatLoader";
import {useRouter} from "next/navigation";


import {authStore} from "@/store/authStore";
import { blueFocus } from "../SignUpUi";
import { toastError, toastSuccess } from "../toasts/toasts";

type UserProfileType = {
    storeName: string;
    fullName: string;
    phonePrimary: string;
    phoneSecondary: string;
    storeAddress: string;
    imageUrl?: string
    updatedAt?: string;
}

type UserDataFromServer = {
    store_name: string;
    full_name: string | null;
    phone_primary: string | null;
    phone_secondary: string | null;
    id_verification_status: string | null;
    store_address: string | null;
    avatar_id: string | null;
    image_url: string | null;
    updated_at: string | null;
};

export default function ProfileSettings() {
    const router = useRouter();
    const fetcher = (url: URL) => fetch(url).then((res) => res.json());
    const {data, isLoading} = useSWR<UserDataFromServer[]>("/api/account/settings", fetcher);

    const setAvatarUrl = authStore((state) => (state.setAvatarUrl))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const formData = new FormData();
    const [avatar, setAvatar] = useState<File | null>(null);
     
    //Original state
    const [original, setOriginal] = useState<UserProfileType>({
        storeName: "",
        fullName: "",
        phonePrimary: "",
        phoneSecondary: "",
        storeAddress: "",
    })
    const [temporal, setTemporal] = useState<UserProfileType>({
        storeName: "",
        fullName: "",
        phonePrimary: "",
        phoneSecondary: "",
        storeAddress: "",
    })

    const [submitDataStatus, setSubmitDataStatus] = useState<boolean>(true);
    const [loading, setLoading] = useState(false);

    const onchangeDebounce = (newData: string, fieldName: string) => {
        setTemporal((prev) => ({ ...prev, [fieldName]: newData }));
    }; 
            
            
    useEffect(() => {

        if (original.storeName !== temporal.storeName && temporal.storeName?.trim()) {
            setSubmitDataStatus(false);
            formData.append("store_name", temporal.storeName);
        }
        if (original.fullName !== temporal.fullName && temporal.fullName?.trim()) {
            setSubmitDataStatus(false);
            formData.append("full_name", temporal.fullName);
        }

        if (original.phonePrimary !== temporal.phonePrimary && temporal.phonePrimary?.trim().length === 10 ) {
            setSubmitDataStatus(false);
            formData.append("phone_primary", temporal.phonePrimary);
        }

        if (original.phoneSecondary !== temporal.phoneSecondary && temporal.phoneSecondary?.trim().length === 10) {
            setSubmitDataStatus(false);
            formData.append("phone_secondary", temporal.phoneSecondary);
        }

        if (original.storeAddress !== temporal.storeAddress && temporal.storeAddress?.trim().length > 1) {
            setSubmitDataStatus(false);
            formData.append("store_address", temporal.storeAddress);
        }

        if (avatar !== null) {
            setSubmitDataStatus(false);
            formData.append("avatar", avatar);
        }

    }, [formData, original, temporal, avatar]);


    useEffect(() => {

        if (!data) return;
        setOriginal((prev) => ({
            ...prev,
            fullName: data?.[0]?.full_name ?? "",
            storeName: data?.[0]?.store_name ?? "",
            phonePrimary: data?.[0]?.phone_primary ?? "",
            phoneSecondary: data?.[0]?.phone_secondary ?? "",
            storeAddress: data?.[0]?.store_address ?? "",
        }));
        setTemporal((prev) => ({
            ...prev,
            fullName: data?.[0]?.full_name ?? "",
            storeName: data?.[0]?.store_name ?? "",
            phonePrimary: data?.[0]?.phone_primary ?? "",
            phoneSecondary: data?.[0]?.phone_secondary ?? "",
            storeAddress: data?.[0]?.store_address ?? "",
        }));
        
    }, [data]);

   
    async function handleSubmitBtn() {

        if(formData.entries().next().done){
          toastError({
            message: "Nothing changed"
          })
          return;
        }
        setLoading(true);
        const response = await fetch("/api/account/settings", {
                credentials: 'include',
                method: "POST",
                body: formData
            }
        );

        if (!response.ok) {
            setLoading(false);
            const data: { publicUrl: string, errorMessage: string } = await response.json();
              toastError({
            message: data?.errorMessage ?? "Something went wrong, please retry."
          })
          return;

        }


        const data: { publicUrl: string, successMessage: string } = await response.json();
        if (data.publicUrl) {
            setAvatarUrl(data.publicUrl)
        }
        await mutate("/api/account/settings")
        setLoading(false);
        setSubmitDataStatus(false);
        toastSuccess({
            message: data?.successMessage,
        })
        router.refresh();


    }


    return (
        <>
            <div className="w-full flex justify-center bg-[#ffff] px-4 sm:px-4 py-10 rounded-lg">
                <section className="w-full max-w-5xl h-fit">
                <div className="w-full flex justify-center mb-4">
                    <div className="w-fit h-fit relative">
                        <div className="relative rounded-full h-20 w-20 bg-gradient-to-r from-[#155dfc] to-violet-500 p-[1px]">
                            <Avatar className="w-full h-full">
                                <AvatarImage
                                    src={`${
                                        data && data[0]?.image_url + "?id=" + data[0]?.updated_at
                                    }`}
                                    alt={original.fullName}
                                />
                                <AvatarFallback>{`👤`}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="absolute translate-x-16 -translate-y-10 bg-blue-200 rounded-full p-1">
                            <Pen size={15} />
                            <Input
                                type="file"
                                accept="image/*"
                                className="absolute -translate-y-10 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setAvatar(e.target.files[0]);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col justify-center gap-x-5 sm:flex-row sm:px-10 lg:px-20 lg:flex-row">
                    <div className="w-full">
                        <Label htmlFor={"storeName"}>Store Name</Label>
                        <Input
                            className={` ${blueFocus} mt-1 mb-5`}
                            placeholder="What's the name of your shop?"
                            name="storeName"
                            value={temporal.storeName}
                            id={"storeName"}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                onchangeDebounce(e.target.value, e.target.name)
                            }
                        />
                    </div>

                    <div className="w-full">
                        {data && data[0]?.id_verification_status !== "Not Verified" ? (
                            <>
                                <Label htmlFor={"fullName"}>Full Name</Label>
                                <Input
                                    className={`${blueFocus} mt-1 mb-5`}
                                    placeholder="Want to verify your store? Enter your gov. issued name."
                                    name="fullName"
                                    id={"fullName"}
                                    value={temporal.fullName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        onchangeDebounce(e.target.value, e.target.name)
                                    }
                                />
                            </>
                        ) : (
                            <div className="relative">
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input
                                    className={`${blueFocus} mt-1 mb-5 pr-10`} // padding so text doesn't overlap
                                    disabled
                                    id="fullname"
                                    value={temporal.fullName}
                                />
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <CircleCheck className="absolute right-6 top-[70%] -translate-y-1/2 text-green-500 w-5 h-5" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs p-2 text-xs bg-green-500 text-center break-words leading-snug">
                                        <p>
                                            Your ID is now verified. <br />
                                            To protect your account, editing or <br /> changing your name
                                            is no longer possible.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full flex flex-col justify-center gap-x-5 sm:flex-row sm:px-10 lg:px-20 lg:flex-row">
                    <div className="w-full">
                        <Label htmlFor={"phonePrimary"}>Phone Primary</Label>
                        <Input
                            className={`${blueFocus} mt-1 mb-5`}
                            type={"number"}
                            name="phonePrimary"
                            id={"phonePrimary"}
                            value={temporal.phonePrimary}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                onchangeDebounce(e.target.value, e.target.name)
                            }
                        />
                    </div>
                    <div className="w-full">
                        <Label htmlFor={"phoneSecondary"}>Phone Secondary</Label>
                        <Input
                            className={`${blueFocus} mt-1 mb-5`}
                            type={"number"}
                            name="phoneSecondary"
                            id={"phoneSecondary"}
                            placeholder="Another number buyers can reach you on."
                            value={temporal.phoneSecondary}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                onchangeDebounce(e.target.value, e.target.name)
                            }
                        />
                    </div>
                </div>

                <div className="w-full flex flex-col justify-center sm:flex-row sm:px-10 lg:px-20 lg:flex-row">
                    <div className="w-full">
                        <Label htmlFor="storeAddress">Store Address</Label>
                        <Input
                            className={`${blueFocus} mt-1 mb-5`}
                            placeholder="Tell them where your shop is located at."
                            type="text"
                            name="storeAddress"
                            id="storeAddress"
                            defaultValue={temporal.storeAddress}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                onchangeDebounce(e.target.value, e.target.name)
                            }
                        />
                    </div>
                </div>

                <div className="w-full flex flex-col justify-center gap-3 sm:flex-row sm:px-10 lg:px-20 lg:flex-row">
                    <div className="w-full flex flex-col justify-end ">
                        {isLoading ? (
                            <BeatLoaderUI
                                className="w-full max-w-7xl m-auto mb-6 flex justify-center pt-4"
                                color="blue"
                                size={10}
                            />
                        ) : (
                            <Button
                                className={`${loading && "pointer-events-none bg-gray-400 w-full sm:w-fit"}`}
                                disabled={submitDataStatus}
                                onClick={handleSubmitBtn}
                            >
                                {loading ? (
                                    "Saving..."
                                ) : (
                                    <>
                                        Save changes
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    <div className="w-full"></div>
                </div>
                </section>
            </div>
        </>
    );

}
