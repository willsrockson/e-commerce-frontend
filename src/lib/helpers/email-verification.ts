import { toast } from 'react-toastify';
import { BackendResponseType } from '../interfaces';
import { toastError } from '@/components/toasts/toasts';

export const handleEmailVerification = async (verify_email: string | null) => { 
    try {
        if (!verify_email) {
            return;
        }

        const res = await fetch("/api/user/email/verification", {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({
                verifyEmail: verify_email,
            }),
            headers: { "Content-Type": "application/json" },
        });

        const json = await res.json() as BackendResponseType;

        if (!res.ok) {
            toast.warning(json.error.message);
            return;
        }
        toast.success(json.message);
    } catch (error) {
       if (error instanceof Error) {
          if (error.name === "AbortError" || error.message.includes("Network")) {
             toastError({ message: "Connection timed out. Please check your internet." });
          } else {
             toastError({ message: "Something went wrong. Please try again later." });
          }
       }
       return;
    }
};
