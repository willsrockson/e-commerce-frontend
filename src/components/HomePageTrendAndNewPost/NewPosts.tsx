"use client"
import SkeletonCard from "@/components/loaders/SkeletonCard";
import useSWR from "swr";
import ProductsCard from "@/components/products-card";
import {NewPostType} from "@/lib/interfaces";

const fetcher = (url: string) => fetch(url).then(res => res.json());
export default function NewPosts() {

    const {data, error, isLoading} = useSWR<NewPostType[]>(`/api/homepage/new/posts`, fetcher );

    if(isLoading || error) return <SkeletonCard />
    return <>
        {/* grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 w-full */}
        { isLoading || data?.length === 0 ? <SkeletonCard /> :
            (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full ">
                    {data?.map((post) =>
                        ( <ProductsCard 
                                  key={post.ads_id} 
                                  id={`/${post.subCategory.replace(/\s/g, "").toLowerCase()}/${post.ads_id}`}
                                  firstImageUrl={post.firstImage}
                                  price={post.price}
                                  title={post.title}
                                  location={post.region +", " + post.town}
                                  condition={post.condition}
                                  createdAt={post.createdAt}
                                  isVerifiedStore={post.userIdVerificationStatus}
                                  description={post.description}
                        />)
                    )}
                </div>

            )
        }
    </>
}
