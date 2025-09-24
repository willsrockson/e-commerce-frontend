"use client"

import { Input } from "@/components/ui/input"
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function LoginAdmin() {
     const [username, setUsername] = useState<string>("");
     const [password, setPassword] = useState<string>("");
     const [loading, setLoading] = useState<boolean>(false);
     const [errMsg, setErrMsg] = useState<string | null>(null);
     const router = useRouter();


     const handleSubmit = async ()=>{
         if(!username || !password){
             return setErrMsg("Fields cannot be empty!");
         }
         if(password.length < 8 ) {
             return setErrMsg("Password must be at least 8 characters!");
         }

          setLoading(true);
         const res = await fetch("/api/workspace/users/login", {
             method: "POST",
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({username, password}),
         })
         const data = await res.json();
         if(!res.ok){
             setLoading(false);
           setErrMsg(data.errorMessage);
         }
         if(res.ok){
             setLoading(false);
             router.push("/workspace");
             toast.success("Success", {
                 style: {backgroundColor: "#AEEA94"},
                 description: `${data?.message}`
             })
         }
     }


    return (
        <div className="w-full h-screen flex flex-col items-center justify-center">

            <div className="max-w-md w-full  flex flex-col gap-4 rounded-lg shadow-md px-10 py-8 bg-[#ffff]">
                <div>
                    <p className="font-bold text-center">ADMIN PANEL</p>
                </div>
               <div>
                   <label htmlFor="email">Username</label>
                   <Input placeholder="Enter your admin username"
                      type="text"
                      onFocus={()=> setErrMsg(null)}
                      value={username}
                      onChange={(e)=>setUsername(e.target.value)}
                   />
               </div>

                <div>
                    <label htmlFor="email">Password</label>
                    <Input placeholder="Enter your admin password"
                    type="password"
                    onFocus={()=> setErrMsg(null)}
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <Button disabled={loading} onClick={handleSubmit} >{ loading ? "Logging in..." : 'Login'}</Button>
                    <span className="text-red-500 my-2 text-sm">{ errMsg }</span>
                </div>


            </div>


        </div>
    )
}
