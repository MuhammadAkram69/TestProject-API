const express=require('express');
const router=express.Router();
const mongoose=require('mongoose')

const Region=require('../Models/Region.model')


//Route to get Regions//

router.get('/',(req,res,next)=>{
      
    Region.find()
    .select("title").exec()
    .then(docs=>{
        const response={
             count:docs.length,
             Regionlist: docs.map(doc=>{
                return{
                    title: doc.title,
                    request:{
                        method: "GET",
                        URL: "https://localhost:3000/region/"+ doc._id
                    }
                }

             })
        }
        console.log(response)
        res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        });
    });
});

//Route to add new regions//

router.post('/',(req,res,next)=>{

  const region=new Region({

    _id:mongoose.Types.ObjectId(),
    title: req.body.title

  });
  region.save()
  .then(result=>{
    console.log(result);
    res.status(201).json({

        message:"Region is added successfully!",
        CreatedRegion:{
            _id: result._id,
            title: result.title
        }
    })
  })
  .catch(err=>{
    console.log(err),
    res.status(500).json({
        error:err
    });
 });

})


module.exports= router;