const express = require("express");
const https = require("https");
const bodyParser=require("body-parser")
const { rawListeners } = require("process");
const { KeyObject } = require("crypto");

const app=express();

const imageUrl="http://openweathermap.org/img/wn/10d@2x.png";

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html")
});


app.post("/",function(req,res){
    const cityName=req.body.cityName;

    const url="https://api.openweathermap.org/data/2.5/weather?units=metric&appid=8c64212b6486efd6c3d0c6ae61e872e3&q="+cityName;

    https.get(url,function(response){
        response.on("data",function(data){
            const weatherData=JSON.parse(data);
            const WeatherCode=weatherData.cod;
            
            if(WeatherCode==404){
                res.write("<h1>City Not found</h1>");
                res.send();
            }
            else{
                const icon=weatherData.weather[0].icon;
                const imageUrl="http://openweathermap.org/img/wn/"+ icon+"@2x.png";
                res.write("<h1>The weather condition at "+ weatherData.name+" is "+weatherData.weather[0].description+"</h1>");
                res.write("<h2>Current temp : "+weatherData.main.temp+"</h2>");
                res.write("<image src="+ imageUrl +">")
                res.send();
            }
        })
    }) 
})

app.listen(3000,function(){
    console.log("Server started at port 3000");
});