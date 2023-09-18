 const express = require ("express");
//requesting from external server using method that is given in the node module
 const https = require ("https");
 const bodyparser = require("body-parser");
 const path = require("path");
 //morgan module allows us to log a request on the console whenever we make request
 const morgan = require("morgan");

 const app = express();

 
//log requests -- also shows get status and speed 
app.use(morgan('tiny'))




//set view engine
app.set("view engine","ejs");




app.use(bodyparser.urlencoded({extended:true}));




//load assets
app.use('/css',express.static(path.resolve(__dirname,"assets/css")))
app.use('/img',express.static(path.resolve(__dirname,"assets/img")))
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))






app.get('/', (req, res) => {
   const senddata ={cityname:"cityname",country:"",temp:"temp",disc:"weatherdescription",imgurl:"imgurl",icon:"icon"}
   
   res.render("index",{senddata:senddata});
   
})










app.post("/" , function(req,res){
   if(!req.body.cityname){
      res.status(400).send({message:"content can not empty"});
      return;
   }else{
   const cityname = req.body.cityname;
   const apikey ="8b8394287f0b1cb948b04df2732d3547";
   const unit ="metric"
const url = "https://api.openweathermap.org/data/2.5/weather?q="+cityname+"&appid="+ apikey+"&units="+unit

 https.get(url, function(response){
 // status code is used to check weather url is right or wrong
    console.log(response.statusCode);
  
    //according to the module of node js
    response.on("data",(data)=>{
      //all the response data will be putted in a normal object-form  from a string-objectso we use json.parse
    const weatherdata = JSON.parse(data);
   console.log(weatherdata)
    

    const temp =Math.floor (weatherdata.main.temp); 
    console.log(temp);


    const country = weatherdata.sys.country;



    const icon = weatherdata.weather[0].icon
    const imgurl = `https://openweathermap.org/img/wn/${icon}@2x.png`


    const weatherdescription = weatherdata.weather[0].description
    console.log(weatherdescription)

  const senddata ={};
  //------ senddata values are setting----- //
  senddata.temp =temp;
  senddata.disc=weatherdescription;
  senddata.cityname=cityname;
  senddata.country=country;
  senddata.imgurl=imgurl;

 
  res.render("index",{senddata:senddata});
    
   //  res.write("<h1>the weather is currently"+"" +weatherdescription+"</h1>")
   //  res.write("<h1>THE TEMPERATURE IN"+  " " +cityname+ "" +" IS "+"" +temp  +"   " +"C"+"</h1>")
   //  res.write(`<img src="${imgurl}">`)
   //  res.send()
    })
   
 })



   }




   console.log("post request recived")
})



 app.listen(3000,function(){
    console.log("server is running on port 3000")
 }) 