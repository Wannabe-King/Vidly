const genres = require("../routes/genre")
const customers = require("../routes/customer")
const movies = require("../routes/movie")
const rentals = require("../routes/rental")
const user = require('../routes/user')
const auth = require('../routes/auth')
const error=require('../middleware/error')
const express = require("express");


module.exports=function(app){
    app.use(express.json());
    app.use("/api/genres", genres);
    app.use("/api/customers", customers);
    app.use("/api/movies", movies);
    app.use("/api/rentals", rentals);
    app.use("/api/register", user);
    app.use('/api/auth', auth);

    //middleware to handle exceptions

    app.use(error)
}
