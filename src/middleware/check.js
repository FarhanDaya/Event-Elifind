const User = require('../models/user');
const bcrypt = require('bcryptjs');

const check = async(req,res,next)=>{

  const find = await User.findById(req.user._id);

  const result = await bcrypt.compare(req.body.Password,find.Password);
  console.log(result)
  if(!result){
      return res.send({error:'Current Password is incorrect!'});
  }
  
  next();


}

module.exports  = check;