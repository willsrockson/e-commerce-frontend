"use client";

import { siteMaxWidth } from "@/lib/constants";
import { authStore } from "@/store/authStore";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react"; // Make sure you have lucide-react installed

export default function Footer() {
  const isAuthenticated = authStore().isAuthenticated;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white pt-16 pb-8">
      <div className={`container ${siteMaxWidth} m-auto px-7`}>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* COL 1: BRANDING & LOGO */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {/* YOUR NEW LOGO HERE */}
              <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                <Image
                  src="/images/tm-icon.avif"
                  alt="Tonmame Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Tonmame
              </span>
            </Link>
            <p className="max-w-xs text-sm text-gray-500 leading-relaxed">
              The premier marketplace for buying and selling items locally and
              globally. Safe, fast, and reliable.
            </p>

            {/* SOCIAL ICONS */}
            <div className="mt-6 flex gap-4">
              <SocialLink href="#" icon={<Twitter size={18} />} />
              <SocialLink href="#" icon={<Instagram size={18} />} />
              <SocialLink href="#" icon={<Facebook size={18} />} />
            </div>
          </div>

          {/* COL 2: MARKETPLACE */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Marketplace
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <FooterLink href="/mobile-phones">Mobile Phones</FooterLink>
              </li>
              <li>
                <FooterLink href="/vehicles">Vehicles</FooterLink>
              </li>
              <li>
                <FooterLink href="/land">Real Estate & Land</FooterLink>
              </li>
              <li>
                <FooterLink href="/clothing">Fashion & Shoes</FooterLink>
              </li>
            </ul>
          </div>

          {/* COL 3: ACCOUNT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Account
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              {!isAuthenticated ? (
                <>
                  <li>
                    <FooterLink href="/login">Login</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/register">Register</FooterLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <FooterLink href="/profile">My Profile</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/buy-later">Saved Items</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/my-ads">My Ads</FooterLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* COL 4: HELP & SUPPORT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <FooterLink href="/help">Help Center</FooterLink>
              </li>
              <li>
                <FooterLink href="/contact-us">Contact Us</FooterLink>
              </li>
              <li>
                <FooterLink href="/safety">Safety Tips</FooterLink>
              </li>
              <li className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                <Mail size={14} />
                <span>support@tonmame.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              &copy; {currentYear} Tonmame Market Hub. All rights reserved.
            </p>

            <div className="flex gap-6 text-xs text-gray-500">
              <Link
                href="/privacy"
                className="hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-gray-900 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components to keep code clean
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="hover:text-blue-600 transition-colors block">
      {children}
    </Link>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white transition-all"
    >
      {icon}
    </a>
  );
}

// "use client"

// import { siteMaxWidth } from "@/lib/constants";
// import { authStore } from "@/store/authStore";
// import Link from "next/link";

// export default function Footer() {
//     const isAuthenticated = authStore().isAuthenticated
//     return (
//         <footer className="border-t bg-background">
//             <div className={`container py-8 md:py-12 ${siteMaxWidth} m-auto px-7`}>
//                 <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
//                     <div className="col-span-2">
//                         <Link href="/" className="inline-block">
//                             <span className="text-xl font-bold">Tonmame</span>
//                         </Link>
//                         <p className="mt-2 max-w-xs text-sm text-muted-foreground">
//                             The premier marketplace for buying and selling items locally and globally.
//                         </p>
//                     </div>
//                     <div>
//                         <h3 className="text-sm font-medium">Categories</h3>
//                         <ul className="mt-4 space-y-2 text-sm">
//                             <li>
//                                 <Link href="/mobile-phones" className="text-muted-foreground hover:text-foreground">
//                                     Mobile Phones
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/vehicles" className="text-muted-foreground hover:text-foreground">
//                                     Vehicles
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/land" className="text-muted-foreground hover:text-foreground">
//                                     Land
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/clothing" className="text-muted-foreground hover:text-foreground">
//                                     Shoes
//                                 </Link>
//                             </li>
//                         </ul>
//                     </div>
//                     <div>
//                         <h3 className="text-sm font-medium">Account</h3>
//                         <ul className="mt-4 space-y-2 text-sm">
//                             { !isAuthenticated &&
//                                 (<li>
//                                 <Link href="/login" className="text-muted-foreground hover:text-foreground">
//                                     Login
//                                 </Link>
//                             </li>)
//                             }
//                             { !isAuthenticated &&
//                                 (<li>
//                                 <Link href="/login" className="text-muted-foreground hover:text-foreground">
//                                     Register
//                                 </Link>
//                             </li>)
//                             }
//                             <li>
//                                 <Link href="/profile" className="text-muted-foreground hover:text-foreground">
//                                     My Profile
//                                 </Link>
//                             </li>
//                             <li>
//                                 <Link href="/buy-later" className="text-muted-foreground hover:text-foreground">
//                                     Bookmarks
//                                 </Link>
//                             </li>
//                         </ul>
//                     </div>
//                     <div>
//                         <h3 className="text-sm font-medium">Support</h3>
//                         <ul className="mt-4 space-y-2 text-sm">
//                             <li>
//                                 <a href="#" className="text-muted-foreground hover:text-foreground">
//                                     Help Center
//                                 </a>
//                             </li>
//                             <li>
//                                 <Link href="/contact-us" className="text-muted-foreground hover:text-foreground">
//                                     Contact Us
//                                 </Link>
//                             </li>
//                             <li>
//                                 <a href="#" className="text-muted-foreground hover:text-foreground">
//                                     FAQ
//                                 </a>
//                             </li>
//                             <li>
//                                 <a href="#" className="text-muted-foreground hover:text-foreground">
//                                     Terms of Service
//                                 </a>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//                 <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
//                     <p className="text-xs text-muted-foreground">
//                         &copy; {new Date().getFullYear()} Tonmame Market Hub. All rights reserved.
//                     </p>
//                     <div className="mt-4 md:mt-0">
//                         <p className="text-xs text-muted-foreground">

//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </footer>

//     )
// }
