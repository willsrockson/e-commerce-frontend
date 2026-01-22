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
   errorMessage: string;
   warningUi: JSX.Element;
};

export default function ImageUploader({
   control,
   name,
   min,
   max,
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
   const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
   return (
      <Controller
         control={control}
         name={name}
         rules={{
            required: "This is required",
            validate: (value) => (value.length >= min && value.length <= max) || errorMessage,
         }}
         defaultValue={[]}
         render={({ field }) => {
            useEffect(() => {
               if (!field.value) return;

               setImages((prev) => {
                  const existing = prev.filter((img) =>
                     field.value.some((f: File) => f.name === img.file.name)
                  );

                  const newOnes = field.value
                     .filter((f: File) => !existing.some((img) => img.file.name === f.name))
                     .map((f: File) => ({
                        file: f,
                        preview: URL.createObjectURL(f),
                     }));

                  return [...existing, ...newOnes];
               });
            }, [field.value]);

            useEffect(() => {
               return () => {
                  images.forEach((img) => URL.revokeObjectURL(img.preview));
               };
            }, []);

            //Determines the position of any images dragged to a certain position
            const handleOnDragEnd = (event: any) => {
               const { active, over } = event;
               if (!over || active.id === over.id) return;

               const oldIndex = images.findIndex((img) => img.file.name === active.id);
               const newIndex = images.findIndex((img) => img.file.name === over.id);

               const newImages = arrayMove(images, oldIndex, newIndex);
               setImages(newImages);
               field.onChange(arrayMove(field.value, oldIndex, newIndex));

               setActiveId(null); // reset
            };

            const removeImage = (fileToRemove: string | number) => {
               // Deletes the image from the Browser preview / ObjectURl before the component unmounts
               const imgToRemove = images.find((img) => img.file.name === fileToRemove);
               if (imgToRemove) {
                  URL.revokeObjectURL(imgToRemove.preview);
               }
               // Filters or removes the removed image from the array
               const newFiles = field.value.filter((file: File) => file.name !== fileToRemove);
               field.onChange(newFiles); // update RHF state
            };

            return (
               <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="w-full">
                     <Label className="block">Add photos</Label>
                     {warningUi}

                     <section className="flex justify-start overflow-x-auto">
                        <div className="relative mr-2 grid place-items-center rounded-md bg-blue-100 min-w-20 h-20">
                           <p
                              onClick={() => fileRef.current?.click()}
                              className="cursor-pointer w-fit bg-blue-200 rounded-md p-2.5"
                           >
                              {/* <CloudUpload color="blue" /> */}
                              <Camera
                                 className="animate-pulse"
                                 color="blue"
                              />
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
                                       if (field.value.length === 0) {
                                          field.onChange(validFiles);
                                       } else {
                                          field.onChange([...(field.value ?? []), ...validFiles]);
                                       }
                                    }
                                    e.target.value = "";
                                 });
                              }}
                           />
                        </div>

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
                              <div className="flex flex-shrink-0 gap-2 overflow-x-auto">
                                 <SortableContext
                                    items={images.map((img) => img.file.name)}
                                    strategy={horizontalListSortingStrategy}
                                 >
                                    {images.map((img) => (
                                       <SortableImages
                                          key={img.file.name}
                                          preview={img.preview}
                                          id={img.file.name}
                                          fetchUrl={""}
                                          adsId={""}
                                          removeImage={(fileName) => removeImage(fileName)}
                                       />
                                    ))}
                                 </SortableContext>
                                 <DragOverlay>
                                    {activeId ? (
                                       <div className="relative rounded-md group min-w-20 h-20">
                                          <Image
                                             src={
                                                images.find((img) => img.file.name === activeId)
                                                   ?.preview || ""
                                             }
                                             alt={`preview-${activeId}`}
                                             fill
                                             className="min-w-20 h-20 object-cover rounded-md bg-blue-200"
                                          />
                                          <button
                                             type="button"
                                             className="cursor-pointer absolute top-1 right-1 bg-black text-white text-xs rounded-full px-2 py-1 md:hidden group-hover:block group-active:block"
                                          >
                                             ×
                                          </button>
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
