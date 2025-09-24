"use client";
import useSWR from "swr";
import ChangeNotVerifiedEmail from "./email/changeNotVerifiedEmail";
import ChangeVerifiedEmail from "./email/ChangeVerifiedEmail";
import BeatLoaderUI from "../loaders/BeatLoader";

enum EmailVerificationEnum{
    "Not Verified" = "Not Verified",
    "Verified" = "Verified"
}

interface IData{
    email_verification_status: string;
}

export default function ChangeEmail() {
    const fetcher = (url: URL) => fetch(url).then((res) => res.json());
    const { data, error, isLoading } = useSWR<IData[]>("/api/account/settings", fetcher);

    
    
    if(isLoading || error){
        return <BeatLoaderUI color="blue" size={10} />
    }
    
    return (
        <div className="w-full h-fit bg-[#ffff] flex justify-center px-4 py-10 rounded-lg">
            { data && data[0]?.email_verification_status === EmailVerificationEnum["Not Verified"] ? 
               <ChangeNotVerifiedEmail />
             :  
              <ChangeVerifiedEmail />
            }
        </div>
    );
}
