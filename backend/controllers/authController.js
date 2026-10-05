const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const googleClient= new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const registerUser=async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        const existingUser=await User.findOne({email});
        //check if user exist or not
        if(existingUser){
            return res.status(400).json({
                message:"User already exists",
            });
        }
            // hash password before stroing in mongodb
            const hashedPassword=await bcrypt.hash(password,10);
            //create user
            const user=await User.create({
                name,
                email, 
                password:hashedPassword,
            });
            //created successfully
            res.status(201).json({
                message:"User Registered successfully",
                user:{
                    id:user._id,
                     name:user.name,
                     email:user.email,
                     role:user.role,
                },
            });
        }catch(error){
         //if regist failed
         res.status(500).json({message:"Registration failed",
            error:error.message,
         });
        }
};
//login logic
const loginUser=async(req,res)=>{
   try{
    const {email,password}=req.body;
    const user=await User.findOne({email});
     if(!user){
        //unauathorized
        return res.status(401).json({
          message:"This account uses Google sign-in. Please continue with Google.",
        });
     }
     //for login match password with hashed one
     const passmatch=await bcrypt.compare(password,user.password);
     //if not matched unauthorized
     if(!passmatch){
      return  res.status(401).json({
            message:"Invalid email or password",
        });
     }
     //create jwt
     const token =jwt.sign(
     {
        userId:user._id,
        role:user.role,
     },
     process.env.JWT_SECRET,
     //expiration
     {
    expiresIn:"7d",
     }
     );
     res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
} ;

const googleLogin=async(req,res)=>{
  try{
    const {credential} =req.body;
   //verify token with google
   const ticket=await googleClient.verifyIdToken({
    idToken:credential,
          audience: process.env.GOOGLE_CLIENT_ID,
   });
       const { sub, email, name, email_verified } = ticket.getPayload();
if (!email_verified) {
      return res.status(400).json({ message: "Google email not verified" });
    }
//find or create user
let user=await User.findOne({email});
if(!user){
  //then create
  user=await User.create({name,email,googleId:sub});
}else{
  //link existng account
  user.googleId=sub;
  await user.save();
}

      // same payload as normal login
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid Google token" });
  }

};
module.exports={registerUser,loginUser,googleLogin};
