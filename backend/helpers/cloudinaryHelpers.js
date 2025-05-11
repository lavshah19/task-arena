const cloudinary=require("../config/cloudinary");
const uploadToCloudinary=async(filePath)=>{
try{
    const result=await cloudinary.uploader.upload(filePath)

    return {
        url: result.secure_url,    // URL of the uploaded image (accessible online)
        publicId: result.public_id // Unique ID assigned by Cloudinary (used for deleting later)
    };

}catch(error){
    console.log('Error while uploading to Cloudinary:', error);
    throw new Error('Error while uploading to Cloudinary');
}
}

module.exports = {
    uploadToCloudinary
};