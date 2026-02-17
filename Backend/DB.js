const  mongoose = require('mongoose')
require('dotenv').config();
const User = require('../Backend/model/UserScheme')
const connectdb= async()=>{

    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected..")
    }
    catch(error){
        console.log("Dikkat ho gayi yarr..")
        console.log(error)
         process.exit(1);
    }

}

module.exports= connectdb