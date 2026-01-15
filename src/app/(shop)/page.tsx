import HomePage from "@/components/Home"
import BeatLoaderUI from "@/components/loaders/BeatLoader"
import { Suspense } from "react"

export default function page() {
  return (
    <div className="w-full h-full">
        <Suspense fallback={ <BeatLoaderUI 
            color="blue" 
            className="w-full h-dvh flex justify-center items-center" /> }>
             <HomePage/>
        </Suspense>
    </div>
  )
}
