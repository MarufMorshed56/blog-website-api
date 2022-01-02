const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  title: {
    type:String,
    unique:true,
    required:true,
  },
  pic:{
    type:String,
    required:false,
  },
  description:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true
  },
  userId:{
    type:String,
    required:true
  },
  categories:{
     type:Array,
     required:true,
    //  enum:{ 
    //         values: ["Lifestyle","Fashion","Food" ,"Travel","Music","Fitness","DIY","Sports","Finance","Personal","Movie","Games","Abstract","Random","Others"]
    //  }
  }
},{timestamps:true})

module.exports = mongoose.model("Post",PostSchema)
