const addWeatherData=require('./weather');
const addAirPollutionData=require('./air-polution');

module.exports=async(blogPost)=>{
    blogPost=blogPost.toObject();
    console.log(blogPost);
    blogPost=await addWeatherData(blogPost);
    console.log(blogPost);
    blogPost=await addAirPollutionData(blogPost);
    console.log(blogPost);
    return blogPost;
}