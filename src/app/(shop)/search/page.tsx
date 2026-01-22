import BeatLoaderUI from "@/components/loaders/BeatLoader";
import SearchContent from "@/components/SearchContent";
import { Suspense } from "react";

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center">
         <BeatLoaderUI color={"blue"} size={12} />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}