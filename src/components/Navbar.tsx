"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

import {
  Search,
  Menu,
  X,
  User,
  LogIn,
  LogOut,
  Bookmark,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

import { authStore } from "@/store/authStore";
import { categoryList } from "@/lib/CategoryList";
import { toastError } from "./toasts/toasts";
import { siteMaxWidth } from "@/lib/constants";
import SearchWithAutocomplete from "@/components/sharedUi/SearchWithAutocomplete";

export default function Navbar() {
  const pathname = usePathname();
  
  const isAuthenticated = authStore((state) => state.isAuthenticated);
  const avatarFallBack = authStore((state) => state.avatarFallback);
  const isLoggedInFromStore = authStore((state) => state.setAuthState);

  // State for the search overlay
  const [isSearchActive, setIsSearchActive] = useState(false);

  const logout = async () => {
    const response = await fetch("/api/auth/session/terminate", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
    if (response.ok) {
      isLoggedInFromStore(false);
      sessionStorage.removeItem("auth");
    } else {
      toastError({
        message: "Sorry We couldn't log you out.",
      });
    }

    window.location.href = "/";
  };

  if (pathname === "/login") {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div
          className={`${siteMaxWidth} m-auto flex h-16 items-center justify-between px-4`}
        >
          <Link href="/" className="flex items-center gap-2 pb-4 pt-2">
            <span className="text-xl font-bold">Tonmame</span>
            <span className="text-sm font-light">Market Hub</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className={`${siteMaxWidth} m-auto flex h-16 items-center justify-between px-4`}
      >
        {/* LEFT SIDE: Logo & Mobile Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <Link href="/" className="flex items-center gap-2 pb-4 pt-3 px-4">
                <span className="text-xl font-bold">Tonmame</span>
                <span className="text-sm font-light">Market Hub</span>
              </Link>
              <nav className="grid gap-2 py-4">
                <p className="px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Popular Categories
                </p>

                <div className="flex flex-col gap-1 pl-2 max-h-40 overflow-y-auto">
                  {categoryList.map((category) => (
                    <SheetClose key={category.id} asChild>
                      <Link
                        href={`/${category.id}`}
                        className="flex items-center gap-3 py-2.5 px-4 text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border-l-2 border-transparent hover:border-blue-600"
                      >
                        <category.icon size={18} />
                        {category.name}
                      </Link>
                    </SheetClose>
                  ))}
                </div>

                <div className="my-4 border-t border-gray-100" />

                {/* ACCOUNT SECTION */}
                <div className="space-y-1">
                  <p className="px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Account
                  </p>

                  {isAuthenticated ? (
                    <div className="flex flex-col gap-1 pl-2">
                      <SheetClose asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 py-2.5 px-4 text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border-l-2 border-transparent hover:border-blue-600"
                        >
                          <User size={18} />
                          Profile
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link
                          href="/buy-later"
                          className="flex items-center gap-3 py-2.5 px-4 text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border-l-2 border-transparent hover:border-blue-600"
                        >
                          <Bookmark size={18} />
                          Bookmarks
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <button
                          onClick={logout}
                          className="flex items-center gap-3 py-2.5 px-4 text-red-500 font-medium hover:text-red-600 hover:bg-blue-50 rounded-md transition-colors border-l-2 border-transparent hover:border-blue-600"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </SheetClose>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 pl-2">
                      <SheetClose asChild>
                        <Link
                          href="/login"
                          className="flex items-center cursor-pointer gap-3 py-2.5 px-4 text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border-l-2 border-transparent hover:border-blue-600"
                        >
                          <LogIn size={18} />
                          Login
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link
                          href="/register"
                          className="flex items-center cursor-pointer gap-3 py-2.5 px-4 text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border-l-2 border-transparent hover:border-blue-600"
                        >
                          <User size={18} />
                          Register
                        </Link>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-1 md:gap-2">
            <span className="text-xl font-bold">Tonmame</span>
            <span className="hidden md:inline text-sm font-light">
              Market Hub
            </span>
          </Link>
        </div>

        {/* SEARCH OVERLAY */}
        {isSearchActive ? (
          <div className="absolute inset-0 top-0 z-50 bg-background px-4 py-2 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
             
             <div className="flex-1 max-w-4xl m-auto">
                <SearchWithAutocomplete 
                  placeholder="Search products (e.g. iPhone 12)..."
                  onSearch={() => setIsSearchActive(false)}
                  className="w-full"
                />
             </div>
             
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchActive(false)}
              className="ml-2 hover:bg-gray-100 rounded-full shrink-0"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close search</span>
            </Button>
          </div>
        ) : (
          /* --- RIGHT SIDE: ICONS & BUTTONS (Default State) --- */
          <div className="flex items-center gap-2">
            {/* Desktop Search Icon - Only shows if NOT on Homepage */}
            <Button
              variant="ghost"
              size="icon"
              className={`hidden ${pathname !== "/" && "md:flex"}`}
              onClick={() => {
                if (pathname !== "/") setIsSearchActive(true);
              }}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/buy-later">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                    >
                      <Bookmark className="h-5 w-5" />
                      <span className="sr-only">Bookmarks</span>
                    </Button>
                  </Link>

                  <Link href="/post-ads">
                    <Button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold rounded-full px-6 shadow-sm flex items-center gap-2 transition-transform active:scale-95">
                      <span>SELL</span>
                    </Button>
                  </Link>

                  <Link href="/profile">
                    <Button variant="ghost" size="sm" className="cursor-pointer">
                      <User className="h-5 w-5 mr-2" />
                      {avatarFallBack}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="cursor-pointer">
                    <Button variant="ghost" size="sm">
                      <LogIn className="h-5 w-5 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/login" className="cursor-pointer">
                    <Button variant="default">Register</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Search Icon - Only shows if NOT on Homepage */}
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden ${pathname === "/" && "hidden"}`}
              onClick={() => {
                if (pathname !== "/") setIsSearchActive(true);
              }}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {isAuthenticated && (
              <Link href="/profile" className="md:hidden">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}