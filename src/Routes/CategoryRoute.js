const mongoose=require('mongoose')
const express = require('express');
const router = express.Router();


const category=require('../Models/Category.model');


//Route to GET categories

// router.get('/',(req,res,next)=>{
    
//       category.find()
//       .select('title')
//       .exec()
//       .then(docs=>{
//         console.log("respose from get route",docs);
//         const response={
//         count:docs.length,
//         categorylist:docs.map(doc=>{
//                 return{
//                     title: doc.body.title,
//                     request:{
//                         method: "GET",
//                         url:"https://localhost:3000/categories/" + doc._id
//                     }
//                 }
//         })
//       }
//       console.log(response),
//       res.status(201).json(response)
//       })
//       .catch(err=>{
//         console.log(err);
//         res.status(500).json({
//             error:err
//         });
//     })
// })
router.get('/', (req, res) => {
  category.find()
    .then(categories => {
      categories.forEach(category => {
        console.log('Title:', category.title);
        // return{
        //   title:category.title,
        // }
        
        // console.log('Type:', category.type);
        console.log('Sub-Sub Categories:');
        category.subCategories.forEach(subCategory => {
        //  return{
        //     title:res.subCategory.title,
        //   }
          console.log('  Title:', subCategory.title);
          console.log('  Inner Categories:');
          subCategory.innerCategories.forEach(innerCategory => {
            // return{
            //   title:res.innerCategory.title,
            // }
            console.log('    Title:', innerCategory.title);
          });
        });
      });
      res.json(categories);

    })
    .catch(err => {
      res.status(500).send(err);
    });
});

//Route to add new Category

router.post('/',(req,res,next)=>{
    const newcategory =new category({
       _id:mongoose.Types.ObjectId(),
       title: req.body.title,
       subCategories: req.body.subCategories,

    })
    newcategory.save()
    .then(result=>{
       console.log(result);
       res.status(201).json({
             message:"Category added successfully!",
             AddedCategory:{
              _id: result._id,
               title:result.title,
               
               request:{
                  method:"GET",
                  url:"https://localhost:3000/categories/" + result._id
               }
             }
       })
    }).catch(err=>{
      res.status(500).json({
        error:err
      });
    })
})

module.exports= router