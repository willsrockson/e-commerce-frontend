"use client"
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import NewPosts from "@/components/HomePageTrendAndNewPost/NewPosts";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ArrowUpRight} from "lucide-react";
import CategoryPage from "@/components/CategoryPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { debounce } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { siteMaxWidth, tabsCustomColor } from "@/lib/constants";
const { handleEmailVerification } = await import("@/lib/helpers/email.links"); // Lazy loading this helper function


export default function HomePage() {

    const search = useSearchParams()

    const router = useRouter();
    
    const [finalSearchResults, setFinalSearchResults] = useState([])
    const searchRef = useRef<HTMLInputElement>(null)
    const [searchData, setSearchData] = useState("")

    
      const searchFieldDebounce = useMemo(
                () => debounce((newData) => {
                    setSearchData(()=> newData )
                  }, 600),[] 
              );
      
    
    const query = new URLSearchParams({});
    
    const triggerSearchResults =(category: string)=>{
          query.set('search', searchData);
          router.push(category + `?${query}`);
    }

    const token = search.get("verify-email");

    useEffect(() => {
        if (!token) return;
        console.log("Token Function called.....");
        handleEmailVerification(token);
    }, [token]); 
   
    //Search item Effect
    useEffect(()=>{
         
        if(!searchData) return;

        const controller = new AbortController();


        console.log("Search Input: ", searchData)

        const searchResults = async()=>{
            
            try {
                const response = await fetch("/api/search/find-product", {
                  method: 'POST',
                  credentials: 'include',
                  headers: { "Content-Type": "application/json", },
                  body: JSON.stringify({ search: searchData }),
                  signal: controller.signal   
                });

                if (!response.ok) throw new Error('Network response was not ok');

               const result = await response.json();

               console.log(result)
               setFinalSearchResults(result); 
                
            } catch (error: unknown) {
                if(error){
                  setFinalSearchResults([]);
                }
                setFinalSearchResults([]);
                
            }      
            
        }
         
        searchResults()
        return () => {
            controller.abort(); // abort fetch on cleanup
          };
         
    },[searchData])

    return (
        <div className="w-full min-h-[calc(100vh-4rem)]">
            <div className={`flex flex-col max-w-[${siteMaxWidth}] w-full h-[fit-content] m-auto rounded-br-xl rounded-bl-xl mb-20 px-4`}>

                {/* Hero section*/}
                <div className={`w-full max-w-[${siteMaxWidth}] py-8 space-y-10`}>
                    <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/90 to-primary">
                        <div className="absolute inset-0 bg-hero bg-cover bg-center opacity-60"></div>
                        <div className="relative z-10 px-6 py-16 md:py-24 md:px-12 lg:py-32 lg:px-16 text-white">
                            <div className="max-w-3xl mx-auto text-center">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                    Find everything you need at Tonmame Market
                                </h1>
                                <p className="text-lg md:text-xl mb-8 text-white/90">
                                    Buy and sell items safely and easily in your local community
                                </p>

                                <div className="relative max-w-xl mx-auto">
                                    <div className="flex relative">
                                        <Input
                                            placeholder="What are you looking for?"
                                            className="w-full py-6 pl-5 pr-12 text-gray-900 bg-white"
                                            ref={searchRef}
                                            type="text"
                                            onChange={()=> searchFieldDebounce( searchRef.current ? searchRef.current.value : '')}
                                        />
                                        {/* <Button className="rounded-l-none px-3 md:px-6 py-6 ">
                                            <Search className="h-5 w-5 sm:hidden md:mr-2" />
                                            <span className="hidden md:block">Search</span>
                                        </Button> */}
                                    </div>
                                     
                                     {/* Search result */}
                                    { (finalSearchResults.length > 0 && searchData) && ( 
                                        <div className={`w-full flex justify-start space-x-2 max-h-80 overflow-y-scroll space-y-2 border-gray-400 bg-white shadow-md text-black absolute rounded-lg mt-1`}>
                                          <ul className="flex flex-col w-full">
                                            {  finalSearchResults.map((category, index)=>(
                                                 <li onClick={()=> triggerSearchResults(category) } className="bg-white hover:bg-[#EEEEEE] cursor-pointer text-left px-5 py-2" key={index}>
                                                    <span className="flex items-center justify-between"> <span>{searchData} in <span className="text-purple-600">{category}</span></span>   <ArrowUpRight size={16}/></span>
                                                </li>
                                              ))
                                            
                                            }
                                          </ul>

                                        </div>) 
                                    }
                                </div>
                            </div>
                        </div>
                    </section>

                    {/*category tab*/}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Categories</h2>
                        </div>

                        <CategoryPage />
                    </section>


                    {/*Trending items*/}
                    <section>
                        <Tabs defaultValue="newpost">
                            <div className="flex justify-between items-center mb-4">
                                <TabsList>
                                    <TabsTrigger className={tabsCustomColor} value="newpost">New posts</TabsTrigger>
                                    <TabsTrigger className={tabsCustomColor} value="trending">Trending</TabsTrigger>
                                </TabsList>
                                <Button variant="link" className="font-medium">
                                    View All
                                </Button>
                            </div>
                            <TabsContent value="newpost" className="mt-0 pb-5">
                                <NewPosts/>
                            </TabsContent>
                            <TabsContent value="trending" className="mt-0 pb-5">
                                <p>Nothing is here</p>
                            </TabsContent>
                        </Tabs>
                    </section>



                    {/* Call to Action */}
                    <section className="bg-[#E7ECF3] rounded-xl p-8 md:p-12 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            Have something to sell?
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Join thousands of sellers on Tonmame Market and reach potential buyers in your area.
                        </p>
                        <Link href="/postads">
                            <Button size="lg">
                                Post Your Item
                            </Button>
                        </Link>
                    </section>


                </div>



            </div>

           {/*  footer  */}
           <Footer />

        </div>
    );
}
