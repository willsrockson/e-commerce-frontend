"use client"
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { Spinner } from '../ui/spinner';
import { useState, CSSProperties } from 'react';
import { BackendResponseType } from '@/lib/interfaces';
import { toastError, toastSuccess } from '../toasts/toasts';

interface ISort {
    removeImage: (fileName: string)=> void;
    preview: string;
    id: string ;
    fetchUrl?: string;
    adsId: string;
}

export default function SortableImages({ preview, id, removeImage, adsId, fetchUrl}: ISort) {
    
    const [loading, setLoading] = useState(false);
    
    // 1. Extract 'transition' from hook
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: id,
    });

    const style: CSSProperties = {
        transform: CSS.Translate.toString(transform),
        transition,
        WebkitTouchCallout: "none",
        userSelect: "none",
        
    };

    async function deleteImage(idToRemove: string) {
       // ... existing logic stays the same ...
       if (idToRemove.includes("https://res.cloudinary.com")) {
          try {
             if (!adsId || !fetchUrl) return;
             setLoading(true);
             const res = await fetch(`${fetchUrl}${adsId}/del/image`, {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl: idToRemove }),
             });
             const json = (await res.json()) as BackendResponseType;
             if (!res.ok) {
                toastError({ message: json?.error.message });
                return;
             }
             removeImage(idToRemove);
             toastSuccess({ message: json?.message });
          } catch {
             toastError({ message: "Oops, an unexpected error happened." });
          } finally {
             setLoading(false);
          }
       } else {
           removeImage(idToRemove)
       }
    }
    
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            // 3. Changed 'touch-none' to 'touch-manipulation'
            // This allows the user to SCROLL the list by swiping on the images.
            className="relative rounded-md group min-w-20 h-20 cursor-pointer touch-manipulation"
        >
            <Image
                src={preview}
                alt={`preview-${id}`}
                width={80}
                height={80}
                className="min-w-20 h-20 object-cover rounded-md bg-blue-200"
                // Prevent the image itself from being draggable (ghost image issue)
                draggable={false} 
            />
            <button
                type="button"
                disabled={loading}
                // 4. Stop Propagation: Prevents 'Drag Start' when you just want to delete
                onPointerDown={(e) => e.stopPropagation()} 
                onClick={() => { deleteImage(id)}}
                className={`cursor-pointer absolute top-1 right-1 bg-black text-white text-xs rounded-full px-2 py-1 ${loading ? 'md:block' : 'md:hidden'} group-hover:block group-active:block`}
            >
            {loading ? <Spinner/> : '×'}
            </button>
        </div>
    );
}






























// "use client"
// import { useSortable } from '@dnd-kit/sortable';

// import { CSS } from '@dnd-kit/utilities';
// import Image from 'next/image';
// import { Spinner } from '../ui/spinner';
// import { useState } from 'react';
// import { BackendResponseType } from '@/lib/interfaces';
// import { toastError, toastSuccess } from '../toasts/toasts';

// interface ISort {
//     removeImage: (fileName: string)=> void;
//     preview: string;
//     id: string ;
//     fetchUrl?: string;
//     adsId: string;
// }


// export default function SortableImages({ preview, id, removeImage, adsId, fetchUrl}: ISort) {
    
//     const [loading, setLoading] = useState(false);
//     const { attributes, listeners, setNodeRef, transform } = useSortable({
//         id: id,
//     });
//     const style = {
//         transform: CSS.Translate.toString(transform),
//     };
//     // /api/auth/fetch/mobile/ads/
//     async function deleteImage(idToRemove: string) {
        
//        if (idToRemove.includes("https://res.cloudinary.com")) {
//           try {
//              if (!adsId || !fetchUrl) return;
//              setLoading(true);
//              const res = await fetch(`${fetchUrl}${adsId}/del/image`, {
//                 method: "DELETE",
//                 credentials: "include",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ imageUrl: idToRemove }),
//              });
//              const json = (await res.json()) as BackendResponseType;
//              if (!res.ok) {
//                 toastError({
//                    message: json?.error.message,
//                 });
//                 return;
//              }

//              removeImage(idToRemove);

//              toastSuccess({
//                 message: json?.message,
//              });
//           } catch {
//              toastError({ message: "Oops, an unexpected error happened." });
//              return;
//           } finally {
//              setLoading(false);
//           }
//        }else{
//            removeImage(idToRemove)
//        }
//     }
    
//     return (
//         <div
//             ref={setNodeRef}
//             style={style}
//             {...listeners}
//             {...attributes}
//             className="relative rounded-md group min-w-20 h-20 cursor-pointer touch-none"
//         >
//             <Image
//                 src={preview}
//                 alt={`preview-${id}`}
//                 width={80}
//                 height={80}
//                 className="min-w-20 h-20 object-cover rounded-md bg-blue-200"
//             />
//             <button
//                 type="button"
//                 disabled={loading}
//                 onClick={() => { deleteImage(id)}}
//                 className={`cursor-pointer absolute top-1 right-1 bg-black text-white text-xs rounded-full px-2 py-1 ${loading ? 'md:block' : 'md:hidden'} group-hover:block group-active:block`}
//             >
//             {loading ? <Spinner/> : '×'}
//             </button>
//         </div>
//     );
// }
