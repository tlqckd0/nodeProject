const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const router = express.Router();

//controller
const {Commenting} = require('./controller/commentControll');

/* 댓글 달기 */
router.post('/add',isLoggedIn,async (req,res,next)=>{
    try{
        const comment = await Commenting(req);
        res.json(comment);

    }catch(error){
        next(error);
    }
})

module.exports = router;