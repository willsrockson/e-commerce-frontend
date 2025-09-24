"use client"
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import useSWR, {mutate} from "swr";
import BeatLoaderUI from "@/components/loaders/BeatLoader";
import VerifiedStoreSuccess from "@/components/VerifiedStoreSuccess";
import {useState} from "react";
import { toastError, toastSuccess } from "../toasts/toasts";
import ProcessingUi from "./verifyAccountUi/processingUi";
import { SubmitHandler, useForm } from "react-hook-form";
import { errorHintColor, redFocus } from "../SignUpUi";



interface IVerifyAccountType {
    id_verification_status?: string
}

interface IFormValues{
    ghanaCardNo: string;
    dateOfBirth: string;
    images: File[];
}

enum VerifyAccountState {
    "Not Verified" = "Not Verified",
    "Processing" = "Processing",
    "Verified" = "Verified"
}

export default function VerifyAccount() {
    const fetcher = (url: URL) => fetch(url).then((res) => res.json());
    const { data: serverData, error, isLoading} = useSWR<IVerifyAccountType[]>("/api/verify/getUser", fetcher);

    const { register, handleSubmit, formState: { errors, isSubmitting} } = useForm<IFormValues>({
        mode: 'onBlur'
    })

    const [universalErrorMessage, setUniversalErrorMessage] = useState<string | null>(null);

    const onSubmit: SubmitHandler<IFormValues> = async (data) => {
        const files = Array.from(data.images);
        
        const formData = new FormData();
        formData.set("ghanaCardNo", data.ghanaCardNo);
        formData.set("dateOfBirth", data.dateOfBirth);
        files.forEach((file) => {formData.append("idImages", file) });

        const response = await fetch("/api/verify/id/verification", {
            credentials: 'include',
            method: "POST",
            body: formData
        })
        const responseData: { errorMessage:string; successMessage:string} = await response.json();
        if (!response.ok) {
            toastError({
                message: `${responseData.errorMessage}`,
            })
            return;
        }
        
        await mutate("/api/verify/getUser")
        toastSuccess({
             message: `${responseData.successMessage}`,
        })

    }


    return (
        <div className="w-full flex justify-center h-fit bg-[#ffff] px-4 py-10 rounded-lg">
            <div className="w-full max-w-5xl flex flex-col justify-center items-center gap-4">
                {isLoading || error || !serverData ? (
                    <BeatLoaderUI
                        color="blue"
                        size={10}
                        className="w-full max-w-7xl m-auto mb-6 flex justify-center pt-4"
                    />
                ) : (
                    <p
                        className={`${
                            serverData[0].id_verification_status === VerifyAccountState.Verified
                                ? `text-green-500 font-semibold`
                                : `text-red-500 font-semibold`
                        } text-sm`}
                    >
                        Status: {serverData[0].id_verification_status}
                    </p>
                )}

                {serverData &&
                    serverData[0].id_verification_status === VerifyAccountState["Not Verified"] && (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="w-full">
                                <div className="max-w-md text-gray-600 text-sm mb-8">
                                    <p>
                                        Verifying your identity helps protect both buyers and
                                        sellers from fraud, ensuring a secure and trustworthy
                                        marketplace for everyone.
                                    </p>
                                </div>

                                <div className="w-full">
                                    <Label htmlFor="ghanaCard">Ghana Card No.</Label>
                                    <Input
                                        className={`w-full ${errors.ghanaCardNo && redFocus}`}
                                        type={"text"}
                                        placeholder="GHA-000000000-0"
                                        {...register("ghanaCardNo", {
                                            required: "This is required",
                                        })}
                                    />
                                    <p className={errorHintColor}>{errors.ghanaCardNo?.message}</p>
                                </div>

                                <div className="w-full relative">
                                    <Label htmlFor="ghanaCard">D.0.B</Label>
                                    <Input
                                        className={`w-full ${errors.dateOfBirth && redFocus}`}
                                        type={"date"}
                                        {...register("dateOfBirth", {
                                            required: "This is required",
                                        })}
                                    />
                                    <p className={errorHintColor}>{errors.dateOfBirth?.message}</p>
                                </div>

                                <div className="mb-4 rounded-md border border-amber-400 bg-amber-50 p-3">
                                    <p className="font-semibold text-amber-700">
                                        ⚠️ Important: Verification Requirements
                                    </p>
                                    <ul className="mt-2 list-disc pl-5 text-sm text-gray-700 space-y-1">
                                        <li>
                                            Upload{" "}
                                            <span className="font-medium">front of Ghana Card</span>{" "}
                                            (clear & visible).
                                        </li>
                                        <li>
                                            Upload{" "}
                                            <span className="font-medium">back of Ghana Card</span>{" "}
                                            (barcode must be visible).
                                        </li>
                                        <li>
                                            Upload a{" "}
                                            <span className="font-medium">
                                                selfie holding the Ghana Card
                                            </span>{" "}
                                            (front side visible).
                                        </li>
                                        <li>
                                            <span className="font-medium">
                                                Profile name must match Ghana Card name exactly.
                                            </span>
                                        </li>
                                        <li>
                                            Blurry, cropped, or mismatched uploads will be{" "}
                                            <span className="text-red-600 font-medium">
                                                rejected
                                            </span>
                                            .
                                        </li>
                                    </ul>
                                </div>

                                <div className="w-full">
                                    <Label className="block ">
                                        Upload Required Images{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <p className="mt-1 text-xs text-gray-500 mb-1">
                                        Please upload <span className="font-medium">3 files</span>:
                                        front, back, and a selfie with the Ghana Card.
                                    </p>
                                    <Input
                                        type="file"
                                        multiple
                                        className={`w-full cursor-pointer ${
                                            errors.images && redFocus
                                        }`}
                                        accept="image/*"
                                        placeholder="Four files expected"
                                        {...register("images", {
                                            required: "This is required",
                                            validate: (value) =>
                                                value.length === 3 || "Three files expected",
                                        })}
                                    />
                                    <p className={errorHintColor}>{errors.images?.message}</p>
                                </div>

                                <div className="w-full mt-5">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-testing hover:bg-blue-400"
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit"}
                                    </Button>
                                </div>

                                {universalErrorMessage && (
                                    <span className="text-red-500 my-2 text-sm">
                                        {universalErrorMessage}
                                    </span>
                                )}
                            </div>
                        </form>
                    )}

                {serverData &&
                    serverData[0]?.id_verification_status === VerifyAccountState.Processing && (
                        <ProcessingUi />
                    )}

                {serverData &&
                    serverData[0]?.id_verification_status === VerifyAccountState.Verified && (
                        <VerifiedStoreSuccess />
                    )}
            </div>
        </div>
    );
}
