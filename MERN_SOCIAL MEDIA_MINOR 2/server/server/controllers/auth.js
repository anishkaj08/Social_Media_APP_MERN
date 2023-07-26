import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

/*register user*/
                                       //callback func
export const register = async(req, res) => {   //asynchronous coz calling mongoDB which is supposed to be async, like an api call from frontend to backend and then to db, req-request body from fe and res- response i.e sending back to fe 
try{
    const{
        firstName,
        lastName,
        email,
        password,
        picturePath,
        friends,
        location,
        occupation
    } = req.body;   //structuring these params from req body, sendinf the object from fe which hv these arguments
    const salt = await bcrypt.genSalt(); // encrpytion, this salt is used to encrypt password
    const passwordHash = await bcrypt.hash(password, salt); 
    const newUser = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,  //so we dont save the real pw
        picturePath,
        friends,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random()*10000),
        impressions: Math.floor(Math.random()*10000)  //it will give random number

    });
    const savedUser = await newUser.save(); //will save this user
    res.status(201).json(saveduser); //if all of this doesn't give error, will send user back the satus of 201 whic is status code meaning smthng is created

}catch(err){
    res.status(500).json(err.message);  //when there is error and a mssg will be shown whatever mongodb has returned 
}
};

//this register func will work the password will be encrypted and saved and then when user will try to login, we'll or they will provid the pw and then again we will salt it and make sure it is correct one and will give them jsonwebtoken

/*LOGGING IN*/
//authentication
export const login= async(req,res) => {
    try{
         const {email,password}= req.body;
         const user= await User.findOne({email:email});// finds user with same email
         if(!user) return res.status(400).json({msg: "User does not exist."}); //if no such user exists, error is raised

         const isMatch= await bcrypt.compare(password,user.password);
         if(!isMatch) return res.status(400).json({msg: "Invalid credentials."}); //in case password doesnt match

         const token= jwt.sign({id:user._id},process.env.JWT_SECRET);
         delete user.password; //we do not want to send our password back to the frontend
         res.status(200).json({token,user});
    }catch(err){
        console.log(err.message)
        res.status(500).json({error: err.message});

    }
};
