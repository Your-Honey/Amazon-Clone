import express from "express";
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from "../models/userModel.js";
import { generateToken, isAdmin, isAuth } from '../util.js';

const userRoutes=express.Router();

//expressAsyncHandler it returns error if there in any handled in server.js

userRoutes.get("/",isAuth,isAdmin,expressAsyncHandler(async(req,res)=>{
    const users= await User.find({});
    res.send(users);
}));

userRoutes.post("/signin",expressAsyncHandler(async(req,res)=>{
   
    const user= await User.findOne({email:req.body.email});
    if(user){
        if(bcrypt.compareSync(req.body.password,user.password)){
            res.send({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user),
            });
            return;
        }
       
    }
    
        res.status(401).send({message:"Invalid email or Password"});

})
);

userRoutes.post("/signup",expressAsyncHandler(async (req,res)=>{
    const newUser=new User({
        name:req.body.name,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password)
    });
    const user= await newUser.save();
    res.send({
        _id:user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
    });
}));

userRoutes.put("/profile",isAuth,expressAsyncHandler(async (req,res)=>{
    const user = await User.findById(req.user._id);
    if(user){
        user.name= req.body.name || user.name;
        user.email= req.body.email || user.email;
        if(req.body.password){
            user.password=bcrypt.hashSync(req.body.password,8);
        }
    
    const updateUser= await user.save();
    res.send({
        _id:updateUser._id,
        name:updateUser.name,
        email:updateUser.email,
        token: generateToken(updateUser)
    });
    }
    else {
        res.status(404).send({message:"User not found"});
    }
}));

userRoutes.get("/:id",isAuth,isAdmin,expressAsyncHandler(async(req,res)=>{
    const userInfo= await User.findById(req.params.id);
    if(userInfo){
        res.send(userInfo);
    }
    else{
        res.status(404).send({message:"User not found"});
    }
}));

userRoutes.put("/:id",isAuth,isAdmin,expressAsyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id);
    if(user){
        user.name= req.body.name || user.name;
        user.email= req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);;

        await user.save();
        res.send({message:"Update Success"});
    }
    else{
        res.status(404).send({message:"User Not Found"});
    }
}));

userRoutes.delete("/:id",isAuth,isAdmin,expressAsyncHandler(async(req,res)=>{
    const user=await User.findById(req.params.id);
    if(user){
        await user.remove();
        res.send({message:"Delete Success"});
    }
    else{
        res.status(404).send({message:"User Not Found"});
    }
}))

export default userRoutes;