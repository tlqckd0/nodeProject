const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.render('main',{user:'123',login:'123123'})
})

router.get('/:boardNum',(req,res,next)=>{
    const boardNum = req.params.boardNum;
    res.render('board',{num:boardNum,user:null,login:null})
})

router.get('/:borardNum/writeform',(req,res,next)=>{
    const boardNum = req.params.boardNum;
    res.render('writeForm',{num:boardNum,user:null,login:null})
})

module.exports = router