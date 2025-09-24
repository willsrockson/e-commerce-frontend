"use client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import React, { useEffect, useState } from "react";
import { authStore } from "@/store/authStore";
import { userLoginUIProps } from "@/components/LoginUI";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "./toasts/toasts";
import { useForm, SubmitHandler } from "react-hook-form";
import { Loader2 } from "lucide-react";

export const redFocus = `border-red-400`;
export const blueFocus = `focus:border-blue-500 focus:ring focus:ring-blue-300`;


    // Checks whether the email is valid or not
export function isValidEmail(email: string) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}
export const errorHintColor = 'text-xs text-red-500 mt-1 mb-5';

interface IRegisterType{
        email: string;
        password: string;
        fullName: string;
        phonePrimary: string;
}

export default function SignUpUi() {
    const router = useRouter();
    // Store Data
    const isLoggedInFromStore = authStore((state) => state.setAuthState);
    const setFallBackNameFromStore = authStore((state) => state.setAvatarFallback);
    const setAvatarFromStore = authStore((state) => state.setAvatarUrl);

    const {register, handleSubmit, formState:{errors, isSubmitting}} = useForm<IRegisterType>({
        mode: 'onBlur'
    })

    const [universalErrorMessage, setUniversalErrorMessage] = useState<string | null>(null);
    



    
    // Handles form submission and error checking
    const handleRegisterSubmit: SubmitHandler<IRegisterType> = async (data) => {
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

            if (!res.ok) {
                const finalResponse: { errorMessage: string } = await res.json();
                setUniversalErrorMessage(finalResponse.errorMessage);
                return;
            }

            const resData = (await res.json()) as userLoginUIProps;
            isLoggedInFromStore(resData?.isValidUser);

            //Takes the first character of first name and last name
            const namePortion = resData.data?.fullname.split(" ")[0];
            setFallBackNameFromStore(namePortion);
            setAvatarFromStore(
                !resData.data?.imageUrl
                    ? " "
                    : resData?.data?.imageUrl + "?v=" + resData?.data?.updatedAt
            );

            toastSuccess({
                message: resData?.successMessage,
            });
            
            router.push("/");
            router.refresh();
        } catch (e: unknown) {
            if (e instanceof Error) {
                toastError({
                    message: "An unexpected error occurred. Please try again later.",
                });
                return;
            }
        } finally {
           
        }
    };
   

    useEffect(() => {
        isLoggedInFromStore(false);
    }, [isLoggedInFromStore]);

    return (
        // w-full border px-8 py-4  h-fit rounded-lg max-w-md pb-8
        <div className="w-full h-fit max-w-md py-8">
            <form onSubmit={handleSubmit(handleRegisterSubmit)}>
                <div className="flex flex-col mb-5 items-center ">
                    {/* <span className="text-2xl text-testing">Create Account</span> */}
                    <p className="font-bold">
                       Create an account
                    </p>
                </div>

                <div className="flex flex-col ">
                    {/* <Label htmlFor="fullname">Full name</Label> */}
                    <Input
                        type="text"
                        className={`w-full ${errors.fullName && redFocus}`}
                        placeholder="Full name"
                        {...register('fullName', { required: 'This is required'})}
                        onFocus={()=> setUniversalErrorMessage(null)}
                    />
                    <p className={errorHintColor}>{errors.fullName?.message}</p>

                    {/* <Label htmlFor="email">Email</Label> */}
                    <Input
                        type="email"
                        className={`w-full ${errors.email && redFocus}`}
                        placeholder="Email"
                        {...register('email', { required: 'This is required', pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })}
                        onFocus={()=> setUniversalErrorMessage(null)}
                    />
                    <p className={errorHintColor}>{errors.email?.message}</p>

                    {/* <Label htmlFor="password">Password</Label> */}
                    <Input
                        type="password"
                        className={`w-full ${errors.password && redFocus}`}
                        placeholder="Password"
                        {...register('password', {required: 'This is required', minLength: { value: 6, message: 'Password must be 6 characters or more'}})}
                        onFocus={()=> setUniversalErrorMessage(null)}
                    />
                    <p className={errorHintColor}>{errors.password?.message}</p>

                    {/* <Label htmlFor="phone">Phone number</Label> */}
                    <Input
                        type="number"
                        className={`w-full ${errors.phonePrimary && redFocus}`}
                        placeholder="Phone primary"
                        {...register('phonePrimary', {required: 'This is required', minLength: { value: 10, message: 'Phone cannot be less than 10 digits'}, maxLength: { value: 10, message: 'Phone cannot be more than 10 digits'}})}
                        onFocus={()=> setUniversalErrorMessage(null)}
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

                    {universalErrorMessage && <p className="text-sm text-red-500 mt-3">{universalErrorMessage}</p>}
                    
                </div>
            </form>
        </div>
    );
}
