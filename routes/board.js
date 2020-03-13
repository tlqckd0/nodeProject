const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

//controller
const {
    Posting,
    GetPostList,
    GetPost,
    GetPostWithoutComment,
    UpdatePost,
    DeletePost
} = require('./controller/postControll');

/* 게시판 메인 > 아직 뭐넣을지 모르겠음 */
router.get('/', (req, res, next) => {
    res.render('main', {// >> 렌더링
        user: req.user
    })
})

/* 게시판 접근 */
router.get('/:boardName',(req,res,next)=>{
    const { boardName } = req.params;
    if (boardName != 1 && boardName != 2) {
        return res.redirect('/board');
    }else{
        next();
    }
})

//게시판 번호 1,2
router.get('/:boardName', async (req, res, next) => {
    const { boardName } = req.params;
    try {
        const { page, type } = req.query;
        const { pagesLength, posts, boardType } = await GetPostList(page, type, boardName);

        res.render('board', {// >> 렌더링
            boardName,
            user: req.user,
            posts,
            pagesLength,
            type: boardType
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
})

/* 글쓰기 폼 */
router.get('/:boardName/writeform', isLoggedIn, (req, res, next) => {
    const { boardName } = req.params;

    res.render('writeForm', {// >> 렌더링
        boardName,
        user: req.user
    })
})

/* 글쓴거 처리하기 */
router.post('/:boardName', isLoggedIn, async (req, res, next) => {
    try {
        const { id, boardName } = await Posting(req);
        res.redirect(`/board/${boardName}/${id}?type=all`);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
})

/* 포스트 보기 */
router.get('/:boardName/:id?', async (req, res, next) => {
    const { boardName } = req.params;

    try {
        const { page, type } = req.query;
        const { post, comments } = await GetPost(req)
        const { pagesLength, posts, boardType } = await GetPostList(page, type, boardName);


        res.render('view', {// >> 렌더링
            post,
            comments,
            boardName,
            user: req.user,
            posts,
            pagesLength,
            type: boardType
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
});

/* 포스트 수정 */
router.post('/:boardName/updateForm', isLoggedIn, async (req, res, next) => {
    const { boardName } = req.params;

    try {
        if (req.body.nick === req.user.nick) {

            const post = await GetPostWithoutComment(req);

            res.render('updateForm', {
                user: req.user,
                boardName,
                post
            })
        }
        else {
            console.log("수정: 사용자가 일치하지 않습니다.");
            res.redirect(`/board/${boardName}`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/* 글 수정처리 */
router.post('/:boardName/update', isLoggedIn, async (req, res, next) => {
    const { boardName } = req.params;

    try {
        if (req.body.nick === req.user.nick) {//사용자와 수정자가 일치하면
            await UpdatePost(req);
            res.redirect(`/board/${boardName}`);
        }
        else {
            res.redirect(`/board/${boardName}`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

/* 글 삭제하기 */
router.post('/:boardName/delete/:id', isLoggedIn, async (req, res, next) => {
    const { boardName } = req.params;
    try {
        if (req.body.nick === req.user.nick) {
            await DeletePost(req);
            res.redirect(`/board/${boardName}`);
        }
        else {
            res.redirect(`/board/${boardName}`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});



module.exports = router