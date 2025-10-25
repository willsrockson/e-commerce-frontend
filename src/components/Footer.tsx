"use client"

import { siteMaxWidth } from "@/lib/constants";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className={`container py-8 md:py-12 max-w-[${siteMaxWidth}] m-auto px-7`}>
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-2">
                        <Link href="/" className="inline-block">
                            <span className="text-xl font-bold">Tonmame</span>
                        </Link>
                        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                            The premier marketplace for buying and selling items locally and globally.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium">Categories</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <Link href="/category/electronics" className="text-muted-foreground hover:text-foreground">
                                    Electronics
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/vehicles" className="text-muted-foreground hover:text-foreground">
                                    Vehicles
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/land" className="text-muted-foreground hover:text-foreground">
                                    Land
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/clothing" className="text-muted-foreground hover:text-foreground">
                                    Clothing
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium">Account</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <Link href="/login" className="text-muted-foreground hover:text-foreground">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-muted-foreground hover:text-foreground">
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile" className="text-muted-foreground hover:text-foreground">
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <Link href="/bookmarks" className="text-muted-foreground hover:text-foreground">
                                    Bookmarks
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium">Support</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Tonmame Market Hub. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0">
                        <p className="text-xs text-muted-foreground">
                            Designed and built with care
                        </p>
                    </div>
                </div>
            </div>
        </footer>

    )
}
