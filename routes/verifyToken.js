const jwt = require('jsonwebtoken')

const Post = require('../model/Post')
const User = require('../model/User')
require('dotenv').config()

const verifyToken =async(req, res, next) => {

  const authHeader = req.headers.token

  if (authHeader) {
      const token = authHeader.split(" ")[1]

      jwt.verify(token, process.env.JWT_SECRET ,(err,user)=>{
            if(err){res.status(403).json("token is not valid")}
            req.user =user
            next()
      })
  }else{
          return res.status(401).json("you are not authenticated")
  }
}


const verifyTokenAndAuthorization = (req,res,next) =>{
          verifyToken(req,res,()=>{
          if( req.user.id === req.params.id || req.user.isAdmin){
                    next()
          }
          else{
                    res.status(403).json('you are not authorized')
          }
          })

}

const verifyTokenAndAuthor = (req,res,next) =>{
   verifyToken(req,res, async()=>{
      const  post = await Post.findById(req.params.id)
     if(req.user.id === post.userId || req.user.isAdmin ){
       next()
     }
     else{
       res.status(403).json('you are not authorized')
     }
   })
}

const verifyTokenAndAdmin = (req,res,next) =>{
          verifyToken(req,res,()=>{
          if(req.user.isAdmin){
                    next();
          }
          else{
                    res.status(403).json('you are not authorized')
          }
          })
}
module.exports = {verifyToken,verifyTokenAndAuthor, verifyTokenAndAuthorization,verifyTokenAndAdmin}