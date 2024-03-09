import UserModel from "../models/usermodel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';






// register user
export const registerUser = async (req, res) => {
   const { username, password, firstname, lastname } = req.body;
   const salt = await bcrypt.genSalt(10);
   const hashpass = await bcrypt.hash(password, salt);
 
   const newUser = new UserModel({ username, password: hashpass, firstname, lastname });
 
   try {
     const existingUser = await UserModel.findOne({ username: username });
 
     if (existingUser) {
       res.status(409).json({ message: "User already exists. Please login." });
     } else {

       const user = await newUser.save();
       const token = jwt.sign({
         username : user.username,
         id  : user._id.user,

       },process.env.JWT , {expiresIn: "1h"});
       res.status(201).json(newUser, {token}, { userId: user._id });
     }
   } catch (error) {
     console.error("Error saving user:", error);
     res.status(500).json({ message: error.message });
   }
 };


// login user

export const loginuser = async(req,res)=>{

   const {username,password} = req.body;

   try {


      const user = await UserModel.findOne({username : username})

      if(user){ 
          
         const valid = await bcrypt.compare(password, user.password);
      

      if(valid){
         const htoken = jwt.sign({ userId: user.id, username: user.username });

         res.json({ htoken })
         res.status(200).json({user,message:"succesfully logged in"})
      }else{
         res.status(400).json("wrong password");
      }
   }else{
      res.status(404).json("user does not exist")

   }
   } catch (error) {
      console.error("Error saving user:", error)
      res.status(500).json({message: error.message})
      
   }


}