const express=require("express");
const app=express();
const mongoose=require("mongoose");
const blogPostsRouter=require('./routers/blogposts');
const categoriesRouter=require('./routers/categories');
const citiesRouter=require('./routers/cities');
const jwt=require('express-jwt');
const errorResponse=require('../../lib/error-response-sender');

app.use(express.json());

mongoose.connect("mongodb://localhost/ws-gen-11-project",{
    useNewUrlParser: true,
    useUnifiedTopology:true,
});

app.use(jwt({
    secret:'WPWIENDOFERBFPLAS788*$',
    algorithms:['HS256']
}).unless({
    path:[
        {
            url:'/blogposts', methods:['GET']
        }
    ]
}));

app.use((err,req,res,next)=>{
    console.log(err, err.name, err.name==='UnauthorizedError')
    if(err.name==='UnauthorizedError'){
        errorResponse(res,400,'You need to log in to perform this action!');
    }
})

app.use('/blogposts', blogPostsRouter);
app.use('/categories', categoriesRouter);
app.use('/cities',citiesRouter);

app.listen("3000", (error)=>{
    if(error){
        return console.log(
            "Error happened while starting the app on post 3000:",
            error
        );
    }
    console.log("Blog service successfully started on port 3000!");
});