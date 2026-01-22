
export const tabsCustomColor = "data-[state=active]:bg-black data-[state=active]:text-white";
export const siteMaxWidth = "max-w-[1200px]";
export const GH_PHONE_REGEX = /^(023|024|025|026|027|028|050|053|054|055|056|057|059|020)\d{7}$/;
export const EMAIL_GHANA_PHONE_REGEX = /^(?:(023|024|025|026|027|028|050|053|054|055|056|057|059|020)\d{7}|[^\s@]+@[^\s@]+\.[^\s@]+)$/;
export const SIX_DIGIT_CODE_REGEX = /^\d{6}$/;
export const OPEN_HOURS_REGEX = /^([A-Za-z]{3})(?:\s*-\s*([A-Za-z]{3}))?\s*\((.+?)\s*-\s*(.+?)\)$/;


export const ID_VERIFICATION = {
    VERIFIED: "verified",
    UNVERIFIED: "unverified"
} as const

