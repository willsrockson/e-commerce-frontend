"use client";

import { Button } from "@/components/ui/button";
import { errorHintColor, redFocus } from "../SignUpUi";
import { SubmitHandler, useForm } from "react-hook-form";
import { toastError, toastSuccess } from "../toasts/toasts";
import FloatingPassword from "../sharedUi/floating-password";
import { BackendResponseType } from "@/lib/interfaces";
import { Spinner } from "../ui/spinner";
import { LockKeyhole } from "lucide-react"; // Nice icon for the header

interface UpdatePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UpdatePassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset, // Added reset to clear form after success
  } = useForm<UpdatePassword>({
    mode: "onBlur",
  });

  const watchNewPassword = watch("newPassword");

  const submitUpdate: SubmitHandler<UpdatePassword> = async (data) => {
    try {
      const response = await fetch("/api/auth/account/change/password", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });
      const json = (await response.json()) as BackendResponseType;

      if (!response.ok) {
        toastError({ message: json.error.message });
        return;
      }

      toastSuccess({ message: json.message });
      reset(); // Clear the inputs on success
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError" || error.message.includes("Network")) {
          toastError({
            message: "Connection timed out. Please check your internet.",
          });
        } else {
          toastError({
            message: "Something went wrong. Please try again later.",
          });
        }
      }
    }
  };

  return (
    // 1. Wrapper: Restrict width to max-w-xl (approx 576px) and align left
    <div className="w-full max-w-xl py-10">
      {/* 2. Header: Consistent with other settings pages */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <LockKeyhole className="h-5 w-5 text-gray-500" />
          Change Password
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Ensure your account stays secure by using a strong, unique password.
        </p>
      </div>

      <form onSubmit={handleSubmit(submitUpdate)} className="space-y-6">
        {/* Current Password */}
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

        {/* Separator line for visual clarity */}
        <hr className="border-gray-100" />

        {/* New Passwords Group */}
        <div className="space-y-6">
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
            <p className={errorHintColor}>{errors.confirmPassword?.message}</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full md:w-auto" // Full width on mobile, auto on desktop
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" /> Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
