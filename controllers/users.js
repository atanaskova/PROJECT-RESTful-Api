const successResponse=require('../lib/success-response-sender')
const errorResponse=require('../lib/error-response-sender');
const User=require('../models/user');
const schedule=require('node-schedule');

module.exports={
    fetchAll: async(req,res)=>{
        try {
            const user= await User.find()
            successResponse(res,'List of all users',user)
            
        }catch(error){
            errorResponse(res,500,error.message)
        }
    },
    fetchOne: async(req,res)=>{
        try {
            const user=await User.findById(req.params.id);
            if(!user) errorResponse(res,400,'No user with the provided id');

            const date=new Date();

            const job=schedule.scheduleJob(date,()=>{
                console.log(`You've searched for this user on date: ${date}`);
                job.cancel();
            });

            successResponse(res,`User with id £${req.params.id}`,user);
            
        } catch (error) {
            errorResponse(res,500,error.message)
        }
    },
    delete: async(req,res)=>{
        try {
            await User.remove({_id:req.params.id});

            const date=new Date();
            const job=schedule.scheduleJob(date,()=>{
                console.log(`You have deleted this user on date: ${date}`);
                job.cancel();
            });

            res.send(`User ${req.paramas.id} is deleted`);
        } catch (error) {
            res.send({message:error});
        }
    },
    follow: async(req,res)=>{
        if(req.body.user!==req.params.id){
            try {
                const user=await User.findById(req.params.id);
                const currentUser=await User.findById(req.body.user);
                if(!user.followers.includes(req.body.user)){
                    await user.updateOne({$push:{followers:req.body.user}});
                    await currentUser.updateOne({$push:{following:req.params.id}});
                    successResponse(res,200,'User has been followed');
                }else{
                    errorResponse(res,403,'You already follow this user');
                }
            } catch (error) {
                errorResponse(res,500,error.message);
            }
            }else{
                errorResponse(res,403,"You can't follow yourself");
        }
    },
    unfollow: async(req,res)=>{
        if(req.body.user!==req.params.id){
            try {
                const user=await User.findById(req.params.id);
                const currentUser=await User.findById(req.body.user);
                if(user.followers.includes(req.body.user)){
                    await user.updateOne({$pull:{followers:req.body.user}});
                    await currentUser.updateOne({$pull:{following:req.params.id}});
                    successResponse(res,200,'User has been unfollowed');
                }else{
                    errorResponse(res,403,"You don't follow this user anymore");
                }
            } catch (error) {
                errorResponse(res,500,error.message);
            }
        }else{
            errorResponse(res,403,"You can't unfollow yourself");
        }
    }
}