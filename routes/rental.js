const express=require('express')
const router=express.Router()
const {Rental,validateRental}=require('../models/rental')
const { Customer } = require('../models/customer')
const { Movie } = require('../models/movie')

const { MongoClient, ClientSession } = require('mongodb');

router.get('/',async (req,res)=>{
    try{
        const rentals=await Rental.find().sort("-dateOut")
        res.send(rentals)
    }
    catch(error){
        res.status(500).send('Internal Server Error')
    }
})


router.get('/:id',async (req,res)=>{
    try {
        const rental=await Rental.findbyId(req.params.id)
        res.send(rental)
    } catch (error) {
        if(error.name=='CastError') return res.status(400).send('Invalid Rental Id')
        res.status(500).send("Internal Server Error")
    }
})

router.post('/',async (req,res)=>{
    const {error}= await validateRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try {
        await Customer.findById(req.body.customerId)
    } catch (error) {
        if(error.name=='CastError') return res.status(400).send('Invalid Customer Id')
        res.status(500).send('Internal Server Error')
    }

    try{
        await Movie.findById(req.body.movieId)
    }
    catch(error){
        if(error.name=='CastError') return res.status(400).send('Invalid Movie Id')
        res.status(500).send('Internal Server Error')
    }

    const customer=await Customer.findById(req.body.customerId)
    const movie=await Movie.findById(req.body.movieId)

    if(movie.numberInStock==0) return res.status(400).send('Movie out of Stock')

    let rental=new Rental({
        customer:{
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
        },
        movie:{
            _id:movie._id,
            title:movie.title,
            dailyRentalRate:movie.dailyRentalRate
        }
    })


    //Transaction from below Source
    
    //https://medium.com/@siddiquiaffan201/mongodb-transactions-in-node-js-a-comprehensive-guide-7f8bc4d363a6
    
    try{
        const client = new MongoClient('mongodb://localhost:27017');
        // Create a new session.
        const session = client.startSession();
        // Create a reservation.
        await createReservation(client, session);
        // End the session.
        await session.endSession();
        res.send(rental)
    }
    catch(error){
        res.status(400).send('Failed to Rent')
    }

    async function createReservation(client, session) {
        // Start a new transaction.
        await session.withTransaction(async () => {
          // Create a new reservation document.
          const reservation = await client.db('vidly').collection('rentals').insertOne(rental);
          // Update the inventory to reflect the new reservation.
          await client.db('vidly').collection('movies').updateOne({_id:movie._id}, {$inc: { numberInStock: -1 }});
        });
    }
    

    //Implementation Without Transaction

    // rental=await rental.save()
    // movie.numberInStock=(--movie.numberInStock)
    // movie.save();
    // res.send(rental)


})

module.exports=router