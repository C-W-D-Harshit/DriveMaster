import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DUMMYUSERID = "c4a4cd5a-3498-4d38-8703-a2485bb483e5";
