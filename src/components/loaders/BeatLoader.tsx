"use client"
import { BeatLoader } from "react-spinners";

export default function BeatLoaderUI({ color, size, className = 'w-full max-w-7xl m-auto mb-6 flex justify-center pt-4' }: { className?: string; color: string; size?: number; }) {
    //w-full max-w-7xl m-auto mb-6 flex justify-center pt-4
    return (
        <div className={`${className}`}>

            <BeatLoader
                size={size ?? 20 }
                color={color}
            />

        </div>
    )
}
