import AdminSideNavBar from "@/components/AdminDashboard/AdminSideNavBar";
import VerificationRequests from "@/components/AdminDashboard/VerificationRequests";


export default function Requests() {

    return (
        <div className="w-full h-screen grid grid-cols-[1fr_6fr]">
            <AdminSideNavBar />
            <div className="bg-[#EBF1F4] w-full h-screen">
                <VerificationRequests />
            </div>
        </div>
    )
}
