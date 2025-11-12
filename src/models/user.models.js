import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema=new mongoose.Schema(
    {
        name:{
            type: String,
            require:true,
        },
        email:{
            type:String,
            require:true,
            unique:true
        },
        phone:{
            type:Number,
            require:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type: String,
            enum: ["user", "volunteer", "ngo", "admin"],
            default: "user"
        },
        address:{
            type:String
        },
        location: {
            type: {
              type: String,
              enum: ["Point"],
              default: "Point",
            },
            coordinates: {
              type: [Number], // [longitude, latitude]
              required: false,
            }
        }
    },{timestamps:true}
);

const User= mongoose.model("User",userSchema);

userSchema.pre("save",async function(){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

export default User;