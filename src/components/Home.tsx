"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import NewPosts from "@/components/homepage-trending-new-post/NewPosts";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import CategoryPage from "@/components/CategoryPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteMaxWidth, tabsCustomColor } from "@/lib/constants";
import SearchWithAutocomplete from "@/components/sharedUi/SearchWithAutocomplete";
const { handleEmailVerification } = await import("@/lib/helpers/email-verification");

export default function HomePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("verify-email");

  useEffect(() => {
    if (!token) return;
    handleEmailVerification(token);
  }, [token]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)]">
      <div
        className={`flex flex-col ${siteMaxWidth} w-full h-[fit-content] m-auto rounded-br-xl rounded-bl-xl mb-20 px-4`}
      >
        {/* Hero section */}
        <div className={`w-full ${siteMaxWidth} py-8 space-y-10`}>
          <section className="relative rounded-xl bg-gradient-to-r from-primary/90 to-primary shadow-lg">
            <div className="absolute rounded-xl inset-0 bg-hero bg-cover bg-center opacity-60"></div>
            <div className="relative z-10 px-6 py-16 md:py-24 md:px-12 lg:py-32 lg:px-16 text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-md">
                  Find everything you need at Tonmame Market
                </h1>
                <p className="text-lg md:text-xl mb-8 text-white/90 drop-shadow-sm">
                  Buy and sell items safely and easily in your local community
                </p>

                <div className="relative max-w-xl mx-auto">
                  <SearchWithAutocomplete 
                    placeholder="What are you looking for?"
                    className="shadow-xl bg-white rounded-md text-gray-900"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Categories</h2>
            </div>
            <CategoryPage />
          </section>

          {/* Trending items */}
          <section>
            <Tabs defaultValue="newpost">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger className={tabsCustomColor} value="newpost">
                    New posts
                  </TabsTrigger>
                  <TabsTrigger className={tabsCustomColor} value="trending">
                    Trending
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="newpost" className="mt-0 pb-5">
                <NewPosts />
              </TabsContent>
              <TabsContent value="trending" className="mt-0 pb-5">
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p>No trending items yet</p>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          <section className="bg-[#E7ECF3] rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              Have something to sell?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands of sellers on Tonmame Market and reach potential
              buyers in your area today.
            </p>
            <Link href="/post-ads">
              <Button size="lg" className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer">
                Post Your Item
              </Button>
            </Link>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}