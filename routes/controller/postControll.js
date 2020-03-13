const { Post, Comment } = require('../../models');

/* 포스팅 처리 */
async function Posting({ body, params, user }) {
    try {
        const { boardName } = params;
        const { title, description, imageURL, type } = body;

        const newPost = await Post.create({
            title,
            imageURL,
            description,
            boardName,
            nick: user.nick,
            type
        });

        //console.log(`포스팅처리 id:${newPost.id}`);
        return {
            id: newPost.id,
            boardName: newPost.boardName
        }
    } catch (error) {
        throw error;
    }
}

/* 포스트리스트 조회 */
async function GetPostList(_page, _type, boardName) {
    try {
        let page = _page;
        const boardCondition = { boardName };
        let postsPerPage = 10;

        //조회조건//
        if (page == undefined) {//처음페이지일때
            page = 1;
        }
        if (_type == 'normal' || _type == 'special') {//all 타입이나 없을때는 전부조회
            boardCondition.type = _type;
        }

        //글 갯수
        const numOfPost = await Post.count({ where: boardCondition });
        const pagesLength = Math.ceil(numOfPost / 10);

        if (numOfPost < 10) {//글이 10개 미만일때
            postsPerPage = numOfPost;
        }


        const posts = await Post.findAll({
            attribute: ['id', 'post', 'nick', 'type', 'createdAt', 'recommend'],
            where: boardCondition,
            offset: postsPerPage * (page - 1),
            limit: postsPerPage,
            order: [['createdAt', 'DESC']]
        });

        //console.log(`게시판${boardName}조회`);

        return {
            pagesLength,
            posts,
            boardType: boardCondition.type
        }
    } catch (error) {
        throw error;
    }
}

/* 포스트 조회 >> 댓글 O for view*/
async function GetPost({ params }) {
    try {
        const { boardName, id } = params;
        const post = await Post.findOne({
            attribute: ['id', 'title', 'imageURL', 'description', 'recommend', 'nick'],
            where: { boardName, id },
            include: { model: Comment }
        })

        //console.log(`게시판${boardName} 포스트 id:${id}조회`);
        //console.log(post,post.comments);
        return {
            post,
            comments: post.comments
        };
    } catch (error) {
        throw error;
    }
}

/* 포스트 조회 >> 댓글 X for update */
async function GetPostWithoutComment({ body }) {
    try {
        const { id } = body;
        const post = await Post.findOne({
            attribute: ['id', 'title', 'description'],
            where: { id }
        })
        return post;
    } catch (error) {
        throw error;
    }
}

/* 포스트 업데이트 */
async function UpdatePost({ body }) {
    try {
        const { title, description, id } = body;
        await Post.update({ title, description }, {
            where: { id }
        })
        return;
    } catch (error) {
        throw error;
    }
}

/* 포스트 제거 */
async function DeletePost({params }) {
    try {
        const {id,boardName} = params;
        Post.destory({
            where:{id,boardName}
        });
        return;
    } catch (error) {
        throw error;
    }
}



module.exports.Posting = Posting;
module.exports.GetPostList = GetPostList;
module.exports.GetPost = GetPost;
module.exports.GetPostWithoutComment = GetPostWithoutComment;
module.exports.UpdatePost = UpdatePost;
module.exports.DeletePost = DeletePost;