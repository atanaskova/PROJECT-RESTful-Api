const axios=require('axios');

module.exports=async(lat,lon)=>{
    const res=await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=hourly,minutely,current&appid=5bff06138ed8728ca826690f30239655`)

    const arr=[]
    res.data.daily.forEach(element=>{
        const weather={
            dt:element.dt,
            morning:element.temp.morn,
            day:element.temp.day,
            evening:element.temp.eve,
            night:element.temp.night
        }
        arr.push(weather)
    })
    return arr
}