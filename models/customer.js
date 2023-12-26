const mongoose=require("mongoose")
const Joi=require('joi');

//Customer Definition
const Customer=mongoose.model("Customer",new mongoose.Schema({
    name:{type: String, required: true},
    phone:{type:String,required:true,minlength:10,maxlength:10},
    isGold: {type:Boolean,default:false}}));


//Customer Validation
function validateCustomer(customer){
        const schema={
            name:Joi.string().required(),
            phone:Joi.string().min(10).max(10).required(),
            isGold:Joi.boolean()
            }
        return Joi.validate(customer,schema);
}

module.exports.Customer=Customer;
exports.validateCustomer=validateCustomer;