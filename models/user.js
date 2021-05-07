var mongoose=require('mongoose');

var usersSchema=mongoose.Schema({
    full_name:{
        type:String,
        required:['Please provide the full name of the user']
    },
    email:{
        type:String,
        required:['Please provide the email of the user']
    },
    password:{
        type:String,
        required:['Please provide the password of the user']
    },
    // confirmation_password:{
    //     type:String,
    //     required:['Please confirm your password']
    // }
});

module.exports=mongoose.model("User",usersSchema);