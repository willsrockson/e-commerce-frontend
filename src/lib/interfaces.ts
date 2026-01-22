export interface MobilePhonesAdsFullType {
  adsId: string;
  region: string;
  town: string;
  description: string;
  title: string;
  slug: string;
  mainSlug: string;
  subSlug: string;
  images: string[]; // URLs of ad images
  color: string;
  storage: string;
  ram: string;
  exchangePossible: string;
  price: number; // could be number if you store numeric prices
  brand: string;
  model: string;
  negotiable: string;
  condition: string;
  screenSize: string;
  batterySize: string;
  batteryHealth: string | null; // nullable
  accessories: string[];
  createdAt: string | Date; // ISO timestamp (use Date if you’ll parse it)
  avatarImageUrl: string;
  storeName: string;
  fullName: string;
  storeNameSlug: string;
  openHours: string;
  phonePrimary: string;
  phoneSecondary: string;
  idVerified: "unverified" | "verified" | "processing";
  userCreatedAt: string | Date; // ISO timestamp
}

export interface MobilePhonesHalfType {
  adsId: string;
  firstImage: string;
  price: number;
  title: string;
  slug: string;
  mainSlug: string;
  subSlug: string;
  town: string;
  description: string;
  region: string;
  idVerified: "unverified" | "verified" | "processing";
  condition: string;
  createdAt: string;
}

export type MainCategoryType = "" | "Electronics" | "Vehicles" | "Properties";

// export type UpdateProfile = {
//     storename:string;
//     fullname:string;
//     phone:string;
//     phone2:string;
//     storeaddress: string;
// }

// Types for getAllAdvertsPostedByMe starts here

export interface IPublishedAdsByME {
  adsId: string;
  firstImage: string;
  price: string;
  description: string;
  title: string;
  region: string;
  town: string;
  deactivated: boolean;
  mainCategory: string;
  subCategory: string;
  slug: string;
  mainSlug: string;
  subSlug: string;
  createdAt: string;
  condition: string;
}

//export type IPublishedAdsByME = AdsResponse;

// Types for getAllAdvertsPostedByMe Ends here

//saved ad
export interface ISavedAd {
  savedId: string;
  adsId: string | null;
  subCategory: string;
  slug: string;
  title: string;
  phonePrimary: string;
  location: string;
  condition: string;
  imageUrl: string;
  price: number;
}

export interface NewPostType {
  adsId: string;
  firstImage: string;
  price: number;
  title: string;
  town: string;
  slug: string;
  mainSlug: string;
  subSlug: string;
  mainCategory: string;
  subCategory: string;
  description: string;
  region: string;
  idVerified: string;
  condition: string;
  createdAt: string;
}

type ErrorFormat = {
  code: string;
  message: string;
};
export interface BackendResponseType<T = string> {
  success: boolean;
  message: string;
  data?: T;
  error: ErrorFormat;
}

export type VerificationStatus = "unverified" | "verified";
export type IdVerificationStatus = "unverified" | "processing" | "verified";

export interface UserProfileData {
  storeName: string | null;
  fullName: string;
  email: string;
  storeAddress: string | null;
  storeDescription: string | null;
  openHours: string;
  phonePrimary: string | null;
  phoneSecondary: string | null;
  emailVerified: VerificationStatus;
  idVerified: IdVerificationStatus;
  phonePrimaryVerified: VerificationStatus;
  phoneSecondaryVerified: VerificationStatus;
  userCreatedAt: string | Date;
  avatarId: string | null;
  imageUrl: string | null;
  updatedAt: string | null;
}
