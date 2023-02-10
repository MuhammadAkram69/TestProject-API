const mongoose=require("mongoose");

const CertificationSchema=mongoose.Schema({
    
     title : {type:String, Required: true},
     type: {type:String, Required: true}
                                                   //validation at input
    
});

 const Certification = mongoose.model("Certification", CertificationSchema);

module.exports= Certification;