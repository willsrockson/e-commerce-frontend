"use client"
import UnverifiedUsers from "@/components/AdminDashboard/UnverifiedUsers";
import AdminSideNavBar from "@/components/AdminDashboard/AdminSideNavBar";


export default function VerifyUsers() {

    return (
        <div className="w-full h-screen grid grid-cols-[1fr_6fr]">
            <AdminSideNavBar />
            <div className="bg-[#EBF1F4] w-full h-screen">
             <UnverifiedUsers/>
             </div>
        </div>


    )
}
