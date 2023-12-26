const mongoose=require("mongoose")
const Joi=require('joi');
const jwt=require('jsonwebtoken')
const config=require('config')

const userSchema=new mongoose.Schema({
    name:{type: String, required: true},
    email:{type:String,required:true,unique:true},
    password: {type:String,minlength:6,required:true},
    isAdmin:Boolean
})

//Adding a method for Genreating Auth token for login of user
userSchema.methods.generateAuthToken= function(){
    const token=jwt.sign({_id:this._id,isAdmin:this.isAdmin},config.get("jwtPrivateKey"));
    return token;
}

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