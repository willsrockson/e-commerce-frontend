/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Controller, Control, RegisterOptions, UseFormSetValue } from 'react-hook-form'
import { useState } from "react"

interface ICountAds{
     label: string;
     count: number;
}



interface ISelectType{
   name: string
   control: Control<any>
   rules?: RegisterOptions<any, string>
   labelText: string;
   placeholder: string;
   setValue: UseFormSetValue<any>;
   countedItems?: ICountAds[];
   className?: string
}



export default function SelectSearchWithAdsCount(
    {
      name,  
      labelText,
      control,
      rules,
      countedItems,
      setValue,
      className,
      placeholder
    }: ISelectType
) {

   const [open, setOpen] = useState(false)


    return (
        <Controller
            name={name}
            rules={rules}
            control={control}
            render={({ field }) => (
                <Popover
                    open={open}
                    onOpenChange={setOpen}
                >
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className={`h-11 justify-between ${className}`}
                        >
                            {field.value ? field.value : `${placeholder}`}
                            <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="PopoverContent">
                        <Command>
                            <CommandInput
                                placeholder={`Search ${labelText}...`}
                                className="h-9"
                            />
                            <CommandList>
                                <CommandEmpty>{`No ${labelText} found.`}</CommandEmpty>
                                <CommandGroup>
                                    { countedItems?.map((item, index) =>{
                                           return (
                                                <CommandItem
                                                disabled={Number(item.count) === 0}
                                                key={index}
                                                value={item.label}
                                                onSelect={(currentValue) => {
                                                    const fieldName = field.name;
                                                    if(fieldName === "region"){
                                                        setValue('town', '');
                                                    }else if(fieldName === "brand"){ 
                                                       setValue('model', '');
                                                    }else if( fieldName === 'main_category'){
                                                        setValue('sub_category', '');
                                                    }

                                                    field.onChange(
                                                        currentValue === field.value ? "" : currentValue
                                                    );
                                                    setOpen(false);
                                                }}
                                            >
                                                {<>{item.label}<span className="text-gray-500 text-xs">{" ⋆ " + item.count +  (item.count <= 1 ? " ad" : " ads")}</span></>}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        field.value === item.label
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                            )

                                    })}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            )}
        />
    );

}
        

