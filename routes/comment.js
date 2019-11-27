const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const router = express.Router();
const {Comment} = require('../models');


router.post('/add',isLoggedIn,async (req,res,next)=>{
    const {nick} = req.user;
    const {description, postId} = req.body;
    try{
        const comment = await Comment.create({
            description,
            nick,
            postId
        })
        res.json(comment);
    }catch(error){
        console.error(error);
        next(error);
    }
})

module.exports = router;