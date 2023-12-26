const mongoose=require("mongoose")
const Joi=require('joi');

const genreSchema=new mongoose.Schema({
    name:{type: String, required: true,minlength:1}
});

//Genre definition
const Genre=mongoose.model("Genre",genreSchema);


//Genre validation
function validateGenre(name){
    const schema=Joi.object({name:Joi.string().required()});
    return schema.validate(name);
}

exports.genreSchema=genreSchema;
module.exports.Genre=Genre;
exports.validateGenre=validateGenre;