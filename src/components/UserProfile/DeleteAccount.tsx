"use client"
import {Button} from "@/components/ui/button";
import {Trash2} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import { toastError, toastSuccess } from "../toasts/toasts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "../ui/textarea";
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { errorHintColor, redFocus } from "../SignUpUi";

interface IFormInputs {
  selectField: string;
  textFiled: string;
  confirmDelete: string;
}

export default function DeleteAccount() {

    const { register, handleSubmit, control,  watch , resetField, formState: { errors, isSubmitting} } = useForm<IFormInputs>({
        defaultValues: {
            selectField: '',
        }
    })

    const watchSelectReason = watch('selectField');
   
     const onSubmit: SubmitHandler<IFormInputs> = async(data) => {
             try {
                  const response = await fetch("/api/account/delete", {
                    method: "DELETE",
                    credentials: 'include',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify({deleteText: data.confirmDelete, reasonType: data.selectField , reasonText: data.textFiled})
                 })
                 const resData: { errorMessage: string; successMessage: string;} = await response.json();

                 if(!response.ok){
                    toastError({
                        message: resData.errorMessage
                    })
                    return
                 }

                 toastSuccess({
                    message: 'Great account deleted successful'
                 })
             } catch (error) {
                 if(error instanceof Error){
                    console.error(error);
                    toastError({
                        message: error.message
                    })
                 }
             }
     }


     useEffect(()=>{
        if(watchSelectReason !== "Other"){
            resetField("textFiled", {
                defaultValue: ''
            })
        }
     }, [watchSelectReason, resetField])
 

    return (
        <div className="w-full h-fit flex justify-center bg-[#ffff] gap-4 py-10 px-4 rounded-lg">
            <div className=" max-w-lg flex flex-col justify-center">
                <p className="text-2xl">Delete Account</p>
                <p className="text-gray-600 text-sm sm:text-left lg:text-justify mb-6">
                    Deleting your account will permanently remove all your information from our
                    database. This cannot be undone.
                </p>
                <form
                    className="w-full flex flex-col"
                    onSubmit={handleSubmit(onSubmit)}
                >
                   
                    <div className="mt-1 mb-5">
                        <Controller
                            name="selectField"
                            control={control}
                             rules={{required: 'This is required'}}
                            render={({ field}) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger className={`w-full py-5 ${errors.selectField && redFocus}`}>
                                        <SelectValue placeholder="Why do you leave?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Reasons</SelectLabel>
                                            <SelectItem value="I have already sold my item">
                                                I have already sold my item
                                            </SelectItem>
                                            <SelectItem value="I don`t find this site interesting">
                                                I don`t find this site interesting
                                            </SelectItem>
                                            <SelectItem value="There are a lot of scammers">
                                                There are a lot of scammers
                                            </SelectItem>
                                            <SelectItem value="I can not change my email">
                                                I can not change my email
                                            </SelectItem>
                                            <SelectItem value="Posting an items is difficult">
                                                Posting an items is difficult
                                            </SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.selectField && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.selectField.message}
                            </p>
                        )}
                    </div>

                    {watchSelectReason === "Other" && (
                        <>
                            <Textarea
                                className={`${errors.textFiled && redFocus} min-h-28`}
                                placeholder="Type your personal reason here."
                                {...register("textFiled", {
                                    required: "This is required",
                                    minLength: {
                                        value: 24,
                                        message: "Message must be 24 characters or more",
                                    },
                                })}
                            />
                            <p className={errorHintColor}>{errors.textFiled?.message}</p>
                        </>
                    )}

                    <div className="w-full">
                        <Label className="block text-sm font-medium text-gray-700 ">
                            To confirm, please type{" "}
                            <span className="text-red-600 font-bold">DELETE</span> below:
                        </Label>
                        <Input
                            type="text"
                            className={`
                                "w-full ",
                                ${errors.confirmDelete ? "border-red-500 focus:ring-red-500" : ""}`}
                            {...register("confirmDelete", {
                                required: "Please type DELETE to confirm",
                                validate: (val) =>
                                    val === "DELETE" || "You must type DELETE exactly",
                            })}
                        />
                        <p className={errorHintColor}>{errors.confirmDelete?.message}</p>
                    </div>

                    <Button
                        className="w-full"
                        variant={"destructive"}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            "Deleting account..."
                        ) : (
                            <>
                                <Trash2 /> Delete account
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
