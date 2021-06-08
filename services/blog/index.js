const express=require("express");
const app=express();
const blogPostsRouter=require('./routers/blogposts');
const categoriesRouter=require('./routers/categories');
const citiesRouter=require('./routers/cities');
const jwt=require('express-jwt');
const serverStartLogger=require('../../lib/handlers/server-start-logger');
const unauthorizedErrorHandler=require('../../lib/handlers/unauthorized-error-handler');

require('../../lib/db/db');
require('dotenv').config();

app.use(express.json());

app.use(jwt({
    secret:process.env.SECRET_AUTH_KEY,
    algorithms:['HS256']
}).unless({
    path:[
        {
            url:'/blogposts', methods:['GET']
        }
    ]
}));

app.use((err,req,res,next) => unauthorizedErrorHandler(err,req,res,next));

app.use('/blogposts', blogPostsRouter);
app.use('/categories', categoriesRouter);
app.use('/cities',citiesRouter);

app.listen(process.env.BLOG_API_PORT, (error) => serverStartLogger('Blog', process.env.BLOG_API_PORT, error));