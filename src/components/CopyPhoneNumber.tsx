"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Copy, PhoneCall, Smartphone } from "lucide-react";
import { toastSuccess } from "./toasts/toasts";

type Data = {
  phonePrimary: string;
  phoneSecondary: string;
};

export default function CopyPhoneNumber({ phonePrimary, phoneSecondary }: Data) {
  
  const handleCopy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toastSuccess({ message: "Number copied to clipboard" });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Made button slightly wider and used a color accent if available */}
        <Button 
          className="cursor-pointer gap-2 min-w-[100px] bg-[#9DBDFF] text-black border-[#9DBDFF] hover:bg-[#8bc0ff] hover:text-black" 
          variant={"outline"}
        >
          <PhoneCall size={16} /> 
          <span>Call</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="center"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="w-[260px] p-2" 
      >
        <DropdownMenuLabel className="text-xs text-gray-500 font-normal uppercase tracking-wider mb-1">
          Contact Numbers
        </DropdownMenuLabel>
        
        {phonePrimary && (
          <DropdownMenuItem
            onClick={() => handleCopy(phonePrimary)}
            className="flex justify-between items-center py-3 px-3 cursor-pointer rounded-md focus:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              {/* Nice icon container */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                <PhoneCall size={14} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-800">{phonePrimary}</span>
                <span className="text-[10px] text-gray-400">Primary</span>
              </div>
            </div>
            
            <Copy size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
          </DropdownMenuItem>
        )}

        {phoneSecondary && phonePrimary && <DropdownMenuSeparator className="my-1 bg-gray-100" />}

        {phoneSecondary && (
          <DropdownMenuItem
            onClick={() => handleCopy(phoneSecondary)}
            className="flex justify-between items-center py-3 px-3 cursor-pointer rounded-md focus:bg-gray-50 transition-colors group"
          >
             <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                <Smartphone size={14} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-800">{phoneSecondary}</span>
                <span className="text-[10px] text-gray-400">Secondary</span>
              </div>
            </div>
            
            <Copy size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


































// "use client";

// import {
//    DropdownMenu,
//    DropdownMenuContent,
//    DropdownMenuItem,
//    DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "./ui/button";
// import { Copy, PhoneCall } from "lucide-react";
// import { toastSuccess } from "./toasts/toasts";

// type Data = {
//    phonePrimary: string;
//    phoneSecondary: string;
// };

// export default function CopyPhoneNumber({ phonePrimary, phoneSecondary }: Data) {
//    const copyTextAlert = async () => {
//       toastSuccess({ message: "Copied" });
//    };

//    return (
//       <DropdownMenu>
//          <DropdownMenuTrigger asChild>
//             <Button
//                className="cursor-pointer"
//                variant={"outline"}
//             >
//                <PhoneCall size={16} /> Reveal contact
//             </Button>
//          </DropdownMenuTrigger>
//          <DropdownMenuContent
//             onCloseAutoFocus={(e) => {
//                e.preventDefault();
//                e.stopPropagation();
//             }} // Remove black focus on the input field
//             className="w-[--radix-dropdown-menu-trigger-width] flex flex-col justify-center items-center"
//          >
//             {phonePrimary && (
//                <DropdownMenuItem>
//                   {" "}
                 
//                   <span
//                      onClick={async () => {
//                         await navigator.clipboard.writeText(phonePrimary);
//                         await copyTextAlert();
//                      }}
//                      className="flex items-center gap-1 cursor-pointer"
//                   >
//                      {phonePrimary} <Copy />
//                   </span>
//                </DropdownMenuItem>
//             )}

//             {phoneSecondary && (
//                <DropdownMenuItem>
//                   <span
//                      onClick={async () => {
//                         await navigator.clipboard.writeText(phoneSecondary ? phoneSecondary : "");
//                         await copyTextAlert();
//                      }}
//                      className="flex items-center gap-1 cursor-pointer"
//                   >
//                      {phoneSecondary} <Copy />
//                   </span>{" "}
//                </DropdownMenuItem>
//             )}
//          </DropdownMenuContent>
//       </DropdownMenu>
//    );
// }
