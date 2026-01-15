"use client";
import { blueFocus, errorHintColor, redFocus } from "@/components/SignUpUi";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";

import {
   InputOTP,
   InputOTPGroup,
   InputOTPSeparator,
   InputOTPSlot,
} from "@/components/ui/input-otp";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Send, Trash } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { BackendResponseType } from "@/lib/interfaces";
import { toastError, toastSuccess } from "@/components/toasts/toasts";
import useTimeCounter from "@/hooks/useTimeCounter";

import { FiEdit3, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { MdVerifiedUser } from "react-icons/md";
import { GH_PHONE_REGEX, SIX_DIGIT_CODE_REGEX } from "@/lib/constants";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { mutate } from "swr";

type PhoneNumber = {
   value: string;
   phoneNumber: string;
   label: string;
   nameAndId: string;
   isPhoneVerified: "verified" | "unverified";
   onchangeFunc: (newData: string, fieldName: string) => void;
};
interface ChangeVerifiedPhoneNumber {
   newPhoneNumber: string | number;
   code: number;
}

export default function PhoneNumberVerification({
   value,
   nameAndId,
   label,
   phoneNumber,
   isPhoneVerified,
   onchangeFunc,
}: PhoneNumber) {
   const {
      register,
      handleSubmit,
      control,
      watch,
      reset,
      formState: { errors, isSubmitting },
   } = useForm<ChangeVerifiedPhoneNumber>();

   const codeForChangeNumber = watch("code");

   const [deleteNumberLoading, setDeleteNumberLoading] = useState(false);
   const [sendCodeLoading, setSendCodeLoading] = useState(false);
   const [verifyCodeLoading, setVerifyCodeLoading] = useState(false);

   const [next, setNext] = useState(false);
   const [isOpen, setIsOpen] = useState({
      notVerified: false,
      verified: false,
   }); // for the dialog model

   const [code, setCode] = useState("");
   const { open, openModal, message, resetTimer } = useTimeCounter({
      inputMinutes: 3,
      type: "down",
   });

   const deleteNumberHandler = async () => {
      try {
         setDeleteNumberLoading(true);
         const res = await fetch("/api/auth/account/delete/number", {
            method: "PATCH",
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone: phoneNumber }),
         });
         const json = (await res.json()) as BackendResponseType;
         setDeleteNumberLoading(false);
         if (!res.ok) {
            toastError({ message: json.error.message });
            return;
         }
         await mutate("/api/auth/account/settings");
         toastSuccess({ message: json.message });
      } catch (error) {
         if (error instanceof Error) {
            if (error.name === "AbortError" || error.message.includes("Network")) {
               toastError({ message: "Connection timed out. Please check your internet." });
            } else {
               // The Universal Fallback
               toastError({ message: "Something went wrong. Please try again later." });
            }
         }
         return;
      }
   };

   const sendCodeHandler = async () => {
      if (!phoneNumber.trim() || !Number(phoneNumber)) return;
      try {
         setSendCodeLoading(true);
         const res = await fetch("/api/auth/account/generate/otp/code", {
            method: "POST",
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone: phoneNumber }),
         });

         const resJson = (await res.json()) as BackendResponseType;

         if (!res.ok) {
            toastError({ message: resJson.error.message });
            return;
         }

         openModal();
         toastSuccess({ message: resJson.message });
      } catch (error) {
         if (error instanceof Error) {
            if (error.name === "AbortError" || error.message.includes("Network")) {
               toastError({ message: "Connection timed out. Please check your internet." });
            } else {
               // The Universal Fallback
               toastError({ message: "Something went wrong. Please try again later." });
            }
         }
         return;
      } finally {
         setSendCodeLoading(false);
      }
   };

   const verifyPhoneNumber = async () => {
      if (!GH_PHONE_REGEX.test(phoneNumber) || !SIX_DIGIT_CODE_REGEX.test(code)) {
         toastError({ message: "Unexpected error happened." });
         return;
      }
      try {
         setVerifyCodeLoading(true);
         const res = await fetch("/api/auth/account/verify/phone/number", {
            method: "POST",
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: code, phone: phoneNumber }),
         });
         const json = (await res.json()) as BackendResponseType;
         if (!res.ok) {
            toastError({ message: json.error.message });
            return;
         }
         await mutate("/api/auth/account/settings");
         resetTimer();
         toastSuccess({ message: json.message });
      } catch (error) {
         if (error instanceof Error) {
            if (error.name === "AbortError" || error.message.includes("Network")) {
               toastError({ message: "Connection timed out. Please check your internet." });
            } else {
               // The Universal Fallback
               toastError({ message: "Something went wrong. Please try again later." });
            }
         }
         return;
      } finally {
         setVerifyCodeLoading(false);
      }
   };

   const changeVerifiedPhoneNumber: SubmitHandler<ChangeVerifiedPhoneNumber> = async (data) => {
      try {
         const res = await fetch("api/auth/account/change/verified/phone/number", {
            method: "PATCH",
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               code: data.code,
               phone: data.newPhoneNumber,
               oldPhone: phoneNumber,
            }),
         });
         const json = (await res.json()) as BackendResponseType;
         if (!res.ok) {
            toastError({ message: json.error.message });
            return;
         }
         await mutate("/api/auth/account/settings");
         resetTimer();
         toastSuccess({ message: json.message });
      } catch (error) {
         if (error instanceof Error) {
            if (error.name === "AbortError" || error.message.includes("Network")) {
               toastError({ message: "Connection timed out. Please check your internet." });
            } else {
               // The Universal Fallback
               toastError({ message: "Something went wrong. Please try again later." });
            }
         }
         return;
      }
   };

   const handleOpenChangeForNotVerifiedNumber = (open: boolean) => {
      setIsOpen((prev) => ({ ...prev, notVerified: open }));
      if (!open) {
         setTimeout(() => {
            setCode("");
         }, 300);
      }
   };

   const handleOpenChangeVerifiedNumber = (open: boolean) => {
      setIsOpen((prev) => ({ ...prev, verified: open }));
      if (!open) {
         setTimeout(() => {
            reset();
            setNext(false);
         }, 300);
      }
   };

   return (
      <div className="w-full">
         <div className="relative mb-5">
            <FloatingLabelInput
               label={label}
               className={`${blueFocus} mt-1 mb-5`}
               type={"number"}
               name={nameAndId}
               id={nameAndId}
               value={value}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (isPhoneVerified === "verified" && e.target.name === "phonePrimary") {
                     return;
                  } else if (isPhoneVerified === "verified" && e.target.name === "phoneSecondary") {
                     return;
                  } else {
                     onchangeFunc(e.target.value, e.target.name);
                  }
               }}
            />
            {phoneNumber && isPhoneVerified === "verified" && (
               <MdVerifiedUser 
                   className="absolute left-28 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none z-10" 
                />
            )}
            {/* Confirm users phone number */}
            {phoneNumber && isPhoneVerified === "unverified" && (
               <Dialog
                  open={isOpen.notVerified}
                  onOpenChange={handleOpenChangeForNotVerifiedNumber}
               >
                  <DialogTrigger asChild>
                     <Button
                        variant={"ghost"}
                        type="button"
                        className="absolute right-12 top-1/2 -translate-y-1/2 px-3 py-1 text-sm hover:bg-blue-200 bg-blue-100 cursor-pointer"
                     >
                        <span className="text-blue-500 text-xs">Confirm</span>
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                     <DialogHeader>
                        <DialogTitle>Confirm Phone Number</DialogTitle>
                        <DialogDescription>
                           Verifying your number builds trust and allows buyers to contact you
                           directly. We will send a code to confirm this number {phoneNumber}.
                        </DialogDescription>
                     </DialogHeader>
                     <div className="w-full space-y-4">
                        {!open ? (
                           <Button
                              disabled={sendCodeLoading}
                              onClick={sendCodeHandler}
                              className="w-full bg-blue-100 hover:bg-blue-200 text-blue-500 flex items-center gap-1"
                           >
                              {sendCodeLoading ? (
                                 <Spinner />
                              ) : (
                                 <>
                                    Confirm via Email <Send />
                                 </>
                              )}
                           </Button>
                        ) : (
                           <div className="w-full space-y-4">
                              <InputOTP
                                 maxLength={6}
                                 pattern={REGEXP_ONLY_DIGITS}
                                 className="w-full"
                                 onChange={(value) => setCode(value)}
                              >
                                 <InputOTPGroup className="w-full">
                                    <InputOTPSlot
                                       className="w-full"
                                       index={0}
                                    />
                                    <InputOTPSlot
                                       className="w-full"
                                       index={1}
                                    />
                                    <InputOTPSlot
                                       className="w-full"
                                       index={2}
                                    />
                                    <InputOTPSlot
                                       className="w-full"
                                       index={3}
                                    />
                                    <InputOTPSlot
                                       className="w-full"
                                       index={4}
                                    />
                                    <InputOTPSlot
                                       className="w-full"
                                       index={5}
                                    />
                                 </InputOTPGroup>
                              </InputOTP>

                              <Button
                                 disabled={code.length !== 6}
                                 onClick={verifyPhoneNumber}
                                 className="w-full bg-blue-100 hover:bg-blue-200 text-blue-500 flex items-center gap-1"
                              >
                                 {verifyCodeLoading ? <Spinner /> : "Verify code"}
                              </Button>
                              <p className="text-xs">{`Resend code in ${message} sec.`}</p>
                           </div>
                        )}
                     </div>
                  </DialogContent>
               </Dialog>
            )}

            {/* Remove users telephone number, and remove confirmed number */}
            {phoneNumber && isPhoneVerified === "unverified" ? (
               <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button
                        variant={"ghost"}
                        type="button"
                        disabled={deleteNumberLoading}
                        className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 text-sm hover:bg-red-200 bg-red-100 cursor-pointer"
                     >
                        {deleteNumberLoading ? <Spinner /> : <Trash className="text-red-500" />}
                     </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle>Remove phone number</AlertDialogTitle>
                        <AlertDialogDescription>
                           This action will remove your secondary phone number and make it
                           unavailable to buyers. Confirm to proceed.
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                           <Button
                              variant={"outline"}
                              type="button"
                              disabled={deleteNumberLoading}
                              onClick={deleteNumberHandler}
                              className="bg-primary-foreground text-sm hover:bg-red-100"
                           >
                              <span className="text-red-500 text-xs">Confirm</span>
                           </Button>
                        </AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>
            ) : (
               phoneNumber &&
               isPhoneVerified === "verified" && (
                  <Dialog
                     open={isOpen.verified}
                     onOpenChange={handleOpenChangeVerifiedNumber}
                  >
                     <DialogTrigger asChild>
                        <Button
                           variant={"ghost"}
                           type="button"
                           className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 text-sm hover:bg-blue-200 bg-blue-100 cursor-pointer"
                        >
                           <FiEdit3 color="#3b82f6" />
                        </Button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                           <DialogTitle className="flex items-center gap-3">
                              <FiArrowLeft
                                 className={`cursor-pointer ${`${!next ? "hidden" : "block"}`}`}
                                 onClick={() => setNext(false)}
                              />
                              Change verified number
                           </DialogTitle>
                           <DialogDescription>
                              You’re about to change your verified phone number. We’ll send a
                              verification code to this number: {phoneNumber} to confirm your new
                              number.
                           </DialogDescription>
                        </DialogHeader>
                        <div className="w-full space-y-4">
                           {!open ? (
                              <Button
                                 disabled={sendCodeLoading}
                                 onClick={sendCodeHandler}
                                 className="w-full bg-blue-100 hover:bg-blue-200 text-blue-500 flex items-center gap-1"
                              >
                                 {sendCodeLoading ? (
                                    <Spinner />
                                 ) : (
                                    <>
                                       Confirm via Email <Send />
                                    </>
                                 )}
                              </Button>
                           ) : (
                              <form onSubmit={handleSubmit(changeVerifiedPhoneNumber)}>
                                 <div className="w-full space-y-4">
                                    <div className={`${!next ? "hidden" : "block"}`}>
                                       <FloatingLabelInput
                                          type="number"
                                          id="newPhoneNumber"
                                          className={`w-full ${errors.newPhoneNumber && redFocus}`}
                                          label="New phone number"
                                          {...register("newPhoneNumber", {
                                             required: "Phone number is required.",
                                             pattern: {
                                                value: GH_PHONE_REGEX,
                                                message: "Please enter a valid 10 digit.",
                                             },
                                          })}
                                       />
                                       <p className={errorHintColor}>
                                          {errors.newPhoneNumber?.message}
                                       </p>
                                    </div>

                                    <Controller
                                       control={control}
                                       name="code"
                                       rules={{ pattern: SIX_DIGIT_CODE_REGEX }}
                                       render={({ field }) => {
                                          return (
                                             <div className={`${next ? "hidden" : "block"}`}>
                                                <InputOTP
                                                   maxLength={6}
                                                   pattern={REGEXP_ONLY_DIGITS}
                                                   className="w-full"
                                                   onChange={(value) => field.onChange(value)}
                                                >
                                                   <InputOTPGroup className="w-full">
                                                      <InputOTPSlot
                                                         className="w-full h-11"
                                                         index={0}
                                                      />
                                                      <InputOTPSlot
                                                         className="w-full h-11"
                                                         index={1}
                                                      />
                                                      <InputOTPSlot
                                                         className="w-full h-11"
                                                         index={2}
                                                      />
                                                      <InputOTPSeparator className="text-gray-400" />
                                                      <InputOTPSlot
                                                         className="w-full h-11"
                                                         index={3}
                                                      />
                                                      <InputOTPSlot
                                                         className="w-full h-11"
                                                         index={4}
                                                      />
                                                      <InputOTPSlot
                                                         className="w-full h-11"
                                                         index={5}
                                                      />
                                                   </InputOTPGroup>
                                                </InputOTP>
                                             </div>
                                          );
                                       }}
                                    />

                                    {next ? (
                                       <Button
                                          disabled={isSubmitting}
                                          type="submit"
                                          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-500 flex items-center gap-1"
                                       >
                                          {isSubmitting ? <Spinner /> : "Change number"}
                                       </Button>
                                    ) : (
                                       <Button
                                          type="button"
                                          disabled={
                                             codeForChangeNumber?.toString()?.trim()?.length !== 6
                                          }
                                          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-500 flex items-center gap-1"
                                          onClick={(e) => {
                                             e.preventDefault();
                                             if (
                                                codeForChangeNumber?.toString()?.trim()?.length ===
                                                6
                                             ) {
                                                setNext(true);
                                             }
                                          }}
                                       >
                                          <span className="flex items-center gap-2">
                                             Next <FiArrowRight />
                                          </span>
                                       </Button>
                                    )}
                                    <p className="text-xs">{`Resend code in ${message} sec.`}</p>
                                 </div>
                              </form>
                           )}
                        </div>
                     </DialogContent>
                  </Dialog>
               )
            )}
         </div>
      </div>
   );
}
