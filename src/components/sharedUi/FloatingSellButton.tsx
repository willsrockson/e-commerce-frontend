"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

export default function FloatingSellButton() {
  const pathname = usePathname();

  // Don't show the button if we are already on the "Post Ad" page
  if (pathname === "/post-ads") return null;

  return (
    <Link
      href="/post-ads"
      className="fixed bottom-6 md:hidden right-6 z-50 flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-90"
      aria-label="Sell Item"
    >
      <Plus size={28} strokeWidth={2.5} />
    </Link>
  );
}