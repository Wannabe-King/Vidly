module.exports = function(err,req,res,next){

    //Internal Server Error
    res.status(500).send('Internal Server Error');
}