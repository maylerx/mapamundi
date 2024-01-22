import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// Servicio Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadImage(filePath){
    return await cloudinary.uploader.upload(filePath, { folder: 'egresados' }, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            // Borra el archivo temporal
            fs.unlinkSync(filePath);
        }
    });
}

export async function deleteImage(imageUrl) {
    const list_url_parts = imageUrl.split('/');
    const imagen_id = list_url_parts[list_url_parts.length - 1].split('.')[0];
    console.log(imagen_id);

    return await cloudinary.uploader.destroy("egresados/"+imagen_id , { invalidate: true }, (error, result) => {
        if (error) {
            console.log("ERROR: ",error);
        }
    });
}