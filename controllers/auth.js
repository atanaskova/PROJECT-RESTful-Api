const successResponse=require('../lib/handlers/success-response-sender');
const errorResponse=require('../lib/handlers/error-response-sender');
const User=require('../models/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const logInMailer = require('../lib/mails/login-mail');
const resetMailer=require('../lib/mails/reset-mail');
require('dotenv').config();

module.exports={
    register:async(req,res)=>{
        try {
            if(!req.body.password || req.body.password != req.body.confirmation_password){
                return errorResponse(res,400,'Bad request. Passwords do not match');
            }

            const user=await User.findOne({email:req.body.email});
            if(user){
                return errorResponse(res,400,'Bad request. User exists with the provided email');
            }

            req.body.password=bcrypt.hashSync(req.body.password);

            await User.create(req.body);

            successResponse(res,'User registered');
        } catch (error) {
            errorResponse(res,500,error.message);
        }
    },
    login: async(req,res)=>{
        try {
            const user=await User.findOne({email:req.body.email});

            if(!user){
                errorResponse(res,400,'Bad request. User with the provided email does not exist');
            }

            if(!bcrypt.compareSync(req.body.password,user.password)){
            return errorResponse(res,401,'Bad request. Incorrect password');
            }

            const payload={
                id:user._id,
                email:user.email
            }

            logInMailer();

            const token=jwt.sign(payload,process.env.SECRET_AUTH_KEY,{
                expiresIn:'30m'
            });

            successResponse(res,'JWT successfully generated', token);

        } catch (error) {
            errorResponse(res,500,error.message);
        }
    },
    refresh_token:(req,res)=>{
       try {
        const payload={
            id: req.user.id,
            email: req.user.email
        }
        const token=jwt.sign(payload,process.env.SECRET_AUTH_KEY,{
            expiresIn:'30m'
        });
           
        successResponse(res,'JWT successfully refreshed', token);
       } catch (error) {
           errorResponse(res,500,error.message)
       }
    },
    logout:(req,res)=>{
        try {
            const payload={
                id:req.user.id,
                email:req.user.email
            }

            const token=jwt.sign(payload,'Invalid secret key',{
                expiresIn:'1'
            });

            successResponse(res,'You have been logged out',token);
        } catch (error) {
            errorResponse(res,500,error.message);
        }
    },
    changePassword:async(req,res)=>{
        try {
            const user=await User.findOne({emai:req.body.email});
            if(!user){
                return errorResponse(res,403,'Forbidden');
            }
            if(!bcrypt.compareSync(req.body.password,user.password)){
                return errorResponse(res,401,'Unauthorized');
            }
            if(req.body.new_password===req.body.confirmation_password){
                req.body.password=req.new_password;
            }else{
                return errorResponse(res,400,'Passwords do not match');
            }

            req.body.password=bcrypt.hashSync(req.body.password);

            const updateUser=await User.findByIdAndUpdate(user._id,req.body);
            if(updateUser){
                return successResponse(res,'Password is successfully changed');
            }
            return errorResponse(res,400,'Not Found');
        } catch (error) {
            errorResponse(res,500,'Internal Server Error');
        }
    },
    forgotPassword:async(req,res)=>{
        try {
            const user=await User.findOne({email:req.body.email});
            if(!user){
                errorResponse(res,404,'Not Found');
            }
            const getLnk=await User.findByIdAndUpdate(user._id,req.body);
            if(getLink){
                resetMailer(req.user.email);
            }
            successResponse(res,'Email has been send, follow the instructions');
        } catch (error) {
            errorResponse(res,500,'Internal Server Error');
        }
    },
    resetPassword:async(req,res)=>{
        try {
            const user=await User.findOne({email:req.body.email});
            if(!user)
                errorResponse(res,403,'Forbidden');
            if(req.body.new_password===req.body.confirmation_password){
                req.body.password=req.body.new_password;
            }else{
                errorResponse(res,400,'Passwords do not match')
            }

            req.body.password=bcrypt.hashSync(req.body.password);

            const updateUser=await User.findByIdAndUpdate(user._id,req.body);
            if(updateUser){
                successResponse(res,'Password is successfully changed');
            }else
            return errorResponse(res,404,'Not Found');
        } catch (error) {
            errorResponse(res,500,'Internal Server Error');
        }
    }
};