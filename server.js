const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); 
const User = require("./models/User"); 
const Address = require("./models/Address");

const app = express();

dotEnv.config();

app.use(bodyParser.json()); 

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo DB connected successfully...");
  })
  .catch((err) => {
    console.log(err);
  });

  //https://smoketreesassignment.onrender.com/register
  app.post("/register", async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ error: "Name and address are required" });
    }

    // Create new user
    const newUser = new User({ name });
    const savedUser = await newUser.save();

    // Create new address linked to the user
    const newAddress = new Address({ userId: savedUser._id, address });
    await newAddress.save();

    res.status(201).json("User and address saved successfully");
  } catch (error) {
    res.status(500).json("Error saving data");
    console.log(error);
  }
});

//https://smoketreesassignment.onrender.com/get-users-data
app.get("/get-users-data" , async(req,res) => {

    try {
        const users = await User.find()
        if(!users) return res.status(404).json({error : "users not found"})
        res.json({users})
    } catch (error) {
        res.status(500).json("Error saving data");
        console.log(error);
    }
})

//https://smoketreesassignment.onrender.com/get-addresses
app.get("/get-addresses" , async(req,res)=> {
    try {
        const addresses = await Address.find()
        if(!addresses) return res.status(404).json({error : "addresses not found"})
        res.json({addresses})
    } catch (error) {
        res.status(500).json("Error saving data");
        console.log(error);
    }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
