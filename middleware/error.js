const winston=require('winston')

module.exports = function(err,req,res,next){

    winston.error(err.message,err)
    //Internal Server Error
    res.status(500).send('Internal Server Error');
}