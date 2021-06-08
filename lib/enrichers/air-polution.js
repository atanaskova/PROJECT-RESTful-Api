const axios=require('axios');

module.exports=async(blogPost)=>{
    const res=await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${blogPost.city.coordinates.lat}&lon=${blogPost.city.coordinates.lon}&appid=5bff06138ed8728ca826690f30239655`);
    const data=res.data.list[0];

    blogPost.city.air_pollution={
        date:new Date(data.dt).toLocaleDateString("en-US"),
        carbon_monoxide:data.components.co,
        ozone:data.components.o3,
        sulphur_dioxide:data.components.so2
    }

    return blogPost
}