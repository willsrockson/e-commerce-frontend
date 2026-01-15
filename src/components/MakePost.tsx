"use client";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CircleArrowLeft,
  ChevronRight,
  MapPin,
  Layers,
  Type,
  Image as ImageIcon,
} from "lucide-react"; // Added Icons
import dynamic from "next/dynamic";

import SelectSearch from "./sharedUi/select-search";
import { useForm, SubmitHandler } from "react-hook-form";
import { redFocus } from "./SignUpUi";
import useSWR from "swr";
import BeatLoaderUI from "./loaders/BeatLoader";
import ImageUploader from "./sharedUi/image-uploader";
import MakePostImageUploadWarningUi from "./sharedUi/imgUploadWarningUi/make-post";
import { MainCategoryType } from "@/lib/interfaces";
import MissingPhoneBanner from "./MissingPhoneBanner";

// imports of dynamicListingCategories
const MainElectronics = dynamic(
  () => import("./dynamic-listing-categories/electronics/MainElectronics"),
);

export interface FormInput {
  region: string;
  town: string;
  mainCategory: MainCategoryType;
  subCategory: string;
  title: string;
  description: string;
  images: File[];
}
export interface RegionTown {
  region: string;
  town: string[];
}

interface Categories {
  mainName: string;
  subCategories: string[];
}

type User = {
  phonePrimaryVerified: 'unverified'|'verified'
}

export const postErrorColor = "text-red-500 text-xs mt-0 font-medium";

export default function MakePost() {
  const fetcher = (url: URL) => fetch(url).then((res) => res.json());
  const { data: regionTown, isLoading: isRegionTownLoading } = useSWR<
    RegionTown[]
  >("/api/content/region/town", fetcher);
  const { data: categories, isLoading: isCategoriesLoading } = useSWR<
    Categories[]
  >("/api/content/categories", fetcher);

  const { data: user, isLoading: isUserLoading } = useSWR<User>("/api/auth/account/settings", fetcher);

  const [renderNextPage, setRenderNextPage] = useState<boolean>(false);
  const [disableWhenPublish, setDisableWhenPublish] = useState<boolean>(true);

  const {
    handleSubmit,
    register,
    control,
    getValues,
    resetField,
    watch,
    formState: { errors },
  } = useForm<FormInput>({
    defaultValues: {
      region: "",
      town: "",
      mainCategory: "",
      subCategory: "",
      title: "",
      description: "",
      images: [],
    },
    shouldUnregister: false,
  });

  const [regionValue, mainCategoryValue, descriptionValue] = watch([
    "region",
    "mainCategory",
    "description",
  ]);

  const onSubmit: SubmitHandler<FormInput> = () => {
    setRenderNextPage((prev) => (prev = !prev));
  };

  function MainCategorySelection(mainCategory: MainCategoryType) {
    switch (mainCategory) {
      case "Electronics":
        return (
          <MainElectronics
            me_region={getValues("region")}
            me_town={getValues("town")}
            me_mainCategory={getValues("mainCategory")}
            me_subCategory={getValues("subCategory")}
            me_description={getValues("description")}
            me_title={getValues("title")}
            me_files={getValues("images")}
            renderNextPage={setDisableWhenPublish}
          />
        );
      default:
        return null;
    }
  }

  useEffect(() => {
    if (mainCategoryValue) {
      resetField("subCategory");
    }
  }, [mainCategoryValue, resetField]);

  useEffect(() => {
    if (regionValue) {
      resetField("town");
    }
  }, [regionValue, resetField]);

  if (isRegionTownLoading || isCategoriesLoading || isUserLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <BeatLoaderUI color="blue" size={15} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      {/* Container - Centered and Max Width restricted for better readability */}
      <div className="w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* HEADER SECTION */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            {renderNextPage && disableWhenPublish && (
              <button
                onClick={() => setRenderNextPage(false)}
                className="p-1 -ml-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <CircleArrowLeft size={24} />
              </button>
            )}
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {renderNextPage ? "Item Details" : "List an Item"}
            </h1>
          </div>
          {!renderNextPage && (
            <p className="text-gray-500">
              Step 1 of 2: Let&apos;s get the general details down.
            </p>
          )}
        </div>

       {user?.phonePrimaryVerified === "unverified" &&  <MissingPhoneBanner/> }

        {/* STEP 1 FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className={`${renderNextPage ? "hidden" : "block"}`}>
            <div className="bg-white space-y-8">
              {/* --- GROUP 1: LOCATION --- */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-800 font-semibold border-b border-gray-100 pb-2 mb-4">
                  <MapPin size={18} className="text-blue-600" />
                  <h2>Location</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="region" className="text-gray-600">
                      Region
                    </Label>
                    <SelectSearch
                      placeholder="Select region..."
                      name="region"
                      control={control}
                      rules={{ required: "This is required" }}
                      labelText="region"
                      items={regionTown?.map((r) => r.region) ?? []}
                      className={`h-11 ${errors.region && redFocus} w-full`}
                    />
                    <p className={postErrorColor}>{errors.region?.message}</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="town" className="text-gray-600">
                      Town
                    </Label>
                    {regionValue ? (
                      <SelectSearch
                        placeholder="Select town..."
                        name="town"
                        control={control}
                        rules={{ required: "This is required" }}
                        labelText="town"
                        items={
                          regionTown
                            ? regionTown[
                                Number(
                                  regionTown.findIndex(
                                    (index) => index.region === regionValue,
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
                        className="h-11 bg-gray-50 text-gray-400 border-dashed"
                        placeholder="Select region first"
                      />
                    )}
                    <p className={postErrorColor}>{errors.town?.message}</p>
                  </div>
                </div>
              </div>

              {/* --- GROUP 2: CATEGORY --- */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-800 font-semibold border-b border-gray-100 pb-2 mb-4">
                  <Layers size={18} className="text-blue-600" />
                  <h2>Category</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="mainCategory" className="text-gray-600">
                      Main Category
                    </Label>
                    <SelectSearch
                      placeholder="Electronics, Vehicles..."
                      name="mainCategory"
                      control={control}
                      rules={{ required: "This is required" }}
                      labelText="main category"
                      items={categories?.map((c) => c.mainName) ?? []}
                      className={`h-11 ${errors.mainCategory && redFocus} w-full`}
                    />
                    <p className={postErrorColor}>
                      {errors.mainCategory?.message}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="subCategory" className="text-gray-600">
                      Sub Category
                    </Label>
                    {mainCategoryValue ? (
                      <SelectSearch
                        placeholder="Phones, Laptops..."
                        name="subCategory"
                        control={control}
                        rules={{ required: "This is required" }}
                        labelText="sub category"
                        items={
                          categories
                            ? categories[
                                Number(
                                  categories.findIndex(
                                    (index) =>
                                      index.mainName === mainCategoryValue,
                                  ),
                                )
                              ].subCategories
                            : []
                        }
                        className={`h-11 ${errors.subCategory && redFocus} w-full`}
                      />
                    ) : (
                      <Input
                        disabled
                        className="h-11 bg-gray-50 text-gray-400 border-dashed"
                        placeholder="Select main category first"
                      />
                    )}
                    <p className={postErrorColor}>
                      {errors.subCategory?.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* --- GROUP 3: DETAILS (Stacked) --- */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-800 font-semibold border-b border-gray-100 pb-2 mb-4">
                  <Type size={18} className="text-blue-600" />
                  <h2>Details</h2>
                </div>

                <div className="space-y-1.5">
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

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="description" className="text-gray-600">
                      Description
                    </Label>
                    <span
                      className={`text-xs ${descriptionValue.length > 350 ? "text-orange-500 font-bold" : "text-gray-400"}`}
                    >
                      {descriptionValue.length}/400
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
              </div>

              {/* --- GROUP 4: PHOTOS --- */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-800 font-semibold border-b border-gray-100 pb-2 mb-4">
                  <ImageIcon size={18} className="text-blue-600" />
                  <h2>Photos</h2>
                </div>

                {/* Wrapped Image Uploader in a nice container */}
                <div className="bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-300">
                  <ImageUploader
                    name="images"
                    control={control}
                    min={2}
                    max={7}
                    errorMessage="Advert must contain between 2 and 7 images"
                    warningUi={<MakePostImageUploadWarningUi />}
                  />
                </div>
                <p className={postErrorColor}>{errors.images?.message}</p>
              </div>

              {/* FOOTER ACTION */}
              <div className="pt-4">
                <Button
                  disabled={user?.phonePrimaryVerified === "unverified"}
                  className="w-full cursor-pointer text-base font-normal bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
                  type="submit"
                >
                  Next Step <ChevronRight className="ml-2 " />
                </Button>
              </div>
            </div>
          </section>
        </form>

        {/* STEP 2: DYNAMIC FORM */}
        <section>
          {( renderNextPage && user?.phonePrimaryVerified === "verified") && MainCategorySelection(mainCategoryValue)}
        </section>
      </div>
    </div>
  );
}

// "use client";
// import { useEffect, useState } from "react";
// import { Input } from "./ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { CircleArrowLeft } from "lucide-react";
// import { MdOutlineNavigateNext } from "react-icons/md";

// import dynamic from "next/dynamic";

// import SelectSearch from "./sharedUi/select-search";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { redFocus } from "./SignUpUi";
// import useSWR from "swr";
// import BeatLoaderUI from "./loaders/BeatLoader";
// import ImageUploader from "./sharedUi/image-uploader";
// import MakePostImageUploadWarningUi from "./sharedUi/imgUploadWarningUi/make-post";
// import { MainCategoryType } from "@/lib/interfaces";

// // imports of dynamicListingCategories
// const MainElectronics = dynamic(
//   () => import("./dynamic-listing-categories/electronics/MainElectronics"),
// );

// export interface FormInput {
//   region: string;
//   town: string;
//   mainCategory: MainCategoryType;
//   subCategory: string;
//   title: string;
//   description: string;
//   images: File[];
// }
// interface RegionTown {
//   region: string;
//   town: string[];
// }

// interface Categories {
//   mainName: string;
//   subCategories: string[];
// }

// export const postErrorColor = "text-red-500 text-xs pt-0.5";

// export default function MakePost() {
//   const fetcher = (url: URL) => fetch(url).then((res) => res.json());
//   const { data: regionTown, isLoading: isRegionTownLoading } = useSWR<
//     RegionTown[]
//   >("/api/content/region/town", fetcher);
//   const { data: categories, isLoading: isCategoriesLoading } = useSWR<
//     Categories[]
//   >("/api/content/categories", fetcher);
//   const [renderNextPage, setRenderNextPage] = useState<boolean>(false);
//   const [disableWhenPublish, setDisableWhenPublish] = useState<boolean>(true);

//   const {
//     handleSubmit,
//     register,
//     control,
//     getValues,
//     resetField,
//     watch,
//     formState: { errors },
//   } = useForm<FormInput>({
//     defaultValues: {
//       region: "",
//       town: "",
//       mainCategory: "",
//       subCategory: "",
//       title: "",
//       description: "",
//       images: [],
//     },
//     shouldUnregister: false,
//   });

//   //const [files, setFiles]= useState([]);

//   const [regionValue, mainCategoryValue, descriptionValue] = watch([
//     "region",
//     "mainCategory",
//     "description",
//   ]);

//   const onSubmit: SubmitHandler<FormInput> = () => {
//     setRenderNextPage((prev) => (prev = !prev));
//   };

//   function MainCategorySelection(mainCategory: MainCategoryType) {
//     switch (mainCategory) {
//       case "Electronics":
//         return (
//           <MainElectronics
//             me_region={getValues("region")}
//             me_town={getValues("town")}
//             me_mainCategory={getValues("mainCategory")}
//             me_subCategory={getValues("subCategory")}
//             me_description={getValues("description")}
//             me_title={getValues("title")}
//             me_files={getValues("images")}
//             renderNextPage={setDisableWhenPublish}
//           />
//         );

//       default:
//         break;
//     }
//   }

//   useEffect(() => {
//     if (mainCategoryValue) {
//       resetField("subCategory");
//     }
//   }, [mainCategoryValue, resetField]);

//   useEffect(() => {
//     if (regionValue) {
//       resetField("town");
//     }
//   }, [regionValue, resetField]);

//   if (isRegionTownLoading || isCategoriesLoading) {
//     return (
//       <div>
//         <BeatLoaderUI color="blue" size={10} />
//       </div>
//     );
//   }

//   return (
//     <div className="w-screen h-auto px-2">
//       <div className=" w-full max-w-[600px] md:max-w-[900px] m-auto h-fit rounded-xl px-4 py-4 md:p-8 bg-white ">
//         <section className="font-medium text-lg mb-6 text-blue-600 bg-blue-100 p-2 text-center rounded-lg flex items-center justify-between">
//           {renderNextPage && disableWhenPublish ? (
//             <CircleArrowLeft
//               className="cursor-pointer"
//               onClick={() => setRenderNextPage((prev) => (prev = !prev))}
//             />
//           ) : (
//             <span></span>
//           )}
//           <p>List an Item</p> <span></span>
//         </section>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <section className={`${renderNextPage && "hidden"}`}>
//             <div className="flex flex-col gap-4">
//               <div className="flex flex-col gap-4 sm:flex-row">
//                 {/* Select Regions here */}
//                 <div className="flex flex-col w-full">
//                   {regionTown && regionValue && (
//                     <Label htmlFor="region">Region</Label>
//                   )}
//                   <SelectSearch
//                     placeholder="Select region..."
//                     name="region"
//                     control={control}
//                     rules={{ required: "This is required" }}
//                     labelText="region"
//                     items={regionTown?.map((r) => r.region) ?? []}
//                     className={`${errors.region && redFocus}`}
//                   />
//                   <p className={postErrorColor}>{errors.region?.message}</p>
//                 </div>

//                 {/* Select Towns here */}
//                 {regionValue ? (
//                   <div className="flex flex-col w-full">
//                     {regionValue ? <Label htmlFor="town">Town</Label> : " "}
//                     <SelectSearch
//                       placeholder="Select town..."
//                       name="town"
//                       control={control}
//                       rules={{ required: "This is required" }}
//                       labelText="town"
//                       items={
//                         regionTown
//                           ? regionTown[
//                               Number(
//                                 regionTown.findIndex(
//                                   (index) => index.region === regionValue,
//                                 ),
//                               )
//                             ].town
//                           : []
//                       }
//                       className={`${errors.town && redFocus}`}
//                     />
//                     <p className={postErrorColor}>{errors.town?.message}</p>
//                   </div>
//                 ) : (
//                   <div className="w-full">
//                     <Input
//                       disabled
//                       className="w-full"
//                       placeholder="* Select a region first"
//                     />
//                   </div>
//                 )}
//               </div>

//               <div className="flex flex-col gap-4 sm:flex-row">
//                 {/* Select Category */}
//                 <div className="flex flex-col w-full">
//                   {/* Only shows when region has been selected */}
//                   {regionValue && (
//                     <Label htmlFor="mainCategory">Main Category</Label>
//                   )}
//                   <SelectSearch
//                     placeholder="Select main category..."
//                     name="mainCategory"
//                     control={control}
//                     rules={{ required: "This is required" }}
//                     labelText="main category"
//                     items={categories?.map((c) => c.mainName) ?? []}
//                     className={`${errors.mainCategory && redFocus}`}
//                   />
//                   <p className={postErrorColor}>
//                     {errors.mainCategory?.message}
//                   </p>
//                 </div>

//                 {/* Select Sub Category here*/}
//                 {mainCategoryValue ? (
//                   <div className="flex flex-col w-full">
//                     {regionValue ? (
//                       <Label htmlFor="subCategory">Sub Category</Label>
//                     ) : (
//                       ""
//                     )}
//                     <SelectSearch
//                       placeholder="Select sub category..."
//                       name="subCategory"
//                       control={control}
//                       rules={{ required: "This is required" }}
//                       labelText="sub category"
//                       items={
//                         categories
//                           ? categories[
//                               Number(
//                                 categories.findIndex(
//                                   (index) =>
//                                     index.mainName === mainCategoryValue,
//                                 ),
//                               )
//                             ].subCategories
//                           : []
//                       }
//                       className={`${errors.subCategory && redFocus}`}
//                     />
//                     <p className={postErrorColor}>
//                       {errors.subCategory?.message}
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="w-full">
//                     {regionValue && <Label>Sub Category</Label>}
//                     <Input
//                       disabled
//                       className="w-full"
//                       placeholder="* Select a category first"
//                     />
//                   </div>
//                 )}
//               </div>

//               <div className="flex flex-col gap-4 sm:flex-row">
//                 <div className="flex flex-col w-full">
//                   <Label htmlFor="title">Title</Label>
//                   <Textarea
//                     id="title"
//                     {...register("title", {
//                       required: "This is required",
//                       minLength: {
//                         value: 6,
//                         message: "Title must be at least 6 characters long",
//                       },
//                     })}
//                     className={`${errors.title && redFocus} min-h-24 h-full`}
//                   />
//                   <p className={postErrorColor}>{errors.title?.message}</p>
//                 </div>

//                 <div className="flex flex-col w-full">
//                   <div className="flex justify-between items-center">
//                     <Label htmlFor="description">Description</Label>
//                     <Label htmlFor="description">
//                       ({descriptionValue.length}/400)
//                     </Label>
//                   </div>

//                   <Textarea
//                     id="description"
//                     {...register("description", {
//                       required: "This is required",
//                       minLength: {
//                         value: 20,
//                         message:
//                           "Description must be at least 20 characters long",
//                       },
//                       maxLength: {
//                         value: 400,
//                         message:
//                           "Description cannot be more than 400 characters long",
//                       },
//                     })}
//                     className={`${errors.description && redFocus} min-h-24 h-full`}
//                   />
//                   <p className={postErrorColor}>
//                     {errors.description?.message}
//                   </p>
//                 </div>
//               </div>

//               {/*  Upload image component here */}
//               <ImageUploader
//                 name="images"
//                 control={control}
//                 min={2}
//                 max={7}
//                 errorMessage="Advert must contain two or seven images"
//                 warningUi={<MakePostImageUploadWarningUi />}
//               />
//               <p className={postErrorColor}>{errors.images?.message}</p>

//               <Button
//                 size={"lg"}
//                 className="bg-blue-100 hover:bg-blue-200 text-blue-500 w-20 cursor-pointer"
//                 type="submit"
//               >
//                 Next <MdOutlineNavigateNext />
//               </Button>
//             </div>
//           </section>
//         </form>

//         {/* Main categories components here */}

//         <section>
//           {renderNextPage && MainCategorySelection(mainCategoryValue)}
//         </section>
//       </div>
//     </div>
//   );
// }
