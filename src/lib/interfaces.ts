export interface IMobilePhonesAdsFullType {
  ads_id: string;
  region: string;
  town: string;
  description: string;
  title: string;
  images: string[];              // URLs of ad images
  color: string;
  storage: string;
  ram: string;
  exchangePossible: string;
  price: number;                 // could be number if you store numeric prices
  brand: string;
  model: string;
  negotiable: string;
  condition: string;
  screenSize: string;
  batterySize: string;
  batteryHealth: string | null;  // nullable
  accessories: string[];
  createdAt: string | Date;              // ISO timestamp (use Date if you’ll parse it)
  avatarImageUrl: string;
  storename: string;
  fullname: string;
  phonePrimary: string;
  phoneSecondary: string;
  userIdVerificationStatus: string;
  userCreatedAt: string | Date;         // ISO timestamp
}


export interface IMobilePhonesHalfType {
    ads_id: string;
    firstImage: string;
    price: number;
    title: string;
    town: string;
    description: string;
    region: string;
    userIdVerificationStatus: string;
    condition: string;
    createdAt: string;
}


export type UpdateProfile = {
    storename:string;
    fullname:string;
    phone:string;
    phone2:string;
    storeaddress: string;
}



// Types for getAllAdvertsPostedByMe starts here

export interface IPublishedAdsByME {
  ads_id: string;
  firstImage: string;
  price: string;     
  description: string;
  title: string;
  region: string;
  town: string;
  deactivated: boolean;
  main_category: string;
  sub_category: string;
  createdAt: string;    
  condition: string;
}


//export type IPublishedAdsByME = AdsResponse;

// Types for getAllAdvertsPostedByMe Ends here



//saved ad
export interface ISavedAd {
  saved_id: string;
  ads_id: string | null;
  subCategory: string;
  title: string;
  phonePrimary: string;
  location: string;
  condition: string;
  imageUrl: string;
  price: number;
}

export interface NewPostType{
    ads_id: string;
    firstImage: string;
    price: number;
    title: string;
    town: string;
    mainCategory: string;
    subCategory: string;
    description: string;
    region: string;
    userIdVerificationStatus: string;
    condition: string;
    createdAt: string;
}