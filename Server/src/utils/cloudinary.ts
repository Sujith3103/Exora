import { v2 as cloudinary } from 'cloudinary';

// Configure with env variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadMediaToCloudinary = async (filepath: string) => {
    try {
        const result = await cloudinary.uploader.upload(filepath, {
            resource_type: 'auto',
        });
        return result;
    } catch (err) {
        console.error(err);
        throw new Error('Error uploading to Cloudinary');
    }
};

export const deleteMediaFromCloudinary = async (publicId: string) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error(error);
        throw new Error('Failed to delete asset from Cloudinary');
    }
};
