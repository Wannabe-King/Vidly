require('express-async-errors')
const winston=require('winston')
const express=require("express");
const app=express();
const genres=require("./routes/genre")
const customers=require("./routes/customer")
const movies=require("./routes/movie")
const rentals=require("./routes/rental")
const user=require('./routes/user')
const auth=require('./routes/auth')
const mongoose=require("mongoose")
const config=require('config')
const error=require('./middleware/error')

if(!config.get('jwtPrivateKey')) {
    console.log('FATAL ERROR : jwtPrivateKey is not defined') 
    process.exit(1);
}

async function createConnection(){
    await mongoose.connect("mongodb://localhost:27017/vidly")
    .then(console.log("Connected to DB successfully."))
    .catch(err=>console.error("Could not connect to DB",err))
}

createConnection();

app.use(express.json());
app.use("/api/genres",genres);
app.use("/api/customers",customers);
app.use("/api/movies",movies);
app.use("/api/rentals",rentals);
app.use("/api/register",user);
app.use('/api/auth',auth);

//middleware to handle exceptions

app.use(error)

const port=process.env.PORT || 3000
app.listen(port,()=>{console.log(`listening to ${port}`)})