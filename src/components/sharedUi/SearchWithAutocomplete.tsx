"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

interface SearchProps {
  placeholder?: string;
  className?: string;
  onSearch?: () => void;
}

export default function SearchWithAutocomplete({ 
  placeholder = "Search...", 
  className,
  onSearch
}: SearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    async function fetchSuggestions() {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(`/api/suggestions?q=${encodeURIComponent(debouncedQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      }
    }

    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    setIsOpen(false);
    if (onSearch) onSearch();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSearch(query); }} 
        className="relative flex items-center w-full"
      >
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => { if(suggestions.length > 0) setIsOpen(true); }}
          placeholder={placeholder}
          className="w-full pr-10" 
        />
        
        {query && (
           <div 
             onClick={() => { setQuery(""); setSuggestions([]); }}
             className="absolute right-12 top-1/2 -translate-y-1/2 cursor-pointer p-1 rounded-full hover:bg-gray-100 text-gray-400"
           >
             <X size={16} />
           </div>
        )}

        <Button 
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-full w-10 text-gray-500 hover:text-blue-600"
        >
            <Search size={20} />
        </Button>
      </form>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-50 overflow-hidden">
          <ul>
            {suggestions.map((term, index) => (
              <li 
                key={index}
                onClick={() => {
                  setQuery(term);
                  handleSearch(term);
                }}
                className="px-4 py-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 text-gray-700 text-sm"
              >
                <Search size={14} className="text-gray-400" />
                <span>
                    <span className="font-semibold">{query}</span>
                    {term.slice(query.length)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}