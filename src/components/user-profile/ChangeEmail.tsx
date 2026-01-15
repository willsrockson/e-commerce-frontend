"use client";
import useSWR from "swr";
import ChangeNotVerifiedEmail from "./email/changeNotVerifiedEmail";
import ChangeVerifiedEmail from "./email/ChangeVerifiedEmail";
import BeatLoaderUI from "../loaders/BeatLoader";
import { UserProfileData } from "@/lib/interfaces";

export default function ChangeEmail() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR<UserProfileData>(
    "/api/auth/account/settings",
    fetcher,
  );

  if (isLoading || error) {
    return (
      <div className="w-full flex justify-start py-10 px-4">
        <BeatLoaderUI color="blue" size={10} />
      </div>
    );
  }

  // Logic: If unverified, show the simple form. If verified, show the OTP form.
  return (
    // Removed "flex justify-center" to allow left alignment
    <div className="w-full h-fit bg-white rounded-lg">
      {data && data?.emailVerified === "unverified" ? (
        <ChangeNotVerifiedEmail />
      ) : (
        <ChangeVerifiedEmail />
      )}
    </div>
  );
}
