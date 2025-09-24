"use client"

import AdminSideNavBar from "@/components/AdminDashboard/AdminSideNavBar";
import PhotoVerificationCenter from "@/components/AdminDashboard/PhotoVerificationCenter";

export default function Page() {
    return(
        <div className="w-full h-screen grid grid-cols-[1fr_6fr]">
            <AdminSideNavBar />
            <div className="bg-[#EBF1F4] w-full h-screen">
                <PhotoVerificationCenter />
            </div>
        </div>
    )
}
