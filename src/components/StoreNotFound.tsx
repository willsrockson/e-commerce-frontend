"use client";

import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SearchWithAutocomplete from "@/components/sharedUi/SearchWithAutocomplete";

export default function StoreNotFound({ slug }: { slug: string }) {

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      
      {/* 1. Visual Cues: Broken Store Icon */}
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Store size={40} className="text-gray-400 opacity-50" />
      </div>

      {/* 2. Clear Message */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Store not found
      </h1>
      <p className="text-gray-500 max-w-md mb-8">
        We couldn&apos;t find a shop named <span className="font-mono bg-gray-100 px-1 rounded text-gray-700">{slug}</span>. 
        It may have been renamed or deleted.
      </p>

      {/* 3. The "Hook" - Smart Search Bar */}
      <div className="w-full max-w-sm mb-8">
        <SearchWithAutocomplete 
            placeholder="Search for iPhones, Laptops..." 
            className="w-full"
        />
      </div>

      {/* 4. Action Buttons */}
      <div className="flex gap-3">
        <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                Browse Categories
            </Button>
        </Link>
      </div>

    </div>
  );
}

























// "use client";

// import { Store, Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function StoreNotFound({ slug }: { slug: string }) {
//   const router = useRouter();

//   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const query = formData.get("query");
//     if (query) router.push(`/search?q=${query}`);
//   };

//   return (
//     <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      
//       {/* 1. Visual Cues: Broken Store Icon */}
//       <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//         <Store size={40} className="text-gray-400 opacity-50" />
//         {/* Absolute positioned X icon to show 'broken' */}
//         {/* <div className="absolute bg-white rounded-full p-1 border border-white">
//             <span className="text-xl">🤔</span> 
//         </div> */}
//       </div>

//       {/* 2. Clear Message */}
//       <h1 className="text-2xl font-bold text-gray-900 mb-2">
//         Store not found
//       </h1>
//       <p className="text-gray-500 max-w-md mb-8">
//         We couldn&apos;t find a shop named <span className="font-mono bg-gray-100 px-1 rounded text-gray-700">{slug}</span>. 
//         It may have been renamed or deleted.
//       </p>

//       {/* 3. The "Hook" - Search Bar */}
//       <div className="w-full max-w-sm mb-8">
//         <form onSubmit={handleSearch} className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <Input 
//                 name="query"
//                 placeholder="Search for iPhones, Laptops..." 
//                 className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
//             />
//         </form>
//       </div>

//       {/* 4. Action Buttons */}
//       <div className="flex gap-3">
        
//         <Link href="/">
//             <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
//                 Browse Categories
//             </Button>
//         </Link>
//       </div>

//     </div>
//   );
// }