const BlogPost=require('../models/blog-post');
const successResponse=require('../lib/success-response-sender');
const errorResponse=require('../lib/error-response-sender');
const mailer=require('../lib/blog-post-mail');
const axios=require('axios');

const getWeatherData=async(cityName)=>{
    const res=await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=5bff06138ed8728ca826690f30239655`)

    return {
        description:`${res.data.weather[0].main}(${res.data.weather[0].description})`,
        temp:res.data.main.temp,
        feels_like:res.data.main.feels_like,
        temp_min:res.data.main.temp_min,
        temp_max:res.data.main.temp_max

    }
}

module.exports={
    fetchAll: async(req,res)=>{
        try{
            const blogPosts=await BlogPost.find()
            .populate('category','name')
            .populate('user',['full_name', 'email'])
            .populate('city','name')

            successResponse(res,'List of all blog posts', blogPosts);

        }catch (error){
            errorResponse(res,500,error.message)
        }
    },
    fetchOne: async(req,res)=>{
        try { 
            const blogPost= await BlogPost.findById(req.params.id)
            .populate('category',['name'])
            .populate('user',['full_name', 'email'])
            .populate('city','name')

            blogPost=blogPost.toObject();
            blogPost.city={
                ...blogPost.city,
                weather:await getWeatherData(blogPost.city.name)
            }
            if(!blogPost) errorResponse(res, 400, 'No blog post with the provided id')

            successResponse(res, `Post with id #${req.params.id}`, blogPost);

        }catch (error){
            errorResponse(res,500,error.message)
        }
    },
    create: async(req,res)=>{
        try {
            const blogPost=await BlogPost.create(req.body);

           if(blogPost) {
               mailer();
           }
                           
            successResponse(res, 'New blog post created', blogPost);
            
        } catch (error) {
            errorResponse(res, 500, error.message)
        }
    },
    patchUpdate : async(req,res)=>{
        try {
            const blogPost=await BlogPost.findByIdAndUpdate(req.params.id,req.body);
            successResponse(res, 'Blog post updated', blogPost);
        } catch (error) {
            errorResponse(res, 500, {
                ...req.body,
                _id: req.params.id,
                error: error.message
            })
        }
    },
    putUpdate : async(req,res)=>{
        try {
            const blogPost=await BlogPost.findOneAndReplace({_id: req.params.id}, req.body);
            successResponse(res,'Blog post updated', blogPost);
        } catch (error) {
            errorResponse(res, 500, {
                ...req.body,
                _id: req.params.id,
                error: error.message
            })
        }
    },
    delete: async(req,res)=>{
        try {
            await BlogPost.remove({_id:req.params.id});
            res.send(`Blog post #${req.params.id} is deleted`);
        } catch (error) {
            res.send({message: error});
        }
    },
    like:async(req,res)=>{
        try {
            const post=await BlogPost.findById(req.params.id);
            if(!post.likes.includes(req.user.id)){
                await post.updateOne({$push:{likes:req.user.id}});
                successResponse(res,200,'The post has been liked!');
            }
        } catch (error) {
            errorResponse(res,500,error.message);
        }
    },
    dislike:async(req,res)=>{
        try {
            const post=await BlogPost.findById(req.params.id);
            if(post.likes.includes(req.user.id)){
                await post.updateOne({$pull:{likes:req.user.id}});
                successResponse(res,200,'The post has been disliked!');
            }
        } catch (error) {
            errorResponse(res,500,error.message);
        }
    }
};