"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import useSWR, { mutate } from "swr";
import { errorHintColor, redFocus } from "@/components/SignUpUi";
import { toastError, toastSuccess } from "@/components/toasts/toasts";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";


 interface IFormType {
            newEmail: string;
            confirmEmail: string;
  }
 
 export interface IDataFromServer{
    email: string;
  }

export default function ChangeNotVerifiedEmail() {
     const router = useRouter();
    const fetcher = (url: URL) => fetch(url).then((res) => res.json());
    const { data } = useSWR<IDataFromServer[]>("/api/account/settings", fetcher);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, formState:{errors, isSubmitting} } = useForm<IFormType>({
        mode: "onBlur"
    });

    const watchNewEmail = watch('newEmail');
   
    const submit: SubmitHandler<IFormType> = async(data) => {
         try {
             const response = await fetch("/api/account/update/email/not/verified", {
                 method: "PATCH",
                 credentials: 'include',
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ newEmail: data.newEmail, confirmEmail: data.confirmEmail }),
             });
             const answer:{errorMessage: string, successMessage: string} = await response.json();
             if(!response.ok){
                throw new Error(answer.errorMessage ?? "Something went wrong, please retry." );
             }
             await mutate("/api/account/settings");
             router.refresh();
             toastSuccess({
                message: answer.successMessage
             })
         } catch (error) {
              if(error instanceof Error){
                toastError({
                    message: error.message,
                })
                return;
              }
                toastError({
                    message: 'Something unexpected happen, please retry.'
                })
                return;
         }

    };


    const submitResendVerificationEmail = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/account/email/resend/verification/link", {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });
            const responseData: { successMessage: string; errorMessage: string } =
                await response.json();
            setLoading(false);    
            if (!response.ok) {
                toastError({
                    message: responseData.errorMessage,
                });
                return;
            }
            toastSuccess({ message: responseData.successMessage });
        } catch (error) {
            if (error instanceof Error) {
                toastError({ message: "Verification request failed" });
                return;
            }
            toastError({ message: "Verification request failed" });
            return;
        }
    };



    return (
        <div className="w-full max-w-5xl flex flex-col justify-center gap-3 sm:px-28 md:px-52 lg:px-60 mb-4">
            <form onSubmit={handleSubmit(submit)}>
                <div className="w-full">
                    <div className="relative mb-5">
                        <FloatingLabelInput
                            label="Your email"
                            className={`pr-10`} // padding so text doesn't overlap
                            disabled
                            name="yourEmail"
                            id="yourEmail"
                            defaultValue={data && data[0]?.email ? data[0]?.email : ""}
                        />
                        <Button
                            variant={"ghost"}
                            type="button"
                            disabled={loading}
                            onClick={submitResendVerificationEmail}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm hover:bg-blue-100"
                        >
                           {loading ? (<Loader2 className="animate-spin h-4 w-4 mr-2" />) : <span className="text-blue-500 text-xs">Resend Link</span>}
                        </Button>
                    </div>
                </div>

                <div className="w-full">
                    <FloatingLabelInput
                        label="New email"
                        id="newEmail"
                        type={"email"}
                        className={errors.newEmail ? redFocus : ""}
                        {...register("newEmail", {
                            required: "Please enter your email address.",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Please enter a valid email address"
                            },
                        })}
                    />
                    <p className={errorHintColor}>{errors.newEmail?.message}</p>
                </div>

                <div className="w-full">
                    <FloatingLabelInput
                        label="Confirm new email"
                        id="confirmNewEmail"
                        type={"email"}
                        className={errors.confirmEmail ? redFocus : ""}
                        {...register("confirmEmail", {
                            required: "Please confirm your email address",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Please enter a valid email address"
                            },
                            validate: (value) => value === watchNewEmail || "Email mismatch",
                        })}
                    />
                    <p className={errorHintColor}>{errors.confirmEmail?.message}</p>
                </div>

                <div className="w-full">
                    <Button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-sky-600 hover:bg-sky-500"
                    >
                        
                    {isSubmitting ? (<Loader2 className="animate-spin h-4 w-4 mr-2" />) : "Update email"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
