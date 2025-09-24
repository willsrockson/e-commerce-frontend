"use client";

import { FormEvent, useState, useEffect, useRef, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, CloudUpload, MoveLeft } from "lucide-react";
import debounce from "lodash/debounce";

import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from "@/components/ui/accordion";

import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

import { ghanaRegions } from "@/lib/ghanaRegions";
import { categories } from "@/lib/categories";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";

import DeleteSingleImage from "@/components/MyAds/delete-single-image";
import BeatLoaderUI from "@/components/loaders/BeatLoader";
import Image from "next/image";
import { toastError, toastSuccess } from "@/components/toasts/toasts";

export interface RegionsType {
   region: string;
}

export default function EditMobilePhones() {
   const params = useParams<{ id: string }>();


   const [townOpen, setTownOpen] = useState(false);
   const [brandOpen, setBrandOpen] = useState(false);
   const [modelOpen, setModelOpen] = useState(false);

   const router = useRouter();
   const [loading, setLoading] = useState<boolean>(false);
   const [editPost, setEditPost] = useState({
      region: "",
      town: "",
      brand: "",
      model: "",
      color: "",
      storage: "",
      ram: "",
      exPossible: "",
      price: "",
      negotiable: "",
      condition: "",
      images: [],
      description: "",
      title: "",
   });
   const [defaultPostData, setDefaultPostData] = useState({
      region: "",
      town: "",
      brand: "",
      model: "",
      color: "",
      storage: "",
      ram: "",
      exPossible: "",
      price: "",
      negotiable: "",
      condition: "",
      images: [],
      description: "",
      title: "",
   });

   // Images upload
   //const [files, setFiles] = useState<File[] | null>(null);
    const fileRef = useRef<HTMLInputElement>(null) // activate hidden file input
    const [files, setFiles] = useState<File[] | null>();
    const [images, setImages] = useState<{ file: File; preview: string }[]>();

    useEffect(()=>{
     const previews = files?.map((file)=>(
        { 
            file,
            preview:URL.createObjectURL(file)
        }
     ))
     setImages(previews) 
    },[files])

    
   // Removes the file from the Files State
   const removeImage = (fileToRemove:string ) => {
    //setImages(prev => prev?.filter((_, index) => index !== indexToRemove));
    setFiles( files?.filter((file)=> file.name !== fileToRemove ) )
  };


   // Images upload code ends here

   const [fetchDataAgain, setFetchDataAgain] = useState<string>("");

   const priceRef = useRef<HTMLInputElement | null>(null);
   const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
   const titleRef = useRef<HTMLTextAreaElement | null>(null);

   
   const debouncedSetEditPost = useMemo(
             () => debounce((newData) => {
                 setEditPost((prev) => ({ ...prev, ...newData }));
               }, 1000),[] 
         );

   const handleSubmitEdit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!defaultPostData) return;

      const newFormData = new FormData();
      Object.entries(editPost).forEach(([key, value]) => {
         if (defaultPostData?.[key as keyof typeof defaultPostData] !== value) {
            newFormData.set(key, String(value));
         }
      });
      files?.forEach((file) => newFormData.append("adImages", file));

      if (!files && newFormData.entries().next().done) {
         toastError({
            message: "No changes made",
         });
         return;
      }

      setLoading(true);
      const res = await fetch(`/api/fetch/submit/edited/mobile/phone/${params.id}`, {
         credentials: "include",
         method: "POST",
         body: newFormData,
      });
      const data = await res.json() as {successMessage: string; errorMessage:string;};
      setLoading(false);
      if (!res.ok) {
         toastError({message: data?.errorMessage });
         return;
      }

      toastSuccess({ message: data?.successMessage });
      fetchPhone();
      setFiles(null);
   };

   // Fetch Phone again when user deletes a photo
   const fetchPhone = () => {
      setFetchDataAgain(new Date().getMilliseconds().toString());
   };

   
   useEffect(() => {
      if (defaultPostData?.region !== editPost.region) {
         setEditPost( prev => ({ ...prev, town: "", }));
      }
   }, [editPost.region, defaultPostData.region]);

   useEffect(() => {
      if (defaultPostData?.brand !== editPost.brand) {
         setEditPost(prev => ({ ...prev, model: "", }));
      }
   }, [editPost.brand, defaultPostData.brand]);

   useEffect(() => {
      const getData = async () => {
         const res = await fetch(`/api/fetch/mobile/phone/for/editing/${params.id}`, 
            { credentials: "include" }
         );

         if (!res.ok) {
            toastError({
               message: "Something went wrong refresh page",
            });
            return;
         }

         const data = await res.json();
         const postData = {
            region: data[0]?.region || "",
            town: data[0]?.town || "",
            brand: data[0]?.brand || "",
            model: data[0]?.model || "",
            color: data[0]?.color || "",
            storage: data[0]?.disk_space || "",
            ram: data[0]?.ram_size || "",
            exPossible: data[0]?.exchange_possible || "",
            price: data[0]?.price || "",
            negotiable: data[0]?.negotiable || "",
            condition: data[0]?.condition || "",
            images: data[0]?.images || [],
            description: data[0]?.description || "",
            title: data[0]?.title || "",
         };
         setEditPost(postData);
         setDefaultPostData(postData);
      };
      getData();
   }, [fetchDataAgain, params]);

   return (
      <div className="w-full">
         <div className="px-2 pt-10">
            <div className=" w-full max-w-[600px] md:max-w-[900px] m-auto h-fit px-5 md:px-10 bg-white ">
               <div className="flex justify-between pb-5 ">
                  <Badge
                     className="bg-[#EBF1F4] hover:bg-[#F4F3F3] text-gray-600 cursor-pointer"
                     onClick={() => router.push("/profile")}
                  >
                     <MoveLeft />
                  </Badge>

                  <p className="text-lg font-medium text-testing">Edit Post</p>

                  <Badge
                     className="bg-[#EBF1F4] hover:bg-[#F4F3F3] text-gray-600 cursor-pointer py-1.5"
                     onClick={() => router.push("/")}
                  >
                     Home
                  </Badge>
               </div>

               <form onSubmit={handleSubmitEdit}>
                  <div className="flex flex-col gap-0">
                     {/* First collapsable starts here */}

                     <Accordion
                        type="single"
                        collapsible
                     >
                        <AccordionItem
                           value="item-1"
                           className="border-none"
                        >
                           <AccordionTrigger>Location and details</AccordionTrigger>
                           <AccordionContent>
                              <div className="flex flex-col gap-8">
                                 <div className="flex flex-col gap-8 sm:flex-row">
                                    {/* Select Regions here */}

                                    <div className="grid w-full items-center gap-1.5">
                                       {/* Only shows when region has been selected */}
                                       {editPost.region && <Label htmlFor="region">Region</Label>}
                                       <Select
                                          name="region"
                                          value={editPost.region}
                                          onValueChange={(value) =>
                                             debouncedSetEditPost({ region: value })
                                          }
                                       >
                                          <SelectTrigger className="w-full">
                                             <SelectValue placeholder="Select Region" />
                                          </SelectTrigger>
                                          <SelectContent id="region">
                                             <SelectGroup>
                                                <SelectLabel>Regions</SelectLabel>
                                                {ghanaRegions.map((data: RegionsType, index) => (
                                                   <SelectItem
                                                      key={index}
                                                      value={data.region}
                                                   >
                                                      {data.region}
                                                   </SelectItem>
                                                ))}
                                             </SelectGroup>
                                          </SelectContent>
                                       </Select>
                                    </div>

                                    {/* Select Towns here */}
                                    {editPost.region ? (
                                       <div className="grid w-full items-center gap-1.5">
                                          {editPost.region ? (
                                             <Label htmlFor="town">Town</Label>
                                          ) : (
                                             " "
                                          )}

                                          <Popover
                                             open={townOpen}
                                             onOpenChange={setTownOpen}
                                          >
                                             <PopoverTrigger asChild>
                                                <Button
                                                   variant="outline"
                                                   role="combobox"
                                                   aria-expanded={townOpen}
                                                   className="w-full justify-between"
                                                >
                                                   {editPost.town
                                                      ? ghanaRegions[
                                                           Number(
                                                              ghanaRegions.findIndex(
                                                                 (data) =>
                                                                    data.region === editPost.region
                                                              )
                                                           )
                                                        ].towns.find(
                                                           (town) => town === editPost.town
                                                        )
                                                      : " Select town"}
                                                   <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                             </PopoverTrigger>

                                             <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                <Command>
                                                   <CommandInput
                                                      placeholder=" Search town..."
                                                   />
                                                   <CommandList>
                                                      <CommandEmpty>Town not found.</CommandEmpty>

                                                      <CommandGroup>
                                                         {ghanaRegions[
                                                            Number(
                                                               ghanaRegions.findIndex(
                                                                  (data) =>
                                                                     data.region === editPost.region
                                                               )
                                                            )
                                                         ].towns.map((town, index) => (
                                                            <CommandItem
                                                               key={index}
                                                               value={town}
                                                               onSelect={(currentValue) => {
                                                                  setEditPost(prev => ({
                                                                     ...prev,
                                                                     town:
                                                                        currentValue ===
                                                                        editPost.town
                                                                           ? ""
                                                                           : currentValue,
                                                                  }));
                                                                  setTownOpen(false);
                                                               }}
                                                            >
                                                               {town}
                                                               <Check
                                                                  className={cn(
                                                                     "ml-auto",
                                                                     editPost.town === town
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                  )}
                                                               />
                                                            </CommandItem>
                                                         ))}
                                                      </CommandGroup>
                                                   </CommandList>
                                                </Command>
                                             </PopoverContent>
                                          </Popover>
                                       </div>
                                    ) : (
                                       <div className="w-full">
                                          <Input
                                             disabled
                                             className="w-full"
                                             placeholder="* select region first"
                                          />
                                       </div>
                                    )}
                                 </div>

                                 <div className="flex flex-col gap-8 sm:flex-row">
                                    {/* Select Brand here*/}

                                    <div className="grid w-full items-center gap-1.5">
                                       <Label htmlFor="brand">Brand</Label>
                                       <Popover
                                          open={brandOpen}
                                          onOpenChange={setBrandOpen}
                                       >
                                          <PopoverTrigger asChild>
                                             <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={brandOpen}
                                                className="w-full justify-between"
                                             >
                                                {editPost.brand
                                                   ? categories[0].subCategory[0].content.find(
                                                        (data) =>
                                                           data.brand === editPost.brand
                                                     )?.brand
                                                   : " Select brand..."}
                                                <ChevronsUpDown className="opacity-50" />
                                             </Button>
                                          </PopoverTrigger>

                                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                             <Command>
                                                <CommandInput placeholder=" Search brand..." />
                                                <CommandList>
                                                   <CommandEmpty>Brand not found.</CommandEmpty>

                                                   <CommandGroup>
                                                      {categories[0].subCategory[0].content.map(
                                                         (data, index) => (
                                                            <CommandItem
                                                               key={index}
                                                               value={data.brand}
                                                               onSelect={(currentValue) => {
                                                                  //setModelValue(currentValue === mobilePostData.brand ? "" : currentValue)

                                                                  setEditPost(prev => ({
                                                                     ...prev,
                                                                     color: "",
                                                                     model: "",
                                                                     brand:
                                                                        currentValue ===
                                                                        editPost.brand
                                                                           ? ""
                                                                           : currentValue,
                                                                  }));
                                                                  setBrandOpen(false);
                                                               }}
                                                            >
                                                               {data.brand}
                                                               <Check
                                                                  className={cn(
                                                                     "ml-auto",
                                                                     editPost.brand ===
                                                                        data.brand
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                  )}
                                                               />
                                                            </CommandItem>
                                                         )
                                                      )}
                                                   </CommandGroup>
                                                </CommandList>
                                             </Command>
                                          </PopoverContent>
                                       </Popover>
                                    </div>
                                 </div>

                                 

                                 { editPost.brand && (
                                    <div className="flex flex-col gap-8">
                                       <div className="flex flex-col gap-8 sm:flex-row">
                                          <div className="grid w-full items-center gap-1.5">
                                             <Label htmlFor="model">Model</Label>
                                             <Popover
                                                open={modelOpen}
                                                onOpenChange={setModelOpen}
                                             >
                                                <PopoverTrigger asChild>
                                                   <Button
                                                      variant="outline"
                                                      role="combobox"
                                                      aria-expanded={modelOpen}
                                                      className="w-full justify-between"
                                                   >
                                                      {editPost.model
                                                        ? (
                                                            categories[0].subCategory[0].content[
                                                                Number(
                                                                categories[0].subCategory[0].content
                                                                .findIndex((data)=> data.brand === editPost.brand))
                                                            ].models.find((data) => data.name === editPost.model)?.name )
                                                        : " Select model..."}
                                                      <ChevronsUpDown className="opacity-50" />
                                                   </Button>
                                                </PopoverTrigger>

                                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                   <Command>
                                                      <CommandInput placeholder=" Search model..." />
                                                      <CommandList>
                                                         <CommandEmpty>
                                                            Model not found.
                                                         </CommandEmpty>

                                                         <CommandGroup>
                                                               {
                                                                categories[0].subCategory[0].content[
                                                                    Number(
                                                                        categories[0].subCategory[0].content
                                                                    .findIndex((data)=> data.brand === editPost.brand))
                                                                ].models
                                                                    .map((data, index) => (
                                                                    <CommandItem
                                                                        key={index}
                                                                        value={data.name}
                                                                        onSelect={(currentValue) => {
                                                                            //setModelValue(currentValue === mobilePostData.brand ? "" : currentValue)
                                                                            setEditPost(prev => ({...prev, model: currentValue === editPost.model ? "" : currentValue }))
                                                                            setModelOpen(false)
                                                                        }}
                                                                    >
                                                                        {data.name}
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                editPost.model === data.name ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                ))}
                                                         </CommandGroup>
                                                      </CommandList>
                                                   </Command>
                                                </PopoverContent>
                                             </Popover>
                                          </div>

                                          <div className="grid w-full items-center gap-1.5">
                                                <Label htmlFor="color">Color</Label>
                                                { (editPost.model && editPost.brand) ?
                                                   ( <Select name="color" value={editPost.color} onValueChange={(value)=> setEditPost(prev => ({...prev, color: value}))}>
                                                         <SelectTrigger className="w-full">
                                                         <SelectValue/>
                                                         </SelectTrigger>
                                                         <SelectContent id="color">
                                                         {
                        
                        
                                                                  categories[0].subCategory[0].content[
                                                                              Number(
                                                                              categories[0].subCategory[0].content
                                                                              .findIndex((data)=> data.brand === editPost.brand))
                                                                        ].models[
                                                                              Number( categories[0].subCategory[0].content[
                                                                              Number(
                                                                              categories[0].subCategory[0].content
                                                                              .findIndex((data)=> data.brand === editPost.brand))
                                                                        ].models.findIndex(data => data.name === editPost.model) )
                                                                        ].colors.map((color, index)=>(
                                                                              <SelectItem key={index}
                                                                              value={color}> {color}</SelectItem> 
                                                                        ))
                                                         }
                        
                                                         </SelectContent>
                                                   </Select> ) : 
                                                      (<div className="w-full">
                                                         { editPost.model && <Label>Color</Label> }
                                                         <Input disabled className="w-full" placeholder="* select model first"/>
                                                      </div>)
                                                }
                                          </div>
                                       </div>

                                       <div className="flex flex-col gap-8 sm:flex-row">
                                          <div className="grid w-full items-center gap-1.5">
                                               <Label htmlFor="storage">Storage</Label>
                                                { (editPost.model && editPost.brand) ?
                                                   ( <Select name="storage" value={editPost.storage} onValueChange={(value)=> setEditPost(prev => ({...prev, storage: value}))}>
                                                         <SelectTrigger className="w-full">
                                                         <SelectValue/>
                                                         </SelectTrigger>
                                                         <SelectContent id="storage">
                                                         {
                        
                        
                                                               categories[0].subCategory[0].content[
                                                                              Number(
                                                                              categories[0].subCategory[0].content
                                                                              .findIndex((data)=> data.brand === editPost.brand))
                                                                        ].models[
                                                                              Number( categories[0].subCategory[0].content[
                                                                              Number(
                                                                              categories[0].subCategory[0].content
                                                                              .findIndex((data)=> data.brand === editPost.brand))
                                                                        ].models.findIndex(data => data.name === editPost.model) )
                                                                        ].storage.map((storage, index)=>(
                                                                              <SelectItem key={index}
                                                                           value={storage}> {storage}</SelectItem> 
                                                                        ))
                                                         }
                        
                                                         </SelectContent>
                                                   </Select> ) : 
                                                   (<div className="w-full">
                                                         { editPost.model && <Label>Storage</Label> }
                                                         <Input disabled className="w-full" placeholder="* select model first"/>
                                                   </div>)
                                                }
                                          </div>

                                          <div className="grid w-full items-center gap-1.5">
                                                 <Label htmlFor="ram">Ram</Label>
                                                   { (editPost.model && editPost.brand) ?
                                                   ( <Select name="ram" value={editPost.ram} onValueChange={(value)=> setEditPost(prev => ({...prev, ram: value}))}>
                                                         <SelectTrigger className="w-full">
                                                         <SelectValue/>
                                                         </SelectTrigger>
                                                         <SelectContent id="storage">
                                                         {
                           
                           
                                                                  categories[0].subCategory[0].content[
                                                                              Number(
                                                                                 categories[0].subCategory[0].content
                                                                              .findIndex((data)=> data.brand === editPost.brand))
                                                                           ].models[
                                                                                 Number( categories[0].subCategory[0].content[
                                                                                 Number(
                                                                                 categories[0].subCategory[0].content
                                                                              .findIndex((data)=> data.brand === editPost.brand))
                                                                           ].models.findIndex(data => data.name === editPost.model) )
                                                                           ].ram.map((ram, index)=>(
                                                                              <SelectItem key={index}
                                                                              value={ram}> {ram}</SelectItem> 
                                                                           ))
                                                         }
                           
                                                         </SelectContent>
                                                      </Select> ) : 
                                                      (<div className="w-full">
                                                            { editPost.model && <Label>Ram</Label> }
                                                         <Input disabled className="w-full" placeholder="* select model first"/>
                                                      </div>)
                                                   }
                                          </div>
                                       </div>
                                    </div>
                                 )}
                              </div>
                           </AccordionContent>
                        </AccordionItem>
                     </Accordion>

                     {/* First collapsable UI ends here */}

                     {/* Second calapsable starts here */}

                     <Accordion
                        type="single"
                        collapsible
                     >
                        <AccordionItem
                           value="item-1"
                           className="border-none"
                        >
                           <AccordionTrigger>Exchange and price</AccordionTrigger>
                           <AccordionContent>
                              <div className="flex flex-col gap-8 sm:flex-row">
                                 <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="exchange">Exchange Possible</Label>
                                    <Select
                                       name="exPossible"
                                       value={editPost.exPossible}
                                       onValueChange={(value) => {
                                          setEditPost(prev => ({
                                             ...prev,
                                             exPossible: value,
                                          }));
                                       }}
                                    >
                                       <SelectTrigger className="w-full">
                                          <SelectValue />
                                       </SelectTrigger>
                                       <SelectContent id="exchange">
                                          <SelectItem value="Yes">Yes</SelectItem>
                                          <SelectItem value="No">No</SelectItem>
                                       </SelectContent>
                                    </Select>
                                 </div>

                                 <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                       name="price"
                                       id="price"
                                       className="w-full"
                                       type="number"
                                       min="0"
                                       step=".01"
                                       ref={priceRef}
                                       defaultValue={editPost.price}
                                       onChange={() =>
                                          debouncedSetEditPost({
                                             price: priceRef.current
                                                ? priceRef.current.value
                                                : defaultPostData.price,
                                          })
                                       }
                                    />
                                 </div>
                              </div>
                           </AccordionContent>
                        </AccordionItem>
                     </Accordion>

                     <div className="flex flex-col gap-4 mt-4">
                        <div className="flex flex-col gap-8 sm:flex-row">
                           <div className="grid w-full items-center gap-1.5">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                 id="description"
                                 ref={descriptionRef}
                                 defaultValue={editPost.description}
                                 onChange={() =>
                                    debouncedSetEditPost({
                                       description: descriptionRef.current
                                          ? descriptionRef.current.value
                                          : defaultPostData.description,
                                    })
                                 }
                              />
                           </div>

                           <div className="grid w-full items-center gap-1.5">
                              <Label htmlFor="title">Title</Label>
                              <Textarea
                                 id="title"
                                 ref={titleRef}
                                 defaultValue={editPost.title}
                                 onChange={() =>
                                    debouncedSetEditPost({
                                       title: titleRef.current
                                          ? titleRef.current.value
                                          : defaultPostData.title,
                                    })
                                 }
                              />
                           </div>
                        </div>

                        <div className="flex flex-col gap-8 sm:flex-row">
                           <div className="grid w-full items-center gap-1.5">
                              <Label htmlFor="negotiable">Negotiable</Label>
                              <Select
                                 value={editPost.negotiable}
                                 onValueChange={(value) => {
                                    setEditPost(prev => ({
                                       ...prev,
                                       negotiable: value,
                                    }));
                                 }}
                              >
                                 <SelectTrigger className="w-full">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent id="negotiable">
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                           <div className="grid w-full items-center gap-1.5">
                              <Label htmlFor="condition">Condition</Label>
                              <Select
                                 value={editPost.condition}
                                 onValueChange={(value) => {
                                    setEditPost({
                                       ...editPost,
                                       condition: value,
                                    });
                                 }}
                              >
                                 <SelectTrigger className="w-full">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent id="condition">
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Refurbished">Refurbished</SelectItem>
                                    <SelectItem value="Used">Used</SelectItem>
                                    <SelectItem value="For parts, not working">
                                       For parts, not working
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>

                        <div className="flex gap-8 w-full">
                           <div className="grid w-full items-center gap-1.5">
                              <Label htmlFor="photos">Photos</Label>

                              {/* Images from previous post */}
                              <div className="min-w-full h-24 flex justify-start items-center gap-1.5 flex-shrink-0 overflow-x-scroll">
                                 {editPost.images?.length > 0 ? (
                                    editPost.images.map((image, index) => (
                                       <DeleteSingleImage
                                          key={index}
                                          url={image}
                                          image_index={index}
                                          ads_id={params.id}
                                          fetchAdsAgain={fetchPhone}
                                       />
                                    ))
                                 ) : (
                                    <BeatLoaderUI color={"blue"} />
                                 )}
                              </div>

                             { ( editPost.images?.length < 7 ) &&     
                              (<div className="min-w-full mt-2">
                                <Label className="block mb-1">Add more photos to your ad</Label>
                                <ul className="text-xs mb-2 text-red-500">
                                    <li>You can upload 1{ (7 - editPost.images?.length) > 1 && '-'+(7 - editPost.images?.length) } image{(7 - editPost.images?.length) > 1 ? 's': ''}</li>
                                </ul>
                                <div className="relative mb-2">
                                    <p
                                        onClick={() => fileRef.current?.click()}
                                        className="cursor-pointer w-fit bg-blue-100 rounded-full p-1"
                                    >
                                        <CloudUpload />
                                    </p>
                                    <Input
                                        type="file"
                                        multiple
                                        ref={fileRef}
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                const arrOfFiles = Array.from(e.target.files);
                                                if (files?.length === 0) {
                                                    setFiles(arrOfFiles);
                                                } else {
                                                    setFiles([...(files ?? []), ...arrOfFiles]);
                                                }
                                            }
                                        }}
                                        className="hidden cursor-pointer opacity-0 absolute top-0 left-0"
                                    />
                                </div>

                                {(images?.length ?? 0) > 0 && (
                                    <div className="flex flex-shrink-0 gap-1.5 overflow-x-auto">
                                        {images?.map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-3/2 group min-w-24 h-24"
                                            >
                                                <Image
                                                    src={img.preview}
                                                    alt={`preview-${index}`}
                                                    fill
                                                    className="min-w-24 h-24 object-cover rounded"
                                                />
                                                <button
                                                    onClick={() => removeImage(img.file.name)}
                                                    className="absolute top-1 right-1 bg-black text-white text-xs rounded-full px-2 py-1 hidden group-hover:block"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>)}
                                  
                                
                           </div>
                        </div>

                        <Button
                           className="bg-blue-600 w-fit "
                           disabled={loading}
                        >
                           {loading ? "Processing..." : "Submit changes"}
                        </Button>
                     </div>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}
