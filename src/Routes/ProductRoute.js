const express=require('express')
const mongoose=require('mongoose');
const router= express.Router();


const Product=require('../Models/Product.model');

//Route to get product////////////////


// router.get('/', async (req, res, next) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = 10;
  
//     try {
//       const products = await Product.find()
//         .select('title price modelno brand MOQ productImage categoryid suppliercert productcert stockAvail manufacturer subcategory innercategory')
//         .skip((page - 1) * limit)
//         .limit(limit);
  
//       const count = await Product.countDocuments();
  
//       const response = {
//         count: products.length,
//         totalPages: Math.ceil(count / limit),
//         currentPage: page,
//         Productlist: products.map(doc => {
//           return {
//             _id: doc._id,
//             title: doc.title,
//             price: doc.price,
//             modelno: doc.modelno,
//             brand: doc.brand,
//             MOQ: doc.MOQ,
//             productImage: doc.productImage,
//             categoryid: doc.categoryid,
//             subcategory: doc.subcategory,
//             innercategory: doc.innercategory,
//             suppliercert: doc.suppliercert,
//             productcert: doc.productcert,
//             stockAvail: doc.stockAvail,
//             manufacturer: doc.manufacturer
//           }
//         })
//       };
//       console.log("response after return", response);
//       res.status(200).json(response);
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     }
//   });

// router.get('/', async (req, res, next) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = 10;

//   try {
//     const products = await Product.find()
//       .select('title price modelno brand MOQ productImage categoryid supplierCert productCert stockAvail manufacturer subcategory innercategory')
//       .populate('supplierCert', 'name') // populate suppliercert with name field
//       .populate('productCert', 'name') // populate productcert with name field
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const count = await Product.countDocuments();

//     const response = {
//       count: products.length,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//       Productlist: products.map(doc => {
//         return {
//           _id: doc._id,
//           title: doc.title,
//           price: doc.price,
//           modelno: doc.modelno,
//           brand: doc.brand,
//           MOQ: doc.MOQ,
//           productImage: doc.productImage,
//           categoryid: doc.categoryid,
//           subcategory: doc.subcategory,
//           innercategory: doc.innercategory,
//           supplierCert: doc.supplierCert, // populated suppliercert field
//           productCert: doc.productCert, // populated productcert field
//           stockAvail: doc.stockAvail,
//           manufacturer: doc.manufacturer
//         }
//       })
//     };
//     console.log("response after return", response);
//     res.status(200).json(response);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       error: err
//     });
//   }
// });
router.get('/', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const searchQuery = req.query.q || '';
  // const regionName = req.query.region || '';

  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'certifications',
          localField: 'productCert',
          foreignField: '_id',
          as: 'certification'
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
        $unwind: {
          path: '$certification',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$supplier_certification',
          preserveNullAndEmptyArrays: true
        }
      },
      
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  title: {
                    $regex: searchQuery,
                    $options: 'i'
                  }
                },
                {
                  'certification.name': {
                    $regex: searchQuery,
                    $options: 'i'
                  }
                },
                {
                  'supplier_certification.name': {
                    $regex: searchQuery,
                    $options: 'i'
                  }
                }
              ]
            },
          ]
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          price: 1,
          modelno: 1,
          brand: 1,
          MOQ: 1,
          productImage: 1,
          categoryid: 1,
          subcategory: 1,
          innercategory: 1,
          productCert: '$certification.name',
          supplierCert: '$supplier_certification.name',
          stockAvail: 1,
          manufacturer: 1
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ]);

    const count = await Product.countDocuments();

    const response = {
      count: products.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      Productlist: products
    };
    
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