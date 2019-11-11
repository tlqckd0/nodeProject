const NaverStrategy = require('passport-naver').Strategy;

const{User} = require('../models');

module.exports = (passport)=>{
    passport.use(new NaverStrategy({
        clientID: process.env.NAVER_ID,
        clientSecret:process.env.NAVER_SECRET,
        callbackURL: '/auth/naver/callback'
	},async (accessToken, refreshToken, profile, done) =>{
        try{
            console.log(profile);
            const exUser = await User.findOne({where:{snsId:profile.id , provider:'naver'}});
            if(exUser){
                done(null,exUser);
            }else{
                const newUser = await User.create({
                    email:profile.emails[0].value,
                    nick:profile.displayName,
                    snsId:profile.id,
                    provider:'naver'
                })
                done(null,newUser);
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }
));
}