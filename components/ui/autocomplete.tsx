"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface Suggestion {
    name: string;
    fullName: string;
    coordinates: [number, number];
}

interface AutocompleteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    onChangeValue: (value: string) => void;
    onSelectCallback?: (suggestion: Suggestion) => void;
    placeholder?: string;
    className?: string;
}

export function AutocompleteInput({
    value,
    onChangeValue,
    onSelectCallback,
    placeholder,
    className,
    ...props
}: AutocompleteInputProps) {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const justSelectedRef = useRef(false);

    const debouncedQuery = useDebounce(query, 300);

    // Sync external value
    useEffect(() => {
        setQuery(value);
    }, [value]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch suggestions
    useEffect(() => {
        async function fetchSuggestions() {
            if (!debouncedQuery || debouncedQuery.length < 2) {
                setSuggestions([]);
                return;
            }

            // Skip fetch if user just selected a suggestion
            if (justSelectedRef.current) {
                justSelectedRef.current = false;
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(`/api/maps/autocomplete?q=${encodeURIComponent(debouncedQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    const items = data.data?.suggestions || data.suggestions || [];
                    setSuggestions(items);
                    if (items.length > 0) setIsOpen(true);
                }
            } catch (error) {
                console.error("Autocomplete error:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSuggestions();
    }, [debouncedQuery]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        onChangeValue(val);
        if (val.length >= 2) setIsOpen(true);
    };

    const handleSelect = (suggestion: Suggestion) => {
        justSelectedRef.current = true;
        setQuery(suggestion.name);
        onChangeValue(suggestion.name);
        setIsOpen(false);
        if (onSelectCallback) {
            onSelectCallback(suggestion);
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-full h-full flex items-center">
            <input
                type="text"
                placeholder={placeholder}
                className={className}
                value={query}
                onChange={handleInputChange}
                onFocus={() => {
                    if (suggestions.length > 0) setIsOpen(true);
                }}
                {...props}
            />

            {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface-bg rounded-2xl shadow-xl border border-surface-outline/10 overflow-hidden z-[100]">
                    <ul className="max-h-60 overflow-y-auto py-2">
                        {suggestions.map((suggestion, idx) => (
                            <li
                                key={idx}
                                className="px-4 py-3 hover:bg-surface-low cursor-pointer transition-colors border-b last:border-0 border-surface-outline/5"
                                onClick={() => handleSelect(suggestion)}
                            >
                                <div className="font-semibold text-text-primary text-sm whitespace-nowrap overflow-hidden text-ellipsis">{suggestion.name}</div>
                                <div className="text-xs text-text-secondary whitespace-nowrap overflow-hidden text-ellipsis mt-0.5">{suggestion.fullName}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
