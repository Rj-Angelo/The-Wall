const Message = require("../models/Message");
const Comment = require("../models/Comment");

class Messages{
	constructor(){
	}

	async index(req, res){
		const err = req.session.err ?? null;

		const messages = await Message.getAll();
		const comments = await Comment.getAll();

		res.render("index",{ messages: messages.data, comments: comments.data, name: req.session.name, user_id: req.session.user_id, err: err });
	}

	async create(req, res){
		const validate_inputs = await Message.validate_input(req.body);
		if(validate_inputs.status){
			const result = await Message.create(req.session.user_id, req.body.message);
		}
		else{
			console.log(validate_inputs.err);
		}
		
		res.redirect("/");
	}

	async destroy(req, res){
		console.log(req.session.user_id);
		console.log(req.body.user_id);
		if(req.session.user_id === parseInt(req.body.user_id)){
			const result = await Message.destroy(req.body.message_id, req.session.user_id);
			console.log(result);
		}
		res.redirect("/");
	}
}

module.exports = new Messages;
