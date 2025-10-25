import ProfileSettings from '@/components/UserProfile/ProfileSettings';
import UpdatePassword from "@/components/UserProfile/UpdatePassword";
import DeleteAccount from "@/components/UserProfile/DeleteAccount";
import VerifyAccount from "@/components/UserProfile/VerifyAccount";
import ChangeEmail from '@/components/UserProfile/ChangeEmail';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyAdsUi from "@/components/MyAds/my-ads-ui";
import { siteMaxWidth, tabsCustomColor } from '@/lib/constants';

export default async function Settings() {

    return (
         <div className="w-full min-h-dvh bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-300">

             <section className={`max-w-[${siteMaxWidth}] mx-auto py-10 px-4`}>

                 <Tabs defaultValue="profile" >
                     <TabsList className={`max-w-[${siteMaxWidth}] w-full sm:w-fit flex justify-start overflow-x-auto mb-6 bg-white`}>
                         <TabsTrigger className={tabsCustomColor} value="profile">Profile settings</TabsTrigger>
                         <TabsTrigger className={tabsCustomColor} value="verification">ID verification</TabsTrigger>
                         <TabsTrigger className={tabsCustomColor} value="security">Security</TabsTrigger>
                         <TabsTrigger className={tabsCustomColor} value="email">Change email</TabsTrigger>
                         <TabsTrigger className={tabsCustomColor} value="delete">Delete account</TabsTrigger>
                         <TabsTrigger className={tabsCustomColor} value="published_ads">Published ads</TabsTrigger>
                     </TabsList>
                     <TabsContent value="profile"> < ProfileSettings /> </TabsContent>
                     <TabsContent value="verification"> <VerifyAccount /> </TabsContent>
                     <TabsContent value="security"> <UpdatePassword/> </TabsContent>
                     <TabsContent value="email"> <ChangeEmail/> </TabsContent>
                     <TabsContent value="delete"> <DeleteAccount/> </TabsContent>
                     <TabsContent value="published_ads"> <MyAdsUi /> </TabsContent>

                 </Tabs>

             </section>
         </div>
    )
}
