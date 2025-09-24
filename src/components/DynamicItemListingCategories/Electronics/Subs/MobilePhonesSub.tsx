"use client"
import {Label} from "@/components/ui/label";
import  React, {useEffect} from "react";
import {Button} from "@/components/ui/button";
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

interface MobilePhoneSubType {
    takeRegion: string;
    takeTown: string;
    takeMainCategory: string;
    takeSubCategory: string;
    takeFiles: File[] | null;
    takeDescription: string;
    takeTitle: string;
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

interface IBrand{
    brand: string;
}

interface IMobileGeneral{
    negotiable: string[];
    conditions: string[];
    exchange_possible: string[];
    accessories: string [];
}

type model = {
    model : string;
    storages: string[];
    colors: string[];
    screen_size: string;
    battery_size: string;
    ram: string[];
}

interface IModel{
    models: model[];  
}


const MobilePhonesSub = ({ takeRegion, takeTown, takeMainCategory, takeSubCategory, takeFiles, takeDescription, takeTitle,
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
                brand: '',
                model: '',
                storage: '',
                ram: '',
                color: '',
                battery_size: '',
                battery_health: '',
                screen_size: '',
                condition: '',
                negotiable: '',
                exchangePossible: '',
                accessories: [],
                price: ''

            },
            mode: 'onBlur'
        });
    const [brandValue, modelValue] = watch(['brand', 'model']);

    const { data: mobileBrand , isLoading: isMobileBrandLoading } = useSWR<IBrand[]>("/api/content/mobile/brand", fetcher);
    const { data: mobileGeneral , isLoading: isMobileGeneralLoading } = useSWR<IMobileGeneral[]>("/api/content/mobile/general", fetcher);   
    const { data: mobileModel , isLoading: isMobileModelLoading } = useSWR<IModel[]>( brandValue ? `/api/content/mobile/model/${brandValue}`: null , fetcher); 
    
   
    const handleListingSubmission: SubmitHandler<IContentFormType> = async(data) => {
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
           formData.set("main_category", takeMainCategory);
           formData.set("sub_category", takeSubCategory); //replace(/\s/g, "").toLowerCase()
           formData.set("title", takeTitle);
           formData.set("description", takeDescription);
           // Mobile data starts from here
           formData.set("brand", data.brand);
           formData.set("model", data.model);
           formData.set("color", data.color);
           formData.set("storage", data.storage);
           formData.set("ram", data.ram);
           formData.set("exchange_possible", data.exchangePossible);
           formData.set("price", data.price);
           formData.set("negotiable", data.negotiable);
           formData.set("condition", data.condition);
           formData.set("screen_size", data.screen_size);
           formData.set("battery_size", data.battery_size);
           if(data.brand === BRAND){
              formData.set("battery_health", data.battery_health);
           }
           if(data.accessories?.length > 0){
               data.accessories?.forEach((accessory) => {
               formData.append("accessories", accessory);
           }); 
           }

           //Add images/ files
           takeFiles?.forEach((file) => {
               formData.append("adImages", file);
           });

           const res = await fetch("/api/upload/categories/electronics/mobilephones", {
               method: "POST",
               body: formData,
           });
           
           const resFromServer = await res.json() as  { successMessage: string; errorMessage: string; };
           if(!res.ok){
              toastError({
                message: resFromServer.errorMessage
              });
              return;
           }
           formData.delete('accessories');
           formData.delete('adImages');
           toastSuccess({
            message: resFromServer.successMessage
           })

       } catch (error) {
          if(error instanceof Error){
             console.error(String(error));
             toastError({
                message: 'Oops! An unexpected error happened.'
              });
            return;  
          }
       }
       
        
       
        
    }


    useEffect(()=>{
           resetField('model');
           resetField('storage');
           resetField('ram');
           resetField('color');
           resetField('battery_size');
           resetField('battery_health');
           resetField('screen_size');
    }, [brandValue, resetField])

    useEffect(()=>{
        if(modelValue){
           resetField('storage');
           resetField('ram');
           resetField('color');
           resetField('battery_size');
           resetField('battery_health');
           resetField('screen_size');
        } 
    }, [modelValue, resetField])

    const renderUI = isMobileBrandLoading || isMobileGeneralLoading || isMobileModelLoading;

    return (
        <div className="relative flex justify-center items-center min-h-[50vh]">
        { renderUI && <BeatLoaderUI size={10} color="blue" className="absolute" /> }
        <div className={`w-full flex flex-col gap-4 ${ renderUI && 'pointer-events-none opacity-50'}`}>
            <form onSubmit={handleSubmit(handleListingSubmission)}>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                        {/* Selection of Brand */}
                        <section className="flex flex-col w-full">
                            <Label htmlFor="brand">Brand</Label>
                            <SelectSearch
                                 placeholder="Select brand..."
                                control={control}
                                items={mobileBrand?.map((b) => b.brand) ?? []}
                                labelText="brand"
                                name="brand"
                                className={`${errors.brand && redFocus}`}
                                rules={{ required: "This is required." }}
                            />
                            <p className={postErrorColor}>{errors.brand?.message}</p>
                        </section>

                        {/* Selection of Model */}
                        <section className="flex flex-col w-full">
                            <Label htmlFor="model">Model</Label>
                            {brandValue ? (
                                <>
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
                                        className={`${errors.model && redFocus}`}
                                        rules={{ required: "This is required." }}
                                    />
                                    <p className={postErrorColor}>{errors.model?.message}</p>
                                </>
                            ) : (
                                <div className="w-full">
                                    {brandValue && <Label htmlFor="model">Model</Label>}
                                    <Input
                                        disabled
                                        className="w-full"
                                        placeholder="* select brand first"
                                    />
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        {/* Select color */}
                        <section className="flex flex-col w-full">
                            <Label htmlFor="color">Color</Label>
                            {modelValue && brandValue ? (
                                <>
                                    <SelectOnly
                                        name="color"
                                        control={control}
                                        items={
                                            mobileModel && mobileModel?.length > 0
                                                ? mobileModel[0]?.models[
                                                      Number(
                                                          mobileModel[0]?.models.findIndex(
                                                              (idx) => idx.model === modelValue
                                                          )
                                                      )
                                                  ]?.colors
                                                : []
                                        }
                                        rules={{ required: "This is required" }}
                                        className={`${errors.color && redFocus}`}
                                    />
                                    <p className={postErrorColor}>{errors.color?.message}</p>
                                </>
                            ) : (
                                <div className="w-full">
                                    {modelValue && <Label htmlFor="color">Color</Label>}
                                    <Input
                                        disabled
                                        className="w-full"
                                        placeholder="* select model first"
                                    />
                                </div>
                            )}
                        </section>

                        {/* Internal Storage */}
                        <section className="flex flex-col w-full">
                            <Label htmlFor="storage">Storage</Label>
                            {modelValue && brandValue ? (
                                <>
                                    <SelectOnly
                                        name="storage"
                                        control={control}
                                        items={
                                            mobileModel && mobileModel?.length > 0
                                                ? mobileModel[0]?.models[
                                                      Number(
                                                          mobileModel[0]?.models.findIndex(
                                                              (idx) => idx.model === modelValue
                                                          )
                                                      )
                                                  ]?.storages
                                                : []
                                        }
                                        rules={{ required: "This is required" }}
                                        className={`${errors.storage && redFocus}`}
                                    />
                                    <p className={postErrorColor}>{errors.storage?.message}</p>
                                </>
                            ) : (
                                <div className="w-full">
                                    {modelValue && <Label htmlFor="storage">Storage</Label>}
                                    <Input
                                        disabled
                                        className="w-full"
                                        placeholder="* select model first"
                                    />
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        {/* Select screen */}
                        <section className="flex flex-col w-full">
                            <Label htmlFor="screen_size">Screen size</Label>
                            {modelValue && brandValue ? (
                                <>
                                    <SelectOnly
                                        name="screen_size"
                                        control={control}
                                        items={
                                            mobileModel && mobileModel?.length > 0
                                                ? [
                                                      mobileModel[0]?.models[
                                                          Number(
                                                              mobileModel[0]?.models.findIndex(
                                                                  (idx) => idx.model === modelValue
                                                              )
                                                          )
                                                      ]?.screen_size,
                                                  ]
                                                : []
                                        }
                                        rules={{ required: "This is required" }}
                                        className={`${errors.screen_size && redFocus}`}
                                    />
                                    <p className={postErrorColor}>{errors.screen_size?.message}</p>
                                </>
                            ) : (
                                <div className="w-full">
                                    {modelValue && <Label htmlFor="screen_size">Screen size</Label>}
                                    <Input
                                        disabled
                                        className="w-full"
                                        placeholder="* select model first"
                                    />
                                </div>
                            )}
                        </section>

                        {/* Internal Storage */}
                        <section className="flex flex-col w-full">
                            <Label htmlFor="battery_size">Battery size</Label>
                            {modelValue && brandValue ? (
                                <>
                                    <SelectOnly
                                        name="battery_size"
                                        control={control}
                                        items={
                                            mobileModel && mobileModel?.length > 0
                                                ? [
                                                      mobileModel[0]?.models[
                                                          Number(
                                                              mobileModel[0]?.models.findIndex(
                                                                  (idx) => idx.model === modelValue
                                                              )
                                                          )
                                                      ]?.battery_size,
                                                  ]
                                                : []
                                        }
                                        rules={{ required: "This is required" }}
                                        className={`${errors.battery_size && redFocus}`}
                                    />
                                    <p className={postErrorColor}>{errors.battery_size?.message}</p>
                                </>
                            ) : (
                                <div className="w-full">
                                    {modelValue && (
                                        <Label htmlFor="battery_size">Battery size</Label>
                                    )}
                                    <Input
                                        disabled
                                        className="w-full"
                                        placeholder="* select model first"
                                    />
                                </div>
                            )}
                        </section>
                    </div>

                    {brandValue && brandValue === "Apple" && (
                        <div className="flex flex-col gap-4 sm:flex-row">
                            {/* Type Battery Health */}
                            <section className="flex flex-col w-full">
                                <Label htmlFor="battery_health">Battery health</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={100}
                                    inputMode="numeric"
                                    className={`w-full ${errors.battery_health && redFocus}`}
                                    placeholder="eg: 78 "
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
                                            ""
                                        );
                                    }}
                                />
                                <p className={postErrorColor}>{errors.battery_health?.message}</p>
                            </section>

                            <section className="flex flex-col w-full"></section>
                        </div>
                    )}

                    <div className="flex flex-col gap-4 sm:flex-row">
                        {/* Selection of RAM */}
                        <section className="flex flex-col w-full">
                            <Label htmlFor="ram">Ram</Label>
                            {modelValue && brandValue ? (
                                <>
                                    <SelectOnly
                                        name="ram"
                                        control={control}
                                        items={
                                            mobileModel && mobileModel?.length > 0
                                                ? mobileModel[0]?.models[
                                                      Number(
                                                          mobileModel[0]?.models.findIndex(
                                                              (idx) => idx.model === modelValue
                                                          )
                                                      )
                                                  ]?.ram
                                                : []
                                        }
                                        rules={{ required: "This is required" }}
                                        className={`${errors.ram && redFocus}`}
                                    />
                                    <p className={postErrorColor}>{errors.ram?.message}</p>
                                </>
                            ) : (
                                <div className="w-full">
                                    {modelValue && <Label htmlFor="ram">Ram</Label>}
                                    <Input
                                        disabled
                                        className="w-full"
                                        placeholder="* select model first"
                                    />
                                </div>
                            )}
                        </section>

                        {/* Select Negotiation */}
                        <section className="flex flex-col w-full">
                            <Label htmlFor="negotiable">Negotiable</Label>
                            <SelectOnly
                                name="negotiable"
                                control={control}
                                items={
                                    mobileGeneral && mobileGeneral?.length > 0
                                        ? mobileGeneral[0]?.negotiable
                                        : []
                                }
                                rules={{ required: "This is required" }}
                                className={`${errors.negotiable && redFocus}`}
                            />
                            <p className={postErrorColor}>{errors.negotiable?.message}</p>
                        </section>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        {/* Select condition */}
                        <section className="flex flex-col w-full">
                            <Label htmlFor="condition">Condition</Label>
                            <SelectOnly
                                name="condition"
                                control={control}
                                items={
                                    mobileGeneral && mobileGeneral?.length > 0
                                        ? mobileGeneral[0]?.conditions
                                        : []
                                }
                                rules={{ required: "This is required" }}
                                className={`${errors.condition && redFocus}`}
                            />
                            <p className={postErrorColor}>{errors.condition?.message}</p>
                        </section>

                        {/* Exchangeable */}
                        <section className="flex flex-col w-full">
                            <Label htmlFor="exchange">Exchange Possible</Label>
                            <SelectOnly
                                name="exchangePossible"
                                control={control}
                                items={
                                    mobileGeneral && mobileGeneral?.length > 0
                                        ? mobileGeneral[0]?.exchange_possible
                                        : []
                                }
                                rules={{ required: "This is required" }}
                                className={`${errors.exchangePossible && redFocus}`}
                            />
                            <p className={postErrorColor}>{errors.exchangePossible?.message}</p>
                        </section>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <section className="flex flex-col w-full">
                            <Label htmlFor="price">Price</Label>

                            <PriceShared
                                name="price"
                                register={register}
                                className={`${errors.price && redFocus}`}
                            />

                            <p className={postErrorColor}>{errors.price?.message}</p>
                        </section>

                        <section className="flex flex-col w-full">
                            <Label htmlFor="accessories">Accessories</Label>
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
                        </section>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600"
                        >
                            {isSubmitting ? "Publishing..." : "Publish"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
        </div>
    );
}


export default MobilePhonesSub;