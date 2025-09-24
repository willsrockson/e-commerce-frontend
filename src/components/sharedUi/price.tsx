/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UseFormRegister } from "react-hook-form";
import { Input } from "../ui/input";

interface IPrice {
    className?: string;
    placeholder?: string;
    name: string;
    register: UseFormRegister<any>
}

export default function PriceShared({ className, name, register, placeholder }: IPrice) {
    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                GHS
            </span>

            <Input
                type="text"
                autoComplete="off"
                inputMode="decimal"
                placeholder={placeholder}
                className={`pl-12 ${className}`}
                {...register(name, {
                    required: "This is required",
                    pattern: {
                        value: /^\d{1,3}(,\d{3})*$/,
                        message: "This input must be a valid number format.",
                    },
                })}
                onBeforeInput={(e: any) => {
                    if (!/[0-9,]/.test(e.data)) {
                        e.preventDefault(); // block letters, symbols, etc.
                    }
                }}
                onInput={(e: any) => {
                    const value = e.target.value.replace(/,/g, "");
                    if (!/^\d*$/.test(value)) return;

                    // format with commas
                    e.target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }}
            />
        </div>
    );
}
