"use client"

import dynamic from "next/dynamic"

// me = Main Electronics
type MainElectronicsType = {
    me_region: string;
    me_town: string;
    me_mainCategory: string;
    me_subCategory: string;
    me_description: string;
    me_title: string;
    me_files: File[];
}

//Dynamic imports of subs
const MobilePhonesSub = dynamic(()=> import('./Subs/MobilePhonesSub'))

const MainElectronics = ({ me_region, me_town, me_mainCategory , me_subCategory, 
               me_description, me_title, me_files  }: MainElectronicsType) => {
   
    function SubCategorySelection(subCategory: string) {
        switch (subCategory) {
            case "Mobile Phones": 
                return (
                    <MobilePhonesSub
                        takeRegion={me_region}
                        takeTown={me_town}
                        takeMainCategory={me_mainCategory}
                        takeSubCategory={me_subCategory}
                        takeFiles={me_files}
                        takeDescription={me_description}
                        takeTitle={me_title}
                    />
                );
            default:
                break;
        }
    }

  return (
    <div>
        {SubCategorySelection(me_subCategory)}
    </div>
  )
}

export default MainElectronics