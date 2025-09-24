"use client"
import Link from "next/link"
import {Button} from "./ui/button"
import {Input} from "./ui/input"
import React, { useState} from "react"

import {
    Search,
    Menu,
    X,
    User,
    LogIn,
    LogOut,
    Bookmark,
    Home,
} from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet";

import {authStore} from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
//import debounce from "lodash/debounce";
import {categoryList} from "@/lib/CategoryList";
import { toastError } from "./toasts/toasts"


export default function Navbar() {
    const pathname = usePathname();
    const isAuthenticated = authStore((state) => state.isAuthenticated);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const avatarFallBack = authStore(state => state.avatarFallback);
    // Store Data
    const isLoggedInFromStore = authStore(state => state.setAuthState );
    const setFallBackNameFromStore = authStore(state => state.setAvatarFallback);
    const setAvatarFromStore = authStore(state => state.setAvatarUrl);

    //const [serverSearch, setServerSearch] = useState<[]>([]);
    //const [searchWord, setSearchWords] = useState<string>('')

    const router = useRouter()
    // Responsible for sending queries to the URL and BackEnd
    //const query = new URLSearchParams({});

    // const searchDebounce = useCallback(
    //     debounce((newData) => setSearchWords(() => newData), 1000),
    //     []
    // );


    // useEffect(() => {
    //     if (searchWord) {
    //         query.set("search", searchWord)
    //     }
    //     router.push(`?${query}`)
    //
    //     const searchFunction = async () => {
    //         const res = await fetch(`/api/search/find-product?${query}`);
    //         if (!res.ok) return setServerSearch([]);
    //         const data = await res.json();
    //         console.log("search Data--", data)
    //         setServerSearch(data);
    //
    //     }
    //     searchFunction()
    //
    //
    // }, [searchWord]);

    // Prevent scrolling in the body/ background when the hamburger is opened
    // useEffect(() => {
    //     if (!hamburger) {
    //         document.body.classList.add("overflow-hidden");
    //     } else {
    //         document.body.classList.remove("overflow-hidden");
    //     }
    //
    //     return () => document.body.classList.remove("overflow-hidden");
    // }, [hamburger]);

    const logout = async ()=>{
        const res = await fetch("/api/user/sign-out", {
            method: "GET",
            credentials: "include"
        });
        if(!res.ok){
            toastError({
               message: "Oops! Something happened. Please retry."
            })
           return; 
        }
        isLoggedInFromStore(false);
        setFallBackNameFromStore("");
        setAvatarFromStore("");
        sessionStorage.removeItem('auth');
        router.push("/");
        router.refresh();

    }

     if (pathname === "/login") {
         return (
             <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                 <div className="max-w-[1400px] m-auto flex h-16 items-center justify-between px-4">
                     <Link
                         href="/"
                         className="flex items-center gap-2 pb-4 pt-2"
                     >
                         <span className="text-xl font-bold">Tonmame</span>
                         <span className="text-sm font-light">Market Hub</span>
                     </Link>
                 </div>
             </header>
         );
     }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-[1400px] m-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2 md:gap-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <Link href="/" className="flex items-center gap-2 pb-4 pt-2">
                                <span className="text-xl font-bold">Tonmame</span>
                                <span className="text-sm font-light">Market Hub</span>
                            </Link>
                            <nav className="grid gap-2 py-4">
                                <SheetClose asChild>
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground"
                                    >
                                        <Home className="h-5 w-5" />
                                        Home
                                    </Link>
                                </SheetClose>
                                <h3 className="px-4 text-sm font-semibold">Categories</h3>
                                {categoryList.map((category) => (
                                    <SheetClose key={category.id} asChild>
                                        <Link
                                            href={`/category/${category.id}`}
                                            className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground"
                                        >
                                            <span className="text-xl">{category.icon}</span>
                                            {category.name}
                                        </Link>
                                    </SheetClose>
                                ))}
                                {isAuthenticated ? (
                                    <>
                                        <SheetClose asChild>
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <User className="h-5 w-5" />
                                                Profile
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link
                                                href="/buylater"
                                                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <Bookmark className="h-5 w-5" />
                                                Bookmarks
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Button
                                                variant="ghost"
                                                className="flex items-center gap-2 justify-start px-4"
                                                onClick={logout}
                                            >
                                                <LogOut className="h-5 w-5" />
                                                Logout
                                            </Button>
                                        </SheetClose>
                                    </>
                                ) : (
                                    <>
                                        <SheetClose asChild>
                                            <Link
                                                href="/login"
                                                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <LogIn className="h-5 w-5" />
                                                Login
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link
                                                href="/login"
                                                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <User className="h-5 w-5" />
                                                Register
                                            </Link>
                                        </SheetClose>
                                    </>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <Link href="/" className="flex items-center gap-1 md:gap-2">
                        <span className="text-xl font-bold">Tonmame</span>
                        <span className="hidden md:inline text-sm font-light">Market Hub</span>
                    </Link>
                </div>

                {isSearchActive ? (
                    <div className="absolute inset-0 top-0 z-50 bg-background px-4 py-2 flex items-center">
                        <Input
                            autoFocus
                            placeholder="Search for products..."
                            className="flex-1 h-10"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSearchActive(false)}
                            className="ml-2"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close search</span>
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`hidden ${pathname != '/' && 'md:flex'}`}
                            onClick={() => ( pathname != '/' && setIsSearchActive(true)) }
                        >
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </Button>
                        <div className="hidden md:flex items-center gap-4">
                            {isAuthenticated ? (
                                <>
                                    <Link href="/buylater">
                                        <Button variant="ghost" size="icon">
                                            <Bookmark className="h-5 w-5" />
                                            <span className="sr-only">Bookmarks</span>
                                        </Button>
                                    </Link>

                                    <Link href="/postads">
                                        <Button variant="ghost" size="icon">
                                            <span className="text-blue-500">SELL</span>
                                            <span className="sr-only">Sell</span>
                                        </Button>
                                    </Link>

                                    <Link href="/profile">
                                        <Button variant="ghost" size="sm">
                                            <User className="h-5 w-5 mr-2" />
                                            {avatarFallBack}
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={logout}
                                    >
                                        <LogOut className="h-5 w-5 mr-2" />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">
                                            <LogIn className="h-5 w-5 mr-2" />
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/login">
                                        <Button variant="default">Register</Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className={`md:hidden ${pathname == '/' && 'hidden'}`}
                            onClick={() => ( pathname != '/' && setIsSearchActive(true)) }
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
    )
}