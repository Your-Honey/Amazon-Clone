import  express from "express";
import mongoose from "mongoose";
import orderRouter from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import seedRouter from "./routes/seedRouter.js";
import userRoutes from "./routes/userRoutes.js";

const app=express();

//To use form body has json object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://0.0.0.0:27017/amazon')
.then(()=>{
    console.log("connected to MongoDb");
}).catch(err=>{
    console.log(err.message)
});

app.get('/api/keys/paypal', (req, res) => {
    res.send('AcCWv7VYeQoOP-rL37mynqMwW3rr8yGGn_l8S52nekMXt4StcpuqpRyFjWS46bEGyCPRqi0XrObwORlQ' || 'sb');
  });

app.use("/api/seed",seedRouter);

app.use("/api/product",productRoutes);

app.use("/api/users",userRoutes);

app.use("/api/orders",orderRouter);

//To handle expressAsyncHandler error globally
app.use((err,req,res,next)=>{
    res.status(500).send({message:err.message});
})



app.listen(5000,()=>{
    console.log("Server strated at port 5000");
})