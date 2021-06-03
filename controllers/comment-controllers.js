const { Comment, Piza, Pizza } = require('../models');

const commentController = {
    // add Comment to Pizza
    addComment({ params, body }, res){
        Comment.create(body)
        .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $push: { comments: _id } },
                { new: true, runValidators: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                return res.status(404).json({ message: 'No Pizza found with this id.'});
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    // add reply
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: { replies:  body } },
            { new: true, runValidators: true }
        )
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                return res.status(404).json({ message: 'No pizza found with this id.'});
            }
            res.json(dbPizzaData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // remove comment
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId})
        .then(deletedComment => {
            if (!deletedComment) {
               return res.status(404).json({ message: 'No comment found with this id.'});
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
               return res.status(404).json({ message: 'No pizza found with this id.'});
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    // remove reply
    removeReply({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId})
        .then(deletedReply => {
            if (!deletedReply) {
                return res.status(404).json({ message: 'No reply found with this id.'});
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { replies: { replyId: params.replyId } } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                return res.status(404).json({ message: 'No pizza found with this id.'});
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = commentController;