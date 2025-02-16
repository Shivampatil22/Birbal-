const express=require('express');
const cors=require('cors');
const app=express();
const scrape_route=require('./routes/scraper_route.js');

app.use(cors());
app.use(express.json());
app.use("/api/problem",scrape_route);

app.listen(8000,()=>{
    console.log("Server is running on port 8000");
});