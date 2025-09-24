/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import { useEffect } from "react";
import { Control, Controller, RegisterOptions, useFormContext } from 'react-hook-form'

interface ISelectType{ 
 name: string;   
 control: Control<any>;
 rules?: RegisterOptions<any, string>;
 items: string[];
 className?: string;
}

export default function SelectOnly({ control ,rules, name, items, className}: ISelectType) {


   
    
  return (
      <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
              if (items?.length === 1){
                  field.onChange(items[0]);
              }
          });       
          return(
                <Select
                  name={name}
                  value={field.value}
                  onValueChange={field.onChange}
              >
                  <SelectTrigger size="default" className={`w-full ${className}`} >
                      <SelectValue placeholder={'Show all'} />
                  </SelectTrigger>
                  <SelectContent id={name} >
                      {
                        items?.map((item, index)=>(
                            <SelectItem key={index} value={item}>{item}</SelectItem>
                        ))
                      }
                  </SelectContent>
              </Select>
            )
          }
              
          }
      />
  );
}
