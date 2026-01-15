"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { Loader2, ShieldCheck, CheckCircle } from "lucide-react"; // Icons
import { errorHintColor, redFocus } from "@/components/SignUpUi";
import { useState } from "react";
import { toastError, toastSuccess } from "@/components/toasts/toasts";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { BackendResponseType, UserProfileData } from "@/lib/interfaces";
import { Spinner } from "@/components/ui/spinner";

interface FormType {
  newEmail: string;
  confirmEmail: string;
  otpCode?: string;
}

export default function ChangeVerifiedEmail() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, mutate } = useSWR<UserProfileData>(
    "/api/auth/account/settings",
    fetcher,
  );
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormType>({
    mode: "onBlur",
  });

  const newEmailWatch = watch("newEmail");

  const submit: SubmitHandler<FormType> = async (formData) => {
    try {
      const response = await fetch("/api/auth/account/change/verified/email", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newEmail: formData.newEmail,
          confirmEmail: formData.confirmEmail,
          code: formData.otpCode?.toString(),
        }),
      });
      const json = (await response.json()) as BackendResponseType<{
        email: string;
      }>;
      if (!response.ok) {
        toastError({ message: json.error.message });
        return;
      }
      await mutate(
        (currentData) => ({ ...currentData!, email: json.data?.email ?? "" }),
        {
          revalidate: false,
        },
      );
      toastSuccess({ message: json.message });
    } catch {
      toastError({ message: "Verification request failed" });
    }
  };

  const submitGetCodeToEmail = async () => {
    try {
      if (!data) throw new Error("Please login");

      setLoading(true);
      const response = await fetch("/api/auth/account/generate/otp/code", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = (await response.json()) as BackendResponseType;
      if (!response.ok) {
        toastError({ message: json.error.message });
        return;
      }
      toastSuccess({ message: json.message });
    } catch {
      toastError({ message: "An unexpected error happened" });
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. Wrapper: Left align + Max Width
    <div className="w-full max-w-xl py-10">
      {/* 2. Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-green-600" />
          Update Email Address
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          For security, changing a verified email requires a code sent to your
          current address.
        </p>
      </div>

      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        {/* Current Email (Read Only) */}
        <div className="w-full">
          <div className="relative">
            <FloatingLabelInput
              className={`pr-10 bg-gray-50`}
              label="Current Verified Email"
              disabled
              name="yourEmail"
              id="yourEmail"
              value={data?.email}
            />
            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
          </div>
        </div>

        {/* New Email Section */}
        <div className="space-y-6">
          <div>
            <FloatingLabelInput
              id="newEmail"
              label="New Email"
              type={"email"}
              className={errors.newEmail ? redFocus : ""}
              {...register("newEmail", {
                required: "Please enter a valid email address.",
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              })}
            />
            <p className={errorHintColor}>{errors.newEmail?.message}</p>
          </div>

          <div>
            <FloatingLabelInput
              id="confirmNewEmail"
              label="Confirm New Email"
              type={"email"}
              className={errors.confirmEmail ? redFocus : ""}
              {...register("confirmEmail", {
                required: "Please confirm your email address",
                validate: (value) =>
                  value === newEmailWatch || "Email mismatch",
              })}
            />
            <p className={errorHintColor}>{errors.confirmEmail?.message}</p>
          </div>
        </div>

        {/* OTP Section */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4">
          <p className="text-xs text-gray-500 mb-3 font-medium">
            Security Verification
          </p>
          <div className="relative">
            <FloatingLabelInput
              id="otpCode"
              label="Enter 6-digit Code"
              type={"number"}
              className={`${errors.otpCode ? redFocus : ""} pr-24 bg-white`}
              {...register("otpCode", {
                required: "Please enter your verification code",
                minLength: { value: 6, message: "Minimum 6 digits" },
                maxLength: { value: 6, message: "Maximum 6 digits" },
              })}
            />
            <Button
              variant={"ghost"}
              type="button"
              disabled={loading}
              onClick={submitGetCodeToEmail}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:bg-sky-50"
            >
              {loading ? (
                <Loader2 className="animate-spin h-3.5 w-3.5" />
              ) : (
                "Get Code"
              )}
            </Button>
          </div>
          <p className={errorHintColor}>{errors.otpCode?.message}</p>
          <p className="text-[11px] text-gray-400 mt-2">
            * The code will be sent to your <b>current</b> email address.
          </p>
        </div>

        <div className="pt-2">
          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full md:w-auto"
          >
            {isSubmitting ? <Spinner className="mr-2" /> : null}
            {isSubmitting ? "Verifying..." : "Update Email"}
          </Button>
        </div>
      </form>
    </div>
  );
}
