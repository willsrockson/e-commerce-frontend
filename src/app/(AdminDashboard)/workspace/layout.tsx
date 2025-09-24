import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Verify Users",
    description: "Verify users for Tonmame",
};

export default function VerifyUsersLayout({children}: Readonly<{ children: React.ReactNode }>) {

    return (

           <div className="w-full h-screen">

               <div className="w-full h-screen">

                   <div className="bg-[#EBF1F4] w-full h-screen">
                       {children}
                   </div>
               </div>

           </div>
    )

}
