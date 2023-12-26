const express=require("express")
const router=express.Router()
const {Movie,validateMovie}=require("../models/movie.js")
const {Genre}=require('../models/genre.js')

//Movie endpoints
router.get('/',async (req,res)=>{
    try{
    const movies=await Movie.find().sort('title');
    res.send(movies);
    }
    catch(error){
        res.status(500).send("Internal Server Error")
    }
})

router.get('/:id',async (req,res)=>{
    try{
    const movie=await Movie.findById(req.params.id);
    res.send(movie);
    }
    catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).send('Invalid movie ID');
        }
        res.status(500).send('Internal Server Error');
    }
})

router.post('/',async (req,res)=>{
    const {error}=validateMovie(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    try{
        await Genre.findById(req.body.genreId)
    }
    catch(error){
        if(error.name=="CastError") return res.status(400).send('Invalid genre Id')
    }

    const genre=await Genre.findById(req.body.genreId)

    let movie=new Movie({
            title: req.body.title,
            genre: {
                _id:genre._id,
                name:genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
    })

    movie=await movie.save()

    res.send(movie);
})

router.put('/:id',async (req,res)=>{
    const {error}=validateMovie(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }

    try{
        await Genre.findById(req.body.genreId)
    }
    catch(error){
        if(error.name=="CastError") return res.status(400).send('Invalid genre Id')
    }

    const genre=await Genre.findById(req.body.genreId)

    try{const movie= await Movie.findByIdAndUpdate(req.params.id,
        {title: req.body.title,
        genre: {
            _id:genre._id,
            name:genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate},
        {new:true});

    res.send(movie);}
    catch(error){
        if(error.name=="CastError") return res.status(400).send('Invalid Movie Id')
        res.status(500).send('Internal Server Error')
    }
})


router.delete('/:id',async (req,res)=>{
    try{
        const movie=await Movie.findByIdAndDelete(req.params.id)
        res.send(movie);
    }
    catch(error){
        res.status(404).send('The given movie not found');
    }

    
})


module.exports=router;