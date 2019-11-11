const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const {User} = require('../models');

module.exports = (passport)=>{
    passport.use(new LocalStrategy({
        usernameField:'email',
        passwordField:'password'
    },async(email, password,done)=>{
        try{
            const ExUser = await User.findOne({where:{email}});
            if(ExUser){
                const result = await bcrypt.compare(password, ExUser.password);
                if(result){
                    done(null, ExUser);
                }else{
                    done(null, false);
                }
            }else{
                done(null, false);
            }
        }catch(error){
            console.error(error);
            done(error);
        }

    }))
}