import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            index:true,
            lowercase:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            
        },
        password:{
            type:String,
            required:true,
            minlength:8,
            lowercase:true,
            
          
        },
        fullname:{
            type:String,
            required:true,
           
            trim:true,
            index:true
        },
        avatar:{
            type:String,
            required:true  //cloudinary hobeh
           
        },
        coverImage:{
            type:String,
            
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ]

    },{timestamps:true}
)

UserSchema.pre("save", async function(next){
    if(!this.isModified) return next()
    this.password = bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function (password){
   return await bcrypt.compare(this.password,password)
}


UserSchema.methods.generateAccessToken = async function (){
   return   jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
UserSchema.methods.generateRefreshToken = async function (){
    jwt.sign(
        {
            _id:this._id,
          
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const user = mongoose.model("User", UserSchema)