import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Electronics from './CategoryForHomePage/Electronics'
import { siteMaxWidth, tabsCustomColor } from "@/lib/constants"




export default function CategoryPage() {
   
    return (

        <div>

            <div className="w-full">

                <section className={`max-w-[${siteMaxWidth}] mx-auto py-5`}>

                    <Tabs defaultValue="electronics">
                        <TabsList className={`max-w-[${siteMaxWidth}] w-full sm:w-fit flex justify-start overflow-x-auto mb-6`}>
                            <TabsTrigger className={tabsCustomColor} value="electronics">Electronics</TabsTrigger>
                            <TabsTrigger className={tabsCustomColor} value="vehicles">Vehicles</TabsTrigger>
                            <TabsTrigger className={tabsCustomColor} value="property">Property</TabsTrigger>
                            <TabsTrigger className={tabsCustomColor} value="health&beauty">Health & Beauty</TabsTrigger>
                            <TabsTrigger className={tabsCustomColor} value="home_essentials">Home Essentials</TabsTrigger>
                            <TabsTrigger className={tabsCustomColor} value="fashion">Fashion</TabsTrigger>
                        </TabsList>
                        <TabsContent value="electronics">
                            <Electronics />
                        </TabsContent>
                        <TabsContent value="verification"> 2  </TabsContent>
                        <TabsContent value="password"> 3 </TabsContent>
                        <TabsContent value="delete"> 4 </TabsContent>
                        <TabsContent value="listing"> 5 </TabsContent>

                    </Tabs>

               </section>
            </div>
        </div>
    )
}
