import { 
         AppleModels,
         SamsungModels
      } 
from "./electronics/mobilephones/phoneModels.js"


export const categories = [
      {
        mainCategory:"Electronics",
        subCategory: [
             {
                subName: "Mobile Phones",
                globalMobilePhoneStorage: ["1TB", "512GB", "256GB", "128GB", "64GB", "32GB", "16GB", "8GB"],
                globalMobilePhoneColors: ["Black", "White", "Silver", "Gray", "Blue", "Gold", "Rose Gold", "Red", "Green", "Purple", "Pink", "Yellow", "Orange", "Bronze", "Graphite", "Space Gray", "Titanium", "Copper", "Sage", "Cream"],
                content:[
                          { brand:"Apple", models: AppleModels },
                          { brand:"Samsung", models: SamsungModels }
                        ]

             },

             {
                subName: "Laptops",
                content: []
                
             }
        ] 
      },

      // ---  Electronics ends here ---


      // {
      //   mainCategory:"Vehicles"
      // }

];