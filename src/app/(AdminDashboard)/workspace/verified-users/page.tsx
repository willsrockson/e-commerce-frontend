"use client"
import AdminSideNavBar from "@/components/AdminDashboard/AdminSideNavBar";
import VerifiedSellers from "@/components/AdminDashboard/VerifiedSellers";

export default function VerifiedUsers() {
    return (
        <div className="w-full h-screen grid grid-cols-[1fr_6fr]">
            <AdminSideNavBar />
            <div className="bg-[#EBF1F4] w-full h-screen">
                <VerifiedSellers />
            </div>
        </div>
    )
}
