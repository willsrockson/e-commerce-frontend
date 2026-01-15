"use client";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { authStore } from "@/store/authStore";
import { redFocus, errorHintColor } from "./SignUpUi";
import { useForm, SubmitHandler } from "react-hook-form";
import { FloatingLabelInput } from "./ui/floating-label-input";
import FloatingPassword from "./sharedUi/floating-password";
import ResetPassword from "./ResetPassword";
import { EMAIL_GHANA_PHONE_REGEX } from "@/lib/constants";
import {FcGoogle} from 'react-icons/fc'
import { Spinner } from "./ui/spinner";
import { BackendResponseType } from "@/lib/interfaces";

export interface UserLoginResponse {
    success: boolean;
    userDetails: {
        fullName: string;
        imageUrl: string | null;
        updatedAt: Date | string;
    };
    message: string;
}

interface Login {
    emailPhone: string | number;
    password: string;
}

export default function LoginUi() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Login>();

    // Store Data
    const isLoggedInFromStore = authStore((state) => state.setAuthState);
    
    const [universalErrorMessage, setUniversalErrorMessage] = useState<string | null>(null);
    const [googleLoading, setGoogleLoading] = useState(false);

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

            const resData = await res.json() as BackendResponseType;

            if (!res.ok) {
                setUniversalErrorMessage(resData.error.message);
                return;
            }

            window.location.href = "/";
        } catch (error) {
            if (error instanceof Error) {
               if (error.name === "AbortError" || error.message.includes("Network")) {
                  setUniversalErrorMessage("Connection timed out. Please check your internet.");
               } else {
                  // The Universal Fallback
                  setUniversalErrorMessage("Something went wrong. Please try again later.");
               }
            }
            return;
        }
    };

    const loginWithGoogle = async()=>{
        try {
            setGoogleLoading(true);
        const res = await fetch('/api/user/oauth/login');
        const responseData = await res.json() as { url: string;}
        window.location.replace(responseData.url);
        setGoogleLoading(false) 
        } catch (error) {
            if (error instanceof Error) {
               if (error.name === "AbortError" || error.message.includes("Network")) {
                  setUniversalErrorMessage("Connection timed out. Please check your internet.");
               } else {
                  // The Universal Fallback
                  setUniversalErrorMessage("Something went wrong. Please try again later.");
               }
            }
            return;
        }    
    }


    useEffect(() => {
        isLoggedInFromStore(false);
    }, [isLoggedInFromStore]);


    return (
        <div className="w-full h-fit max-w-md py-5">
            <form onSubmit={handleSubmit(loginSubmitHandler)}>
                
                 {universalErrorMessage && (
                    <div className="bg-red-100 w-full px-3 py-2.5 flex justify-between mb-4 rounded-md">
                        <p className="text-sm text-red-600">{universalErrorMessage}</p>
                    </div>
                )}

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
                    } bg-testing hover:bg-blue-500 w-full mb-3 cursor-pointer`}
                    type="submit"
                >
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Continue"}
                </Button>

                <Button 
                      disabled={googleLoading} 
                      onClick={loginWithGoogle} 
                      type="button" variant={"outline"} 
                      className="w-full cursor-pointer">
                    <FcGoogle className="mr-2 h-4 w-4" />
                    {googleLoading ? <Spinner/>: 'Continue with Google' }
                </Button>

                {/* {universalErrorMessage && (
                    <p className="text-sm text-red-500 mt-3">{universalErrorMessage}</p>
                )} */}
            </form>
            <ResetPassword />

            {/* {!universalErrorMessage && <ResetPassword />} */}
        </div>
    );
}
