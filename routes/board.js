const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.render('main',{user:req.user})
})

router.get('/:boardNum',(req,res,next)=>{
    const boardNum = req.params.boardNum;
    res.render('board',{num:boardNum,user:req.user})
})

router.get('/:borardNum/writeform',isLoggedIn,(req,res,next)=>{
    const boardNum = req.params.boardNum;
    res.render('writeForm',{num:boardNum,user:req.user})
})

module.exports = router