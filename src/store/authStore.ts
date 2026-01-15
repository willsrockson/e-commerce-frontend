import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AuthState {
    isAuthenticated: boolean;
    avatarUrl: string | null;
    avatarFallback: string;
    setAuthState: (fromServer: boolean)=> void;
    setAvatarUrl: (urlFromServer: string) => void;
    setAvatarFallback: (nameFromServer: string) => void;

}


export const authStore = create<AuthState>()(persist(
    (set)=> ({
        isAuthenticated: false,
        avatarUrl: '',
        avatarFallback: 'AV',
        setAuthState: (fromServer: boolean)=> set(()=>({ isAuthenticated: fromServer })),
        setAvatarUrl: (urlFromServer: string | null ) => set(()=>({ avatarUrl: urlFromServer })),
        setAvatarFallback: (nameFromServer: string) => set(()=>({ avatarFallback: nameFromServer })),
    }),
    {
        name:'auth',
        storage: createJSONStorage(() => sessionStorage),

    },
));





// (set)=>({
//     isAuthenticated: false,
//     avatarUrl: '',
//     avatarFallback: 'AV',
//     setAuthState: (fromServer: boolean)=> set(()=>({ isAuthenticated: fromServer })), // responsible for changing the Ui when a user log in
//     setAvatarUrl: (urlFromServer: string | null ) => set(()=>({ avatarUrl: urlFromServer })), // set image when user log in
//     setAvatarFallback: (nameFromServer: string) => set(()=>({ avatarFallback: nameFromServer })), // sets profile pic name when image isn't available
// })