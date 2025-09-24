import LoginUi from "@/components/LoginUI";
import SignUpUi from "@/components/SignUpUi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image";
export default function LoginPage() {
    
    return (
        <div className="w-full h-[calc(100vh-4rem)]">
            <div className="w-full max-w-[1400px] m-auto px-7 pt-10 lg:gap-12 grid grid-cols-1 lg:grid-cols-[1fr_1fr] bg-white-200 place-content-start">

                <div className="relative hidden lg:block w-full min-h-[600px] rounded-lg overflow-hidden">
                      <Image 
                        src={'/images/login.webp'}
                        alt="login"
                        fill
                        priority
                        className="object-cover rounded-lg"
                      />
                </div>
                
                <div className="flex justify-center lg:justify-start pt-10">
                    <Tabs defaultValue="login" className="w-full max-w-[400px]">
                    <TabsList className="w-full">
                        <TabsTrigger className="w-full " value="login">Login to Tonmame</TabsTrigger>
                        <TabsTrigger className="w-full " value="signup">Create Account</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login"> <LoginUi /> </TabsContent>
                    <TabsContent value="signup"> <SignUpUi /> </TabsContent>
                  </Tabs>
                </div>

            </div>
        </div>
    )
}
