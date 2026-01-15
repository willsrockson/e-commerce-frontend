"use client";
import { Button } from "./ui/button";
import React, { useEffect, useState } from "react";
import { authStore } from "@/store/authStore";
import { useForm, SubmitHandler } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { FloatingLabelInput } from "./ui/floating-label-input";
import FloatingPassword from "./sharedUi/floating-password";
import { GH_PHONE_REGEX } from "@/lib/constants";
import { BackendResponseType } from "@/lib/interfaces";

export const redFocus = `border-red-400 pl-2`;
export const blueFocus = `focus:border-blue-500 focus:ring focus:ring-blue-300`;


    // Checks whether the email is valid or not
export function isValidEmail(email: string) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}
export const errorHintColor = 'text-xs text-red-500 mt-1 mb-5 pl-2';

interface Register{
    email: string;
    password: string;
    fullName: string;
    phonePrimary: string;
}

export default function SignUpUi() {
    //Store state
    const isLoggedInFromStore = authStore((state) => state.setAuthState);

    const {register, handleSubmit, formState:{errors, isSubmitting}} = useForm<Register>({
        mode: 'onBlur'
    })

    const [universalErrorMessage, setUniversalErrorMessage] = useState<string | null>(null);
    
    // Handles form submission and error checking
    const handleRegisterSubmit: SubmitHandler<Register> = async (data) => {
        try {
            const res = await fetch("/api/user/signup", {
                credentials: "include",
                method: "POST",
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    fullName: data.fullName,
                    phonePrimary: data.phonePrimary,
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
   

    useEffect(() => {
        isLoggedInFromStore(false);
    }, [isLoggedInFromStore]);

    return (
        // w-full border px-8 py-4  h-fit rounded-lg max-w-md pb-8
        <div className="w-full h-fit max-w-md py-8">
            <form onSubmit={handleSubmit(handleRegisterSubmit)}>
                {/* <div className="flex flex-col mb-3 items-center ">
                    <p className="font-bold">
                       Create an account
                    </p>
                </div> */}

                <div className="flex flex-col ">
                    <FloatingLabelInput
                        id="fullName"
                        type="text"
                        className={`w-full ${errors.fullName && redFocus}`}
                        label="Full name"
                        {...register("fullName", { required: "Please enter your full name" })}
                        onFocus={() => setUniversalErrorMessage(null)}
                    />
                    <p className={errorHintColor}>{errors.fullName?.message}</p>

                    <FloatingLabelInput
                        id="email"
                        type="email"
                        className={`w-full ${errors.email && redFocus}`}
                        label="Email"
                        {...register("email", {
                            required: "Please enter your email address.",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Please enter a valid email address."
                            },
                        })}
                        onFocus={() => setUniversalErrorMessage(null)}
                    />
                    <p className={errorHintColor}>{errors.email?.message}</p>

                    <FloatingPassword<Register>
                        className={`w-full ${errors.password && redFocus}`}
                        label="Password"
                        name="password"
                        register={register}
                        minLength={6}
                        minLenErrorMessage="Password must be 6 characters or more."
                        onFocus={() => setUniversalErrorMessage(null)}
                    />
                    <p className={errorHintColor}>{errors.password?.message}</p>

                    <FloatingLabelInput
                        id="phoneNumber"
                        type="number"
                        className={`w-full ${errors.phonePrimary && redFocus}`}
                        label="Phone (digits only)"
                        {...register("phonePrimary", {
                            required: "Please enter a valid phone number",
                            minLength: {
                                value: 10,
                                message: "Phone number cannot be less than 10 digits.",
                            },
                            maxLength: {
                                value: 10,
                                message: "Phone number cannot be more than 10 digits.",
                            },
                            pattern:{
                                value: GH_PHONE_REGEX,
                                message: "Invalid phone number."
                            }
                        })}
                        onFocus={() => setUniversalErrorMessage(null)}
                    />
                    <p className={errorHintColor}>{errors.phonePrimary?.message}</p>
                    <Button
                        disabled={isSubmitting}
                        type="submit"
                        className={`${
                            isSubmitting
                                ? `bg-gray-500 text-white disabled:cursor-not-allowed`
                                : `bg-testing hover:bg-blue-400`
                        } w-full`}
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        ) : (
                            "Sign up for free"
                        )}
                    </Button>

                    {universalErrorMessage && (
                        <p className="text-sm text-red-500 mt-3">{universalErrorMessage}</p>
                    )}
                </div>
            </form>
        </div>
    );
}
