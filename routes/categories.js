const router = require("express").Router()
const Category = require("../model/Category");
const { verifyTokenAndAdmin } = require("./verifyToken");

//creating a new Category

router.post("/", verifyTokenAndAdmin, async(req,res)=>{
  const  newCat = new Category(req.body);
  try {
        const savedCat = await newCat.save()
        res.status(200).json(savedCat) 

  } catch (error) {
                                                                           res.status(500),json(error)
                                     
  }
})

//delete a Category

router.delete("/:id", verifyTokenAndAdmin, async(req,res)=>{
  
  try {
        const deleteCat = await Category.findByIdAndDelete(req.params.id)
        const allCategory = await Category.find()
        res.status(200).json(allCategory) 

  } catch (error) {
                                                                           res.status(500),json(error)
                                     
  }
})

// Get All Categories

router.get("/",  async(req,res)=>{
  
  try {
         const allCategory = await Category.find()
        res.status(200).json(allCategory)

  } catch (error) {
         res.status(500),json(error)
                                        
  }
})

module.exports = router