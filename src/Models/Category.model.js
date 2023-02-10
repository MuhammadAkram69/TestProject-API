const mongoose=require("mongoose");

const CategorySchema=mongoose.Schema({
    
     title : {type:String, Required: true},
     type: {type:String, Required: true}, 
     subCategories:[
         {
             name:{type:String,Required:true},
             innerCategory : [
                 {name: {type: String, required: true}}
             ]
         }
     ],
    
    });
    
    const category=mongoose.model('category',CategorySchema)
    module.exports= category;