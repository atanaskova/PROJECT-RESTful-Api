const axios=require('axios');

module.exports=async(blogPost)=>{
    const res=await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${blogPost.city.name}&appid=5bff06138ed8728ca826690f30239655`);
    const data=res.data;

    blogPost.city.coordinates={
        lon:data.coord.lon,
        lat:data.coord.lat
    }

    blogPost.city.weather={
        description:`${data.weather[0].main} (${data.weather[0].description})`,
        temp:data.main.temp,
        feels_like:data.main.feels_like,
        temp_min:data.main.temp_min,
        temp_max:data.main.temp_max
    }

    return blogPost
}