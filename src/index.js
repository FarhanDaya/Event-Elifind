const express = require('express');
require('../src/db/mongoose');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const session = require('express-session');
const sessionStore = require('connect-mongo')(session)
const app = express();
const port = process.env.PORT || 3000

app.use(express.json()); 
app.use(express.urlencoded( {extended: true}));
// app.use(session({

//     store:new sessionStore({mongooseConnection:mongoose.connection}),
//     name:'sid2',
//     resave:false,
//     saveUninitialized:false,
//     secret:process.env.SSECRET,
//     maxAge:86400000 ,
//     cookie:{
//       maxAge:86400000,
//       sameSite:true,
//       secure:true
//     }
  
// }));
app.use('/User',userRouter);

app.get('/',async(req,res)=>{
    res.send("Welcome!")
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})