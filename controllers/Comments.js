const Comment = require("../models/Comment");

class Comments{
	constructor(req, res){
	}

	create(req, res){
		const validate_comment = Comment.validate_input(req.body.comment);

		if(validate_comment.status){
			const user_comment = Comment.create(
				req.body.comment,
				req.body.message_id,
				req.session.user_id
			);

			if(!user_comment.result){
				req.session.err = user_comment.err;
			}
		}
		else{
			req.session.err = validate_comment.err;
		}

		res.redirect("/");
	}

	destroy(req,res){
		if(req.session.user_id === parseInt(req.body.user_id)){
			const delete_comment = Comment.destroy(req.body.comment_id, req.session.user_id);
		}

		res.redirect("/");
	}
}

module.exports = new Comments;