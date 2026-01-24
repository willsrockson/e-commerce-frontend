"use client";
import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toastError, toastSuccess } from "@/components/toasts/toasts";
import SelectSearch from "@/components/sharedUi/select-search";
import { useForm, SubmitHandler } from "react-hook-form";
import SelectOnly from "@/components/sharedUi/select-only";
import { postErrorColor } from "@/components/MakePost";
import { redFocus } from "@/components/SignUpUi";
import PriceShared from "@/components/sharedUi/price";
import CheckBoxSelectShared from "@/components/sharedUi/checkbox-select";
import useSWR from "swr";
import BeatLoaderUI from "@/components/loaders/BeatLoader";
import { Spinner } from "@/components/ui/spinner";
import imageCompression from "browser-image-compression";
import { BackendResponseType } from "@/lib/interfaces";
import {
  Smartphone,
  BatteryCharging,
  Tag,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

interface MobilePhoneSubType {
  takeRegion: string;
  takeTown: string;
  takeMainCategory: string;
  takeSubCategory: string;
  takeFiles: File[] | null;
  takeDescription: string;
  takeTitle: string;
  renderNextPage: (state: boolean) => void;
}

interface IContentFormType {
  brand: string;
  model: string;
  storage: string;
  ram: string;
  color: string;
  battery_size: string;
  battery_health: string;
  screen_size: string;
  condition: string;
  negotiable: string;
  exchangePossible: string;
  accessories: string[];
  price: string;
}

interface IBrand {
  brand: string;
}

export interface IMobileGeneral {
  negotiable: string[];
  conditions: string[];
  exchange_possible: string[];
  accessories: string[];
}

type model = {
  model: string;
  storages: string[];
  colors: string[];
  screen_size: string[];
  battery_size: string[];
  ram: string[];
};

export interface IModel {
  models: model[];
}

export const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/webp",
};

const MobilePhonesSub = ({
  takeRegion,
  takeTown,
  takeMainCategory,
  takeSubCategory,
  takeFiles,
  takeDescription,
  takeTitle,
  renderNextPage,
}: MobilePhoneSubType) => {
  const fetcher = (url: URL) => fetch(url).then((res) => res.json());

  const {
    register,
    handleSubmit,
    watch,
    resetField,
    control,
    formState: { errors, isSubmitting },
  } = useForm<IContentFormType>({
    defaultValues: {
      brand: "",
      model: "",
      storage: "",
      ram: "",
      color: "",
      battery_size: "",
      battery_health: "",
      screen_size: "",
      condition: "",
      negotiable: "",
      exchangePossible: "",
      accessories: [],
      price: "",
    },
    mode: "onBlur",
    shouldUnregister: false,
  });
  const [brandValue, modelValue] = watch(["brand", "model"]);

  const { data: mobileBrand, isLoading: isMobileBrandLoading } = useSWR<
    IBrand[]
  >("/api/content/mobile/brand", fetcher);
  const { data: mobileGeneral, isLoading: isMobileGeneralLoading } = useSWR<
    IMobileGeneral[]
  >("/api/content/mobile/general", fetcher);
  const { data: mobileModel, isLoading: isMobileModelLoading } = useSWR<
    IModel[]
  >(brandValue ? `/api/content/mobile/model/${brandValue}` : null, fetcher);

  const handleListingSubmission: SubmitHandler<IContentFormType> = async (
    data,
  ) => {
    renderNextPage(false);
    const BRAND = "Apple";
    try {
      if (data.brand === BRAND && !data.battery_health.trim()) {
        toastError({
          message: "Enter a valid BH percentage",
        });
        return;
      }

      if (
        !takeRegion.trim() ||
        !takeTown.trim() ||
        !takeMainCategory.trim() ||
        !takeSubCategory.trim() ||
        !takeFiles ||
        !takeDescription.trim() ||
        !takeTitle.trim()
      ) {
        toastError({
          message: "Please fill out all fields.",
        });
        return;
      }

      const formData = new FormData();

      formData.set("region", takeRegion);
      formData.set("town", takeTown);
      formData.set("mainCategory", takeMainCategory);
      formData.set("subCategory", takeSubCategory);
      formData.set("title", takeTitle);
      formData.set("description", takeDescription);
      // Mobile data starts from here
      formData.set("brand", data.brand);
      formData.set("model", data.model);
      formData.set("color", data.color);
      formData.set("storage", data.storage);
      formData.set("ram", data.ram);
      formData.set("exchangePossible", data.exchangePossible);
      formData.set("price", data.price);
      formData.set("negotiable", data.negotiable);
      formData.set("condition", data.condition);
      formData.set("screenSize", data.screen_size);
      formData.set("batterySize", data.battery_size);
      if (data.brand === BRAND) {
        formData.set("batteryHealth", data.battery_health);
      }
      if (data.accessories?.length > 0) {
        data.accessories?.forEach((accessory) => {
          formData.append("accessories", accessory);
        });
      }

      const compressionPromises = takeFiles?.map(async (file) => {
        try {
          const compressedFile = await imageCompression(file, options);
          return compressedFile;
        } catch {
          return null;
        }
      });

      if (compressionPromises === null) {
        throw new Error("Failed adding images");
      }

      const compressedFiles = await Promise.all(compressionPromises);

      compressedFiles?.forEach((file) => {
        if (!file) return;
        formData.append("adImages", file);
      });

      const res = await fetch("/api/auth/post/electronics/mobile/phones", {
        method: "POST",
        body: formData,
      });

      const json = (await res.json()) as BackendResponseType;

      if (!res.ok) {
        toastError({
          message: Array.isArray(json.error.message)
            ? json.error.message[0].message
            : json.error.message,
        });
        return;
      }

      //formData.delete('accessories');
      //formData.delete('adImages');
      toastSuccess({
        message: json.message,
      });
    } catch (error) {
      if (error instanceof Error) {
        toastError({
          message: "Oops! An unexpected error happened.",
        });
        return;
      }
    } finally {
      renderNextPage(true);
    }
    // END LOGIC COPY
  };

  useEffect(() => {
    resetField("model");
    resetField("storage");
    resetField("ram");
    resetField("color");
    resetField("battery_size");
    resetField("battery_health");
    resetField("screen_size");
  }, [brandValue, resetField]);

  useEffect(() => {
    if (modelValue) {
      resetField("storage");
      resetField("ram");
      resetField("color");
      resetField("battery_size");
      resetField("battery_health");
      resetField("screen_size");
    }
  }, [modelValue, resetField]);

  const renderUI =
    isMobileBrandLoading || isMobileGeneralLoading || isMobileModelLoading;

  return (
    <div className="w-full min-h-screen pb-20">
      <div className="w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Phone Specs
          </h1>
          <p className="text-gray-500 mt-1 mb-2">
            Step 2 of 2: Specific details for your device.
          </p>
        </div>

        {renderUI && (
          <BeatLoaderUI
            color="blue"
            size={12}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        )}
        <form onSubmit={handleSubmit(handleListingSubmission)}>
          <div
            className={`bg-white space-y-8 ${renderUI && "pointer-events-none opacity-20"}`}
          >
            {/* --- CORE SPECS --- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-800 font-semibold border-b border-gray-100 pb-2 mb-4">
                <Smartphone size={18} className="text-blue-600" />
                <h2>Device Specification</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Brand */}
                <div className="space-y-1.5">
                  <Label htmlFor="brand" className="text-gray-600">
                    Brand
                  </Label>
                  <SelectSearch
                    placeholder="Select brand..."
                    control={control}
                    items={mobileBrand?.map((b) => b.brand) ?? []}
                    labelText="brand"
                    name="brand"
                    className={`h-11 ${errors.brand && redFocus} w-full`}
                    rules={{ required: "This is required." }}
                  />
                  <p className={postErrorColor}>{errors.brand?.message}</p>
                </div>

                {/* Model */}
                <div className="space-y-1.5">
                  <Label htmlFor="model" className="text-gray-600">
                    Model
                  </Label>
                  {brandValue ? (
                    <SelectSearch
                      placeholder="Select model..."
                      control={control}
                      items={
                        mobileModel && mobileModel?.length > 0
                          ? mobileModel[0]?.models.map((m) => m.model)
                          : []
                      }
                      labelText="model"
                      name="model"
                      className={`h-11 ${errors.model && redFocus} w-full`}
                      rules={{ required: "This is required." }}
                    />
                  ) : (
                    <Input
                      disabled
                      className="h-11 bg-gray-50 text-gray-400 border-dashed"
                      placeholder="Select brand first"
                    />
                  )}
                  <p className={postErrorColor}>{errors.model?.message}</p>
                </div>

                {/* Color */}
                <div className="space-y-1.5">
                  <Label htmlFor="color" className="text-gray-600">
                    Color
                  </Label>
                  {modelValue && brandValue ? (
                    <SelectOnly
                      name="color"
                      control={control}
                      items={
                        mobileModel && mobileModel?.length > 0
                          ? mobileModel[0]?.models[
                              Number(
                                mobileModel[0]?.models.findIndex(
                                  (idx) => idx.model === modelValue,
                                ),
                              )
                            ]?.colors
                          : []
                      }
                      rules={{ required: "This is required" }}
                      className={`h-11 ${errors.color && redFocus} w-full`}
                    />
                  ) : (
                    <Input
                      disabled
                      className="h-11 bg-gray-50 text-gray-400 border-dashed w-full"
                      placeholder="Select model first"
                    />
                  )}
                  <p className={postErrorColor}>{errors.color?.message}</p>
                </div>

                {/* Screen Size */}
                <div className="space-y-1.5">
                  <Label htmlFor="screen_size" className="text-gray-600">
                    Screen Size
                  </Label>
                  {modelValue && brandValue ? (
                    <SelectOnly
                      name="screen_size"
                      control={control}
                      items={
                        mobileModel && mobileModel?.length > 0
                          ? mobileModel[0]?.models[
                              Number(
                                mobileModel[0]?.models.findIndex(
                                  (idx) => idx.model === modelValue,
                                ),
                              )
                            ]?.screen_size
                          : []
                      }
                      rules={{ required: "This is required" }}
                      className={`h-11 ${errors.screen_size && redFocus} w-full`}
                    />
                  ) : (
                    <Input
                      disabled
                      className="h-11 bg-gray-50 text-gray-400 border-dashed w-full"
                      placeholder="Select model first"
                    />
                  )}
                  <p className={postErrorColor}>
                    {errors.screen_size?.message}
                  </p>
                </div>
              </div>
            </div>

            {/* --- SECTION 2: MEMORY & BATTERY --- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-800 font-semibold border-b border-gray-100 pb-2 mb-4">
                <BatteryCharging size={18} className="text-blue-600" />
                <h2>Memory & Power</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Storage */}
                <div className="space-y-1.5">
                  <Label htmlFor="storage" className="text-gray-600">
                    Internal Storage
                  </Label>
                  {modelValue && brandValue ? (
                    <SelectOnly
                      name="storage"
                      control={control}
                      items={
                        mobileModel && mobileModel?.length > 0
                          ? mobileModel[0]?.models[
                              Number(
                                mobileModel[0]?.models.findIndex(
                                  (idx) => idx.model === modelValue,
                                ),
                              )
                            ]?.storages
                          : []
                      }
                      rules={{ required: "This is required" }}
                      className={`h-11 ${errors.storage && redFocus} w-full`}
                    />
                  ) : (
                    <Input
                      disabled
                      className="h-11 bg-gray-50 text-gray-400 border-dashed w-full"
                      placeholder="Select model first"
                    />
                  )}
                  <p className={postErrorColor}>{errors.storage?.message}</p>
                </div>

                {/* RAM */}
                <div className="space-y-1.5">
                  <Label htmlFor="ram" className="text-gray-600">
                    Ram
                  </Label>
                  {modelValue && brandValue ? (
                    <SelectOnly
                      name="ram"
                      control={control}
                      items={
                        mobileModel && mobileModel?.length > 0
                          ? mobileModel[0]?.models[
                              Number(
                                mobileModel[0]?.models.findIndex(
                                  (idx) => idx.model === modelValue,
                                ),
                              )
                            ]?.ram
                          : []
                      }
                      rules={{ required: "This is required" }}
                      className={`h-11 ${errors.ram && redFocus} w-full`}
                    />
                  ) : (
                    <Input
                      disabled
                      className="h-11 bg-gray-50 text-gray-400 border-dashed w-full"
                      placeholder="Select model first"
                    />
                  )}
                  <p className={postErrorColor}>{errors.ram?.message}</p>
                </div>

                {/* Battery Size */}
                <div className="space-y-1.5">
                  <Label htmlFor="battery_size" className="text-gray-600">
                    Battery Size
                  </Label>
                  {modelValue && brandValue ? (
                    <SelectOnly
                      name="battery_size"
                      control={control}
                      items={
                        mobileModel && mobileModel?.length > 0
                          ? mobileModel[0]?.models[
                              Number(
                                mobileModel[0]?.models.findIndex(
                                  (idx) => idx.model === modelValue,
                                ),
                              )
                            ]?.battery_size
                          : []
                      }
                      rules={{ required: "This is required" }}
                      className={`h-11 ${errors.battery_size && redFocus} w-full`}
                    />
                  ) : (
                    <Input
                      disabled
                      className="h-11 bg-gray-50 text-gray-400 border-dashed w-full"
                      placeholder="Select model first"
                    />
                  )}
                  <p className={postErrorColor}>
                    {errors.battery_size?.message}
                  </p>
                </div>

                {/* Battery Health (Apple Only) */}
                {brandValue === "Apple" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="battery_health" className="text-gray-600">
                      Battery Health (%)
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      inputMode="numeric"
                      className={`h-11 ${errors.battery_health && redFocus} w-full`}
                      placeholder="e.g. 85"
                      {...register("battery_health", {
                        required: "This is required",
                        pattern: {
                          value: /^(100|[1-9][0-9]?)$/,
                          message: "Enter a valid BH number",
                        },
                      })}
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /[^0-9]/g,
                          "",
                        );
                      }}
                    />
                    <p className={postErrorColor}>
                      {errors.battery_health?.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* --- SECTION 3: CONDITION & DEAL --- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-800 font-semibold border-b border-gray-100 pb-2 mb-4">
                <Briefcase size={18} className="text-blue-600" />
                <h2>Condition & Deal</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label htmlFor="condition" className="text-gray-600">
                    Condition
                  </Label>
                  <SelectOnly
                    name="condition"
                    control={control}
                    items={
                      mobileGeneral && mobileGeneral?.length > 0
                        ? mobileGeneral[0]?.conditions
                        : []
                    }
                    rules={{ required: "This is required" }}
                    className={`h-11 ${errors.condition && redFocus} w-full`}
                  />
                  <p className={postErrorColor}>{errors.condition?.message}</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="exchange" className="text-gray-600">
                    Exchange Possible?
                  </Label>
                  <SelectOnly
                    name="exchangePossible"
                    control={control}
                    items={
                      mobileGeneral && mobileGeneral?.length > 0
                        ? mobileGeneral[0]?.exchange_possible
                        : []
                    }
                    rules={{ required: "This is required" }}
                    className={`h-11 ${errors.exchangePossible && redFocus} w-full`}
                  />
                  <p className={postErrorColor}>
                    {errors.exchangePossible?.message}
                  </p>
                </div>
              </div>
            </div>

            {/* --- SECTION 4: PRICING --- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-800 font-semibold border-b border-gray-100 pb-2 mb-4">
                <Tag size={18} className="text-blue-600" />
                <h2>Pricing & Extras</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label htmlFor="price" className="text-gray-600">
                    Price (GH₵)
                  </Label>
                  <PriceShared
                    name="price"
                    register={register}
                    className={`h-11 ${errors.price && redFocus} w-full`}
                  />
                  <p className={postErrorColor}>{errors.price?.message}</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="negotiable" className="text-gray-600">
                    Negotiable?
                  </Label>
                  <SelectOnly
                    name="negotiable"
                    control={control}
                    items={
                      mobileGeneral && mobileGeneral?.length > 0
                        ? mobileGeneral[0]?.negotiable
                        : []
                    }
                    rules={{ required: "This is required" }}
                    className={`h-11 ${errors.negotiable && redFocus} w-full`}
                  />
                  <p className={postErrorColor}>{errors.negotiable?.message}</p>
                </div>
              </div>

              {/* Accessories (Full Width) */}
              <div className="space-y-2 mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <Label
                    htmlFor="accessories"
                    className="text-gray-700 font-medium"
                  >
                    Included Accessories
                  </Label>
                </div>
                <CheckBoxSelectShared
                  name="accessories"
                  labelText="Select accessories"
                  control={control}
                  items={
                    mobileGeneral && mobileGeneral?.length > 0
                      ? mobileGeneral[0]?.accessories
                      : []
                  }
                />
              </div>
            </div>

            {/* --- FOOTER ACTION --- */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-base font-normal cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="text-white" /> Publishing...
                  </div>
                ) : (
                  "Publish Ad"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobilePhonesSub;
