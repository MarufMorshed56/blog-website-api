const  router = require('express').Router()

const Post = require('../model/Post')


router.get('/',async(req,res)=>{
          const queryname = req.query.name;
          //const search = req.params.id
          try{
                    const  posts =  await Post.find()
                    //let sortedProducts = [...products]
                    
                    let sortedProducts = posts.filter((product)=>{
                              return product.title.includes(queryname)
                    })
                    
                    res.status(200).json(sortedProducts)

          }catch(error){
                    res.status(500).json(error)
          }
})

module.exports = router