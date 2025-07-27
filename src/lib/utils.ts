import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import imageCompression from "browser-image-compression";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageCompression = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };
  const compressedFile = await imageCompression(file, options);
  return compressedFile;
};

export function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = (e.target?.result as string) ?? "";
      const base64 = result.split(",")[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
