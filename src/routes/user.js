const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const unique = require('../middleware/unique');



router.post('/Signup',unique,async (req,res)=>{
   
    const user = new User(req.body);
    try{
  
     await user.save();
     const token = await user.generateAuthToken();
     req.session.token = await token;
     res.send(true);
    }
    catch(e){
        res.send(e);
        
    }
  })

router.get('/test',async(req,res)=>{
    req.session.test = await "yes";
    res.send(req.session.test)
})

router.get('/testing',(req,res)=>{

    res.send(req.session.test)
   
})


module.exports = router;