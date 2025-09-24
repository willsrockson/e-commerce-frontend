 
const categorySchema = [
      {
        mainCategory:"Electronics",
        subCategory: [
             {
                subName: "Mobile Phones",
                fields:[
                         { brand:"Apple", models: [] },
                         { brand:"Samsung", models: [] }
                       ]

             },

             {
                subName: "Laptops",
                
             }
        ] 
      },


      {
        mainCategory:"Fashion"
      }

]


















export const x = [
    {
        categoriesList: {catId: 1, name: "Mobile Phones"},
        brands: [
            {
                brandId: 1, name: "Apple", model: [
                    {modelId: 1, modelName: "iPhone"},
                    {modelId: 2, modelName: "iPhone 3G"},
                    {modelId: 3, modelName: "iPhone 3GS"},
                    {modelId: 4, modelName: "iPhone 4"},
                    {modelId: 5, modelName: "iPhone 4S"},
                    {modelId: 6, modelName: "iPhone 5"},
                    {modelId: 7, modelName: "iPhone 5c"},
                    {modelId: 8, modelName: "iPhone 5s"},
                    {modelId: 9, modelName: "iPhone 6"},
                    {modelId: 10, modelName: "iPhone 6 Plus"},
                    {modelId: 11, modelName: "iPhone 6s"},
                    {modelId: 12, modelName: "iPhone 6s Plus"},
                    {modelId: 13, modelName: "iPhone SE (1st generation)"},
                    {modelId: 14, modelName: "iPhone 7"},
                    {modelId: 15, modelName: "iPhone 7 Plus"},
                    {modelId: 16, modelName: "iPhone 8"},
                    {modelId: 17, modelName: "iPhone 8 Plus"},
                    {modelId: 18, modelName: "iPhone X"},
                    {modelId: 19, modelName: "iPhone XR"},
                    {modelId: 20, modelName: "iPhone XS"},
                    {modelId: 21, modelName: "iPhone XS Max"},
                    {modelId: 22, modelName: "iPhone 11"},
                    {modelId: 23, modelName: "iPhone 11 Pro"},
                    {modelId: 24, modelName: "iPhone 11 Pro Max"},
                    {modelId: 25, modelName: "iPhone SE (2nd generation)"},
                    {modelId: 26, modelName: "iPhone 12 mini"},
                    {modelId: 27, modelName: "iPhone 12"},
                    {modelId: 28, modelName: "iPhone 12 Pro"},
                    {modelId: 29, modelName: "iPhone 12 Pro Max"},
                    {modelId: 30, modelName: "iPhone 13 mini"},
                    {modelId: 31, modelName: "iPhone 13"},
                    {modelId: 32, modelName: "iPhone 13 Pro"},
                    {modelId: 33, modelName: "iPhone 13 Pro Max"},
                    {modelId: 34, modelName: "iPhone SE (3rd generation)"},
                    {modelId: 35, modelName: "iPhone 14"},
                    {modelId: 36, modelName: "iPhone 14 Plus"},
                    {modelId: 37, modelName: "iPhone 14 Pro"},
                    {modelId: 38, modelName: "iPhone 14 Pro Max"},
                    {modelId: 39, modelName: "iPhone 15"},
                    {modelId: 40, modelName: "iPhone 15 Plus"},
                    {modelId: 41, modelName: "iPhone 15 Pro"},
                    {modelId: 42, modelName: "iPhone 15 Pro Max"},
                    {modelId: 43, modelName: "iPhone 16"},
                    {modelId: 44, modelName: "iPhone 16 Plus"},
                    {modelId: 45, modelName: "iPhone 16 Pro"},
                    {modelId: 46, modelName: "iPhone 16 Pro Max"},
                    {modelId: 47, modelName: "iPhone 16 e"},

                ],
            },
            {
                brandId: 2, name: "Samsung", model: [
                    {modelId: 1, modelName: "Galaxy S2"},
                    {modelId: 2, modelName: "Galaxy S3"},
                    {modelId: 3, modelName: "Galaxy S4"},
                    {modelId: 4, modelName: "Galaxy S5"},
                    {modelId: 5, modelName: "Galaxy S6"},
                    {modelId: 6, modelName: "Galaxy S6 Edge"},
                    {modelId: 7, modelName: "Galaxy S7"},
                    {modelId: 8, modelName: "Galaxy S7 Edge"},
                    {modelId: 9, modelName: "Galaxy S8"},
                    {modelId: 10, modelName: "Galaxy S8+"},
                    {modelId: 11, modelName: "Galaxy S9"},
                    {modelId: 12, modelName: "Galaxy S9+"},
                    {modelId: 13, modelName: "Galaxy S10e"},
                    {modelId: 14, modelName: "Galaxy S10"},
                    {modelId: 15, modelName: "Galaxy S10+"},
                    {modelId: 16, modelName: "Galaxy S10 5G"},
                    {modelId: 17, modelName: "Galaxy S20"},
                    {modelId: 18, modelName: "Galaxy S20+"},
                    {modelId: 19, modelName: "Galaxy S20 Ultra"},
                    {modelId: 20, modelName: "Galaxy S20 FE"},
                    {modelId: 21, modelName: "Galaxy S21"},
                    {modelId: 22, modelName: "Galaxy S21+"},
                    {modelId: 23, modelName: "Galaxy S21 Ultra"},
                    {modelId: 24, modelName: "Galaxy S21 FE"},
                    {modelId: 25, modelName: "Galaxy S22"},
                    {modelId: 26, modelName: "Galaxy S22+"},
                    {modelId: 27, modelName: "Galaxy S22 Ultra"},
                    {modelId: 28, modelName: "Galaxy S22 FE"},
                    {modelId: 29, modelName: "Galaxy S23"},
                    {modelId: 30, modelName: "Galaxy S23+"},
                    {modelId: 31, modelName: "Galaxy S23 Ultra"},
                    // --- Projected models for 2024/2025 ---
                    {modelId: 32, modelName: "Galaxy S24"},
                    {modelId: 33, modelName: "Galaxy S24+"},
                    {modelId: 34, modelName: "Galaxy S24 Ultra"},
                    // --- Added Galaxy S25 series ---
                    {modelId: 35, modelName: "Galaxy S25"},
                    {modelId: 36, modelName: "Galaxy S25+"},
                    {modelId: 37, modelName: "Galaxy S25 Ultra"},

                    // Galaxy J series
                    {modelId: 38, modelName: "Galaxy J1"},
                    {modelId: 39, modelName: "Galaxy J2"},
                    {modelId: 40, modelName: "Galaxy J3"},
                    {modelId: 41, modelName: "Galaxy J4"},
                    {modelId: 42, modelName: "Galaxy J5"},
                    {modelId: 43, modelName: "Galaxy J7"},

                    // Galaxy M series
                    {modelId: 44, modelName: "Galaxy M10"},
                    {modelId: 45, modelName: "Galaxy M11"},
                    {modelId: 46, modelName: "Galaxy M12"},
                    {modelId: 47, modelName: "Galaxy M20"},
                    {modelId: 48, modelName: "Galaxy M21"},
                    {modelId: 49, modelName: "Galaxy M30"},
                    {modelId: 50, modelName: "Galaxy M31"},
                    {modelId: 51, modelName: "Galaxy M32"},
                    {modelId: 52, modelName: "Galaxy M40"},
                    {modelId: 53, modelName: "Galaxy M41"},

                    // Galaxy A series
                    {modelId: 54, modelName: "Galaxy A3 (2014)"},
                    {modelId: 55, modelName: "Galaxy A5 (2014)"},
                    {modelId: 56, modelName: "Galaxy A7 (2014)"},
                    {modelId: 57, modelName: "Galaxy A8 (2018)"},
                    {modelId: 58, modelName: "Galaxy A8+ (2018)"},
                    {modelId: 59, modelName: "Galaxy A9 (2018)"},
                    {modelId: 60, modelName: "Galaxy A10e (2019)"},
                    {modelId: 61, modelName: "Galaxy A10 (2019)"},
                    {modelId: 62, modelName: "Galaxy A10s (2019)"},
                    {modelId: 63, modelName: "Galaxy A20 (2018)"},
                    {modelId: 64, modelName: "Galaxy A21 (2019)"},
                    {modelId: 65, modelName: "Galaxy A30 (2019)"},
                    {modelId: 66, modelName: "Galaxy A31 (2020)"},
                    {modelId: 67, modelName: "Galaxy A32 (2021)"},
                    {modelId: 68, modelName: "Galaxy A40 (2019)"},
                    {modelId: 69, modelName: "Galaxy A41 (2020)"},
                    {modelId: 70, modelName: "Galaxy A42 (2021)"},
                    {modelId: 71, modelName: "Galaxy A50 (2019)"},
                    {modelId: 72, modelName: "Galaxy A51 (2019)"},
                    {modelId: 73, modelName: "Galaxy A52 (2021)"},
                    {modelId: 74, modelName: "Galaxy A53 (2022)"},
                    {modelId: 75, modelName: "Galaxy A70 (2019)"},
                    {modelId: 76, modelName: "Galaxy A71 (2020)"},
                    {modelId: 77, modelName: "Galaxy A72 (2021)"},
                    {modelId: 78, modelName: "Galaxy A80 (2016)"},
                    {modelId: 79, modelName: "Galaxy A90 (2019)"},
                    {modelId: 80, modelName: "Galaxy A91 (2020)"}
                ]
            },
            {
                brandId: 13,
                name: "ASUS",
                model: [
                    { modelId: 1, modelName: "ZenFone 2" },
                    { modelId: 2, modelName: "ZenFone 3" },
                    { modelId: 3, modelName: "ZenFone 3 Deluxe" },
                    { modelId: 4, modelName: "ZenFone 4" },
                    { modelId: 5, modelName: "ZenFone 5" },
                    { modelId: 6, modelName: "ZenFone 6" },
                    { modelId: 7, modelName: "ZenFone 7" },
                    { modelId: 8, modelName: "ZenFone 7 Pro" },
                    // ROG Phone series:
                    { modelId: 9, modelName: "ROG Phone" },
                    { modelId: 10, modelName: "ROG Phone II" },
                    { modelId: 11, modelName: "ROG Phone 3" },
                    { modelId: 12, modelName: "ROG Phone 5" },
                    { modelId: 13, modelName: "ZenFone 8" },
                    { modelId: 14, modelName: "ZenFone 9" },
                    { modelId: 15, modelName: "ROG Phone 6" }
                ]
            },
            {
                brandId: 9,
                name: "Google Pixel",
                model: [
                    { modelId: 1, modelName: "Pixel" },
                    { modelId: 2, modelName: "Pixel XL" },
                    { modelId: 3, modelName: "Pixel 2" },
                    { modelId: 4, modelName: "Pixel 2 XL" },
                    { modelId: 5, modelName: "Pixel 3" },
                    { modelId: 6, modelName: "Pixel 3 XL" },
                    { modelId: 7, modelName: "Pixel 3a" },
                    { modelId: 8, modelName: "Pixel 3a XL" },
                    { modelId: 9, modelName: "Pixel 4" },
                    { modelId: 10, modelName: "Pixel 4 XL" },
                    { modelId: 11, modelName: "Pixel 4a" },
                    { modelId: 12, modelName: "Pixel 4a (5G)" },
                    { modelId: 13, modelName: "Pixel 5" },
                    { modelId: 14, modelName: "Pixel 5a" },
                    { modelId: 15, modelName: "Pixel 6" },
                    { modelId: 16, modelName: "Pixel 6 Pro" },
                    { modelId: 17, modelName: "Pixel 7" },
                    { modelId: 18, modelName: "Pixel 7 Pro" },
                    { modelId: 19, modelName: "Pixel 8" },
                    { modelId: 20, modelName: "Pixel 8a" },
                    { modelId: 21, modelName: "Pixel 8 Pro" },
                    { modelId: 22, modelName: "Pixel 9" },
                    { modelId: 23, modelName: "Pixel 9a" },
                    { modelId: 24, modelName: "Pixel 9 Pro" }
                ]
            },
            {
                brandId: 3,
                name: "Huawei",
                model: [
                    // Huawei flagship series
                    { modelId: 1, modelName: "Huawei P8" },
                    { modelId: 2, modelName: "Huawei P9" },
                    { modelId: 3, modelName: "Huawei P10" },
                    { modelId: 4, modelName: "Huawei P20" },
                    { modelId: 5, modelName: "Huawei P30" },
                    { modelId: 6, modelName: "Huawei P40" },
                    { modelId: 7, modelName: "Huawei P40 Pro" },
                    { modelId: 8, modelName: "Huawei P50" },
                    { modelId: 9, modelName: "Huawei P50 Pro" },
                    { modelId: 10, modelName: "Huawei Mate 8" },
                    { modelId: 11, modelName: "Huawei Mate 9" },
                    { modelId: 12, modelName: "Huawei Mate 10" },
                    { modelId: 13, modelName: "Huawei Mate 20" },
                    { modelId: 14, modelName: "Huawei Mate 20 Pro" },
                    { modelId: 15, modelName: "Huawei Mate 30" },
                    { modelId: 16, modelName: "Huawei Mate 30 Pro" },
                    { modelId: 17, modelName: "Huawei Mate 40" },
                    { modelId: 18, modelName: "Huawei Mate 40 Pro" },
                    { modelId: 19, modelName: "Huawei Mate 40 Pro+" },
                    // Recent/Projected Huawei models:
                    { modelId: 20, modelName: "Huawei P60" },
                    { modelId: 21, modelName: "Huawei Mate 50" },
                    { modelId: 22, modelName: "Huawei P70" },
                    // Honor series (Huawei sub‑brand):
                    { modelId: 23, modelName: "Honor 5X" },
                    { modelId: 24, modelName: "Honor 6X" },
                    { modelId: 25, modelName: "Honor 7X" },
                    { modelId: 26, modelName: "Honor 8" },
                    { modelId: 27, modelName: "Honor 8X" },
                    { modelId: 28, modelName: "Honor 9" },
                    { modelId: 29, modelName: "Honor 9X" },
                    { modelId: 30, modelName: "Honor 10" },
                    { modelId: 31, modelName: "Honor View 10" },
                    { modelId: 32, modelName: "Honor 20" },
                    { modelId: 33, modelName: "Honor 20 Pro" },
                    { modelId: 34, modelName: "Honor 30" },
                    { modelId: 35, modelName: "Honor 30 Pro" },
                    { modelId: 36, modelName: "Honor 30S" },
                    { modelId: 37, modelName: "Honor Magic 2" },
                    // Projected Honor models:
                    { modelId: 38, modelName: "Honor 40" },
                    { modelId: 39, modelName: "Honor 50" }
                ]
            },
            {
                brandId: 8,
                name: "Motorola",
                model: [
                    { modelId: 1, modelName: "Moto G (1st Gen)" },
                    { modelId: 2, modelName: "Moto G (2nd Gen)" },
                    { modelId: 3, modelName: "Moto G (3rd Gen)" },
                    { modelId: 4, modelName: "Moto G (4th Gen)" },
                    { modelId: 5, modelName: "Moto G (5th Gen)" },
                    { modelId: 6, modelName: "Moto G6" },
                    { modelId: 7, modelName: "Moto G7" },
                    { modelId: 8, modelName: "Moto G8" },
                    { modelId: 9, modelName: "Moto G Power" },
                    { modelId: 10, modelName: "Moto G Stylus" },
                    { modelId: 11, modelName: "Moto E" },
                    { modelId: 12, modelName: "Moto Edge" },
                    { modelId: 13, modelName: "Moto Edge Plus" },
                    { modelId: 14, modelName: "Moto Razr (Fold)" },
                    { modelId: 15, modelName: "Moto Razr (2020)" },
                    { modelId: 16, modelName: "Moto G14" },
                    { modelId: 17, modelName: "Moto Edge X" }
                ]
            },
            {
                brandId: 10,
                name: "Nokia",
                model: [
                    { modelId: 1, modelName: "Nokia 1" },
                    { modelId: 2, modelName: "Nokia 2" },
                    { modelId: 3, modelName: "Nokia 3" },
                    { modelId: 4, modelName: "Nokia 4" },
                    { modelId: 5, modelName: "Nokia 5" },
                    { modelId: 6, modelName: "Nokia 6" },
                    { modelId: 7, modelName: "Nokia 7 Plus" },
                    { modelId: 8, modelName: "Nokia 8" },
                    { modelId: 9, modelName: "Nokia 8.1" },
                    { modelId: 10, modelName: "Nokia 9 PureView" },
                    { modelId: 11, modelName: "Nokia X6" },
                    { modelId: 12, modelName: "Nokia 2.1 Plus" },
                    { modelId: 13, modelName: "Nokia 3.1 Plus" },
                    { modelId: 14, modelName: "Nokia 5.1" },
                    { modelId: 15, modelName: "Nokia X20" },
                    { modelId: 16, modelName: "Nokia X30" }
                ]
            },
            {
                brandId: 7,
                name: "OnePlus",
                model: [
                    { modelId: 1, modelName: "OnePlus One" },
                    { modelId: 2, modelName: "OnePlus 2" },
                    { modelId: 3, modelName: "OnePlus X" },
                    { modelId: 4, modelName: "OnePlus 3" },
                    { modelId: 5, modelName: "OnePlus 3T" },
                    { modelId: 6, modelName: "OnePlus 5" },
                    { modelId: 7, modelName: "OnePlus 5T" },
                    { modelId: 8, modelName: "OnePlus 6" },
                    { modelId: 9, modelName: "OnePlus 6T" },
                    { modelId: 10, modelName: "OnePlus 7" },
                    { modelId: 11, modelName: "OnePlus 7 Pro" },
                    { modelId: 12, modelName: "OnePlus 7T" },
                    { modelId: 13, modelName: "OnePlus 7T Pro" },
                    { modelId: 14, modelName: "OnePlus 8" },
                    { modelId: 15, modelName: "OnePlus 8 Pro" },
                    { modelId: 16, modelName: "OnePlus 8T" },
                    { modelId: 17, modelName: "OnePlus 9" },
                    { modelId: 18, modelName: "OnePlus 9 Pro" },
                    { modelId: 19, modelName: "OnePlus 9R" },
                    { modelId: 20, modelName: "OnePlus 10 Pro" },
                    { modelId: 21, modelName: "OnePlus 10T" },
                    { modelId: 22, modelName: "OnePlus 11" },
                    { modelId: 23, modelName: "OnePlus 12" }
                ]
            },
            {
                brandId: 11,
                name: "Realme",
                model: [
                    { modelId: 1, modelName: "Realme C1" },
                    { modelId: 2, modelName: "Realme C2" },
                    { modelId: 3, modelName: "Realme C3" },
                    { modelId: 4, modelName: "Realme C11" },
                    { modelId: 5, modelName: "Realme C12" },
                    { modelId: 6, modelName: "Realme 3" },
                    { modelId: 7, modelName: "Realme 3 Pro" },
                    { modelId: 8, modelName: "Realme 5" },
                    { modelId: 9, modelName: "Realme 5 Pro" },
                    { modelId: 10, modelName: "Realme 6" },
                    { modelId: 11, modelName: "Realme 6 Pro" },
                    { modelId: 12, modelName: "Realme 7" },
                    { modelId: 13, modelName: "Realme 7 Pro" },
                    { modelId: 14, modelName: "Realme 8" },
                    { modelId: 15, modelName: "Realme 8 Pro" },
                    { modelId: 16, modelName: "Realme 9" },
                    { modelId: 17, modelName: "Realme 9 Pro" },
                    { modelId: 18, modelName: "Realme 10" },
                    { modelId: 19, modelName: "Realme 11" },
                    { modelId: 20, modelName: "Realme 12" },
                    { modelId: 21, modelName: "Realme GT Master Edition" }
                ]
            },
            {
                brandId: 12,
                name: "Sony",
                model: [
                    { modelId: 1, modelName: "Xperia XZ" },
                    { modelId: 2, modelName: "Xperia XZ1" },
                    { modelId: 3, modelName: "Xperia XZ2" },
                    { modelId: 4, modelName: "Xperia XZ2 Compact" },
                    { modelId: 5, modelName: "Xperia XZ3" },
                    { modelId: 6, modelName: "Xperia 1" },
                    { modelId: 7, modelName: "Xperia 1 II" },
                    { modelId: 8, modelName: "Xperia 5" },
                    { modelId: 9, modelName: "Xperia 5 II" },
                    { modelId: 10, modelName: "Xperia 10" },
                    { modelId: 11, modelName: "Xperia 10 II" },
                    { modelId: 12, modelName: "Xperia 10 III" },
                    { modelId: 13, modelName: "Xperia 1 III" },
                    { modelId: 14, modelName: "Xperia 5 III" }
                ]
            },
            {
                brandId: 6,
                name: "Vivo",
                model: [
                    { modelId: 1, modelName: "Vivo Y1" },
                    { modelId: 2, modelName: "Vivo Y3" },
                    { modelId: 3, modelName: "Vivo Y5" },
                    { modelId: 4, modelName: "Vivo Y7" },
                    { modelId: 5, modelName: "Vivo V1" },
                    { modelId: 6, modelName: "Vivo V3" },
                    { modelId: 7, modelName: "Vivo V5" },
                    { modelId: 8, modelName: "Vivo V7" },
                    { modelId: 9, modelName: "Vivo V9" },
                    { modelId: 10, modelName: "Vivo V11" },
                    { modelId: 11, modelName: "Vivo V15" },
                    { modelId: 12, modelName: "Vivo V17" },
                    { modelId: 13, modelName: "Vivo X21" },
                    { modelId: 14, modelName: "Vivo X27" },
                    { modelId: 15, modelName: "Vivo X30" },
                    { modelId: 16, modelName: "Vivo X50" },
                    { modelId: 17, modelName: "Vivo X60" },
                    { modelId: 18, modelName: "Vivo X70" },
                    { modelId: 19, modelName: "Vivo X80" }
                ]
            },
            {
                brandId: 4,
                name: "Xiaomi",
                model: [
                    // Xiaomi flagship Mi series
                    { modelId: 1, modelName: "Xiaomi Mi 1" },
                    { modelId: 2, modelName: "Xiaomi Mi 2" },
                    { modelId: 3, modelName: "Xiaomi Mi 3" },
                    { modelId: 4, modelName: "Xiaomi Mi 4" },
                    { modelId: 5, modelName: "Xiaomi Mi 5" },
                    { modelId: 6, modelName: "Xiaomi Mi 6" },
                    { modelId: 7, modelName: "Xiaomi Mi 8" },
                    { modelId: 8, modelName: "Xiaomi Mi 9" },
                    { modelId: 9, modelName: "Xiaomi Mi 10" },
                    { modelId: 10, modelName: "Xiaomi Mi 10 Pro" },
                    { modelId: 11, modelName: "Xiaomi Mi 11" },
                    { modelId: 12, modelName: "Xiaomi Mi 11 Ultra" },
                    { modelId: 13, modelName: "Xiaomi Mi 12" },
                    { modelId: 14, modelName: "Xiaomi Mi 12 Pro" },
                    { modelId: 15, modelName: "Xiaomi Mi 13" },
                    { modelId: 16, modelName: "Xiaomi Mi 13 Pro" },
                    // Redmi series:
                    { modelId: 17, modelName: "Redmi Note 7" },
                    { modelId: 18, modelName: "Redmi Note 8" },
                    { modelId: 19, modelName: "Redmi Note 9" },
                    { modelId: 20, modelName: "Redmi Note 10" },
                    { modelId: 21, modelName: "Redmi Note 11" },
                    { modelId: 22, modelName: "Redmi Note 12" },
                    // Poco series:
                    { modelId: 23, modelName: "Poco F1" },
                    { modelId: 24, modelName: "Poco X2" },
                    { modelId: 25, modelName: "Poco X3 Pro" },
                    { modelId: 26, modelName: "Poco M3 Pro 5G" },
                    // Xiaomi A series (Android One)
                    { modelId: 27, modelName: "Xiaomi Mi A1" },
                    { modelId: 28, modelName: "Xiaomi Mi A2" },
                    { modelId: 29, modelName: "Xiaomi Mi A3" },
                    { modelId: 30, modelName: "Xiaomi Mi A4" }
                ]
            },
            {
                brandId: 14,
                name: "ZTE",
                model: [
                    { modelId: 1, modelName: "Blade V7" },
                    { modelId: 2, modelName: "Blade A3" },
                    { modelId: 3, modelName: "Blade A5" },
                    { modelId: 4, modelName: "Axon 7" },
                    { modelId: 5, modelName: "Axon 10 Pro" },
                    { modelId: 6, modelName: "Axon 11" },
                    { modelId: 7, modelName: "Blade V8" },
                    { modelId: 8, modelName: "Axon 12" }
                ]
            }
        ],
        storage: [
            {storageId: 1, size: "4 GB"},
            {storageId: 2, size: "8 GB"},
            {storageId: 3, size: "16 GB"},
            {storageId: 4, size: "32 GB"},
            {storageId: 5, size: "64 GB"},
            {storageId: 6, size: "128 GB"},
            {storageId: 7, size: "256 GB"},
            {storageId: 8, size: "512 GB"},
            {storageId: 9, size: "1 TB"},
            {storageId: 10, size: "2 TB"}
        ],

        ram: [
            {ramId: 1, size: "1 GB"},
            {ramId: 2, size: "2 GB"},
            {ramId: 3, size: "3 GB"},
            {ramId: 4, size: "4 GB"},
            {ramId: 5, size: "6 GB"},
            {ramId: 6, size: "8 GB"},
            {ramId: 7, size: "12 GB"},
            {ramId: 8, size: "16 GB"},
            {ramId: 9, size: "20 GB"},
            {ramId: 10, size: "24 GB"}
        ],

        colors: [
            { colorId: 1, colorName: "Black" },
            { colorId: 2, colorName: "White" },
            { colorId: 3, colorName: "Silver" },
            { colorId: 4, colorName: "Gold" },
            { colorId: 5, colorName: "Space Gray" },
            { colorId: 6, colorName: "Rose Gold" },
            { colorId: 7, colorName: "Blue" },
            { colorId: 8, colorName: "Red" },
            { colorId: 9, colorName: "Green" },
            { colorId: 10, colorName: "Purple" },
            { colorId: 11, colorName: "Yellow" },
            { colorId: 12, colorName: "Orange" },
            { colorId: 13, colorName: "Coral" },
            { colorId: 14, colorName: "Midnight Green" },
            { colorId: 15, colorName: "Pacific Blue" },
            { colorId: 16, colorName: "Graphite" },
            { colorId: 17, colorName: "Other" }
        ],
    },

    // Mobile Phones Ends here


    // Laptop and Computers starts here

    {
        categoriesList: {catId: 2, name: "Laptops & Computers"},
        brands: [
            // { brandId: 1, name: "Apple", type:[{typeId:1, typeName: "Laptop", series:[  {seriesId:1, seriesName: "", model: [] }   ] }, ] },
            {
                brandId: 1,
                name: "Apple",
                type: [
                    {
                        typeId: 1,
                        typeName: "Laptop",
                        series: [
                            {
                                seriesId: 1,
                                seriesName: "MacBook",
                                model: [
                                    "MacBook (Early 2009)",
                                    "MacBook (Mid 2009)",
                                    "MacBook (Late 2009)",
                                    "MacBook (Mid 2010)",
                                    "MacBook (Retina, 12-inch, Early 2015)",
                                    "MacBook (Retina, 12-inch, Early 2016)",
                                    "MacBook (Retina, 12-inch, 2017)"
                                ]
                            },
                            {
                                seriesId: 2,
                                seriesName: "MacBook Air",
                                model: [
                                    "MacBook Air (Mid 2009)",
                                    "MacBook Air (Late 2010)",
                                    "MacBook Air (Mid 2011)",
                                    "MacBook Air (Mid 2012)",
                                    "MacBook Air (Mid 2013)",
                                    "MacBook Air (Early 2014)",
                                    "MacBook Air (Early 2015)",
                                    "MacBook Air (2017)",
                                    "MacBook Air (Retina, 13-inch, 2018)",
                                    "MacBook Air (Retina, 13-inch, 2019)",
                                    "MacBook Air (Retina, 13-inch, 2020)",
                                    "MacBook Air (M1, 2020)",
                                    "MacBook Air (M2, 2022)",
                                    "MacBook Air (13-inch, M3, 2024)",
                                    "MacBook Air (15-inch, M3, 2024)"
                                ]
                            },
                            {
                                seriesId: 3,
                                seriesName: "MacBook Pro",
                                model: [
                                    "MacBook Pro (17-inch, Early 2009)",
                                    "MacBook Pro (15-inch, Mid 2009)",
                                    "MacBook Pro (13-inch, Mid 2009)",
                                    "MacBook Pro (17-inch, Mid 2009)",
                                    "MacBook Pro (Mid 2010)",
                                    "MacBook Pro (Early 2011)",
                                    "MacBook Pro (Late 2011)",
                                    "MacBook Pro (Mid 2012)",
                                    "MacBook Pro (Retina, 15-inch, Mid 2012)",
                                    "MacBook Pro (Retina, 13-inch, Late 2012)",
                                    "MacBook Pro (Retina, Early 2013)",
                                    "MacBook Pro (Retina, Late 2013)",
                                    "MacBook Pro (Retina, Mid 2014)",
                                    "MacBook Pro (Retina, 13-inch, Early 2015)",
                                    "MacBook Pro (Retina, 15-inch, Mid 2015)",
                                    "MacBook Pro (2016)",
                                    "MacBook Pro (2017)",
                                    "MacBook Pro (2018)",
                                    "MacBook Pro (2019)",
                                    "MacBook Pro (2020)",
                                    "MacBook Pro (M1 Pro/Max, 2021)",
                                    "MacBook Pro (M2 Pro/Max, 2023)",
                                    "MacBook Pro (2024)"
                                ]
                            }
                        ]
                    },
                    {
                        typeId: 2,
                        typeName: "Desktop",
                        series: [
                            {
                                seriesId: 1,
                                seriesName: "iMac",
                                model: [
                                    "iMac (2009)",
                                    "iMac (2010)",
                                    "iMac (Late 2012)",
                                    "iMac (Retina 5K, 2014)",
                                    "iMac (Retina 5K, 2015)",
                                    "iMac (Retina 4K, 2017)",
                                    "iMac (M1, 2021)",
                                    "iMac (2022)",
                                    "iMac (2024)"
                                ]
                            },
                            {
                                seriesId: 2,
                                seriesName: "Mac Mini",
                                model: [
                                    "Mac Mini (2009)",
                                    "Mac Mini (2010)",
                                    "Mac Mini (Mid 2011)",
                                    "Mac Mini (Late 2014)",
                                    "Mac Mini (2018)",
                                    "Mac Mini (M1, 2020)",
                                    "Mac Mini (2023)"
                                ]
                            },
                            {
                                seriesId: 3,
                                seriesName: "Mac Pro",
                                model: [
                                    "Mac Pro (2009)",
                                    "Mac Pro (Mid 2010)",
                                    "Mac Pro (2013)",
                                    "Mac Pro (2019)",
                                    "Mac Pro (2023)"
                                ]
                            }
                        ]
                    }
                ]
            }

        ]
    },


]















export default categorySchema;
