const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.render('index',{login:null,user:null});
})

module.exports = router