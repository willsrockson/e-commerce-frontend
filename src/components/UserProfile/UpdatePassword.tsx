"use client"
import {Button} from "@/components/ui/button";
import { errorHintColor, redFocus } from "../SignUpUi";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toastError, toastSuccess } from "../toasts/toasts";
import FloatingPassword from "../sharedUi/floating-password";

interface UpdatePassword{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function UpdatePassword() {
   
    const { register, handleSubmit ,watch, formState:{errors, isSubmitting} } = useForm<UpdatePassword>({
        mode: 'onBlur'
    });

    const watchNewPassword = watch('newPassword');

    const submitUpdate: SubmitHandler<UpdatePassword> = async (data)=>{
    
        try {
            const response = await fetch("/api/account/update/password", {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                    confirmPassword: data.confirmPassword,
                }),
            });
            const results: { successMessage: string; errorMessage: string} = await response.json();
            if(!response.ok){
                 toastError({
                    message: results.errorMessage,
                });
                return;
            }
            toastSuccess({
                message: results.successMessage
            })
        } catch (error) {
            if (error instanceof Error) {
                toastError({
                    message: error.message,
                });
                return;
            }
            toastError({
                message: String(error),
            });
            return;
        }
         
    }


    return (
        <div className="w-full h-fit flex justify-center bg-[#ffff] px-4 py-10 rounded-lg">
            <div className="w-full max-w-5xl flex flex-col justify-center gap-3 sm:px-28 md:px-52 lg:px-60 mb-4">
                <form onSubmit={handleSubmit(submitUpdate)}>
                    <div className="w-full">
                        <FloatingPassword<UpdatePassword>
                            className={`w-full ${errors.currentPassword && redFocus}`}
                            label="Current password"
                            name="currentPassword"
                            register={register}
                            minLength={6}
                            minLenErrorMessage="At least 6 characters needed"
                        />
                        <p className={errorHintColor}>{errors.currentPassword?.message}</p>
                    </div>

                    <div className="w-full">
                        <FloatingPassword<UpdatePassword>
                            className={`w-full ${errors.newPassword && redFocus}`}
                            label="New password"
                            name="newPassword"
                            register={register}
                            minLength={6}
                            minLenErrorMessage="At least 6 characters needed"
                        />

                        <p className={errorHintColor}>{errors.newPassword?.message}</p>
                    </div>

                    <div className="w-full">
                        <FloatingPassword<UpdatePassword>
                            className={`w-full ${errors.confirmPassword && redFocus}`}
                            label="Confirm new password"
                            name="confirmPassword"
                            register={register}
                            minLength={6}
                            minLenErrorMessage="At least 6 characters needed"
                            confirmPassword={true}
                            takeConfirmPassword={watchNewPassword}
                        />

                        {/* <Input
                            className={errors.confirmPassword && redFocus}
                            type="password"
                            {...register("confirmPassword", {
                                required: "This is required",
                                minLength: 6,
                                validate: (value) =>
                                    value === watchNewPassword || "Password mismatch",
                            })}
                        /> */}
                        <p className={errorHintColor}>{errors.confirmPassword?.message}</p>
                    </div>

                    <div className="w-full pt-2">
                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            ) : (
                                "Change password"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
    
}
