import { toast } from "sonner";

export const toastError = ({ message = "" }) => {
    toast.error(message, {
        style: { backgroundColor: "#fecaca", color: 'red', fontStyle: 'inherit' },
    });
};

export const toastSuccess = ({ message = "" }) => {
    toast.success(message, {
        style: { backgroundColor: "#bbf7d0", color: "green", fontStyle: 'inherit' }, //#22C55E  
    });
};

