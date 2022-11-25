import express  from "express";
import data from "../data.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const seedRouter=express.Router();

seedRouter.get("/",async(req,res)=>{
    await Product.remove({});
    const createdproduct = await Product.insertMany(data.products);

    await User.remove({});
    const usersCreated= await User.insertMany(data.users);
    res.send({usersCreated,createdproduct});
});

export default seedRouter;

