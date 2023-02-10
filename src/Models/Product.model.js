const mongoose=require("mongoose");

const ProductSchema=mongoose.Schema({
    
     title : {type:String, Required: true},
     price: {type:Number, Required: true}, 
     modelno: {type: String, Required: true},
     brand: {type: String, Required: true} ,
     MOQ: {type: Number, Required: true},
     productImage:{type:String, Required: true},
     categoryid: {type: mongoose.Schema.Types.ObjectId, Required: true},
     suppierCert: {type: mongoose.Schema.Types.ObjectId, Required: true},
     productCert: {type: mongoose.Schema.Types.ObjectId, Required: true},
     stockAvail: {type: mongoose.Schema.Types.ObjectId, Required: true},
     manufacturer: {type: mongoose.Schema.Types.ObjectId, Required: true},
     subcategory: {type: mongoose.Schema.Types.ObjectId, Required: true},
     innercategory: {type: mongoose.Schema.Types.ObjectId, Required: true}
                                                 
    
});