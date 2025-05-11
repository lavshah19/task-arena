const mongoose=require("mongoose");
const connectToDB =async()=>{
    try{
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("mongodb connect successflly");
        
    }catch(error){
        console.log('cannot connect to mongodb',error);
        process.exit(1);
        
    }
   
}
module.exports=connectToDB;