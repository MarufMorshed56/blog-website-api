const router = require('express').Router()

const User = require('../model/User')
const Post = require('../model/Post')
const CryptoJS = require('crypto-js')

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken')

// UPDATE USER
router.put('/:id', async (req, res) => {
  //verifyTokenAndAuthorization, 
  
  // id here is the user's id 
  if (req.body.password) {
    req.body.password = await CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET,
    ).toString()
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    )
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json(error)
  }
})

//DELETE USER & THEIR POSTS

router.delete('/:id',  async (req, res) => {
  //verifyTokenAndAuthorization,
  
    try { 
                                                                     //getting user Account  by searching by userID & then 
                                
      const user = await User.findById(req.params.id)
      await Post.deleteMany({username: user.username})
      //using username to find all the post that conatains the username/author & deleting them. amra Post Schema te post create korar jonno username / author name  required kore disi, so proti ta post e username/author name thakbe, ekhn jeishob post ei author er likha ogula delete hoye jabe.. 

      const deletedUser = await User.findByIdAndDelete(req.params.id)
      res.status(200).json('user & all of his/her posts has been deleted')
    } catch (error) {
      res.status(500).json(error)
    }

})

//GET SINGLE USER
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if(!user){res.status(404).json("user doesn't exist")}
    const { password, ...others } = user._doc
    res.status(200).json(others)
  } catch (error) {
    res.status(500).json(error)
  }
})

//GET ALL USERS

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find()

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
