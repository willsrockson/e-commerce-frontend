'use client'
import { authStore } from '@/store/authStore';
import React, { useEffect } from 'react'

type ResponseType = {
    fullName: string; 
    imageUrl: string;
    success: boolean;
}

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
    const setAuthStateFromStore = authStore(state => state.setAuthState );
    const setFallBackNameFromStore = authStore(state => state.setAvatarFallback);
    const setAvatarFromStore = authStore(state => state.setAvatarUrl);

   useEffect(() => {
        
       const fetchAndSetAuth = async () => {
            try {
                const res = await fetch('/api/auth/session/recreate', {
                method: "GET",
                credentials: 'include'
                });

                if (!res.ok) return;
                const data = await res.json() as ResponseType;

                console.log(data);
                
                setAuthStateFromStore(data?.success);
                setFallBackNameFromStore(data?.fullName.split(/\s+/)[0]);
                setAvatarFromStore(data?.imageUrl);
            } catch (error) {
                if(error instanceof Error){
                    return;
                }
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
