"use client"
import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react';
import { FloatingLabelInput } from '../ui/floating-label-input';
import { FieldValues, Path, UseFormRegister } from 'react-hook-form';

interface PassFloat<T extends FieldValues>{
    className?: string;
    onFocus?: ()=> void;
    register: UseFormRegister<T>
    name: Path<T>
    label: string;
    requiredMessage?: string;
    minLength: number;
    minLenErrorMessage: string;
    confirmPassword?: boolean;
    takeConfirmPassword?: string
}

export default function FloatingPassword<T extends FieldValues>({label, minLength, confirmPassword = false, takeConfirmPassword = "", minLenErrorMessage, className, onFocus, register, name, requiredMessage = "Please enter a password"}: PassFloat<T>) {
    const [showPassword, setShowPassword] = useState(false);

    
  return (
      <div className="relative">
          <FloatingLabelInput
              id={label}
              label={label}
              type={showPassword ? "text" : "password"}
              className={`pr-10 ${className ?? ""}`}
              {...register(name, { required: requiredMessage, 
                minLength:{
                    value: minLength,
                    message: minLenErrorMessage
                },
                validate: (value) =>
                  confirmPassword ? ( value === takeConfirmPassword || "Password mismatch") : ( value !== takeConfirmPassword || "")
            })}
              onFocus={onFocus}
          />
          <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
          >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
      </div>
  );
}
