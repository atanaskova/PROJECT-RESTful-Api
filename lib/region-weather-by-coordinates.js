const axios=require('axios');

module.exports=async(lat,lon,number)=>{
    const res=await axios.get(`https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=${number}&units=metric&lang=mk&appid=5bff06138ed8728ca826690f30239655`)

    const arr=[]
    res.data.list.forEach(element => {
        const weather={
            location:element.name,
            country:element.sys.country,
            temp:element.main.temp,
            description:element.weather[0].description
        }
        arr.push(weather)
    });
    return arr
}