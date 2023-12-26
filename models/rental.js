const mongoose=require('mongoose')
const Joi=require('joi')

const rentalSchema=new mongoose.Schema({
    customer:{
        type: new mongoose.Schema({
            name:{type: String,required:true},
            isGold:{type:Boolean, default:false},
            phone:{type:String,minlength:10,maxlength:10,required:true}
        }),
        required:true
    },
    movie:{
        type:new mongoose.Schema({
            title:{type:String,minlength:5,trim:true,maxlength:255,required:true},
            dailyRentalRate:{type:Number,min:0,required:true},
        })
        ,required:true
    },
    dateOut:{type:Date,required:true,default:Date.now},
    dateReturn:{type:Date},
    rentalFee:{type:Number,default:0,min:0}
})


const Rental=new mongoose.model('Rental',rentalSchema)


function validateRental(rental){
    const schema=Joi.object({
        customerId:Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        movieId:Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })

    return schema.validate(rental);
}

exports.Rental=Rental;
exports.validateRental=validateRental;