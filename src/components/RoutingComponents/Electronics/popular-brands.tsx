import Image from "next/image";

interface IPopularBrand {
  setColor: (brand: string) => void;
  watchBrand: string;
  items: { imgUrl: string; brand: string }[];
}

export default function PopularBrands({
  setColor,
  watchBrand,
  items,
}: IPopularBrand) {
  return (
    // Added 'scrollbar-hide' (you might need a plugin or custom css) for a cleaner scroll
    <div className="flex space-x-3 min-w-max pb-2 overflow-x-auto scrollbar-hide">
      {items.map((data) => {
        const isActive = watchBrand === data.brand;

        return (
          <div
            key={data.brand}
            onClick={() => setColor(data.brand)}
            className={`
              relative w-24 h-12 flex items-center justify-center rounded-xl border cursor-pointer
              transition-all duration-200 ease-in-out
              ${
                isActive
                  ? "bg-blue-50 border-blue-300 shadow-sm" // Active: Blue tint + Blue Border + Ring
                  : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md" // Inactive: Clean white + hover lift
              }
            `}
          >
            {/* Image Container */}
            <div className={`relative w-16 h-8 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
              <Image
                src={data.imgUrl}
                alt={data.brand}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}


























// import Image from "next/image";

// interface IPopularBrand {
//   setColor: (brand: string) => void;
//   watchBrand: string;
//   items: { imgUrl: string; brand: string }[];
// }

// //bg-[#C9DAFF]

// export default function PopularBrands({
//   setColor,
//   watchBrand,
//   items,
// }: IPopularBrand) {
//   const defaultBgColor = "bg-wite";
//   return (
//     <div className="flex space-x-4 min-w-max">
//       {items.map((data) => (
//         <div
//           key={data.brand}
//           className={`${watchBrand === data.brand ? "bg-[#d6e1f9]" : defaultBgColor} w-24 h-12 hover:bg-[#d6e1f9] flex items-center border justify-center rounded-md p-4 cursor-pointer`}
//           onClick={() => setColor(data.brand)}
//         >
//           <div className="relative w-20 h-9">
//             <Image
//               src={data.imgUrl}
//               alt={data.brand}
//               fill
//               className="object-contain"
//               sizes="80px"
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
