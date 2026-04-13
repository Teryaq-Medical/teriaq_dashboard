// lib/image.ts

/**
 * Constructs a full Cloudinary URL or returns a fallback
 * @param path - The string coming from the database (partial path or null)
 * @param type - Determines the fallback icon/image (doctor vs hospital)
 */
export const getImageUrl = (path: string | null | undefined, type: 'doctor' | 'entity' = 'entity') => {
  // 1. Return a default placeholder if no path exists
  if (!path) {
    return type === 'doctor' 
      ? '/placeholders/default-doctor.png' 
      : '/placeholders/default-hospital.png';
  }

  // 2. If the backend already sent a full URL (http/https), return it as is
  if (path.startsWith('http')) {
    return path;
  }

  // 3. Cloudinary configuration (use environment variable)
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drswiflul';
  const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/`;

  // 4. Normalize the path: remove leading slashes
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // 5. If the path already contains '/image/upload/', just prepend base
  if (cleanPath.includes('/image/upload/')) {
    return `${CLOUDINARY_BASE}${cleanPath}`;
  }

  // 6. Otherwise, assume it's a public ID (or a path without the upload part)
  //    Ensure we add '/image/upload/'
  //    Also remove any 'image/upload' prefix if present (e.g., if the path is "image/upload/public_id")
  if (cleanPath.startsWith('image/upload/')) {
    cleanPath = cleanPath.replace('image/upload/', '');
  }
  return `${CLOUDINARY_BASE}image/upload/${cleanPath}`;
};