require("dotenv").config();
const bcrypt = require("bcryptjs");
 
const connectDB = require("../config/db");
const User = require("../models/User");
const seedAdmin = async () => {
  try {
    await connectDB();
 
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
 
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.log("Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file");
      process.exit(1);
    }
    const existingUser = await User.findOne({ email: ADMIN_EMAIL });
    if(existingUser){
        existingUser.role="admin";
        await existingUser.save();
        console.log(`${ADMIN_EMAIL} is now an admin`);
    }else{
         const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await User.create({
        name: ADMIN_NAME || "Admin",
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`Admin created: ${ADMIN_EMAIL}`);
    }
 
    process.exit(0);
  } catch (error) {
    console.log("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
