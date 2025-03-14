import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new Schema(
    {
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        videoFile:{
            type:String,
            required:true
        },
        thumbnail:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String
        },
        duration:{
            type:Number,
            required:true
            
        },
        views:{
            type:Number,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },




    }
,{timestamps:true});
VideoSchema.plugin(mongooseAggregatePaginate)


export const Video = mongoose.model("Video", VideoSchema)