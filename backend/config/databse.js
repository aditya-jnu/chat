const mongoose=require('mongoose')
require('dotenv').config();

const dbConnect=()=>{
    const uri = process.env.DATABASE_URL;
    console.log("URI ",uri) // Check if DATABASE_URL is properly set
        if (!uri) {
            throw new Error('DATABASE_URL is not defined in environment variables');
        }
    mongoose.connect(uri,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("DB connection successfull!!")
    }).catch((error)=>{
        console.log(error);
        console.log("Error in DB connection.")
    })
}

module.exports=dbConnect;