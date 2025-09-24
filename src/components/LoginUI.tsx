"use client";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { authStore } from "@/store/authStore";
import { redFocus, errorHintColor } from "./SignUpUi";
import { toastError } from "./toasts/toasts";
import { useForm, SubmitHandler } from "react-hook-form";

export interface userLoginUIProps {
    isValidUser: boolean;
    data: { storename: string; fullname: string; imageUrl: string | null; updatedAt: Date | string };
    successMessage: string;
}

interface ILogin{
    emailPhone: string | number;
    password: string;
}

export default function LoginUi() {
    const {register, handleSubmit, formState:{errors, isSubmitting}} = useForm<ILogin>({
        mode: 'onBlur'
    })
    

    // Store Data
    const isLoggedInFromStore = authStore((state) => state.setAuthState);
    const setFallBackNameFromStore = authStore((state) => state.setAvatarFallback);
    const setAvatarFromStore = authStore((state) => state.setAvatarUrl);

    const [universalErrorMessage, setUniversalErrorMessage] = useState<string | null>(null);
    

    const router = useRouter();


    const loginSubmitHandler: SubmitHandler<ILogin> = async (data) => {
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
                <div className="flex flex-col mb-5 items-center ">
                    {/* <span className="text-2xl text-testing">Create Account</span> */}
                    <p className="font-bold">
                       Sign in to your account
                    </p>
                </div>

                <div className="flex flex-col">
                    {/* <Label htmlFor="email_phone">Email or phone number</Label> */}
                    <Input
                        className={`w-full ${errors.emailPhone && redFocus}`}
                        placeholder="Email or Phone"
                        type="text"
                        {...register("emailPhone", {
                            required: "This is required",
                            pattern: /^(?:[^\s@]+@[^\s@]+\.[^\s@]+|\d{10})$/,
                        })}
                        onFocus={()=> setUniversalErrorMessage(null)}
                    />
                    <p className={errorHintColor}>{errors.emailPhone?.message}</p>

                    {/* <Label htmlFor="Password">Password</Label> */}
                    <Input
                        className={`w-full ${errors.password && redFocus}`}
                        placeholder="Password"
                        type="password"
                        {...register("password", {
                            required: "This is required",
                            minLength: {
                                value: 6,
                                message: "Password must be 6 characters or more.",
                            },
                        })}
                        onFocus={()=> setUniversalErrorMessage(null)}
                    />
                    <p className={errorHintColor}>{errors.password?.message}</p>
                    <Button
                        disabled={isSubmitting}
                        className={`${
                            isSubmitting && `disabled:cursor-not-allowed`
                        } bg-testing hover:bg-blue-500 w-full`}
                        type="submit"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        ) : (
                            "Continue"
                        )}
                    </Button>

                    {universalErrorMessage && <p className="text-sm text-red-500 mt-3">{universalErrorMessage}</p>}
                    {
                        !universalErrorMessage &&
                    <Link
                            href="#"
                            className=" hover:underline flex justify-start mt-3 text-blue-400 text-sm px-0.5 cursor-pointer"
                        >
                            I forgot my password
                        </Link>
                    }
                </div>
            </form>
        </div>
    );
}
