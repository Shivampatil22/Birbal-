const { FetchQuestion } = require('../controllers/scraper');

const express=require("express")
const scrape_route= express.Router();

scrape_route.get("/:contestId/:index",async(req,res)=>{
    const {contestId,index} = req.params;
    const data=await FetchQuestion(contestId,index);
    res.send(data);
});

module.exports=scrape_route;