import { siteMaxWidth } from '@/lib/constants'

export default function ShopSkeletonLoader() {
   return (
      <div
         className={`${siteMaxWidth} mx-auto px-4 py-6 min-h-[80vh] space-y-8 p-4 md:p-8 animate-pulse`}
      >
         <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 shrink-0" />

            <div className="space-y-3 w-full max-w-md text-center md:text-left">
               <div className="h-6 w-3/4 bg-gray-200 rounded mx-auto md:mx-0" />
               <div className="h-4 w-1/2 bg-gray-200 rounded mx-auto md:mx-0" />
               <div className="flex gap-2 justify-center md:justify-start mt-4">
                  <div className="h-8 w-24 bg-gray-200 rounded" />
                  <div className="h-8 w-24 bg-gray-200 rounded" />
               </div>
            </div>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
               <div
                  key={i}
                  className="space-y-3"
               >
                  <div className="aspect-square w-full bg-gray-200 rounded-xl" />
                  <div className="space-y-2">
                     <div className="h-4 w-full bg-gray-200 rounded" />
                     <div className="h-4 w-2/3 bg-gray-200 rounded" />
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
