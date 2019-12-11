const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const router = express.Router();
const {Recommend,Post} = require('../models');


router.post('/',isLoggedIn,async (req,res,next)=>{
    const {id} = req.body;
    const userId = req.user.id;
    try{
        const post = await Post.findOne({where:{id},include:{model:Recommend}});

        var result = post.recommends.find(recommend=>{
            return recommend.userId == userId;
        })
        var num = post.recommend;
        if(result === undefined){
            num += 1;       
            await Post.update({recommend:num},{where:{id}});
            await Recommend.create({
                userId,
                postId:id
            })
            res.send(JSON.stringify({num,result:'ok'}));
        }else{
            res.send(JSON.stringify({num,result:'false'}));
        }
    }catch(error){
        console.error(error);
        next(error);
    }
})

module.exports = router;