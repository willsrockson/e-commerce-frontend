"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useSWR, { mutate } from "swr";
import { Loader2 } from "lucide-react";
import { errorHintColor, redFocus } from "@/components/SignUpUi";
import {useState } from "react";
import { IDataFromServer } from "./changeNotVerifiedEmail";
import { toastError, toastSuccess } from "@/components/toasts/toasts";
import { useRouter } from "next/navigation";

 interface IFormType {
            newEmail: string;
            confirmEmail: string;
            otpCode?: string | number;
        }


export default function ChangeVerifiedEmail() {
    const router = useRouter();
    const fetcher = (url: string) => fetch(url).then((res) => res.json());     
    const { data } = useSWR<IDataFromServer[]>("/api/account/settings", fetcher);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, formState:{errors, isSubmitting} } = useForm<IFormType>({
        mode: "onBlur"
    });

    const newEmailWatch = watch('newEmail');
   
    const submit: SubmitHandler<IFormType> =async(data)=>{
         try {
             const response = await fetch("/api/account/update/email/verified", {
                 method: "PATCH",
                 credentials: 'include',
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ newEmail: data.newEmail, confirmEmail: data.confirmEmail, code: data.otpCode?.toString()}),
             });
             const answer:{errorMessage: string, successMessage: string} = await response.json();
             if(!response.ok){
                throw new Error(answer.errorMessage);
             }
             await mutate("/api/account/settings");
             router.refresh();
             toastSuccess({
                message: answer.successMessage
             })
         } catch (error) {
              if(error instanceof Error){
                console.error(error.message);
                toastError({
                    message: error.message,
                })
                return;
              }
              console.error(String(error));
                toastError({
                    message: 'Something unexpected happen, please retry.'
                })
                return;
         }
    }

    const submitGetCodeToEmail = async () => {
            try {
                if(!data){
                    throw new Error('Please login');
                }

                setLoading(true);
                const response = await fetch("/api/account/email/request/code", {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                const responseData: { successMessage: string; errorMessage: string } =
                    await response.json();
                setLoading(false);    
                if (!response.ok) {
                    toastError({
                        message: responseData.errorMessage ?? "Something went wrong, please retry.",
                    });
                    return;
                }
                toastSuccess({ message: responseData.successMessage });
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                    toastError({ message: "Code request failed" });
                    return;
                }
                console.error(String(error));
                toastError({ message: "Code request failed" });
                return;
            }
        };
 
 
    return (
       
            <div className="w-full max-w-5xl flex flex-col justify-center gap-3 sm:px-28 md:px-52 lg:px-60 mb-4">
                <form onSubmit={handleSubmit(submit)}>
                    <div className="w-full">
                        <Label htmlFor="yourEmail">Your email</Label>
                        <div className="relative mb-5">
                        <Input
                            className={`pr-10`} // padding so text doesn't overlap
                            disabled
                            name="yourEmail"
                            id="yourEmail"
                           defaultValue={data && data[0]?.email ? data[0]?.email : ""}
                        />
                        <span className="flex text-[#22c55e] items-center gap-1 absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm">
                                
                                Confirmed
                            </span>
                        </div>
                        
                    </div>

                    <div className="w-full">
                        <Label htmlFor={"newEmail"}>New email</Label>
                        <Input
                            type={"email"}
                            className={errors.newEmail ? redFocus : ""}
                            {...register("newEmail", {
                                required: "This is required.",
                                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            })}
                        />
                        <p className={errorHintColor}>{errors.newEmail?.message}</p>
                    </div>

                    <div className="w-full">
                        <Label htmlFor={"confirmNewEmail"}>Confirm new email</Label>
                        <Input
                            type={"email"}
                            className={errors.confirmEmail ? redFocus : ""}
                            {...register("confirmEmail", {
                                required: "This is required",
                                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                validate: (value) =>
                                    value === newEmailWatch || 'Emails do not match'
                            })}
                        />
                        <p className={errorHintColor}>{errors.confirmEmail?.message}</p>
                    </div>

                    <div className="w-full ">
                        <Label htmlFor={"otpCode"}>Enter 6-digit code</Label>
                        <div className="relative">
                            <Input
                                type={"number"}
                                className={`${errors.otpCode ? redFocus : ""} pr-20`}
                                {...register("otpCode", {
                                    required: "This is required",
                                    minLength: { value: 6, message: "Minimum 6 digits" },
                                    maxLength: { value: 6, message: "Maximum 6 digits" },
                                })}
                            />
                            <Button
                                variant={"ghost"}
                                type="button"
                                disabled={loading}
                                onClick={submitGetCodeToEmail}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm"
                            >
                               {loading ? (<Loader2 className="animate-spin h-4 w-4 mr-2" />) : "Get Code"}
                            </Button>
                        </div>

                        <p className={errorHintColor}>{errors.otpCode?.message}</p>
                    </div>

                    <ol className="text-xs text-gray-500 mt-1 mb-5">
                        <li>Requested code will be sent to your current email</li>
                    </ol>

                    <div className="w-full pt-2">
                        <Button disabled={isSubmitting} type="submit" className="w-full">{isSubmitting ? (<Loader2 className="animate-spin h-4 w-4 mr-2" />) : "Update email"}</Button>
                    </div>
                </form>
            </div>
    );
}
