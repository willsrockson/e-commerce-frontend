"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { errorHintColor, redFocus } from "@/components/SignUpUi";
import { toastError, toastSuccess } from "@/components/toasts/toasts";
import { useState } from "react";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Spinner } from "@/components/ui/spinner";
import { BackendResponseType, UserProfileData } from "@/lib/interfaces";
import { MailWarning, RefreshCw } from "lucide-react"; // Icons

interface IFormType {
  newEmail: string;
  confirmEmail: string;
}

type Email = Pick<UserProfileData, "email">;

export default function ChangeNotVerifiedEmail() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, mutate } = useSWR<Email>("/api/auth/account/settings", fetcher);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IFormType>({
    mode: "onBlur",
  });

  const watchNewEmail = watch("newEmail");

  const submit: SubmitHandler<IFormType> = async (formData) => {
    try {
      const response = await fetch(
        "/api/auth/account/change/unverified/email",
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newEmail: formData.newEmail,
            confirmEmail: formData.confirmEmail,
          }),
        },
      );
      const json = (await response.json()) as BackendResponseType<{
        email: string;
      }>;
      if (!response.ok) {
        toastError({ message: json.error.message });
        return;
      }

      await mutate(
        (currentData) => ({ ...currentData, email: json.data?.email ?? "" }),
        {
          revalidate: false,
        },
      );

      toastSuccess({ message: json.message });
    } catch {
      toastError({ message: "Update failed. Please try again." });
    }
  };

  const submitResendVerificationEmail = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/auth/account/resend/email/verification/link",
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      const json = (await response.json()) as BackendResponseType;

      if (!response.ok) {
        toastError({ message: json.error.message });
        return;
      }
      toastSuccess({ message: json.message });
    } catch {
      toastError({ message: "Request failed" });
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
          <MailWarning className="h-5 w-5 text-orange-500" />
          Verify or Update Email
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Your current email is unverified. Resend the link or update it below.
        </p>
      </div>

      <form onSubmit={handleSubmit(submit)} className="space-y-6">
        {/* Current Email + Resend Button */}
        <div className="w-full">
          <div className="relative">
            <FloatingLabelInput
              label="Current Email (Unverified)"
              className={`pr-28 bg-orange-50/50`} // Tint background to show unverified status
              disabled
              name="yourEmail"
              id="yourEmail"
              value={data?.email}
            />

            <Button
              variant={"ghost"}
              type="button"
              disabled={loading}
              onClick={submitResendVerificationEmail}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              {loading ? (
                <Spinner className="w-3 h-3" />
              ) : (
                <span className="flex items-center gap-1">
                  <RefreshCw size={12} /> Resend Link
                </span>
              )}
            </Button>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* New Email Inputs */}
        <div className="space-y-6">
          <div className="w-full">
            <FloatingLabelInput
              label="New Email Address"
              id="newEmail"
              type={"email"}
              className={errors.newEmail ? redFocus : ""}
              {...register("newEmail", {
                required: "Please enter your email address.",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            <p className={errorHintColor}>{errors.newEmail?.message}</p>
          </div>

          <div className="w-full">
            <FloatingLabelInput
              label="Confirm New Email"
              id="confirmNewEmail"
              type={"email"}
              className={errors.confirmEmail ? redFocus : ""}
              {...register("confirmEmail", {
                required: "Please confirm your email address",
                validate: (value) =>
                  value === watchNewEmail || "Email mismatch",
              })}
            />
            <p className={errorHintColor}>{errors.confirmEmail?.message}</p>
          </div>
        </div>

        <div className="pt-2">
          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full md:w-auto"
          >
            {isSubmitting ? <Spinner className="mr-2" /> : null}
            {isSubmitting ? "Updating..." : "Update Email"}
          </Button>
        </div>
      </form>
    </div>
  );
}
