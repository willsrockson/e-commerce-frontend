import Link from "next/link";
import { TriangleAlert, ChevronRight } from "lucide-react";

export default function MissingPhoneBanner() {
  return (
    <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      
      {/* Icon + Text */}
      <div className="flex gap-3">
        <div className="bg-red-100 p-2 rounded-full flex-shrink-0 h-fit">
           <TriangleAlert className="text-red-600" size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            Action Required
          </h3>
          <p className="text-sm text-gray-600 mt-0.5">
            You need a verified primary phone number before you can list an item.
          </p>
        </div>
      </div>

      {/* Call To Action Button */}
      <Link 
        href="/profile"
        className="whitespace-nowrap flex items-center gap-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
      >
        Add Phone Number
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}