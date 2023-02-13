const express=require('express')
const mongoose=require('mongoose');
const router= express.Router();


const Product=require('../Models/Product.model');

//Route to get product////////////////

router.get('/',(req,res,next)=>{

    Product.find()
    .select('title price modelno brand MOQ productImage categoryid suppliercert productcert stockAvail manufacturer subcategory innercategory')
    .then(docs=>{
        console.log('response from get',docs);
       const response={
           count: docs.length,
           Productlist: docs.map(doc=>{
               return{
                   _id:doc._id,
                   title:doc.title,
                   price:doc.price,
                   modelno:doc.modelno,
                   brand:doc.brand,
                   MOQ:doc.MOQ,
                   productImage:doc.productImage,
                   categoryid:doc.categoryid,
                   subcategory:doc.subcategory,
                   innercategory:doc.innercategory,
                   suppliercert:doc.suppliercert,
                   productcert:doc.productcert,
                   stockAvail:doc.stockAvail,
                   manufacturer:doc.manufacturer
                   
               }
           })
       }
       console.log("response after return",response);
       res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err),
        res.status(500).json({
            error:err
        })
    })
})

//Route to add new Product////////////////////////////////////

router.post('/',(req,res,next)=>{
  
    const Newproduct= new Product({
        _id:mongoose.Types.ObjectId(),
        title:req.body.title,
        price:req.body.price,
        modelno:req.body.modelno,
        brand: req.body.brand,
        MOQ: req.body.MOQ,
        productImage: req.body.productImage,
        subcategory: req.body.subcategory,
        innercategory: req.body.innercategory,
        categoryid: req.body.categoryid,
        suppliercert: req.body.suppliercert,
        productcert: req.body.productcert,
        stockAvail: req.body.stockAvail,
        manufacturer: req.body.manufacturer
        
    })

    Newproduct.save()
    .then(result=>{
      console.log(result),
      res.status(201).json({
          message:"Product Added Successfully!",
          CreatedProduct:{
              _id:result._id,
              title:result.title,
              price:result.price,
              modelno:result.modelno,
              brand:result.brand,
              MOQ:result.MOQ,
              productImage:result.productImage,
            //   categoryid:result.categoryid,
            //   suppliercert:result.suppliercert,
            //   productcert:result.productcert,
            //   stockAvail:result.stockAvail,
            //   manufacturer:result.manufacturer,
            //   subcategory:result.subcategory,
            //   innercategory:result.innercategory,
          }
      })
    })
    .catch(err => {
        console.log(err)
        res.status(500).send(err);
      });
})

module.exports=router;