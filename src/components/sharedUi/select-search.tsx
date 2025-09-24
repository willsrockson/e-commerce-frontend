/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

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
import { Controller, Control, RegisterOptions } from 'react-hook-form'


interface ISelectType{
   name: string
   control: Control<any>
   rules?: RegisterOptions<any, string>
   labelText: string;
   placeholder: string;
   items: string[];
   className?: string
}



export default function SelectSearch(
    {
      name,  
      labelText,
      control,
      rules,
      items,
      className,
      placeholder
    }: ISelectType
) {

   const [open, setOpen] = React.useState(false)
  
    return (
        <Controller 
          name={name}
          rules={rules}
          control={control}
          render={({field})=>(
            
                 <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={`h-11 justify-between ${className}`}
                        >
                        {field.value
                            ? field.value
                            : `${placeholder}` }
                        <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="PopoverContent">
                        <Command>
                        <CommandInput placeholder={`Search ${labelText}...`} className="h-9" />
                        <CommandList>
                            <CommandEmpty>{`No ${labelText} found.`}</CommandEmpty>
                            <CommandGroup>
                            {items.map((framework, index) => (
                                <CommandItem
                                key={index}
                                value={framework}
                                onSelect={(currentValue) => {
                                    field.onChange(currentValue === field.value ? "" : currentValue)
                                    setOpen(false)
                                }}
                                >
                                {framework}
                                <Check
                                    className={cn(
                                    "ml-auto",
                                    field.value === framework ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </CommandList>
                        </Command>
                    </PopoverContent>
                    </Popover>
          
          )}
        />
    )

}
