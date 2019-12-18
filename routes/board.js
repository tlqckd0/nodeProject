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
    let showPageNum = 10;
    let {page, type} =req.query;
    const {boardNum} = req.params;

    //잘못된 보드 접근
    if(boardNum != 1 && boardNum != 2){
        return res.redirect('/board');
    }
    try{
        //포스트리스트 처리
        const PostCondition = {boardName:boardNum};
        if(type !== undefined){
            PostCondition.type = type;
        }
        const numOfPosts = await Post.count({where:PostCondition});
        if(page === undefined){
            page = 1;
        }
        if(numOfPosts <10){
            showPageNum = numOfPosts;
        }

        const postdata = await Post.findAll({where:PostCondition,offset : showPageNum*(page-1),limit : showPageNum,order:[['createdAt','DESC']]});
        const pageLength = Math.ceil(numOfPosts/10);

        res.render('board',
                {boardNum,
                 user:req.user,
                 postdata,
                 pageLength,
                 type});
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
    const {title, description,imageURL,type} = req.body;
    const boardName = req.params.boardNum;
    const nick = req.user.nick;
    try{
        const post = await Post.create({
            title,
            imageURL,
            description,
            nick,
            boardName,
            type
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
    let showPageNum = 10;
    let {page,type} = req.query;
    const {boardNum,id} = req.params;
    
    //잘못된 보드 접근
    if(boardNum != 1 && boardNum != 2){
        return res.redirect('/board');
    }
    try{
        //포스트 처리
        const post = await Post.findOne({where:{boardName:boardNum,id},include:{model:Comment}});

        //포스트 리스트 처리
        const PostCondition = {boardName:boardNum};
        if(type !== undefined){
            PostCondition.type = type;
        }
        const numOfPosts = await Post.count({where:PostCondition});
        if(page === undefined){
            page = 1;
        }
        if(numOfPosts <10){
            showPageNum = numOfPosts;
        }

        const postdata = await Post.findAll({where:PostCondition,offset : showPageNum*(page-1),limit : showPageNum,order:[['createdAt','DESC']]});
        const pageLength = Math.ceil(numOfPosts/10);

        
        res.render('view',{
            post,
            title:post.title,
            comments:post.comments,
            boardNum,
            user:req.user,
            postdata,
            pageLength,
            type
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