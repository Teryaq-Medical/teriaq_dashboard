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

  // 3. Prefix with your Cloudinary base URL
  // Replace 'your-cloud-name' with your actual Cloudinary cloud name
  const CLOUDINARY_BASE = "https://res.cloudinary.com/drswiflul/";
  
  // Ensure we don't double slash if the path starts with /
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  return `${CLOUDINARY_BASE}${cleanPath}`;
};