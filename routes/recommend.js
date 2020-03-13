const express = require('express');
const {isLoggedIn} = require('./middlewares');
const router = express.Router();

const {Recommending} = require('./controller/recommentControll');

router.post('/',isLoggedIn,async (req,res,next)=>{
    try{
        const {num,result} = await Recommending(req);
        res.send(JSON.stringify({num,result}));

    }catch(error){
        next(error);
    }
})

module.exports = router;