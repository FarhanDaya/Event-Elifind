const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Tokens = require('./token');
const sharp = require('sharp');

const userSchema = new mongoose.Schema({
    FirstName:{
        type:String,
        required:true,
        trim:true
    },
    LastName:{
        type:String,
        required:true,
        trim:true
    },
    Birthday:{
        type:Date,
        required:true
    },
    Gender:{
        type:String,
        required:true
    },
    Country:{
        type:String,
        required:true
    },
    City:{
        type:String,
        required:true,
        trim:true
    },
    Phone:{
        type:String,
        default:'0'
    },
    Email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email format not found!');
            }

        }
    },
    Password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,

    },
    Dp:{
        type:Buffer
        
    },
    ForgetPasswordToken:{
        type:String
    },
    FPTokenExpires:{
        type:Date
    }


},{
    timestamps:true
});

userSchema.virtual('token',{
    ref:'Tokens',
    localField:'_id',
    foreignField:'Owner'

});

userSchema.pre('save',async function(next){
    const user = this;
    if(user.isModified('Password')){
        user.Password = await bcrypt.hash(user.Password,8); 
    }
    next();
})

userSchema.statics.checkCredentials = async (Email,Password,next)=>{
    
    const user = await User.findOne({Email});

    if(!user){
        return false;
    }

    const pass = await bcrypt.compare(Password,user.Password);

    if(!pass){
        return false;
    }
    return user;
    
}

userSchema.methods.generateAuthToken = async function(){

    try{
    const user = this;
    let t;
    const findUserToken = await Tokens.findOne({Owner:user._id});
    if(!findUserToken){
        t = new Tokens({Owner:user._id});
    }
    else{
        t = findUserToken;
    }
    
    const token = await jwt.sign({_id:user._id.toString()},process.env.JWT_SECRECT1);
    const finaltoken = await jwt.sign({_id:token.toString()},process.env.JWT_SECRECT2);
    t.Token = t.Token.concat({token:finaltoken});
    await user.save();
    await t.save();
    return finaltoken;
    }catch(e){
        console.log(e);
    }


}

userSchema.statics.upload = async(file,id)=>{
   
    try{
        const image = await sharp(file).png().toBuffer();
        const user = await User.findById(id);
        user.Dp = await image
        await user.save();
        return image;

    }catch(e){
        console.log(e)
    }
}

userSchema.statics.update = async(data)=>{
    
    try{
        const user = await User.findOneAndUpdate({_id:data._id},data);
        await user.save();
        return true;
        

    }catch(e){
        console.log(e);
        
    }
}

userSchema.statics.updatePassword = async(pass,user)=>{
    try{

        user.Password = await pass;
        await user.save();
        return true;

    }catch(e){
        console.log(e);
    }
}

const User = mongoose.model('Users',userSchema);
module.exports = User;
