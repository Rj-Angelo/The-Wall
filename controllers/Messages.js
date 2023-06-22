const Message = require("../models/Message");
const Comment = require("../models/Comment");

class Messages{
	constructor(){
	}

	async index(req, res){
		const errors = req.session.error ?? null;

		const messages = await Message.getAllMessages();
		const comments = await Comment.getAllComments();

		res.render("index",
		{ 
			messages: messages.result, 
			comments: comments.result, 
			name: req.session.name, 
			user_id: req.session.user_id, 
			errors: errors
		});
	}

	async createMessage(req, res){
		const validate_inputs = await Message.validateMessage(req.body);
		if(validate_inputs.status){
			const result = await Message.createMessage(req.session.user_id, req.body.message);
		}
		else{
			console.log(validate_inputs.error);
		}
		
		res.redirect("/");
	}

	async destroyMessage(req, res){
		const result = await Message.destroyMessage(req.body.message_id, req.session.user_id);
		res.redirect("/");
	}
}

module.exports = new Messages;
