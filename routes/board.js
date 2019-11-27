const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const router = express.Router();
const {Post , Comment} = require('../models');
const multer = require('multer');

//게시판 메인
router.get('/',(req,res,next)=>{
    res.render('main',{user:req.user})
})

//게시판 번호 1,2
router.get('/:boardNum',async (req,res,next)=>{
    let showPrintNum = 10;
    let {page} =req.query;
    const {boardNum} = req.params;
    if(boardNum != 1 && boardNum != 2){
        return res.redirect('/board');
    }
    try{
        const posts = await Post.findAll({where:{boardName:boardNum},order:[['createdAt','DESC']]});
        //보내주는거는 ex) page = 1또는 없으면 최근쓴글 0~9번까지
        //                page = 3이면 최근쓴글  20~29번까지
        const pageLength = Math.ceil(posts.length/10);
        if(pageLength === parseInt(page)){
            showPrintNum = posts.length-(page-1)*10;
        }else if(pageLength === Number(1)){
            //게시판에 글 10개 이하일때
            showPrintNum = posts.length;
        }
        if(page === undefined || page === 1){
            page = 0
        }else{
            page = (page-1)*10;
        }

        const postdata=[];
        for(let i = page;i<page+showPrintNum;i++){
            postdata.push(posts[i]);
        }

        res.render('board',{boardNum,user:req.user,postdata,pageLength});

    }catch(error){
        console.error(error);
        next(error);
    }
})
//글쓰기
router.get('/:boardNum/writeform',isLoggedIn,(req,res,next)=>{
    const boardNum = req.params.boardNum;
    res.render('writeForm',{boardNum,user:req.user})
})

//글쓴거 처리
router.post('/:boardNum/writeform',isLoggedIn,async (req,res,next)=>{
    const {title, description,imageURL} = req.body;
    const boardName = req.params.boardNum;
    const nick = req.user.nick;
    try{
        const post = await Post.create({
            title,
            imageURL,
            description,
            nick,
            boardName,
            type:'normal'
        })
        return res.redirect(`/board/view/${boardName}/${post.id}`);
    }
    catch(error){
        console.error(error);
        next(error);
    }
})
//글쓴거 보여주기
router.get('/view/:boardNum/:id?',async(req,res,next)=>{
    let showPrintNum = 10;
    let {page} = req.query;
    const {boardNum,id} = req.params;
    try{
        //포스트 처리
        const post = await Post.findOne({where:{boardName:boardNum,id},include:{model:Comment}});
        const posts = await Post.findAll({where:{boardName:boardNum},order:[['createdAt','DESC']]});
        const pageLength = Math.ceil(posts.length/10);
        if(pageLength === parseInt(page)){
            showPrintNum = posts.length-(page-1)*10;
        }else if(pageLength === Number(1)){
            showPrintNum = posts.length;
        }
        if(page === undefined || page === 1){
            page = 0
        }else{
            page = (page-1)*10;
        }
        const postdata=[];
        for(let i = page;i<page+showPrintNum;i++){
            postdata.push(posts[i]);
        }
        
        res.render('view',{
            post,
            title:post.title,
            boardNum,
            user:req.user,
            postdata,
            pageLength,
            comments:post.comments
        });
    }catch(error){
        console.error(error);
        next(error);
    }
})
//글 수정하기
router.post('/:boardNum/updateForm', isLoggedIn, async (req, res, next) => {
    //포스트정보
    const { boardNum } = req.params;
    const { userNick, postId } = req.body;
    try {
        if(userNick === req.user.nick) {
            const post = await Post.findOne({ where: { id: postId } });
            res.render('updateForm', {
                user: req.user,
                boardNum,
                post
            })
        }
        else {
            console.log("수정: 사용자가 일치하지 않습니다.");
            res.redirect(`/board/${boardNum}`);
        }
    } catch(error){
        console.error(error);
        next(error);
    }
})
//글 수정 처리
router.post('/:boardNum/update', isLoggedIn, async (req, res, next) => {
    //포스트정보
    const { boardNum } = req.params;
    const { userNick, postId, title, description } = req.body;
    try {
        if (userNick === req.user.nick) {
            await Post.update({ title, description }, { where: { id: postId } });
            res.redirect(`/board/${boardNum}`);
        }
        else {
            console.log("수정 : 사용자가 일치하지 않습니다.");
            res.redirect(`/board/${boardNum}`);
        }
    } catch(error){
        console.error(error);
        next(error);
    }
})

//글 삭제하기
router.post('/:boardNum/delete/:id',isLoggedIn,async(req,res,next)=>{
    //포스트정보
    const {boardNum,id} = req.params;
    const {userNick} = req.body;
    try{
        if(userNick === req.user.nick){
            await Post.destroy({where:{id,boardName:boardNum}});
            res.redirect(`/board/${boardNum}`);
        }
        else{
            console.log("삭제 :사용자 일치하지 않는다");
            res.redirect(`/board/${boardNum}`);
        }
    }catch(error){
        console.error(error);
        next(error);
    }
});



module.exports = router