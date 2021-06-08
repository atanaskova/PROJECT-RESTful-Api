const BlogPost=require('../models/blog-post');
const successResponse=require('../lib/handlers/success-response-sender');
const errorResponse=require('../lib/handlers/error-response-sender');
const enrichBlogPost=require('../lib/enrichers')
const mailer=require('../lib/mails/blog-post-mail');
const sendMail=require('../lib/mails/mailgun');
const createPDF=require('../lib/mails/pdf');
const path=require('path');
const generateEmailData=require('../lib/mails/emailData');

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

            if(!blogPost) errorResponse(res, 400, 'No blog post with the provided id')

            successResponse(res, `Post with id #${req.params.id}`, await enrichBlogPost(blogPost));

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

        //    The Callback Way
        //    createPDF(blogPost,()=>{
        //        sendMail(generateEmailData(blogPost,req.user.email));
        //    });

           //The Promised Land
           await createPDF(blogPost);
           sendMail(generateEmailData(blogPost,req.user.email));
                           
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