const mongoose=require("mongoose");

const RegionSchema=mongoose.Schema({
    
     title : {type:String, Required: true},
     
    
});

const Region=mongoose.model('Region',RegionSchema);

module.exports=Region;