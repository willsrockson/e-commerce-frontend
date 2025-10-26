import { currency } from "@/lib/helpers/universal-functions";
import { Badge } from "./ui/badge"
import {CheckCircle} from "lucide-react";
import Image from "next/image";
import Link from "next/link";


interface CardProps {
    id: string;
    firstImageUrl: string;
    price: number | string;
    title: string;
    location: string;
    condition: string;
    description: string;
    createdAt: string;
    isVerifiedStore: string;
}

enum VerificationStatus{
     "Not Verified"="Not Verified",
     "Verified"="Verified"
}

export default function ProductsCard({id, firstImageUrl, price, title, condition, location, description , createdAt, isVerifiedStore }: CardProps) {

    // function truncateChars(text: string, maxLength: number) {
    //     if (text.length <= maxLength) return text;
    //     return text.slice(0, text.lastIndexOf(" ", maxLength)) + "..."; 
    // }
    // Helper function to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return "Today";
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    return (
        <Link
            href={id}
            className="flex flex-col h-auto rounded-md bg-white shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden group border"
        >
            <section className="max-w-md">
                <div className="relative overflow-hidden aspect-3/4">
                    <Image
                        src={firstImageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={true}
                        quality={85}
                    />

                    {isVerifiedStore === VerificationStatus.Verified && (
                        <Badge
                            variant="secondary"
                            className="absolute bottom-2 left-2 gap-1 bg-[#E0FBE2] text-green-700"
                        >
                            <CheckCircle className="h-3 w-3" /> Verified
                        </Badge>
                    )}
                </div>

                <div className="px-2 pb-2 pt-1">
                    <span className="text-lg font-semibold text-blue-500">{currency(price)}</span>
                    <div className="space-y-1.5">
                        <p className="font-semibold text-sm line-clamp-1">{title}</p>
                        <p className="font-medium text-xs text-gray-600 line-clamp-1">
                           {description}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{location}</p>
                       <div className="flex flex-col gap-y-1 sm:flex-row justify-between">
                           <Badge variant={'secondary'} className="text-gray-500">
                            <span>{condition}</span>
                        </Badge>
                        <Badge variant={'outline'} className="text-gray-500">
                            <span>{formatDate(createdAt.toString())}</span>
                        </Badge>
                       </div>
                    </div>
                </div>
            </section>
        </Link>
    );
}












































/*

import {
    Card,
    CardContent,
} from "./ui/card"
import { Badge } from "./ui/badge"

import Image from "next/image";
import {MapPin} from "lucide-react";



export default function CardUi() {
    return (
        <Card className="p-1 rounded-xl overflow-hidden bg-cardBg" >

            <Image className="rounded-lg w-auto h-auto" src="/images/iphone.png" alt="iphone" width={300} height={300} />

            <CardContent className="p-2 m-0 flex flex-col gap-1.5">
                <p className="text-blue-500 font-bold">GH₵ {150}</p>
                <p className="leading-6">iPhone 16 pro max 64gb</p>
                <p className="text-gray-500 text-xs leading-6 sm:text-sm">A little description about the device goes here, and sometimes long</p>
                <span className="flex text-xs text-gray-400"><MapPin size={15} /> Accra,Ghana Nungua</span>

                <div className="flex justify-between mt-1.5">
                    <Badge className="w-auto cursor-pointer">New</Badge>
                    <Badge className="bg-blue-400 w-auto hover:bg-blue-300 cursor-pointer">Verified</Badge>
                </div>
            </CardContent>

        </Card>

    )
}


 */