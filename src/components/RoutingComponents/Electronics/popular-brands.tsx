import Image from "next/image";

interface IPopularBrand {
  setColor: (brand: string) => void;
  watchBrand: string;
  items: { imgUrl: string; brand: string }[];
}

//bg-[#C9DAFF]

export default function PopularBrands({
  setColor,
  watchBrand,
  items,
}: IPopularBrand) {
  const defaultBgColor = "bg-wite";
  return (
    <div className="flex space-x-4 min-w-max">
      {items.map((data) => (
        <div
          key={data.brand}
          className={`${watchBrand === data.brand ? "bg-[#d6e1f9]" : defaultBgColor} w-24 h-12 hover:bg-[#d6e1f9] flex items-center border justify-center rounded-md p-4 cursor-pointer`}
          onClick={() => setColor(data.brand)}
        >
          <div className="relative w-20 h-9">
            <Image
              src={data.imgUrl}
              alt={data.brand}
              fill
              className="object-contain"
              sizes="80px"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
