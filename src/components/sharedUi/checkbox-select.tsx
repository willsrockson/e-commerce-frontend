/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ICheckBox{
    name: string;
    labelText: string;
    items: string[];
    control: Control<any>
}
import { Control, Controller } from "react-hook-form"
import { Checkbox } from "../ui/checkbox"
import  { truncateWords } from '@/lib/helpers/universal-functions'

export default function CheckBoxSelectShared({name, labelText, items, control}: ICheckBox) {

  return (
      <Controller
          name={name}
          control={control}
          render={({field}) => {

              const { value, onChange } = field;
              const current = value || [];
              const toggleOption = (item: string) => {
                  if (current.includes(item)) {
                      onChange(current.filter((v: string) => v !== item));
                  } else {
                      onChange([...current, item]);
                  }
              };
              return (
                  <Popover >
                      <PopoverTrigger asChild className="h-11 w-full">
                          <Button variant="outline" className="text-left line-clamp-2">
                            { value?.length > 0 ? (
                                truncateWords(
                                     value?.map((item: string)=> item ).join(', '),
                                     30
                                )
                            ) : truncateWords(labelText, 30)
                         }
                            </Button>
                      </PopoverTrigger>
                      <PopoverContent className="PopoverContent">
                          <div className="space-y-2 p-2">
                              {items.map((option, index) => (
                                  <label
                                      key={index}
                                      className="flex items-center gap-2 cursor-pointer"
                                  >
                                      <Checkbox
                                         checked={ (value && value?.length > 0 ) && value.includes(option) }
                                         onCheckedChange={()=> toggleOption(option) }
                                      />
                                      <span className="text-sm">{option}</span>
                                  </label>
                              ))}
                          </div>
                      </PopoverContent>
                  </Popover>
              );
          }}
      />
  );
}
