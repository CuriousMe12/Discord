import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Why we require this util??
 *  To add conditional CSS
 *  by default -> i want bg-blue-500
 *  state changes & true -> I want bg-red-500
 *
 *  This kind of conditional rendering of classes is handled by this inbuild utils
 * */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
