const express=require("express")
const router=express.Router()
const {Customer,validateCustomer}=require("../models/customer")
// const Customer=customerModel.Customer
// const validateCustomer=customerModel.validateCustomer;


//Customer endpoints
router.get('/',async (req,res)=>{
    try{
        const customers=await Customer.find().sort('name');
        res.send(customers);
    }
    catch(error){
        res.status(500).send('Internal Sever Error')
    }
})

router.get('/:id',async (req,res)=>{
    try{
        const customer=await Customer.findById(req.params.id);
        res.send(customer);
    }
    catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).send('Invalid Customer ID');
        }
        res.status(500).send('Internal Server Error');
    }
})

router.post('/',async (req,res)=>{
    const {error}=validateCustomer(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    let customer=new Customer({
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
    })

    customer=await customer.save()

    res.send(customer);
})

router.put('/:id',async (req,res)=>{
    const {error}=validateCustomer(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
    }

    try{
        const customer= await Customer.findByIdAndUpdate(req.params.id,
        {name:req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold},
        {new:true}
        );

        res.send(customer);
    }
    catch(error){
        if(error.name=='CastError') return res.status(400).send('Invalid Customer Id')
        res.status(500).send('Internal Server Error')
    }
})


router.delete('/:id',async (req,res)=>{
    try{
        const customer=await Customer.findByIdAndDelete(req.params.id)
        res.send(customer);
    }
    catch(error){
        if(error.name="CastError") return res.status(400).send('Invalid Customer Id')
        res.status(500).send('Internal Server Error')
    }
})


module.exports=router;