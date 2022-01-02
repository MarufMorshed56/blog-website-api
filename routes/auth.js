const router = require("express").Router()
const  User = require("../model/User")

const CryptoJS = require('crypto-js')
const jwt = require("jsonwebtoken")
const { verifyToken } = require("./verifyToken")

require("dotenv").config()



//Login

router.post("/login", async(req,res)=>{
      try {
            const user = await User.findOne({
              username: req.body.username
            })
             !user && res.status(401).json('wrong Username')

             const hashedPassword = CryptoJS.AES.decrypt(user.password , process.env.PASS_SECRET)

             const originalPassword = CryptoJS.enc.Utf8.stringify(hashedPassword)

             const inputPassword = req.body.password

             originalPassword != inputPassword &&  res.status(401).json("Wrong Password");

            const accessToken = jwt.sign({id:user._id, isAdmin:user.isAdmin}, process.env.JWT_SECRET, {expiresIn:"3d"})

             const {password, ...others} = user._doc
             res.status(200).json({...others , accessToken})



      } catch (error) {
               res.status(501).json(error)

}          
})

//Register

router.post("/register", async(req,res)=>{
 try {
//           const savedUser = req.body
//                                                                 res.status(201).json({savedUser})                              
      const newUser = await new User({
                    username: req.body.username,
                    email: req.body.email,
                    password:CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SECRET).toString(),
                    isAdmin: req.body.isAdmin
      })

      const savedUser = await newUser.save()
      res.status(201).json({savedUser})

 } catch (error) {
      res.status(500).json({error}) 

 }
})




module.exports = router