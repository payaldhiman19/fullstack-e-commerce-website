const mongoose=new mongoose.Schema({
    name:{
    type: String,
    required:true,
    trim:true,
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
},

password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

const User=new mongoose.model("User",userSchema);
module.exports=User;