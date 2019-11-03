const express  = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
require('dotenv').config();


var router = require('./routes/index');
var user = require('./routes/users')
var sequelize = require('./models').sequelize;


const app = express();
sequelize.sync();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.set('port',process.env.PORT||8080);

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(session({
    resave:false,
    saveUninitialized:false,  
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false
    }
}));
app.use(flash());


app.use('/',router);

app.use((req,res,next)=>{
    const err=  new Error('Not Found');
    err.status = 404;
    next(err);
})

app.use((err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development'?err:{};
    res.status(err.status||500);
    res.render('error');
})

app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'포트에서 시작합니다!');
})