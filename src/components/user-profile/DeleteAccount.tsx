"use client";
import { Button } from "@/components/ui/button";
import { Trash2, TriangleAlert, AlertCircle } from "lucide-react"; // Added icons
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { toastError, toastSuccess } from "../toasts/toasts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { errorHintColor, redFocus } from "../SignUpUi";
import { Spinner } from "../ui/spinner"; // Assuming you have this from previous components

interface IFormInputs {
  selectField: string;
  textFiled: string;
  confirmDelete: string;
}

export default function DeleteAccount() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<IFormInputs>({
    defaultValues: {
      selectField: "",
    },
  });

  const watchSelectReason = watch("selectField");

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          deleteText: data.confirmDelete,
          reasonType: data.selectField,
          reasonText: data.textFiled,
        }),
      });
      const resData = await response.json();

      if (!response.ok) {
        toastError({ message: resData.errorMessage });
        return;
      }

      toastSuccess({ message: "Account deleted successfully" });
      // Logic to logout or redirect user would likely go here
    } catch (error) {
      if (error instanceof Error) {
        toastError({ message: error.message });
      }
    }
  };

  useEffect(() => {
    if (watchSelectReason !== "Other") {
      resetField("textFiled", { defaultValue: "" });
    }
  }, [watchSelectReason, resetField]);

  return (
    // 1. Wrapper: Left align + Max Width
    <div className="w-full max-w-xl py-10">
      {/* 2. Header with Warning Icon */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-red-600 flex items-center gap-2">
          <TriangleAlert className="h-5 w-5" />
          Delete Account
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Permanently remove your account and all associated data. This action
          cannot be undone.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Reason Select */}
        <div className="space-y-2">
          <Label>Reason for leaving</Label>
          <Controller
            name="selectField"
            control={control}
            rules={{ required: "Please select a reason" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  className={`w-full ${errors.selectField && "border-red-500 focus:ring-red-500"}`}
                >
                  <SelectValue placeholder="Select a reason..." />
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
                      Posting items is difficult
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.selectField && (
            <p className={errorHintColor}>{errors.selectField.message}</p>
          )}
        </div>

        {/* Conditional Textarea */}
        {watchSelectReason === "Other" && (
          <div className="space-y-2">
            <Label>Please tell us more</Label>
            <Textarea
              className={`${errors.textFiled && redFocus} min-h-[100px]`}
              placeholder="Type your personal reason here..."
              {...register("textFiled", {
                required: "This is required",
                minLength: {
                  value: 24,
                  message: "Message must be 24 characters or more",
                },
              })}
            />
            <p className={errorHintColor}>{errors.textFiled?.message}</p>
          </div>
        )}

        {/* Danger Zone: Confirmation */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 mt-4">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Final Confirmation</p>
              <p className="mt-1 opacity-90">
                To confirm deletion, please type{" "}
                <span className="font-bold select-none">DELETE</span> in the box
                below.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Input
              type="text"
              placeholder="DELETE"
              className={`bg-white ${errors.confirmDelete ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              {...register("confirmDelete", {
                required: "Please type DELETE to confirm",
                validate: (val) =>
                  val === "DELETE" || "You must type DELETE exactly",
              })}
            />
            <p className={errorHintColor}>{errors.confirmDelete?.message}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white border-red-600"
            variant={"destructive"}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Account
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
