'use client'
import { authStore } from '@/store/authStore';
import React, { useEffect } from 'react'

type ResponseType = {
    data: [{full_name: string; image_url: string}];
    isValidUser: boolean;
}

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
    const setAuthStateFromStore = authStore(state => state.setAuthState );
    const setFallBackNameFromStore = authStore(state => state.setAvatarFallback);
    const setAvatarFromStore = authStore(state => state.setAvatarUrl);

   useEffect(() => {
        
       const fetchAndSetAuth = async () => {
            try {
                const res = await fetch('/api/user/recreate-session', {
                method: "GET",
                credentials: 'include'
                });

                if (!res.ok) return;
                const data = await res.json() as ResponseType;

                setAuthStateFromStore(data.isValidUser);
                setFallBackNameFromStore(data.data[0].full_name.split(/\s+/)[0]);
                setAvatarFromStore(data.data[0].image_url);
            } catch (error) {
                if(error instanceof Error){
                    console.error("Failed to restore session: ", error.message);
                    return;
                }
                console.log("Failed to restore session: ", String(error));
                return;
            }
         };
               
         const restateAuthState = async()=>{
             // Make sure this runs only on the client
             if (typeof window === "undefined") return;
             
              const session_storage = sessionStorage.getItem('auth')  
              if(session_storage){
                 const parsedSession = JSON.parse(session_storage);
                  if (!parsedSession.state.isAuthenticated || !parsedSession.state.avatarUrl || !parsedSession.state.avatarFallback){     
                      await fetchAndSetAuth();
                  }  
         
              }else{
                 await fetchAndSetAuth();    
              }
              
         }


     restateAuthState()


  }, [setAuthStateFromStore, setAvatarFromStore, setFallBackNameFromStore]);
  return (
    <main>{ children }</main>
  )
}
