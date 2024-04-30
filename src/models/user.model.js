import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true
  },
  role: { 
    type: String, 
    enum: ["admin", "customer"], 
    default: "customer"
  },
  avatar : {
    type : String,
    required : true,
  },
  refreshToken : {
    type : String
  }
},{
  timestamps : true
});


userSchema.pre("save", async function(next){
  // checking if current password is modified or not
  if(!this.isModified('password')) return next();

  // if password is modified then we have to hash it
  this.password = await bcrypt.hash(this.password, 10);
  next();
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id : this._id,
          email : this.email,
          username : this.username,
          fullname : this.fullname
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn : process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id : this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn : process.env.REFRESH_TOKEN_EXPIRY
      }
  )
}

export const User = mongoose.model("User", userSchema);
