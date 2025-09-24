import React, { Suspense } from 'react'
import MobilePhones from "@/components/RoutingComponents/Electronics/MobilePhones";
import BeatLoaderUI from '@/components/loaders/BeatLoader';

export default function Page() {
    return (
        <Suspense
            fallback={
                <BeatLoaderUI
                    className="w-full max-w-7xl m-auto mb-6 flex justify-center pt-4"
                    size={10}
                    color="blue"
                />
            }
        >
            <MobilePhones />
        </Suspense>
    );
}
