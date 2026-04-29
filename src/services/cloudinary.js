import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const connectCloudinary = () => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_MY_KEY,
      api_secret: process.env.CLOUDINARY_MY_SECRET,
    });
  };


const uploadOnCloudinary = async (localFilePath) => {
    try {
        
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });

        fs.unlinkSync(localFilePath); // delete local file after successful upload too

        console.log('File successfully uploaded on cloudinary', response.url);

        return response;

    } catch (error) {
        console.log('Cloudinary upload error:', error);
        fs.unlinkSync(localFilePath); // delete local file if upload failed
        return null;
    }
};

export { uploadOnCloudinary, connectCloudinary };