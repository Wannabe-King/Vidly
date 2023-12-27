const mongoose=require("mongoose")

module.exports = async function (){
    await mongoose.connect("mongodb://localhost:27017/vidly")
    .then(console.log("Connected to DB successfully."))
    .catch(err=>console.error("Could not connect to DB",err))
}