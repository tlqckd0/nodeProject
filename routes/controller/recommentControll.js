const { Post, Recommend } = require('../../models');

async function Recommending({ body, user }) {
    try {
        const { postId } = body;
        const userId = user.id;

        const post = await Post.findOne({
            where: { id: postId },
            include: { model: Recommend }
        });
        let num = post.recommend;
        let result = post.recommends.find(recommend => {
            return recommend.userId == userId;
        })
        if (result === undefined) {
            num += 1;
            await Post.update({ recommend: num }, { where: { id: postId } });
            await Recommend.create({
                userId,
                postId
            })
            result = 'ok';
        } else {
            result = 'false';
        }
        return {
            num,
            result
        }
    } catch (error) {
        throw error;
    }
}

module.exports.Recommending = Recommending;