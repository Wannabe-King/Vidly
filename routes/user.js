const express=require("express")
const _=require('lodash')
const bcrypt=require('bcryptjs')
const router=express.Router()
const {User,validateUser}=require("../models/user")

//Register User endpoints

router.post('/',async (req,res)=>{
    const {error}=validateUser(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let isRegistered=await User.findOne({email:req.body.email});
    if(isRegistered) return res.status(400).send('Email Already Registred');

    // let user=new User({
    //         name: req.body.name,
    //         email: req.body.email,
    //         password: req.body.password
    // })

    let user=new User(_.pick(req.body,['name','email','password']))
    const salt=await bcrypt.genSalt(10)  //generating a random padding for password
    user.password=await bcrypt.hash(user.password,salt) //hashing the password

    await user.save()

    // res.send(user);
    //We don't want anybody to see the password so 

    const token=user.generateAuthToken();

    res.header('x-auth-token',token).send(_.pick(user,["_id","name","email"]))
})



module.exports=router;