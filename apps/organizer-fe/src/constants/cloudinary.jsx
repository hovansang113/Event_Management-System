export const CLOUDINARY_CONFIG = {
    cloudName:
        import.meta.env.VITE_CLOUDINARY_NAME,

    uploadPreset:
        import.meta.env.VITE_CLOUDINARY_PRESET,

    uploadUrl: (cloudName) =>
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
};