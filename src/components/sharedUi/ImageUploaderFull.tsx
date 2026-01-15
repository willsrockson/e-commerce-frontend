/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Camera } from "lucide-react";
import React, { JSX, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Image from "next/image";
import { Controller, Control } from "react-hook-form";
import {
   DndContext,
   closestCorners,
   useSensor,
   MouseSensor,
   useSensors,
   DragOverlay,
   DragStartEvent,
   TouchSensor,
} from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import SortableImages from "./sortable.images";
import { toastError } from "../toasts/toasts";

type ImageUploaderProps = {
   control: Control<any>;
   name: string;
   min: number;
   max: number;
   adsId?: string;
   fetchUrl?: string;
   errorMessage: string;
   warningUi: JSX.Element;
};

// Internal type to handle the mixed state of Files and URLs consistently
type UnifiedImage = {
   id: string; // Will be file.name for new uploads, or the URL string for existing
   preview: string;
   original: File | string; // The actual value sent to the form
   type: "FILE" | "URL";
};

export default function ImageUploaderFull({
   control,
   name,
   min,
   max,
   adsId,
   fetchUrl,
   errorMessage,
   warningUi,
}: ImageUploaderProps) {
   
   const sensors = useSensors(
      useSensor(TouchSensor, {
         activationConstraint: {
            delay: 250,
            tolerance: 5,
         },
      }),
      useSensor(MouseSensor, {
         activationConstraint: {
            distance: 8,
         },
      })
   );

   const [activeId, setActiveId] = useState<string | null>(null);
   const fileRef = useRef<HTMLInputElement>(null);
   
   // State now holds the unified structure
   const [images, setImages] = useState<UnifiedImage[]>([]);
   

   return (
      <Controller
         control={control}
         name={name}
         rules={{
            required: "This is required",
            validate: (value) => (value?.length >= min && value?.length <= max) || errorMessage,
         }}
         defaultValue={[]}
         render={({ field }) => {
            
            // 1. Sync Form State (field.value) to Local State (images)
            // This handles mixed arrays: [File, "https://cloudinary...", File]

            useEffect(() => {
               const currentValues = (field.value || []) as (File | string)[];

               setImages((prev) => {
                  // Map form values to our UnifiedImage structure
                  const nextImages = currentValues.map((item) => {
                     const isFile = item instanceof File;
                     
                     // ID Strategy: Use file name for Files, URL string for URLs
                     const itemId = isFile ? item.name : item;

                     // Check if we already have this image in state to preserve its blob URL
                     const existing = prev.find((p) => p.id === itemId);

                     if (existing) return existing;

                     // If new, create the object
                     return {
                        id: itemId,
                        preview: isFile ? URL.createObjectURL(item) : item,
                        original: item,
                        type: (isFile ? "FILE" : "URL") as "FILE" | "URL",
                     };
                  });

                  return nextImages;
               });
            }, [field.value]); // Only re-run when the form value actually changes

            // Cleanup Blobs on unmount
            useEffect(() => {
               return () => {
                  images.forEach((img) => {
                     if (img.type === "FILE") URL.revokeObjectURL(img.preview);
                  });
               };
            }, []);

            // 2. Drag & Drop Reordering
            const handleOnDragEnd = (event: any) => {
               const { active, over } = event;
               if (!over || active.id === over.id) return;

               const oldIndex = images.findIndex((img) => img.id === active.id);
               const newIndex = images.findIndex((img) => img.id === over.id);

               // 1. Reorder visual state locally for smoothness
               const newImages = arrayMove(images, oldIndex, newIndex);
               setImages(newImages);

               // 2. Map back to the raw (File | string) array for React Hook Form
               const newFormValue = newImages.map((img) => img.original);
               field.onChange(newFormValue);

               setActiveId(null);
            };

            // 3. Deletion Logic (Handles both Files and URLs)
            const removeImage = async (idToRemove: string) => {
               
               const imgToRemove = images.find((img) => img.id === idToRemove);

               if (imgToRemove && imgToRemove.type === "FILE") {
                  URL.revokeObjectURL(imgToRemove.preview);
               }

               // Filter based on the ID
               const newFiles = (field.value as (File | string)[]).filter((item) => {
                  const itemId = item instanceof File ? item.name : item;
                  return itemId !== idToRemove;
               });

               field.onChange(newFiles);
            };
            // pt-2 pb-4
            return (
               <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="w-full">
                     <Label className="block">Add photos</Label>
                     {warningUi}
                     
                     <section className="flex justify-start overflow-x-scroll">
                        {/* Upload Button */}
                        <div className="relative mr-2 grid place-items-center rounded-md bg-blue-100 min-w-20 h-20">
                           <p
                              onClick={() => fileRef.current?.click()}
                              className="cursor-pointer w-fit bg-blue-200 rounded-md p-2.5 hover:bg-blue-300 transition-colors"
                           >
                              <Camera className="animate-pulse" color="blue" />
                           </p>
                           <Input
                              type="file"
                              multiple
                              ref={fileRef}
                              accept="image/png, image/jpeg, image/webp"
                              className="hidden"
                              onChange={(e) => {
                                 if (!e.target.files) return;

                                 const arrOfFiles = Array.from(e.target.files);

                                 // Validate Dimensions for NEW files only
                                 Promise.all(
                                    arrOfFiles.map(
                                       (file) =>
                                          new Promise<File | null>((resolve) => {
                                             const img = new window.Image();
                                             const objectUrl = URL.createObjectURL(file);

                                             img.onload = () => {
                                                if (img.width >= 800 && img.height >= 600) {
                                                   resolve(file);
                                                } else {
                                                   toastError({
                                                      message: ` ${file.name} must be at least 800x600px`,
                                                   });
                                                   resolve(null);
                                                }
                                                URL.revokeObjectURL(objectUrl);
                                             };

                                             img.onerror = () => {
                                                toastError({
                                                   message: `Failed to load ${file.name}`,
                                                });
                                                URL.revokeObjectURL(objectUrl);
                                                resolve(null);
                                             };

                                             img.src = objectUrl;
                                          })
                                    )
                                 ).then((validatedFiles) => {
                                    const validFiles = validatedFiles.filter(
                                       (f): f is File => f !== null
                                    );

                                    if (validFiles.length > 0) {
                                       // Append new files to existing mixed array
                                       const currentVal = field.value || [];
                                       field.onChange([...currentVal, ...validFiles]);
                                    }
                                    e.target.value = "";
                                 });
                              }}
                           />
                        </div>

                        {/* Draggable List */}
                        <DndContext
                           collisionDetection={closestCorners}
                           onDragEnd={handleOnDragEnd}
                           onDragStart={(event: DragStartEvent) =>
                             setActiveId(event.active.id as string)
                           }
                           onDragCancel={() => setActiveId(null)}
                           sensors={sensors}
                        >
                           {images.length > 0 && (
                              <div className="flex flex-shrink-0 gap-2 overflow-x-scroll">
                                 <SortableContext
                                    //Items must be the IDs (URL string or Filename)
                                    items={images.map((img) => img.id)}
                                    strategy={horizontalListSortingStrategy}
                                 >
                                    { images.map((img) => (
                                       <SortableImages
                                          key={img.id}
                                          preview={img.preview}
                                          id={img.id}
                                          adsId={adsId!}
                                          fetchUrl={fetchUrl}
                                          removeImage={(id) => removeImage(id)}
                                       />
                                    )) }
                                 </SortableContext>
                                 
                                 <DragOverlay>
                                    { activeId ? (
                                       <div className="relative rounded-md group min-w-20 h-20">
                                          <Image
                                             src={
                                                images.find((img) => img.id === activeId)
                                                   ?.preview || ""
                                             }
                                             alt="preview"
                                             fill
                                             className="object-cover bg-blue-200"
                                          />
                                       </div>
                                    ) : null}
                                 </DragOverlay>
                              </div>
                           )}
                        </DndContext>
                     </section>
                  </div>
               </div>
            );
         }}
      />
   );
}