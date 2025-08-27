const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
      destination: function (req, file, cb) {
           cb(null, "uploads/"); 
       },
      
       filename: function (req, file, cb) {
           cb(
               null,
               file.fieldname + "-" + Date.now() + path.extname(file.originalname)
               // Example output: image-1713456791234.jpg
           );
       }
});
// File filter to accept any file type
const checkFileFilter = (req, file, cb) => {
    // Accept all files
    cb(null, true);
};
// Using null as the first argument is a standard Node.js convention to say:
// "No error happened, continue normally."
// Export configured multer middleware
module.exports = multer({
    storage: storage,             // Use the storage config defined above
    fileFilter: checkFileFilter,  // Use custom filter to allow all files
    limits: {
        fileSize: 10 * 1024 * 1024 // Limit file size to 10 MB
    }
});

