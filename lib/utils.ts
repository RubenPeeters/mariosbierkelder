import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  // // Find the last space within the maxLength
  // const lastSpace = text.lastIndexOf(' ', maxLength);

  // if (lastSpace > 0) {
  //   // Truncate at the last space to avoid cutting in the middle of a word
  //   return text.substr(0, lastSpace) + '...';
  // }

  // If no space is found, truncate directly to the maxLength
  // This case happens if there's a very long word at the start
  return text.substr(0, maxLength) + '...';
}