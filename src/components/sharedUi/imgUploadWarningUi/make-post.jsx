export default function MakePostImageUploadWarningUi() {
    return (
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 mb-4">
            <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h16M4 18h16M4 12h8"
                    />
                </svg>
                Photo Guidelines
            </h4>

            <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        Min 2 – Max 7
                    </span>
                    <span>photos allowed</span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                        Main photo
                    </span>
                    <span>First photo</span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Drag & Drop
                    </span>
                    <span>To reorder photos easily</span>
                </li>
            </ul>
        </div>
    );
}
