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


//////////code to render products filter at front end//////////