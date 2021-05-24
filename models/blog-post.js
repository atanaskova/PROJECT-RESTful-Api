var mongoose=require("mongoose");

var blogPostSchema=mongoose.Schema({
    title:{
            type: String,
            required:['Please provide the title of the blog post']
    },
    content:{
            type: String,
            required:['Please provide the content of the blog post']
        },
    category:{
        type: mongoose.Types.ObjectId,
        ref: 'Category'
        },
    user:{
        type: mongoose.Types.ObjectId,
        ref:'User'
    },
    likes:{
        type: Array,
        default: []
    },
    city:{
        type: mongoose.Types.ObjectId,
        ref: 'City'
    }
});

module.exports=mongoose.model("BlogPost", blogPostSchema);