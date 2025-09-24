"use client"
import { useSortable } from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';


interface ISort {
    removeImage: (fileName: string | number)=> void;
    preview: string;
    id: string | number;
}


export default function SortableImages({ preview, id, removeImage}: ISort) {
    const { attributes, listeners, setNodeRef, transform } = useSortable({
        id: id,
    });
    const style = {
        transform: CSS.Translate.toString(transform),
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="relative rounded-md group min-w-20 h-20 cursor-pointer"
        >
            <Image
                src={preview}
                alt={`preview-${id}`}
                width={80}
                height={80}
                className="min-w-20 h-20 object-cover rounded-md bg-blue-200"
            />
            <button
                type="button"
                onClick={() => removeImage(id)}
                className="cursor-pointer absolute top-1 right-1 bg-black text-white text-xs rounded-full px-2 py-1 md:hidden group-hover:block group-active:block"
            >
                ×
            </button>
        </div>
    );
}
