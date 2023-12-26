const express=require("express")
const router=express.Router()
const {Genre,validateGenre}=require("../models/genre")
const authorizedUser=require('../middleware/auth')
const isAdmin=require('../middleware/admin')

//Genre endpoints
router.get('/',async (req,res)=>{
    try{
        const genres=await Genre.find().sort('name');
        res.send(genres);
    }
    catch(error){
        res.status(500).send('Internal Server Error');
    }
})

router.get('/:id',async (req,res)=>{
    try{
        const genre=await Genre.findById(req.params.id);
        res.send(genre);
    }
    catch(error){
        if(error.name=='CastError') return res.status(400).send('Invalid Genre Id')
        res.status(500).send('Internal Server Error')
    }
})

router.post('/',[authorizedUser,isAdmin],async (req,res)=>{
    const {error}=validateGenre(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let genre=new Genre({
            name: req.body.name,
    })

    genre=await genre.save()

    res.send(genre);
})

router.put('/:id',[authorizedUser,isAdmin],async (req,res)=>{
    const {error}=validateGenre(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }

    try{
        const genre= await Genre.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true});
        res.send(genre);
    }
    catch(error){
        if(error.name=='CastError') return res.status(400).send('Invalid Genre Id')
        res.status(500).send('Internal Server Error')
    }
})


router.delete('/:id',[authorizedUser,isAdmin],async (req,res)=>{
    try{
        const genre=await Genre.findByIdAndDelete(req.params.id)
        res.send(genre);
    }
    catch(error){
        if(error.name=='CastError') return res.status(400).send('Invalid Genre Id')
        res.status(500).send('Internal Server Error')
    }
})


module.exports=router;