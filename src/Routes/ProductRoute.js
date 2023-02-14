const express=require('express')
const mongoose=require('mongoose');
const router= express.Router();


const Product=require('../Models/Product.model');

//Route to get product////////////////


router.get('/', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const searchQuery = req.query.q || '';
  // console.log("chk:",req.query)
  const priceMin = parseInt(req.query.priceMin) || 0;
  const priceMax = parseInt(req.query.priceMax) || Infinity;
  const GTMOQ = parseInt(req.query.GTMOQ) || 0;
  // const priceMax = parseInt(req.query.priceMax) || Infinity;

 
  try { 
    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'certifications',
          localField: 'productCert',
          foreignField: '_id',
          as: 'pro-certification'
        }
      },
      {
        $lookup: {
          from: 'certifications',
          localField: 'supplierCert',
          foreignField: '_id',
          as: 'supplier_certification'
        }
      },
      {
        $lookup: {
          from: 'regions',
          localField: 'manufacturer',
          foreignField: '_id',
          as: 'manufacturer'
        }
      },
      {
        $lookup: {
          from: 'regions',
          localField: 'stockAvail',
          foreignField: '_id',
          as: 'stockregion'
        }
      },
      // {
      //   $lookup: {
      //     from: 'categories',
      //     localField: 'categoryid',
      //     foreignField: '_id',
      //     as: 'mainCategory'
      //   }
      // },
      // {
      //   $unwind: {
      //     path: '$pro-certification',
      //     preserveNullAndEmptyArrays: true
      //   }
      // },
      {
        $unwind: {
          path: '$supplier_certification',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$manufacturer',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$stockregion',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$mainCategory.subcategory.innercategory',
          preserveNullAndEmptyArrays: true
        }
      },
     {
      $unwind: {
        path: '$mainCategory.subcategory.innercategory',
        preserveNullAndEmptyArrays: true
      }
    },
      
      {
        $match: {

          $or: [
            // {
            //   title: {
            //     $regex: searchQuery,
            //     $options: 'i'
            //   }
            // },
            // {
            //   'pro-certification.name': {
            //     $regex: searchQuery,
            //     $options: 'i'
            //   }
            // },
            {
              'supplier_certification.title': {
                $regex: searchQuery,
                $options: 'i'
              }
            },

            {
              'manufacturer.title': {
                $regex: searchQuery,
                $options: 'i'
              }
            },
            {
              'stockregion.title': {
                $regex: searchQuery,
                $options: 'i'
              }
            },

            {
              'mainCategory.title': {
                $regex: searchQuery,
                $options: 'i'
              }
            },
          ],
          price: {
            $gte: priceMin,
            $lte: priceMax
          },
          MOQ: {
            $gte: GTMOQ,
          },
        }
      },
      // {
      //   $project: {
      //     _id: 1,
      //     title: 1,
      //     price: 1,
      //     modelno: 1,
      //     brand: 1,
      //     MOQ: 1,
      //     productImage: 1,
      //     categoryid: 1,
      //     subcategory: 1,
      //     innercategory: 1,
      //     certification: { $arrayElemAt: ["$certification", 0] },
      //     supplier_certification: { $arrayElemAt: ["$supplier_certification", 0] },
      //     stockAvail: 1,
      //     manufacturer: 1
      //   }
      // },
      // {
      //   $skip: (page - 1) * limit
      // },
      // {
      //   $limit: limit
      // }
    ]);
   // console.log(productCert,supplierCert);
    const count = await Product.countDocuments()


    const response = {
      count: products.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      Productlist: products
    };
    console.log(response);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
});




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
        supplierCert: req.body.supplierCert,
        productCert: req.body.productCert,
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
              categoryid:result.categoryid,
              supplierCert:result.supplierCert,
              productCert:result.productCert,
              stockAvail:result.stockAvail,
              manufacturer:result.manufacturer,
              subcategory:result.subcategory,
              innercategory:result.innercategory,
          }
      })
    })
    .catch(err => {
        console.log(err)
        res.status(500).send(err);
      });
})

module.exports=router;