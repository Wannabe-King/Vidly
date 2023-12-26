const mongoose=require("mongoose")
const Joi=require('joi');

const userSchema=new mongoose.Schema({
    name:{type: String, required: true},
    email:{type:String,required:true,unique:true},
    password: {type:String,minlength:6,required:true}
})

//Customer Definition
const User=mongoose.model("User",userSchema);


//Customer Validation
function validateUser(user){
        const schema=Joi.object({
            name:Joi.string().required(),
            email:Joi.string().required().email(),
            password:Joi.string().min(6).required()
            })
        return schema.validate(user);
} 

module.exports.User=User;
exports.validateUser=validateUser;