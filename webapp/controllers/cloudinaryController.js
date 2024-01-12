const cloudinary = require('cloudinary').v2
const fs = require('fs');

// Servicio Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadImage(filePath){
    return await cloudinary.uploader.upload(filePath, { folder: 'egresados' }, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
            fs.unlinkSync(filePath);
        }
    });
}

module.exports = uploadImage;