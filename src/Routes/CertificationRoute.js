const express= require('express');
const mongoose=require('mongoose');
const router=express.Router();
const bodyParser = require("body-parser");

const Certification =require('../Models/Certification.model');

router.get('/',(req,res,next)=>{
    // res.send("inner")

    Certification.find()
    .select("title type")
    .exec()
    .then(docs=>{
       const response= {
            count:docs.length,
            certificationlist:docs.map(doc=>{
                 return{
                    title:doc.title,
                    type:doc.type,
                    _id:doc._id,
                    request:{
                        Type:'GET',
                        url:'http://localhost:3000/Certification/'+ doc._id,
                    }
                 }
            })

        }
        console.log(response);
        res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});


//Route to add certification

router.post('/',(req,res,next)=>{
    // console.log(req.body);
     const certification = new Certification({
         _id : mongoose.Types.ObjectId(), //special type of id provided by moongose
         title: req.body.title,
         type: req.body.type,
        
     });
 
     certification.save().then(result=>{
         console.log(result);
         res.status(201).json  ({
             message: "Certification created Successfully!",
             Createdproduct : {
                 _id:result._id,
                 title:result.title,
                 type:result.type,
                
                 request:{
                     Type: "GET",
                     URL: "http://localhost:3000/" + result._id
                 }
             }
         });
     }).catch(err=>{
         console.log(err),
         res.status(500).json({
             error:err
         })
 
     })     //This will save the product in database and show result/error on console
     
 });



module.exports = router;