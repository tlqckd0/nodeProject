const express = require('express');
const fs = require('fs');
const path  = require('path');
const multer = require('multer');

const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const router = express.Router();
//되나..?
fs.readdir('postFile/img',(error)=>{
    if(error){
        console.error('폴더가 없음');
        fs.mkdirSync('postFile/img');
    }
})
//정적파일을 저장합니다.!
const uploadImg = multer({
    //storage diskStorage > 파일 저장장소를 콜백함수에 저장
    //        filename > 파일이름을 콜백함수에 저장
    storage:multer.diskStorage({
        destination(req,file,cb){
            cb(null,'postFile/img/');
        },
        filename(req,file,cb){
            const ext = path.extname(file.originalname);
            cb(null,path.basename(file.originalname,ext)+new Date().valueOf()+ext);
        },
    }),
    //limits fileSize 파일사이즈제한
    limits:{fileSize: 10*1024*1024}
})

//이미지 처리
//single >> 이미지는 req.file에 저장됨
//여기 uploadImg미들웨어를 사용하므로 컴터에 이미지를 저장하고 그 정보를 
//ajax로 넘기는 방법
router.post('/img',isLoggedIn,uploadImg.single('imgURL'),(req,res,next)=>{
    res.json({url:`/img/${req.file.filename}`});
})

module.exports = router;