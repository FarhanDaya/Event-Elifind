const User = require('../models/user');
const querystring = require('querystring');

const unique = async(req,res,next)=>{
    const  find = await User.findOne({Email:req.body.Email})
    if(find!=null){
        return res.send({error:'Account with this email address already exists!'});
    }
    
    next();
    
}

module.exports = unique;