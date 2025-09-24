import { toast } from 'react-toastify';

export const handleEmailVerification = async (verify_email: string | null) => { 
    try {
        if (!verify_email) {
            return;
        }

        const res = await fetch("/api/account/email/verification", {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({
                verify_email,
            }),
            headers: { "Content-Type": "application/json" },
        });

        const data: { successMessage?: string; errorMessage?: string } = await res.json();

        if (!res.ok) {
            console.log("Error" + data.errorMessage);
            toast.warning(data.errorMessage);
            return;
        }
        toast.success(data.successMessage);
        console.log("Success " + data.successMessage);
    } catch (error) {
        if (error instanceof Error) {
            return;
        }
        return;
    }
};
