const Comment = require("../models/Comment");

class Comments{
	constructor(req, res){
	}

	createComment(req, res){
		try{
			let validate_comment = Comment.validateComment(req.body.comment);

			if (validate_comment.status) {
				let user_comment = Comment.createComment(
					req.body.comment,
					req.body.message_id,
					req.session.user_id
				);

				if (!user_comment.status) {
					req.session.error = user_comment.error;
				}
			}
			else {
				req.session.error = validate_comment.error;
			}

			res.redirect("/");
		}
		catch(error){
			console.log(error);
		}
	}

	destroyComment(req, res){
		try{
			Comment.destroyComment(req.body.comment_id, req.session.user_id);
			res.redirect("/");
		}
		catch(error){
			console.log(error);
		}
	}
}

module.exports = new Comments;