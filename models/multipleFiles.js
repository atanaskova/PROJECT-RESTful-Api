const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const multipleFileSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    files:[Object]
});

module.exports=mongoose.model('MultipleFile',multipleFileSchema)