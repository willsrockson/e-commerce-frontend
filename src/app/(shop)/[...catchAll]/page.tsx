import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function ShopNotFoundPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-center px-6">
                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                <p className="text-2xl font-medium mb-6">Page not found</p>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                    The page you are looking for doesn&apos;t exist or has been moved.
                </p>
                <Link href="/">
                    <Button size="lg">Return to Home</Button>
                </Link>
            </div>
        </div>
    )
}
