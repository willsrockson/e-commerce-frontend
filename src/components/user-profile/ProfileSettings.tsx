"use client";

import { Input } from "@/components/ui/input";
import { CircleCheck, Pen, User, Store } from "lucide-react"; // Added Icons
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useSWR, { mutate } from "swr";
import { useEffect, useMemo, useState } from "react";
import BeatLoaderUI from "@/components/loaders/BeatLoader";
import { authStore } from "@/store/authStore";
import { blueFocus } from "../SignUpUi";
import { toastError, toastSuccess, toastWarning } from "../toasts/toasts";
import { FloatingLabelInput } from "../ui/floating-label-input";
import { GH_PHONE_REGEX, ID_VERIFICATION } from "@/lib/constants";
import { BackendResponseType, UserProfileData } from "@/lib/interfaces";
import PhoneNumberVerification from "./phone/PhoneNumberVerification";
import imageCompression from "browser-image-compression";

type UserProfileType = {
  storeName: string;
  fullName: string;
  phonePrimary: string;
  phoneSecondary: string;
  storeAddress: string;
  imageUrl?: string;
  updatedAt?: string;
};

export default function ProfileSettings() {
  const fetcher = (url: URL) => fetch(url).then((res) => res.json());
  const { data, isLoading } = useSWR<UserProfileData>(
    "/api/auth/account/settings",
    fetcher,
  );

  const setAvatarUrl = authStore((state) => state.setAvatarUrl);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const formData = new FormData();
  const avatarFormData = useMemo(() => new FormData(), []);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Original state
  const [original, setOriginal] = useState<UserProfileType>({
    storeName: "",
    fullName: "",
    phonePrimary: "",
    phoneSecondary: "",
    storeAddress: "",
  });
  const [temporal, setTemporal] = useState<UserProfileType>({
    storeName: "",
    fullName: "",
    phonePrimary: "",
    phoneSecondary: "",
    storeAddress: "",
  });

  const [submitDataStatus, setSubmitDataStatus] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const onchangeDebounce = (newData: string, fieldName: string) => {
    setTemporal((prev) => ({ ...prev, [fieldName]: newData }));
  };

  // --- LOGIC: Avatar Upload (Kept same) ---
  useEffect(() => {
    if (avatar == null || !avatar) return;
    setIsUploadingPhoto(true);

    async function updateProfilePicture() {
      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1000,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(avatar!, options);
        avatarFormData.set("avatar", compressedFile);

        if (avatarFormData.entries().next().done) {
          toastWarning({ message: "No photo selected" });
          return;
        }

        const response = await fetch("/api/auth/account/set/avatar", {
          credentials: "include",
          method: "POST",
          body: avatarFormData,
        });
        const json = (await response.json()) as BackendResponseType<{
          imageUrl: string;
        }>;

        if (!response.ok) {
          setAvatar(null);
          setIsUploadingPhoto(false);
          toastError({ message: json.error.message });
          return;
        }

        await mutate("/api/auth/account/settings");
        setAvatarUrl(json?.data?.imageUrl ?? "");
        setAvatar(null);
        setIsUploadingPhoto(false);
        toastSuccess({ message: json.message });
      } catch (error) {
        if (error instanceof Error) {
          toastError({ message: "Upload failed. Please try again." });
        }
        setIsUploadingPhoto(false);
        setAvatar(null);
      }
    }
    updateProfilePicture();
  }, [avatar, avatarFormData, setAvatarUrl]);

  // --- LOGIC: Form Change Detection (Kept same) ---
  useEffect(() => {
    if (
      original.storeName !== temporal.storeName &&
      temporal.storeName?.trim()
    ) {
      setSubmitDataStatus(false);
      formData.append("storeName", temporal.storeName);
    }
    if (original.fullName !== temporal.fullName && temporal.fullName?.trim()) {
      setSubmitDataStatus(false);
      formData.append("fullName", temporal.fullName);
    }
    if (
      original.phonePrimary !== temporal.phonePrimary &&
      temporal.phonePrimary?.trim().length === 10 &&
      GH_PHONE_REGEX.test(temporal.phonePrimary)
    ) {
      setSubmitDataStatus(false);
      formData.append("phonePrimary", temporal.phonePrimary);
    }
    if (
      original.phoneSecondary !== temporal.phoneSecondary &&
      GH_PHONE_REGEX.test(temporal.phoneSecondary)
    ) {
      setSubmitDataStatus(false);
      formData.append("phoneSecondary", temporal.phoneSecondary);
    }
    if (
      original.storeAddress !== temporal.storeAddress &&
      temporal.storeAddress?.trim().length > 1
    ) {
      setSubmitDataStatus(false);
      formData.append("storeAddress", temporal.storeAddress);
    }
  }, [formData, original, temporal]);

  // --- LOGIC: Sync Data (Kept same) ---
  useEffect(() => {
    if (!data) return;
    const userData = {
      fullName: data?.fullName ?? "",
      storeName: data?.storeName ?? "",
      phonePrimary: data?.phonePrimary ?? "",
      phoneSecondary: data?.phoneSecondary ?? "",
      storeAddress: data?.storeAddress ?? "",
    };
    setOriginal((prev) => ({ ...prev, ...userData }));
    setTemporal((prev) => ({ ...prev, ...userData }));
  }, [data]);

  async function handleSubmitBtn() {
    if (formData.entries().next().done) {
      toastWarning({ message: "Nothing changed." });
      return;
    }
    setLoading(true);
    const response = await fetch("/api/auth/account/settings/update", {
      credentials: "include",
      method: "PATCH",
      body: formData,
    });

    const data = (await response.json()) as BackendResponseType;
    setLoading(false);
    if (!response.ok) {
      toastWarning({ message: data.error.message });
      return;
    }

    await mutate("/api/auth/account/settings");
    setSubmitDataStatus(false);
    toastSuccess({ message: data.message });
  }

  // --- RENDER ---
  return (
    // 1. Wrapper: Left aligned + Max Width
    <div className="w-full max-w-xl py-10">
      {/* 2. Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Store className="h-5 w-5 text-gray-500" />
          Profile Details
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your public profile and contact information.
        </p>
      </div>

      <section className="space-y-8">
        {/* 3. Avatar Section (Left Aligned Row) */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="relative h-20 w-20 rounded-full bg-gradient-to-r from-[#155dfc] to-violet-500 p-[2px]">
              <Avatar
                className={`w-full h-full border-2 border-white ${isUploadingPhoto && "animate-pulse"}`}
              >
                <AvatarImage
                  src={`${data && data?.imageUrl}`}
                  alt={original.fullName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-white">
                  <User className="text-gray-400" />
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Edit Icon Overlay */}
            <div className="absolute bottom-0 right-0 translate-x-1 translate-y-1 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
              <Pen size={14} className="text-gray-600" />
              <Input
                type="file"
                disabled={isUploadingPhoto}
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0])
                    setAvatar(e.target.files[0]);
                }}
              />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Profile Photo</h3>
            <p className="text-xs text-gray-500 mt-1">
              Click the pen icon to upload. <br /> recommended: Square JPG or
              PNG.
            </p>
          </div>
        </div>

        {/* 4. Form Fields (Vertical Stack) */}
        <div className="space-y-5">
          {/* Store Name */}
          <div>
            <FloatingLabelInput
              className={`${blueFocus}`}
              label="Shop / Business Name"
              name="storeName"
              value={temporal.storeName}
              id="storeName"
              onChange={(e) => onchangeDebounce(e.target.value, e.target.name)}
            />
          </div>

          {/* Full Name */}
          <div>
            {data && data?.idVerified === ID_VERIFICATION.UNVERIFIED ? (
              <FloatingLabelInput
                className={`${blueFocus}`}
                label="Full Name"
                name="fullName"
                id="fullName"
                value={temporal.fullName}
                onChange={(e) =>
                  onchangeDebounce(e.target.value, e.target.name)
                }
              />
            ) : (
              <div className="relative">
                <FloatingLabelInput
                  label="Full Name"
                  className={`${blueFocus} pr-10 bg-gray-50`} // Greyed out slightly
                  disabled
                  id="fullname"
                  value={temporal.fullName}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CircleCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-green-600 text-white border-green-700">
                    <p>ID Verified. Name cannot be changed.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>

          {/* Phones Grid (2 Cols on mobile is fine, but stack on tiny screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <PhoneNumberVerification
              label="Primary Phone"
              nameAndId="phonePrimary"
              value={temporal?.phonePrimary}
              isPhoneVerified={data ? data?.phonePrimaryVerified : "unverified"}
              phoneNumber={original?.phonePrimary}
              onchangeFunc={onchangeDebounce}
            />
            <PhoneNumberVerification
              label="Secondary Phone"
              nameAndId="phoneSecondary"
              value={temporal?.phoneSecondary}
              isPhoneVerified={
                data ? data?.phoneSecondaryVerified : "unverified"
              }
              phoneNumber={original?.phoneSecondary}
              onchangeFunc={onchangeDebounce}
            />
          </div>

          {/* Address */}
          <div>
            <FloatingLabelInput
              className={`${blueFocus}`}
              label="Shop Address / Location"
              type="text"
              name="storeAddress"
              id="storeAddress"
              defaultValue={temporal.storeAddress}
              onChange={(e) => onchangeDebounce(e.target.value, e.target.name)}
            />
          </div>
        </div>

        {/* 5. Action Button */}
        <div className="pt-2">
          {isLoading ? (
            <div className="w-full flex justify-start">
              <BeatLoaderUI color="blue" size={10} />
            </div>
          ) : (
            <Button
              className={`w-full md:w-auto min-w-[150px] ${loading && "opacity-70"}`}
              disabled={submitDataStatus || loading}
              onClick={handleSubmitBtn}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
