const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/',(req,res,next)=>{
    res.render('index',{user:req.user});
})

router.get('/join',isNotLoggedIn,(req,res,next)=>{
    res.render('join',{user:req.user})
})

module.exports = router