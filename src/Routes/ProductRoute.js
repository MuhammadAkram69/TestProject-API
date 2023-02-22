const express=require('express')
const mongoose=require('mongoose');
const router= express.Router();


const Product=require('../Models/Product.model');

//Route to get product////////////////


router.get('/', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 4;
  const searchQuery = req.query.q || '';
  console.log("chk:",req.query)
  const priceMin = parseInt(req.query.priceMin) || 0;
  const priceMax = parseInt(req.query.priceMax) || Infinity;
  const GTMOQ = parseInt(req.query.GTMOQ) || 0;
  const regionQuery = req.query.region || '';
  console.log(req.query.region);
  const categoryQuery = req.query.category || '';
  console.log(req.query.category);
  const manufacturerQuery = req.query.manufacturer || '';
  const supplierCQuery = req.query.supplierC || '';
  const productCQuery = req.query.productC || '';

  const matchedarray=[]
  if(regionQuery)
  {
    matchedarray.push(  {
      'stockregion.title': {
        $regex: regionQuery,
        $options: 'i'
      }
    },)
  }
  if(categoryQuery)
  {
    matchedarray.push(  {
            'mainCategory.title': {
             $regex: categoryQuery,
             $options: 'i'
           }
         },
       )
  }
  if(manufacturerQuery)
  {
    matchedarray.push(   {
      'manufacturer.title': {
        $regex: manufacturerQuery,
        $options: 'i'
      }
    },
       )
  }
  if(supplierCQuery)
  {
    matchedarray.push(   {
      'supplier_certification.title': {
        $regex: supplierCQuery,
        $options: 'i'
      }
    },
       )
  }
  if(productCQuery)
  {
    matchedarray.push(   {
      'pro_certification.title': {
        $regex: productCQuery,
        $options: 'i'
      }
    },
       )
  }

  if(searchQuery.length===0){
    matchedarray.push(
      {
        'title': {
         $regex: searchQuery,
         $options: 'i'
       }
     },
    )
  }
  // if(!matchedarray.length){
  //     let query= '$and:' + matchedarray;
  // }
  // let query; 
  // if (matchedarray.length === 0) {
  //   query = {};
  // } else if (matchedarray.length === 1) {
  //   query = matchedarray[0];
  // } else {
  //   query = { $and: matchedarray };
  // }

 
  try { 
    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'certifications',
          localField: 'productCert',
          foreignField: '_id',
          as: 'pro_certification'
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
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryid',
          foreignField: '_id',
          as: 'mainCategory'
        }
      },
      {
        $unwind: {
          path: '$pro_certification',
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
          path: '$mainCategory',
          preserveNullAndEmptyArrays: true
        }
      },
    //  {
    //   $unwind: {
    //     path: '$mainCategory.subcategory.innercategory',
    //     preserveNullAndEmptyArrays: true
    //   }
    // },
      
      {
        $match: {
          $and: matchedarray,

          // $or:[
          //   {
          //     'title': {
          //      $regex: searchQuery,
          //      $options: 'i'
          //    }
          //  },
          // ],

          price: {
            $gte: priceMin,
            $lte: priceMax
          },
          MOQ: {
            $gte: GTMOQ
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
      //     mainCategory: { $arrayElemAt: ["$mainCategory", 0] },
      //     subcategory: 1,
      //     innercategory: 1,
      //     procertification: { $arrayElemAt: ["$procertification", 0] },
      //     supplier_certification: { $arrayElemAt: ["$supplier_certification", 1] },
      //     stockregion: { $arrayElemAt: ["$stockregion", 0] },
      //     manufacturer: { $arrayElemAt: ["$manufacturer", 0] }
      //   }
      // },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ]);

    ////////////Filters arrays to get filter///////////////
    
    let manufacturerTitles = [];
    const stockregionF = [];
    const pro_certificationF = [];
    let supplier_certificationF = [];
    const mainCategoryF = [];
    const priceF=[];
    const MOQF=[];

    
     

      products.forEach((product) => {

        const { manufacturer } = product;
          if (manufacturer && !manufacturerTitles.includes(manufacturer.title)) {
              if (manufacturer && manufacturer.title) {
                manufacturerTitles.push(manufacturer.title);
              }
          }

          const { stockregion } = product;
          if (stockregion && !stockregionF.includes(stockregion.title)) {
              if (stockregion && stockregion.title) {
                stockregionF.push(stockregion.title);
              }
          }

          const { supplier_certification } = product;
          if (supplier_certification && !supplier_certificationF.includes(supplier_certification.title)) {
              if (supplier_certification && supplier_certification.title) {
                supplier_certificationF.push(supplier_certification.title);
              }
          }

          const { pro_certification } = product;
          if (pro_certification && !pro_certificationF.includes(pro_certification.title)) {
              if (pro_certification && pro_certification.title) {
                pro_certificationF.push(pro_certification.title);
              }
          }
          
          const { mainCategory } = product;
          if (mainCategory && !mainCategoryF.includes(mainCategory.title)) {
              if (mainCategory && mainCategory.title) {
                mainCategoryF.push(mainCategory.title);
              }
          }

      });
      ///price filter/////////
      let minPrice = products[0].price;
        let maxPrice = products[0].price;

        for (let i = 1; i < products.length; i++) {
          if (products[i].price < minPrice) {
            minPrice = products[i].price;
          }
          if (products[i].price > maxPrice) {
            maxPrice = products[i].price;
          }
        }

        const priceRange = [minPrice, maxPrice];

      let filters ={
        manufacturerTitles,
        stockregionF,
        supplier_certificationF,
        pro_certificationF,
        mainCategoryF,
        priceRange
      }
     console.log("titles==========================",filters);

    
    
    
     
    const count = await Product.countDocuments()


    const response = {
      count: products.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      Productlist: products,
      FiltersArray: filters

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