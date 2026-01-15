import { toast } from "sonner";

export const toastError = ({ message = "" }) => {
    toast.error(message);
};

export const toastWarning = ({ message = "" }) => {
    toast.warning(message);
};

export const toastSuccess = ({ message = "" }) => {
    toast.success(message);
};

