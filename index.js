const express=require("express");
const app=express();


require('./startup/loging')()
require('./startup/routes')(app)
require('./startup/db')();
require('./startup/config')();



const port=process.env.PORT || 3000
let server=app.listen(port,()=>{console.log(`listening to ${port}`)})

module.exports={app}