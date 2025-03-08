import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Token {
  iat: number;
  exp: number;
}

export function parseJwt(token: string | null): Token | undefined {
  if (!token) {
    return;
  }
  const base64Url = token.split(".")[1];

  const base64 = base64Url.replace("-", "+").replace("_", "/");
  return JSON.parse(window.atob(base64));
}
