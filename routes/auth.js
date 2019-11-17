const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt');
const {isLoggedIn,isNotLoggedIn} = require('./middlewares');
const {User} = require('../models');

const router = express.Router();

//회원가입
router.post('/join',isNotLoggedIn,async(req,res,next)=>{
    const{email, nick, password} = req.body;
    try{
        const exUser = await User.findOne({where:{email}});
        if(exUser){
            //플레시 에러 나중에
            return res.redirect('/join');
        }
        const hash = await bcrypt.hash(password,12);
        await User.create({
            email,
            nick,
            password:hash
        });
        return res.redirect('/');
    }catch(error){
        console.error(error);
        next(error);
    }
})

//로그인
router.post('/login',isNotLoggedIn,(req,res,next)=>{
    passport.authenticate('local',(authError,user,info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return next(authError);
        }

        return req.login(user,(loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        })
    })(req,res,next);
});

router.get('/logout',isLoggedIn,(req,res)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
})

router.get('/kakao',passport.authenticate('kakao'));
router.get('/kakao/callback',passport.authenticate('kakao',{
    failureRedirect:'/',
}),(req,res)=>{
    res.redirect('/');
});

router.get('/naver',passport.authenticate('naver'));
router.get('/naver/callback',passport.authenticate('naver', {
        failureRedirect: '/'
    }), (req,res)=>{
        res.redirect('/');
});

module.exports =router;