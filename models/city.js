var mongoose=require("mongoose");
var citySchema=mongoose.Schema({
    name:{
        type:String,
        require:['Please provide the name of the city']
    }
});

module.exports=mongoose.model("City",citySchema);