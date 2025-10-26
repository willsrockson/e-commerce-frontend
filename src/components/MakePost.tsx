"use client";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CircleArrowLeft } from "lucide-react";


import dynamic from "next/dynamic";

import SelectSearch from "./sharedUi/select-search";
import { useForm, SubmitHandler } from "react-hook-form";
import { redFocus } from "./SignUpUi";
import useSWR from "swr";
import BeatLoaderUI from "./loaders/BeatLoader";
import ImageUploader from "./sharedUi/image-uploader";
import MakePostImageUploadWarningUi from "./sharedUi/imgUploadWarningUi/make-post"

// imports of dynamicListingCategories
const MainElectronics = dynamic(
    () => import("./DynamicItemListingCategories/Electronics/MainElectronics")
);

export interface IFormInput {
    region: string;
    town: string;
    mainCategory: string;
    subCategory: string;
    title: string;
    description: string;
    images: File[];
}
interface ILocation{
    region: string;
    town: string[];
    
}

interface ICategories{
    mainName: string;
    subCategories: string[];
}


export const postErrorColor = 'text-red-500 text-xs pt-0.5';


export default function MakePost() {

    const fetcher = (url: URL) => fetch(url).then((res) => res.json());
    const { data: location, isLoading: isLocationLoading } = useSWR<ILocation[]>("/api/content/location", fetcher);
    const { data: categories , isLoading: isCategoriesLoading } = useSWR<ICategories[]>("/api/content/categories", fetcher);
    const [renderNextPage, setRenderNextPage] = useState<boolean>(false);
 
   const { handleSubmit, register, control, getValues, resetField, watch, formState:{errors} } = useForm<IFormInput>({
     defaultValues:{
        region: "",
        town: "",
        mainCategory: "",
        subCategory: "",
        title: "",
        description: "",
        images: []
     }
   }) 


   //const [files, setFiles]= useState([]);

   const [ regionValue, mainCategoryValue, descriptionValue ] = watch(['region', 'mainCategory', 'description'])


   const onSubmit: SubmitHandler<IFormInput> =()=>{
      setRenderNextPage((prev) => (prev = !prev));
   }


   function MainCategorySelection(mainCategory: string) {
        switch (mainCategory) {
            case "Electronics":
                return (
                    <MainElectronics
                        me_region={getValues('region')}
                        me_town={getValues('town')}
                        me_mainCategory={getValues('mainCategory')}
                        me_subCategory={getValues('subCategory')}
                        me_description={getValues('description')}
                        me_title={getValues('title')}
                        me_files={getValues('images')}
                    />
                );
                break;

            default:
                break;
        }
    }
    
     useEffect(()=>{
         if(mainCategoryValue){
            resetField('subCategory');
        }
     }, [mainCategoryValue, resetField])

     useEffect(()=>{
        if(regionValue){
            resetField('town');
        }
     }, [regionValue, resetField])

     if(isLocationLoading || isCategoriesLoading){
        return <div>
            <BeatLoaderUI color="blue" size={10} />
        </div>
     }



    return (
        <div className="w-screen h-auto px-2">
            <div className=" w-full max-w-[600px] md:max-w-[900px] m-auto h-fit rounded-xl px-4 py-4 md:p-8 bg-white ">
                <section className="font-medium text-lg mb-6 text-blue-600 bg-blue-100 p-2 text-center rounded-lg flex items-center justify-between">
                    {renderNextPage ? (
                        <CircleArrowLeft
                            className="cursor-pointer"
                            onClick={() => setRenderNextPage((prev) => (prev = !prev))}
                        />
                    ) : (
                        <span></span>
                    )}
                    <p>List an Item</p> <span></span>
                </section>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <section className={`${renderNextPage && "hidden"}`}>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 sm:flex-row">
                                {/* Select Regions here */}
                                <div className="flex flex-col w-full">
                                    {location && regionValue && <Label htmlFor="region">Region</Label>}
                                    <SelectSearch
                                        placeholder="Select region..." 
                                        name="region"
                                        control={control}
                                        rules={{ required: "This is required" }}
                                        labelText="region"
                                        items={ location?.map((r)=> r.region) ?? []}
                                        className={`${errors.region && redFocus}`}
                                    />
                                  <p className={postErrorColor}>{errors.region?.message}</p>
                                </div>

                                {/* Select Towns here */}
                                {regionValue ? (
                                    <div className="flex flex-col w-full">
                                        {regionValue ? <Label htmlFor="town">Town</Label> : " "}
                                        <SelectSearch
                                            placeholder="Select town..."
                                            name="town"
                                            control={control}
                                            rules={{ required: "This is required" }}
                                            labelText="town"
                                            items={ location ? location[
                                                 Number(location.findIndex((index)=> index.region === regionValue))
                                            ].town : []}
                                            className={`${errors.town && redFocus}`}
                                        />
                                       <p className={postErrorColor}>{errors.town?.message}</p>
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        <Input
                                            disabled
                                            className="w-full"
                                            placeholder="* Select a region first"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                {/* Select Category */}
                                <div className="flex flex-col w-full">
                                    {/* Only shows when region has been selected */}
                                    {regionValue && (<Label htmlFor="mainCategory">Main Category</Label>)}
                                     <SelectSearch
                                            placeholder="Select main category..."
                                            name="mainCategory"
                                            control={control}
                                            rules={{ required: "This is required" }}
                                            labelText="main category"
                                            items={categories?.map((c)=> c.mainName) ?? []}
                                            className={`${errors.mainCategory && redFocus}`}
                                        />
                                       <p className={postErrorColor}>{errors.mainCategory?.message}</p>
                                </div>
                              
                              
                                {/* Select Sub Category here*/}
                                   { mainCategoryValue ? (
                                    <div className="flex flex-col w-full">
                                        {regionValue ? (<Label htmlFor="subCategory">Sub Category</Label>) : "" }
                                        <SelectSearch
                                            placeholder="Select sub category..."
                                            name="subCategory"
                                            control={control}
                                            rules={{ required: "This is required" }}
                                            labelText="sub category"
                                             items={ categories ? categories[
                                                 Number(categories.findIndex((index)=> index.mainName === mainCategoryValue))
                                            ].subCategories : []}
                                            className={`${errors.subCategory && redFocus}`}
                                        />
                                      <p className={postErrorColor}>{errors.subCategory?.message}</p>
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        {regionValue && <Label>Sub Category</Label>}
                                        <Input
                                            disabled
                                            className="w-full"
                                            placeholder="* Select a category first"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="flex flex-col w-full">
                                    <Label htmlFor="title">Title</Label>
                                     <Textarea 
                                           id="title"
                                           {...register('title', 
                                            { required: 'This is required', 
                                              minLength: { value: 6, 
                                              message: 'Title must be at least 6 characters long'
                                           }})}
                                            className={`${errors.title && redFocus} min-h-24 h-full`}
                                          />
                                <p className={postErrorColor}>{errors.title?.message}</p>     
                                </div>

                                <div className="flex flex-col w-full">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="description">Description</Label>
                                        <Label htmlFor="description">({descriptionValue.length}/400)</Label>
                                    </div>
                                   
                                    <Textarea 
                                           id="description"
                                           {...register('description', 
                                            { required: 'This is required', 
                                              minLength: { value: 20, 
                                              message: 'Description must be at least 20 characters long'
                                           },maxLength:{
                                               value: 400,
                                               message: "Description cannot be more than 400 characters long"
                                           }})}
                                            className={`${errors.description && redFocus} min-h-24 h-full`}
                                          />
                                <p className={postErrorColor}>{errors.description?.message}</p> 
                                </div>
                            </div>

                            {/*  Upload image component here */}
                             <ImageUploader 
                               name="images" 
                               control={control} 
                               min={2}
                               max={7}
                               errorMessage="Advert must contain two or seven images"
                               warningUi={<MakePostImageUploadWarningUi/>}
                               />
                            <p className={postErrorColor}>{errors.images?.message}</p>

                            <Button
                                size={"lg"}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-500 w-20"
                                type="submit"
                            >
                                Next
                               
                            </Button>
                        </div>
                    </section>
                </form>

                {/* Main categories components here */}

                <section>{renderNextPage && MainCategorySelection(mainCategoryValue)}</section>
            </div>
        </div>
    );




}

