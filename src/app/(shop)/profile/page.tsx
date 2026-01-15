import ProfileSettings from "@/components/user-profile/ProfileSettings";
import UpdatePassword from "@/components/user-profile/UpdatePassword";
import DeleteAccount from "@/components/user-profile/DeleteAccount";
//import VerifyAccount from "@/components/user-profile/VerifyAccount";
import ChangeEmail from "@/components/user-profile/ChangeEmail";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyAdsUi from "@/components/my-ads/AdsUi";
import { siteMaxWidth, tabsCustomColor } from "@/lib/constants";

//bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-300
export default async function Settings() {
  return (
    <div className="w-full min-h-dvh">
      <section className={`${siteMaxWidth} mx-auto py-10 px-4`}>
        <Tabs defaultValue="profile">
          <TabsList
            className={`${siteMaxWidth} w-full sm:w-fit flex justify-start overflow-x-auto mb-6 bg-white`}
          >
            <TabsTrigger className={tabsCustomColor} value="profile">
              Profile settings
            </TabsTrigger>
            {/* <TabsTrigger className={tabsCustomColor} value="verification">ID verification</TabsTrigger> */}
            <TabsTrigger className={tabsCustomColor} value="security">
              Security
            </TabsTrigger>
            <TabsTrigger className={tabsCustomColor} value="email">
              Change email
            </TabsTrigger>
            <TabsTrigger className={tabsCustomColor} value="delete">
              Delete account
            </TabsTrigger>
            <TabsTrigger className={tabsCustomColor} value="published_ads">
              Published ads
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            {" "}
            <ProfileSettings />{" "}
          </TabsContent>
          {/* <TabsContent value="verification"> <VerifyAccount /> </TabsContent> */}
          <TabsContent value="security">
            {" "}
            <UpdatePassword />{" "}
          </TabsContent>
          <TabsContent value="email">
            {" "}
            <ChangeEmail />{" "}
          </TabsContent>
          <TabsContent value="delete">
            {" "}
            <DeleteAccount />{" "}
          </TabsContent>
          <TabsContent value="published_ads">
            {" "}
            <MyAdsUi />{" "}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
