const mongoose=require("mongoose")
const Joi=require('joi');
const {genreSchema}=require('../models/genre');
const number = require("joi/lib/types/number");

const movieSchema=new mongoose.Schema({
    title:{type: String, required: true,trim:true,minlength:5,maxlength:255},
    genre:{type:genreSchema,required:true},
    numberInStock:{type:Number,required:true,min:0},
    dailyRentalRate:{type:Number,required:true,min:0}
});

//Genre definition
const Movie=mongoose.model("Movie",movieSchema);


//Genre validation
function validateMovie(movie){
    const schema={title:Joi.string().min(5).max(255).required(),
    genreId:Joi.string().required(),
    numberInStock:Joi.number().min(0).required(),
    dailyRentalRate:Joi.number().min(0).required()
    };
    return Joi.validate(movie,schema);
}

module.exports.Movie=Movie;
exports.validateMovie=validateMovie;