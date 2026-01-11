import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes using clsx and tailwind-merge.
 * This ensures that conditional classes are handled correctly 
 * and that conflicting Tailwind classes are resolved (last one wins).
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}