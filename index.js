const express=require('express');
const app=express();
var mongoose = require("mongoose");
app.use(express.json());

mongoose.connect('mongodb://localhost/cupcakes');
mongoose.connection.once('open',function(){
  console.log('Mongodb connected');
}).on('error',function(error){
  console.log('error is:', error);
});
app.get('/',(req,res)=>{
    res.send("Cupcakes");
});

const userRoute=require("./routes/userRoute");
const orderRoute=require('./routes/orderRoute')

app.use("/user",userRoute);
app.use('/order',orderRoute);
app.listen(9000,"192.168.1.101",()=>{
    console.log("server connected on port 9000...");
});