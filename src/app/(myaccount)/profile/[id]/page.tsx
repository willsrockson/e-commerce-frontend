"use client"
import {FormEvent, useState, useEffect, useRef, useCallback} from 'react'
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Check, ChevronsUpDown, MoveLeft} from "lucide-react";
import debounce from "lodash/debounce";



import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {ghanaRegions} from "@/lib/ghanaRegions";
import {categories} from "@/lib/categories";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {useParams, useRouter} from "next/navigation";

import DeleteSingleImage from "@/components/MyAds/delete-single-image";
import BeatLoaderUI from "@/components/loaders/BeatLoader";
import {useToast} from "@/hooks/use-toast";

export interface RegionsType {
    region: { regionId: number, regionName: string },
}


export default function EditPost() {
    const { toast } = useToast()
    const params = useParams<{ id: string }>();

    const [open, setOpen] = useState(false)
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [editPost, setEditPost] = useState({
        region: "",
        town: "",
        category: "Mobile Phones",
        brand: "",
        model: "",
        color: "",
        storage: "",
        ram: "",
        exPossible: "",
        price: "",
        negotiation: "",
        condition: "",
        images: [],
        description: "",
        title: ""
    })
    const [defaultPostData, setDefaultPostData] = useState({
        region: "",
        town: "",
        category: "Mobile Phones",
        brand: "",
        model: "",
        color: "",
        storage: "",
        ram: "",
        exPossible: "",
        price: "",
        negotiation: "",
        condition: "",
        images: [],
        description: "",
        title: ""
    })
    const [files, setFiles] = useState<File[] | null>(null);

    const [fetchDataAgain, setFetchDataAgain] = useState<string>('')

    const priceRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
    const titleRef = useRef<HTMLTextAreaElement | null>(null);




    // Debounce
    const debouncedSetEditPost = useCallback(
        debounce((newData) => setEditPost(prev => ({ ...prev, ...newData })), 1000),
        []
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
        files?.forEach((file) => newFormData.append('adImages', file));

        if(!files && newFormData.entries().next().done) {

            return toast({
                title: "No changes found",
                variant: "destructive",
            });
        }


        setLoading(true);
        const res = await fetch(`/api/mobile/editmobile/${params.id}`, {
            credentials: 'include',
            method: "POST",
            body: newFormData,
        })

        setLoading(false);
        if(!res.ok){
            const data = await res.json();
            return toast({
                title: "Update failed",
                description: `${data?.errorMessage}`,
                variant: "destructive",
            });
        }

        const data = await res.json();
        toast({
            title: "Success",
            description: `${data?.message}`,
            variant: "default",
            style: {
                backgroundColor: "#22C55E", // Success green
                color: "#FFFFFF", // White text for contrast
                border: "1px solid #16A34A", // Darker green border (green-600)
            },
        });
        fetchPhone();


    }

    // Fetch Phone again when user deletes a photo
    const fetchPhone =()=>{
        setFetchDataAgain(new Date().getMilliseconds().toString())
    }

    useEffect(() => {
        if (defaultPostData?.region !== editPost.region) {
            setEditPost({
                ...editPost,
                town: ''
            });
        }

    }, [editPost.region, defaultPostData.region]);


    useEffect(() => {
        if (defaultPostData?.brand !== editPost.brand) {
            setEditPost({
                ...editPost,
                model: ''
            });
        }
    }, [editPost.brand, defaultPostData.brand]);


    useEffect( () => {

        const getData = async () => {

                 const res = await  fetch(`/api/mobile/phones/${params.id}`, {credentials: 'include'})

                 if(!res.ok){
                    return toast({
                         title: "Something went wrong refresh page",
                         variant: "destructive",
                     });
                 }

                 const data = await res.json();
                 console.log(data[0][0]);
                 const postData = {
                     region: data[0][0]?.region || "",
                     town: data[0][0]?.town || "",
                     category: data[0][0]?.category || "Mobile Phones",
                     brand: data[0][0]?.brand || "",
                     model: data[0][0]?.model || "",
                     color: data[0][0]?.color || "",
                     storage: data[0][0]?.disk_space || "",
                     ram: data[0][0]?.ram_size || "",
                     exPossible: data[0][0]?.exchange_possible || "",
                     price: data[0][0]?.price || "",
                     negotiation: data[0][0]?.negotiation || "",
                     condition: data[0][0]?.condition || "",
                     images: data[0][0]?.images || [],
                     description: data[0][0]?.description || "",
                     title: data[0][0]?.title || "",
                 };
                 setEditPost(postData);
                 setDefaultPostData(postData);

        }
        getData();


    },[fetchDataAgain])





    return (

        <div className="w-full">
           <div className="px-2 pt-10">
            <div
                className=" w-full max-w-[600px] md:max-w-[900px] m-auto h-fit px-5 md:px-10 bg-white ">

                <div className="flex justify-between pb-5 ">
                    <Badge className="bg-[#EBF1F4] hover:bg-[#F4F3F3] text-gray-600 cursor-pointer"
                           onClick={() => router.push('/profile')}
                    ><MoveLeft/></Badge>

                    <p className="text-lg font-medium text-testing">Edit Post</p>

                    <Badge className="bg-[#EBF1F4] hover:bg-[#F4F3F3] text-gray-600 cursor-pointer py-1.5"
                           onClick={() => router.push('/')}
                    >Home</Badge>

                </div>

                <form onSubmit={handleSubmitEdit}>
                    <div className="flex flex-col gap-0">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1" className='border-none'>
                                <AccordionTrigger >
                                      Location and details
                                </AccordionTrigger>
                                <AccordionContent >
                                    <div className="flex flex-col gap-8">
                                        <div className="flex flex-col gap-8 sm:flex-row">
                                            {/* Select Regions here */}

                                            <div className="grid w-full items-center gap-1.5">
                                                {/* Only shows when region has been selected */}
                                                {editPost.region && <Label htmlFor="region">Select Region</Label>}
                                                <Select name='region' value={editPost.region}
                                                        onValueChange={(value) => debouncedSetEditPost({ region: value })}
                                                        >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Region"/>
                                                    </SelectTrigger>
                                                    <SelectContent id="region">
                                                        <SelectGroup>
                                                            <SelectLabel>Regions</SelectLabel>
                                                            {ghanaRegions.map((region: RegionsType) => (
                                                                <SelectItem key={region.region.regionId}
                                                                            value={region.region.regionName}>
                                                                    {region.region.regionName}
                                                                </SelectItem>
                                                            ))}

                                                        </SelectGroup>

                                                    </SelectContent>
                                                </Select>
                                            </div>


                                            {/* Select Towns here */}
                                            {editPost.region ?

                                                <div className="grid w-full items-center gap-1.5">
                                                    {editPost.region ? <Label htmlFor="town">Select Town</Label> : " "}
                                                    <Select value={editPost.town} onValueChange={(value) => {
                                                        setEditPost({
                                                                ...editPost,
                                                                town: value
                                                            }
                                                        )
                                                    }}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue/>
                                                        </SelectTrigger>
                                                        <SelectContent id="town">
                                                            <SelectGroup>
                                                                <SelectLabel>Towns</SelectLabel>
                                                                {
                                                                    ghanaRegions[
                                                                        Number(
                                                                            ghanaRegions.findIndex((region) => (
                                                                                region.region.regionName === editPost.region
                                                                            ))
                                                                        )
                                                                        ].towns.map((town) => (

                                                                        <SelectItem key={town.id} value={town.name}>
                                                                            {town.name}
                                                                        </SelectItem>
                                                                    ))
                                                                }

                                                            </SelectGroup>

                                                        </SelectContent>
                                                    </Select>
                                                </div>


                                                : (<div className="w-full">
                                                    <Input disabled className="w-full"
                                                           placeholder="* select a region first"/>

                                                </div>)
                                            }

                                        </div>


                                        <div className="flex flex-col gap-8 sm:flex-row">
                                            {/* Select Category */}
                                            <div className="grid w-full items-center gap-1.5">
                                                {/* Only shows when region has been selected */}
                                                {editPost.category &&
                                                    <Label htmlFor="category">Default category</Label>}
                                                <Select disabled={true} name="category" value={editPost.category}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select category"/>
                                                    </SelectTrigger>
                                                    <SelectContent id="category">
                                                        <SelectGroup>
                                                            <SelectLabel>Categories</SelectLabel>
                                                            {categories.map((category) => (
                                                                <SelectItem key={category.categoriesList.catId}
                                                                            value={category.categoriesList.name}>
                                                                    {category.categoriesList.name}
                                                                </SelectItem>

                                                            ))}

                                                        </SelectGroup>

                                                    </SelectContent>
                                                </Select>
                                            </div>


                                            {/* Select Brand here*/}
                                            {editPost.category ?

                                                <div className="grid w-full items-center gap-1.5">
                                                    {editPost.category ?
                                                        <Label htmlFor="brand">Select Brand</Label> : " "}
                                                    <Select name="brand" value={editPost.brand}
                                                            onValueChange={(value) => {
                                                                setEditPost({
                                                                    ...editPost,
                                                                    brand: value
                                                                })
                                                            }}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue/>
                                                        </SelectTrigger>
                                                        <SelectContent id="brand">
                                                            <SelectGroup>
                                                                <SelectLabel>Brand</SelectLabel>
                                                                {
                                                                    categories[
                                                                        Number(
                                                                            categories.findIndex((category) => (
                                                                                category.categoriesList.name === editPost.category
                                                                            ))
                                                                        )
                                                                        ].brands.map((brand) => (

                                                                        <SelectItem key={brand.brandId}
                                                                                    value={brand.name}>
                                                                            {brand.name}
                                                                        </SelectItem>
                                                                    ))
                                                                }

                                                            </SelectGroup>

                                                        </SelectContent>
                                                    </Select>
                                                </div>


                                                : (<div className="w-full">
                                                    <span></span>
                                                    <Input disabled className="w-full"
                                                           placeholder="* select a category first"/>
                                                </div>)
                                            }

                                        </div>

                                        {/* //////////////////////////////// Mobile ///////////////////////////////////////////////////////////// */}


                                        {editPost.category && editPost.brand &&


                                            <div className="flex flex-col gap-8">

                                                <div className="flex flex-col gap-8 sm:flex-row">


                                                    <div className="grid w-full items-center gap-1.5">

                                                        <Label htmlFor="model">Select Model</Label>
                                                        <Popover open={open} onOpenChange={setOpen}>

                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    aria-expanded={open}
                                                                    className="w-full justify-between"
                                                                >

                                                                    {editPost.model
                                                                        ? (

                                                                            categories[
                                                                                Number(
                                                                                    categories.findIndex((cat) => (
                                                                                        cat.categoriesList.name === editPost.category
                                                                                    ))
                                                                                )
                                                                                ].brands[
                                                                                Number(
                                                                                    categories[0].brands.findIndex((brandIndex) => (
                                                                                        brandIndex.name === editPost.brand
                                                                                    ))
                                                                                )
                                                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                                // @ts-expect-error
                                                                                ].model.find((model: {
                                                                                modelId: number,
                                                                                modelName: string
                                                                            }) => model.modelName === editPost.model)?.modelName)
                                                                        : " Select model..."}
                                                                    <ChevronsUpDown className="opacity-50"/>
                                                                </Button>
                                                            </PopoverTrigger>

                                                            <PopoverContent
                                                                className="w-[--radix-popover-trigger-width] p-0">
                                                                <Command>
                                                                    <CommandInput placeholder=" Search model..."/>
                                                                    <CommandList>
                                                                        <CommandEmpty>Model not found.</CommandEmpty>

                                                                        <CommandGroup>
                                                                            {

                                                                                categories[
                                                                                    Number(
                                                                                        categories.findIndex((cat) => (
                                                                                            cat.categoriesList.name === editPost.category
                                                                                        ))
                                                                                    )
                                                                                    ].brands[
                                                                                    Number(
                                                                                        categories[0].brands.findIndex((brandIndex) => (
                                                                                            brandIndex.name === editPost.brand
                                                                                        ))
                                                                                    )
                                                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                                    // @ts-expect-error
                                                                                    ].model.map((model: {
                                                                                    modelId: number,
                                                                                    modelName: string
                                                                                }) => (
                                                                                    <CommandItem
                                                                                        key={model.modelId}
                                                                                        value={model.modelName}
                                                                                        onSelect={(currentValue) => {
                                                                                            setEditPost({
                                                                                                ...editPost,
                                                                                                model: (currentValue === editPost.model ? "" : currentValue)
                                                                                            })
                                                                                            //setModelValue(currentValue === modelValue ? "" : currentValue)
                                                                                            setOpen(false)
                                                                                        }}
                                                                                    >
                                                                                        {model.modelName}
                                                                                        <Check
                                                                                            className={cn(
                                                                                                "ml-auto",
                                                                                                editPost.model === model.modelName ? "opacity-100" : "opacity-0"
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
                                                        <Select name="color" value={editPost.color}
                                                                onValueChange={(value) => {
                                                                    setEditPost({
                                                                        ...editPost,
                                                                        color: value
                                                                    })
                                                                }}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue/>
                                                            </SelectTrigger>
                                                            <SelectContent id="color">
                                                                {
                                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                    // @ts-expect-error
                                                                    categories[0].colors.map((color) => (
                                                                        <SelectItem key={color.colorId}
                                                                                    value={color.colorName}> {color.colorName}</SelectItem>
                                                                    ))
                                                                }

                                                            </SelectContent>
                                                        </Select>
                                                    </div>


                                                </div>


                                                <div className="flex flex-col gap-8 sm:flex-row">
                                                    <div className="grid w-full items-center gap-1.5">
                                                        <Label htmlFor="model">Internal Storage</Label>
                                                        <Select value={editPost.storage} onValueChange={(value) => {
                                                            setEditPost({
                                                                ...editPost,
                                                                storage: value,
                                                            })
                                                        }}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue/>
                                                            </SelectTrigger>
                                                            <SelectContent id="storage">

                                                                {
                                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                    // @ts-expect-error
                                                                    categories[0].storage.map((space) => (
                                                                        <SelectItem key={space.storageId}
                                                                                    value={space.size}> {space.size}</SelectItem>
                                                                    ))
                                                                }


                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="grid w-full items-center gap-1.5">
                                                        <Label htmlFor="model">Ram Size</Label>
                                                        <Select value={editPost.ram} onValueChange={(value) => {
                                                            setEditPost({
                                                                ...editPost,
                                                                ram: value
                                                            })
                                                        }}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue/>
                                                            </SelectTrigger>
                                                            <SelectContent id="ram">

                                                                {
                                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                    // @ts-expect-error
                                                                    categories[0].ram.map((ram) => (
                                                                        <SelectItem key={ram.ramId}
                                                                                    value={ram.size}> {ram.size} </SelectItem>
                                                                    ))
                                                                }

                                                            </SelectContent>
                                                        </Select>


                                                    </div>


                                                </div>

                                            </div>


                                        }

                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>



                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1" className='border-none'>
                                <AccordionTrigger >Exchange and price</AccordionTrigger>
                                <AccordionContent>

                        <div className="flex flex-col gap-8 sm:flex-row">

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="exchange">Exchange Possible</Label>
                                <Select name="exPossible" value={editPost.exPossible} onValueChange={(value) => {
                                    setEditPost({
                                        ...editPost,
                                        exPossible: value
                                    })
                                }}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent id="exchange">
                                        <SelectItem value="No">No</SelectItem>
                                        <SelectItem value="Yes">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="price">Price</Label>
                                <Input name="price" id="price" className="w-full" type="number" min="0" step=".01"
                                       ref={priceRef}
                                       defaultValue={editPost.price}
                                       onChange={()=> debouncedSetEditPost({ price: priceRef.current ? priceRef.current.value : defaultPostData.price })}
                                />
                            </div>


                        </div>

                    </AccordionContent>
                </AccordionItem>
               </Accordion>



                        <div className='flex flex-col gap-4 mt-4'>

                        <div className="flex flex-col gap-8 sm:flex-row">

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description"
                                          ref={descriptionRef}
                                          defaultValue={editPost.description}
                                          onChange={()=> debouncedSetEditPost(
                                              { description: descriptionRef.current ? descriptionRef.current.value
                                                      : defaultPostData.description
                                              })}
                                />
                            </div>

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="title">Title</Label>
                                <Textarea id="title"
                                          ref={titleRef}
                                          defaultValue={editPost.title}
                                          onChange={()=> debouncedSetEditPost({
                                              title: titleRef.current ? titleRef.current.value : defaultPostData.title
                                          })}

                                />
                            </div>

                        </div>

                        <div className="flex flex-col gap-8 sm:flex-row">

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="negotiable">Negotiable</Label>
                                <Select value={editPost.negotiation} onValueChange={(value) => {
                                    setEditPost({
                                        ...editPost,
                                        negotiation: value
                                    })
                                }}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent id="negotiable">
                                        <SelectItem value="No">No</SelectItem>
                                        <SelectItem value="Yes">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="condition">Condition</Label>
                                <Select value={editPost.condition} onValueChange={(value) => {
                                    setEditPost({
                                        ...editPost,
                                        condition: value
                                    })
                                }}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent id="condition">
                                        <SelectItem value="New">Brand New</SelectItem>
                                        <SelectItem value="Refurbished">Refurbished</SelectItem>
                                        <SelectItem value="Used">Used</SelectItem>
                                        <SelectItem value="PartsOnly">For parts, not working</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>


                        <div className="flex gap-8 w-full">

                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="photos">Photos</Label>

                                {/* Images from previous post */}
                                <div className="w-full max-h-20 h-full flex justify-start items-center gap-1">

                                    {
                                       editPost.images?.length > 0 ? editPost.images.map((image, index) => (
                                            <DeleteSingleImage
                                                key={index}
                                                url={image}
                                                id={index}
                                                mobile_id={ params.id }
                                                fetchPhone={fetchPhone}
                                            />
                                        ))
                                         :   <BeatLoaderUI color={'blue'}/>
                                    }

                                </div>
                                <Input id="photos" type="file" accept="image/*" multiple onChange={(e) => {
                                    if (e.target.files) {
                                        setFiles(Array.from(e.target.files));
                                    }
                                }}/>
                                <span className="text-sm text-gray-500">Maximum files expected is 7</span>
                            </div>


                        </div>


                        <Button className="bg-blue-600 w-fit " disabled={loading}>
                            { loading ? 'Processing...' : 'Submit changes' }
                        </Button>
                      </div>

                    </div>
                </form>

            </div>

           </div>
        </div>
    )
}



