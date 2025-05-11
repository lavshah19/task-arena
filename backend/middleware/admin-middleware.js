
const isAdminUser=(req,res,next)=>{
    if(req.userInfo.role!=='admin'){
        return res.status(403).json({
            success:false,
            message:'access denies! Admin rights required'
        })
        
    }
    next();
}
module.exports=isAdminUser; 
//haven't used this yet if i see any feature where i need to check if the user is admin or not then i will use this middleware