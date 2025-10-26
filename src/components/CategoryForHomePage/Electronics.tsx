'use client'
import Link from "next/link";
import Image from 'next/image';
//import useSWR from "swr";



//const fetcher = (url: string) => fetch(url).then(res => res.json())

const Electronics = () => {
    //const { data, isLoading } = useSWR('/api/count-ads/countElectronics', fetcher);


    
    
    const electronics = [
        {
            id: 1,
            href: '/mobilephones',
            img: '/images/categories/electronics/phone.webp',
            alt: 'Phones',
            label: 'Mobile Phones',
        },
    
        {
            id: 2,
            href: '/tablets',
            img: '/images/categories/electronics/tablet.webp',
            alt: 'tablets',
            label: 'Tablets',
           
        },

        {
            id: 3,
            href: '/laptops',
            img: '/images/categories/electronics/laptop.webp',
            alt: 'laptops',
            label: 'Laptops',
            

        },

        {
            id: 4,
            href: '/monitors',
            img: '/images/categories/electronics/monitor.webp',
            alt: 'monitors',
            label: 'Monitors',
            
        },

        {
            id: 5,
            href: '/headphones',
            img: '/images/categories/electronics/headphone.webp',
            alt: 'headphones',
            label: 'Headphones',
            

        },

        {
            id: 6,
            href: '/desktopcomputer',
            img: '/images/categories/electronics/desktop-computer.webp',
            alt: 'desktopcomputer',
            label: 'Desktop PC',
            

        },

        {
            id: 7,
            href: '/console',
            img: '/images/categories/electronics/console.webp',
            alt: 'console',
            label: 'Consoles',
            
        },

        {
            id: 8,
            href: '/camera',
            img: '/images/categories/electronics/camera.webp',
            alt: 'camera',
            label: 'Camera',
            

        },

        {
            id: 9,
            href: '/phoneaccessories',
            img: '/images/categories/electronics/phone-accessories.webp',
            alt: 'phone-accessories',
            label: 'Phone Accessories',
            
        },

        {
            id: 10,
            href: '/computeraccessories',
            img: '/images/categories/electronics/computer-accessories.webp',
            alt: 'computer-accessories',
            label: 'Computer Accessories',
            

        }
    ] 

  return (
    <div className="w-full max-h-[23rem] py-2 overflow-y-auto grid gap-4 grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10">

          { electronics.map(items =>(

                <Link href={items.href} className="flex flex-col items-center" key={items.id}>
                    <div className="hover:bg-gray-300/50 flex flex-col justify-center items-center bg-cardBg shadow transition-shadow duration-200 hover:shadow-md py-4 w-full border rounded-full">
                        {/* Image Container */}
                        <div className="relative aspect-square w-full max-w-[40px]">
                            <Image
                                src={items.img}
                                fill
                                style={{ objectFit: "contain" }}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                alt={items.href}
                                priority
                            />
                        </div>
                        
                        
                        
                    </div>
                    {/* Text Elements */}
                    <h3 className="font-medium text-sm text-center mt-2 line-clamp-2">{items.label}</h3>
                </Link>

          ))}

  </div>
  )
}

export default Electronics