const User = require('../models/user');
const querystring = require('querystring');

const unique = async(req,res,next)=>{
    const  find = await User.findOne({Email:req.body.Email})
    if(find!=null){
        req.flash('signupError','Account with this email address already exists!');
        return res.send(false);
     
    }
    
    next();
    
}

module.exports = unique;