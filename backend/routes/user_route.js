const express =require('express');
const router=express.Router();
const {userRegistration,userLogin,uploadUserProfile,skipUserProfile,getUserData,getOtherUserData,getTopUsers,toggleFollowers}=require('../controller/UserController');
const authMiddleware =require("../middleware/auth-Middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
router.post('/register',userRegistration);
router.post('/login',userLogin);
router.put("/profile",authMiddleware,uploadMiddleware.single("profileImage"),uploadUserProfile);
router.put("/profile-skip",authMiddleware,skipUserProfile); // now its not use mignt use later 
router.get('/get-user-info',authMiddleware,getUserData);
router.get('/get-other-user-info/:id',authMiddleware,getOtherUserData);
router.get('/get-top-users',authMiddleware,getTopUsers);
router.put('/toggle-followers/:id',authMiddleware,toggleFollowers);

// router.get('/test',authMiddleware,(req,res)=>{
//     res.status(200).json({
//         success:true,
//         message:"this is test for authmiddleware "
//     })
// });
module.exports=router;