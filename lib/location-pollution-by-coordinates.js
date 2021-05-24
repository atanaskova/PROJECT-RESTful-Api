const axios=require('axios');

module.exports=async(lat,lon)=>{
    const res=await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=5bff06138ed8728ca826690f30239655`)

    return{
        co: res.data.list[0].components.co,
        pm10: res.data.list[0].components.pm10,
        pm2_5: res.data.list[0].components.pm2_5
    }
}