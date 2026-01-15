"use client";

import { useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FilePenLine, MoveLeft } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";

import BeatLoaderUI from "@/components/loaders/BeatLoader";
import { toastError, toastSuccess } from "@/components/toasts/toasts";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";
import SelectSearch from "@/components/sharedUi/select-search";
import CheckBoxSelectShared from "@/components/sharedUi/checkbox-select";
import { redFocus } from "@/components/SignUpUi";
import PriceShared from "@/components/sharedUi/price";
import { postErrorColor, RegionTown } from "@/components/MakePost";
import {
  IMobileGeneral,
  IModel,
  options,
} from "@/components/dynamic-listing-categories/electronics/subs/MobilePhonesSub";
import ImageUploaderFull from "@/components/sharedUi/ImageUploaderFull";
import { formatPrice } from "@/lib/helpers/universal-functions";
import imageCompression from "browser-image-compression";
import { BackendResponseType } from "@/lib/interfaces";
import { Spinner } from "@/components/ui/spinner";

export interface RegionsType {
  region: string;
}
export type EditMobilePhones = {
  region: string;
  town: string;
  color: string;
  brand: string;
  model: string;
  storage: string;
  ram: string;
  batteryHealth?: number | string;
  exchangePossible: string;
  price: string;
  negotiable: string;
  condition: string;
  accessories: string[];
  title: string;
  description: string;
  images: string[];
};

type OnePhone = EditMobilePhones;

export default function EditMobilePhones() {
  const params = useParams<{ id: string }>();
  const fetcher = (url: URL) => fetch(url).then((res) => res.json());

  const { data } = useSWR<OnePhone>(
    `/api/auth/fetch/mobile/phones/${params.id}`,
    fetcher,
  );
  const { data: mobileGeneral, isLoading: isMobileGeneralLoading } = useSWR<
    IMobileGeneral[]
  >("/api/content/mobile/general", fetcher);

  const { data: mobileModel, isLoading: isMobileModelLoading } = useSWR<
    IModel[]
  >(data ? `/api/content/mobile/model/${data?.brand}` : null, fetcher);

  const adDefaultValues = useMemo(() => {
    return {
      region: data?.region,
      town: data?.town,
      exchangePossible: data?.exchangePossible,
      negotiable: data?.negotiable,
      storage: data?.storage,
      color: data?.color,
      ram: data?.ram,
      condition: data?.condition,
      accessories: data?.accessories,
      images: data?.images,
      batteryHealth: data?.batteryHealth,
      description: data?.description,
      title: data?.title,
      price: data?.price ? formatPrice(data?.price) : "",
    } as EditMobilePhones;
  }, [data]);

  const {
    control,
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditMobilePhones>({
    defaultValues: { ...adDefaultValues },
  });

  const { data: regionTown, isLoading: isRegionTownLoading } = useSWR<
    RegionTown[]
  >("/api/content/region/town", fetcher);

  const [descriptionValue, regionValue] = watch(["description", "region"]);

  const router = useRouter();

  useEffect(() => {
    if (data) {
      reset({ ...adDefaultValues });
    }
  }, [adDefaultValues, data, reset]);

  const formData = new FormData();

  const onSubmit: SubmitHandler<EditMobilePhones> = async (data) => {
    try {
      if (data.images && data.images.length > 0) {
        const compressionPromises = data.images.map(
          async (file: File | string) => {
            try {
              if (file instanceof File) {
                return await imageCompression(file, options);
              }
              return file;
            } catch (error) {
              console.error("Compression failed for a file:", error);
              return null;
            }
          },
        );

        const compressedFiles = await Promise.all(compressionPromises);

        compressedFiles.forEach((file) => {
          if (file) {
            formData.append("images", file);
          }
        });
      }

      formData.set("region", data.region);
      formData.set("town", data.town);
      formData.set("exchangePossible", data.exchangePossible);
      formData.set("negotiable", data.negotiable);
      formData.set("storage", data.storage);
      formData.set("color", data.color);
      formData.set("ram", data.ram);
      formData.set("condition", data.condition);
      formData.set("title", data.title);
      formData.set("description", data.description);

      if (data.batteryHealth) {
        formData.append("batteryHealth", data.batteryHealth.toString());
      }
      const rawPrice = data.price
        ? data.price.toString().replace(/,/g, "")
        : "";
      formData.append("price", rawPrice);

      if (data.accessories && data.accessories.length > 0) {
        data.accessories.forEach((acc) => {
          formData.append("accessories", acc);
        });
      }

      const res = await fetch(`/api/auth/fetch/mobile/edit/${params.id}`, {
        method: "PUT",
        body: formData,
      });

      const json = (await res.json()) as BackendResponseType;

      if (!res.ok) {
        toastError({ message: json.error.message });
        return;
      }

      await mutate(`/api/auth/fetch/mobile/phones/${params.id}`);

      toastSuccess({ message: json.message });
    } catch {
      toastError({ message: "An unexpected error occurred." });
      return;
    }
  };

  return (
    <div className="w-full">
      <div className="px-2 pt-10">
        <div className=" w-full max-w-[600px] md:max-w-[900px] m-auto h-fit px-5 md:px-10 bg-white ">
          <div className="flex justify-between pb-5 ">
            <Badge
              className="bg-[#EBF1F4] hover:bg-[#F4F3F3] text-gray-600 cursor-pointer rounded-full"
              onClick={() => router.push("/profile")}
            >
              <MoveLeft />
            </Badge>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                <FilePenLine size={18} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Edit Post
              </h1>
            </div>

            <Badge
              className="bg-[#EBF1F4] hover:bg-[#F4F3F3] text-gray-600 cursor-pointer py-1.5 rounded-full"
              onClick={() => router.push("/")}
            >
              Home
            </Badge>
          </div>
          {!data ||
          isMobileGeneralLoading ||
          isMobileModelLoading ||
          isRegionTownLoading ? (
            <BeatLoaderUI color={"blue"} size={12} />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-0 mb-10">
                {/* First collapsable starts here Location*/}
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="text-blue-500">
                      Location and Deals
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="grid w-full items-center gap-1.5">
                          <div className="space-y-1.5">
                            <Label htmlFor="region" className="text-gray-600">
                              Region
                            </Label>
                            <SelectSearch
                              placeholder="Select region..."
                              name="region"
                              control={control}
                              labelText="region"
                              rules={{ required: "This is required" }}
                              items={regionTown?.map((r) => r.region) ?? []}
                              className={`h-11 ${errors.region && redFocus} w-full`}
                            />
                          </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                          <div className="space-y-1.5">
                            <Label htmlFor="town" className="text-gray-600">
                              Town
                            </Label>
                            {regionValue ? (
                              <SelectSearch
                                placeholder="Select town..."
                                name="town"
                                control={control}
                                labelText="town"
                                rules={{ required: "This is required" }}
                                items={
                                  regionTown
                                    ? regionTown[
                                        Number(
                                          regionTown.findIndex(
                                            (index) =>
                                              index.region === regionValue,
                                          ),
                                        )
                                      ].town
                                    : []
                                }
                                className={`h-11 ${errors.town && redFocus} w-full`}
                              />
                            ) : (
                              <Input
                                disabled
                                value={data?.town}
                                className="h-11 bg-gray-50 text-gray-400 border-dashed"
                                placeholder="Select region first"
                              />
                            )}
                          </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                          <div className="space-y-1.5">
                            <Label
                              htmlFor="exchangePossible"
                              className="text-gray-600"
                            >
                              Exchangeable
                            </Label>
                            <SelectSearch
                              placeholder="Select an option..."
                              name="exchangePossible"
                              control={control}
                              rules={{ required: "This is required" }}
                              labelText="exchange possible"
                              items={
                                mobileGeneral && mobileGeneral?.length > 0
                                  ? mobileGeneral[0]?.exchange_possible
                                  : []
                              }
                              className={`h-11 ${errors.exchangePossible && redFocus} w-full`}
                            />
                          </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                          <div className="space-y-1.5">
                            <Label
                              htmlFor="exchangePossible"
                              className="text-gray-600"
                            >
                              Negotiable
                            </Label>
                            <SelectSearch
                              placeholder="Select an option..."
                              name="negotiable"
                              control={control}
                              rules={{ required: "This is required" }}
                              labelText="negotiable"
                              items={
                                mobileGeneral && mobileGeneral?.length > 0
                                  ? mobileGeneral[0]?.negotiable
                                  : []
                              }
                              className={`h-11 ${errors.negotiable && redFocus} w-full`}
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {/* First collapsable UI ends here */}

                {/* Second collapsable starts here */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="text-blue-500">
                      Device Specs
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="grid w-full items-center gap-1.5">
                          <div className="space-y-1.5">
                            <Label
                              htmlFor="condition"
                              className="text-gray-600"
                            >
                              Condition
                            </Label>
                            <SelectSearch
                              placeholder="Select condition..."
                              name="condition"
                              control={control}
                              rules={{ required: "This is required" }}
                              labelText="condition"
                              items={
                                mobileGeneral && mobileGeneral?.length > 0
                                  ? mobileGeneral[0]?.conditions
                                  : []
                              }
                              className={`h-11 ${errors.condition && redFocus} w-full`}
                            />
                          </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                          <div className="space-y-1.5">
                            <Label htmlFor="color" className="text-gray-600">
                              Color
                            </Label>
                            <SelectSearch
                              placeholder="Select color..."
                              name="color"
                              control={control}
                              rules={{ required: "This is required" }}
                              labelText="color"
                              items={
                                mobileModel && mobileModel?.length > 0
                                  ? mobileModel[0]?.models[
                                      Number(
                                        mobileModel[0]?.models.findIndex(
                                          (idx) => idx.model === data?.model,
                                        ),
                                      )
                                    ]?.colors
                                  : []
                              }
                              className={`h-11 ${errors.color && redFocus} w-full`}
                            />
                          </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                          <div className="space-y-1.5">
                            <Label htmlFor="storage" className="text-gray-600">
                              Internal Storage
                            </Label>
                            <SelectSearch
                              placeholder="Select storage..."
                              name="storage"
                              control={control}
                              rules={{ required: "This is required" }}
                              labelText="storage"
                              items={
                                mobileModel && mobileModel?.length > 0
                                  ? mobileModel[0]?.models[
                                      Number(
                                        mobileModel[0]?.models.findIndex(
                                          (idx) => idx.model === data?.model,
                                        ),
                                      )
                                    ]?.storages
                                  : []
                              }
                              className={`h-11 ${errors.storage && redFocus} w-full`}
                            />
                          </div>
                        </div>

                        <div className="grid w-full items-center gap-1.5">
                          <div className="space-y-1.5">
                            <Label htmlFor="ram" className="text-gray-600">
                              Ram
                            </Label>
                            <SelectSearch
                              placeholder="Select ram..."
                              name="ram"
                              control={control}
                              rules={{ required: "This is required" }}
                              labelText="ram"
                              items={
                                mobileModel && mobileModel?.length > 0
                                  ? mobileModel[0]?.models[
                                      Number(
                                        mobileModel[0]?.models.findIndex(
                                          (idx) => idx.model === data?.model,
                                        ),
                                      )
                                    ]?.ram
                                  : []
                              }
                              className={`h-11 ${errors.ram && redFocus} w-full`}
                            />
                          </div>
                        </div>

                        {data?.brand === "Apple" && (
                          <div className="grid w-full items-center gap-1.5">
                            <div className="space-y-1.5">
                              <Label
                                htmlFor="batteryHealth"
                                className="text-gray-600"
                              >
                                Battery Health
                              </Label>
                              <Input
                                type="number"
                                min={1}
                                max={100}
                                inputMode="numeric"
                                className={`h-11 ${errors.batteryHealth && redFocus} w-full`}
                                placeholder="e.g. 85"
                                {...register("batteryHealth", {
                                  required: "This is required",
                                  pattern: {
                                    value: /^(100|[1-9][0-9]?)$/,
                                    message: "Enter a valid BH number",
                                  },
                                })}
                                onInput={(e) => {
                                  e.currentTarget.value =
                                    e.currentTarget.value.replace(
                                      /[^0-9]/g,
                                      "",
                                    );
                                }}
                              />
                              <p className={postErrorColor}>
                                {errors.batteryHealth?.message}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="grid w-full items-center gap-1.5">
                          <div className="space-y-1.5">
                            <Label
                              htmlFor="accessories"
                              className="text-gray-600"
                            >
                              Accessories
                            </Label>
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
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {/*Second according ends here*/}

                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex flex-col gap-8">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="description" className="text-gray-600">
                          Description
                        </Label>
                        <span
                          className={`text-xs ${descriptionValue?.length > 350 ? "text-orange-500 font-bold" : "text-gray-400"}`}
                        >
                          {descriptionValue?.length}/400
                        </span>
                      </div>
                      <Textarea
                        id="description"
                        placeholder="Describe your item... (Condition, faults, reason for selling)"
                        {...register("description", {
                          required: "This is required",
                          minLength: {
                            value: 20,
                            message:
                              "Description must be at least 20 characters long",
                          },
                          maxLength: {
                            value: 400,
                            message:
                              "Description cannot be more than 400 characters long",
                          },
                        })}
                        className={`min-h-[140px] text-base resize-y ${errors.description && redFocus}`}
                      />
                      <p className={postErrorColor}>
                        {errors.description?.message}
                      </p>
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="title" className="text-gray-600">
                        Ad Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g. iPhone 17 Pro Max 1TB - Brand New"
                        {...register("title", {
                          required: "This is required",
                          minLength: {
                            value: 6,
                            message: "Title must be at least 6 characters long",
                          },
                        })}
                        className={`h-12 text-base ${errors.title && redFocus} w-full`}
                      />
                      <p className={postErrorColor}>{errors.title?.message}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-8 sm:flex-row">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="price" className="text-gray-600">
                        Price
                      </Label>
                      <PriceShared
                        name="price"
                        register={register}
                        className={`h-11 ${errors.price && redFocus} w-full`}
                      />
                      <p className={postErrorColor}>{errors.price?.message}</p>
                    </div>
                  </div>

                  <div className="flex gap-8">
                    <div className="grid w-full items-center gap-1.5">
                      <div className="bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-300 min-w-full">
                        <ImageUploaderFull
                          name="images"
                          control={control}
                          min={2}
                          max={7}
                          fetchUrl={"/api/auth/fetch/mobile/ads/"}
                          adsId={params.id}
                          errorMessage="Advert must contain between 2 and 7 images"
                          warningUi={<></>}
                        />
                      </div>
                      <p className={postErrorColor}>{errors.images?.message}</p>
                    </div>
                  </div>

                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="bg-blue-600 w-fit "
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Spinner className="text-white" /> Processing...
                      </div>
                    ) : (
                      "Submit changes"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
