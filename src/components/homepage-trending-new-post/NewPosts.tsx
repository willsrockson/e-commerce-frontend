"use client";
import SkeletonCard from "@/components/loaders/SkeletonCard";
import useSWR from "swr";
import ProductsCard from "@/components/ProductsCard";
import { NewPostType } from "@/lib/interfaces";

export default function NewPosts() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR<NewPostType[]>(
    `/api/homepage/new/posts`,
    fetcher,
  );

  return (
    <>
      {isLoading || data?.length === 0 || error ? (
        <SkeletonCard />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 w-full ">
          { data?.map((ad) => (
            <ProductsCard
              key={ad.adsId}
              id={`/${ad.subSlug}/${ad.slug}`}
              adsId={ad.adsId}
              firstImageUrl={ad.firstImage}
              price={ad.price}
              title={ad.title}
              location={ad.region + ", " + ad.town}
              condition={ad.condition}
              createdAt={ad.createdAt}
              isVerifiedStore={ad.idVerified}
              description={ad.description}
            />
          ))}
        </div>
      )}
    </>
  );
}
