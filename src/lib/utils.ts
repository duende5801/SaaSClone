import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeTrailingSlash(path: string) {
  return path.replace(/\/$/, "");
}

export function createURL(
  href: string,
  oldParams: Record<string, string>,
  newParams: Record<string, string | undefined>
) {
  const encode = (key: string, value: string) =>
    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

  const oldParamsEntries = Object.entries(oldParams).filter(
    ([key, value]) => typeof key === "string" && typeof value === "string"
  );

  const params = new Map<string, string>(
    oldParamsEntries.map(([key, value]) => [key, value])
  );

  Object.entries(newParams).forEach(([key, value]) => {
    if (value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  const queryString = Array.from(params.entries())
    .map(([key, value]) => encode(key, value))
    .join("&");

  return `${href}?${queryString}`;
}
