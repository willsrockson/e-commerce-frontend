"use client";
import { Button } from "./ui/button";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { authStore } from "@/store/authStore";
import { redFocus, errorHintColor } from "./SignUpUi";
import { toastError } from "./toasts/toasts";
import { useForm, SubmitHandler } from "react-hook-form";
import { FloatingLabelInput } from "./ui/floating-label-input";
import FloatingPassword from "./sharedUi/floating-password";
import ResetPassword from "./ResetPassword";
import { EMAIL_GHANA_PHONE_REGEX } from "@/lib/constants";


export interface userLoginUIProps {
    isValidUser: boolean;
    data: { storename: string; fullname: string; imageUrl: string | null; updatedAt: Date | string };
    successMessage: string;
}

interface Login{
    emailPhone: string | number;
    password: string;
}

export default function LoginUi() {
    const {register, handleSubmit, formState:{errors, isSubmitting}} = useForm<Login>({
        mode: 'onBlur'
    })
    

    // Store Data
    const isLoggedInFromStore = authStore((state) => state.setAuthState);
    const setFallBackNameFromStore = authStore((state) => state.setAvatarFallback);
    const setAvatarFromStore = authStore((state) => state.setAvatarUrl);

    const [universalErrorMessage, setUniversalErrorMessage] = useState<string | null>(null);

    const router = useRouter();


    const loginSubmitHandler: SubmitHandler<Login> = async (data) => {
        try {
            const res = await fetch("/api/user/login", {
                credentials: "include",
                method: "POST",
                body: JSON.stringify({
                    emailPhone: data.emailPhone,
                    password: data.password,
                }),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                const dataFrom404: { isValidUser: boolean; errorMessage: string } = await res.json();
                setUniversalErrorMessage(dataFrom404.errorMessage);
                return;
            }

            const resData: userLoginUIProps = await res.json();
            isLoggedInFromStore(resData?.isValidUser);

            //Takes the first character of first name and last name
            setFallBackNameFromStore(resData.data?.fullname.split(" ")[0]);
            setAvatarFromStore(
                resData.data?.imageUrl + "?v=" + resData.data?.updatedAt
            );
            router.push("/");
            router.refresh();
        } catch (e: unknown) {
              if(e instanceof Error){
                toastError({message: "An unexpected error occurred. Please try again later."});
                return;
              }
        }
    };

    

    useEffect(() => {
        isLoggedInFromStore(false);
    }, [isLoggedInFromStore]);

    return (
        <div className="w-full h-fit max-w-md py-8">
            <form onSubmit={handleSubmit(loginSubmitHandler)}>
                {/* <div className="flex flex-col mb-3 items-center ">
                    <p className="font-bold">Sign in to your account</p>
                </div> */}

                <div className="relative">
                    <FloatingLabelInput
                        id="EmailOrPhone"
                        className={`w-full ${errors.emailPhone && redFocus}`}
                        label="Email or Phone"
                        type="text"
                        {...register("emailPhone", {
                            required: "Please enter your email or number",
                            pattern: {
                                value: EMAIL_GHANA_PHONE_REGEX,
                                message: "Please enter a valid email address or phone.",
                            },
                        })}
                        onFocus={() => setUniversalErrorMessage(null)}
                    />
                    <p className={errorHintColor}>{errors.emailPhone?.message}</p>
                </div>

                <div>
                    <FloatingPassword<Login>
                        className={`w-full ${errors.password && redFocus}`}
                        label="Password"
                        name="password"
                        register={register}
                        minLength={6}
                        minLenErrorMessage="At least 6 characters needed"
                        onFocus={() => setUniversalErrorMessage(null)}
                    />
                    <p className={errorHintColor}>{errors.password?.message}</p>
                </div>

                <Button
                    disabled={isSubmitting}
                    className={`${
                        isSubmitting && `disabled:cursor-not-allowed`
                    } bg-testing hover:bg-blue-500 w-full`}
                    type="submit"
                >
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Continue"}
                </Button>

                {universalErrorMessage && (
                    <p className="text-sm text-red-500 mt-3">{universalErrorMessage}</p>
                )}
                
            </form>

            {!universalErrorMessage && (
                    <ResetPassword />
                )}
        </div>
    );
}
