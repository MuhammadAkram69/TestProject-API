const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();


const Category = require('../Models/Category.model');


//Route to GET categories

router.get('/', (req, res) => {
  Category.find()
  .then(categories => {
      console.log("mmm")

        const catcc = categories.map(category => {
          return {
            title: category.title,
            subcatagories: category.subCategories.map(sub => {
              return {
                name: sub.name,
                inner: sub.innerCategory.map(inn => {
                  return {
                    name: inn.name
                  }
                })
              }
            })
          }
        })

      res.status(200).json(catcc);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(err);
    });
});

//Route to add new Category

router.post('/', (req, res, next) => {
  const newcategory = new category({
    _id: mongoose.Types.ObjectId(),
    title: req.body.title,
    subCategories: req.body.subCategories,

  })
  newcategory.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Category added successfully!",
        AddedCategory: {
          _id: result._id,
          title: result.title,

          // request: {
          //   method: "GET",
          //   url: "https://localhost:3000/categories/" + result._id
          // }
        }
      })
    }).catch(err => {
      res.status(500).json({
        error: err
      });
    })
})

module.exports = router;