const express=require("express")
const _=require('lodash')
const bcrypt=require('bcryptjs')
const router=express.Router()
const {User}=require("../models/user")
const Joi=require('joi')

//Register User endpoints
router.post('/',async (req,res)=>{
    const {error}=validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user=await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('User Not Registered');

    const login=await bcrypt.compare(req.body.password,user.password);
    if(!login) return res.status(400).send('Invalid Email or Password')
    
    const token=user.generateAuthToken();
    res.send(token)
})

function validate(req){
    const schema=Joi.object({
        email:Joi.string().required().email(),
        password:Joi.string().min(6).required()
        })
    return schema.validate(req);
} 



module.exports=router;