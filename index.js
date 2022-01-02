const express = require('express')
const app = express()
const cors = require("cors");
const connectDB = require('./connectDB/connect')
require("dotenv").config()

const path = require('path');

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const postRoute = require('./routes/post');
const queryRoute = require('./routes/query')
// const categoryRoute = require('./routes/categories')

// importing multer for uploading images in the assets folder
const multer = require('multer');



app.use(cors())
app.use(express.json())
{/* .........handling uploaded pic........*/}
  app.use("/assets" , express.static(path.join(__dirname, "/assets")))
{/* .........handling uploaded pic........*/}
app.use("/api/auth", authRoute)
app.use("/api/user",userRoute)
app.use("/api/post",postRoute)
app.use("/api/query", queryRoute)
// app.use("/api/category",categoryRoute)



//...........Adding images using multer.............

const myStorage = multer.diskStorage({
  destination:(req,file,callBackfunc)=>{
     callBackfunc(null,"assets")
  },filename:(req,file,callBackfunc)=>{
    callBackfunc(null,req.body.name)
  }
})

//inside destitnation => callBackfunc takes care of errors if there is any so it takes 2 parameters, first one is "null" & second one is the destination folder name where we want to save our images (in this case it is "assets"). 

//inside filename => callBackfunc 2 parameters again, first one is "null" & second one is the filename which in our case will be comming from the Front-End so we are using             "req.body.name" 

const upload = multer({storage: myStorage})

// we are doing the uploading process, & defining a route for that

app.post("/api/upload" , upload.single("file"),(req,res)=>{
  res.status(200).json("file has been uploaded")
})

// the "file" inside "upload.single()"  is the keyname

//we could haved added "verifyToken" for jwt authentication but  it is not needed for now as "write" section in the front end won't be accessable without logging in anyway  




//.....................End.....................



//...................Heroku Deployment...................//

if(process.env.NODE_ENV === 'production'){
   app.use(express.static('client/build'));
   app.get('*',(req,res)=>{
     res.sendFile(path.resolve(__dirname, 'client','build', 'index.html'))
   })
}  

//...................Heroku Deployment...................//


const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI,
      console.log("connected to Database"))
      app.listen(port ,console.log(`server connected to port ${port}`))
  } catch (error){
    console.log(error)
  }
}

start()
