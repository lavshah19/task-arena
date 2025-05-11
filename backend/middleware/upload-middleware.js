// Import multer (for handling file uploads) and path (to work with file extensions)
const multer = require('multer');
const path = require('path');

// ======================================
// Set up multer disk storage configuration
// ======================================
const storage = multer.diskStorage({
    // Define where the uploaded files should be stored (local folder)
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Make sure this "uploads/" folder exists in your project || “Hey Multer, save this file inside the uploads/ folder.”
    },
    // Define how the uploaded file should be named
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
            // Example output: image-1713456791234.jpg
        );
    }
});

// ======================================
// File filter to accept only image files
// ======================================
const checkFileFilter = (req, file, cb) => {
    // Check if the uploaded file's mimetype starts with "image"
    if (file.mimetype.startsWith('image')) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Not an image! Please upload only images.'), false); // Reject the file
    }
};
//Using null as the first argument is a standard Node.js convention to say:
//"No error happened, continue normally."

// ======================================
// Export configured multer middleware
// ======================================
module.exports = multer({
    storage: storage,             // Use the storage config defined above
    fileFilter: checkFileFilter,  // Use custom filter to allow only images
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit file size to 5 MB
    }
});

