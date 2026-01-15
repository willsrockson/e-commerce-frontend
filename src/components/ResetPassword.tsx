"use client";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { FloatingLabelInput } from "./ui/floating-label-input";
import { useForm, SubmitHandler } from "react-hook-form";
import { errorHintColor, redFocus } from "./SignUpUi";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import FloatingPassword from "./sharedUi/floating-password";
import { EMAIL_GHANA_PHONE_REGEX, SIX_DIGIT_CODE_REGEX } from "@/lib/constants";
import { useEffect, useState } from "react";
import { toastError, toastSuccess } from "./toasts/toasts";

interface ResetUserPassword {
   emailOrPhone: string | number;
   otpCode: number;
   password: string;
}

export default function ResetPassword() {
   const {
      register,
      handleSubmit,
      getValues,
      formState: { isSubmitting, errors },
   } = useForm<ResetUserPassword>({
      mode: "onBlur",
      defaultValues: {
         emailOrPhone: "",
         password: "",
      },
   });

   const [loading, setLoading] = useState(false);
   const [counterLoading, setCounterLoading] = useState(false);
   const [countDown, setCountdown] = useState(0);
   const [unlockUi, setUnlockUi] = useState(false);

   const sendOtpCode = async () => {
      if (!EMAIL_GHANA_PHONE_REGEX.test(String(getValues("emailOrPhone")))) {
         return;
      }
      try {
         setLoading(true);
         const res = await fetch("/api/account//me/reset/password/send/otp", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emailOrPhone: getValues("emailOrPhone") }),
         });
         const data = (await res.json()) as { successMessage: string; errorMessage: string };
         if (!res.ok) {
            setLoading(false);
            setCounterLoading(false);
            setUnlockUi(false);
            toastError({ message: data.errorMessage });
            return;
         }
         setCounterLoading(true);
         setUnlockUi(true);
         setCountdown(30);
         toastSuccess({ message: data.successMessage });
      } catch (error) {
         if (error instanceof Error) {
            setLoading(false);
            setCounterLoading(false);
            setUnlockUi(false);
            toastError({ message: "Oops, something happened. Please retry." });
         }
         return;
      }
   };

   const submitResetForms: SubmitHandler<ResetUserPassword> = async (data) => {
      try {
         const res = await fetch("/api/account/me/reset/password", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               emailOrPhone: data.emailOrPhone,
               otpCode: data.otpCode,
               newPassword: data.password,
            }),
         });
         const resData = (await res.json()) as { successMessage: string; errorMessage: string };
         if (!res.ok) {
            toastError({ message: resData.errorMessage });
            return;
         }
         toastSuccess({ message: resData.successMessage });
      } catch (error) {
         if (error instanceof Error) {
            toastError({ message: "Oops, something happened. Please retry." });
         }
         return;
      }
   };

   useEffect(() => {
      if (countDown <= 0) return;
      const timer = setInterval(() => {
         setCountdown((prev) => prev - 1);
         if (countDown <= 1) {
            setCounterLoading(false);
            setLoading(false);
         }
      }, 1000);

      return () => clearInterval(timer);
   }, [countDown]);
   return (
      <Dialog>
         <DialogTrigger asChild>
            <p className=" hover:underline flex justify-start mt-3 text-blue-400 text-sm px-0.5 cursor-pointer">
               I forgot my password
            </p>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Reset your password</DialogTitle>
               <DialogDescription>
                  For your security, we need to make sure it’s really you.
               </DialogDescription>
            </DialogHeader>
            <div className="mt-1 text-start">
               <form
                  id="resetPassword"
                  onSubmit={handleSubmit(submitResetForms)}
               >
                  <div>
                     <div>
                        <div className="relative">
                           <FloatingLabelInput
                              id="EmailPhone"
                              className={`w-full ${errors.emailOrPhone && redFocus} pr-20`}
                              label="Email or Phone"
                              type="text"
                              {...register("emailOrPhone", {
                                 required: "Please enter your email or number",
                                 pattern: {
                                    value: /^(?:[^\s@]+@[^\s@]+\.[^\s@]+|\d{10})$/,
                                    message: "Please enter a valid email address",
                                 },
                              })}
                           />
                           <Button
                              variant={"ghost"}
                              type="button"
                              disabled={loading}
                              onClick={sendOtpCode}
                              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 text-sm hover:bg-blue-100"
                           >
                              {loading ? (
                                 counterLoading ? (
                                    `${countDown} sec.`
                                 ) : (
                                    <Spinner />
                                 )
                              ) : (
                                 <span className="text-blue-500 text-xs">Get Code</span>
                              )}
                           </Button>
                        </div>

                        <p className={errorHintColor}>{errors.emailOrPhone?.message}</p>
                     </div>
                     {unlockUi && (
                        <>
                           <div>
                              <FloatingLabelInput
                                 id="optCode"
                                 className={`w-full ${errors.otpCode && redFocus}`}
                                 label="Otp Code"
                                 type="text"
                                 {...register("otpCode", {
                                    required: "Please enter OTP Code",
                                    pattern: {
                                       value: SIX_DIGIT_CODE_REGEX,
                                       message: "Please enter a valid OTP Code",
                                    },
                                 })}
                              />
                              <p className={errorHintColor}>{errors.otpCode?.message}</p>
                           </div>

                           <div>
                              <FloatingPassword<ResetUserPassword>
                                 className={`w-full ${errors.password && redFocus}`}
                                 label="New password"
                                 name="password"
                                 register={register}
                                 minLength={6}
                                 minLenErrorMessage="At least 6 characters needed"
                              />
                              <p className={errorHintColor}>{errors.password?.message}</p>
                           </div>

                           <Button
                              type="submit"
                              className="w-full"
                              variant={"default"}
                              disabled={isSubmitting}
                           >
                              {isSubmitting ? <Spinner /> : "Reset"}
                           </Button>
                        </>
                     )}
                  </div>
               </form>
            </div>
         </DialogContent>
      </Dialog>
   );
}
