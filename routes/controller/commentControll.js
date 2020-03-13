const { Comment } = require('../../models');

async function Commenting({ user, body }) {
    try {
        const { description, postId } = body;
        const { nick } = user;
        const comment = await Comment.create({
            postId,
            nick,
            description
        });
        return comment;
    } catch (error) {
        throw error;
    }
};

module.exports.Commenting = Commenting;