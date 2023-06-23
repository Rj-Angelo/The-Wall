const Message = require("../models/Message");
const Comment = require("../models/Comment");

class Messages{
	constructor(){
	}

	async index(req, res){
		try{
			let errors = req.session.error ?? null;
			req.session.error = [];

			let messages = await Message.getAllMessages();

			res.render("index",
			{
				messages: messages.result,
				name: req.session.name,
				user_id: req.session.user_id,
				errors: errors
			});
		}
		catch(error){
			console.log(error);
		}
	}

	async createMessage(req, res){
		try{
			let validate_inputs = await Message.validateMessage(req.body);

			if (validate_inputs.status) {
				await Message.createMessage(req.session.user_id, req.body.message);
			}
			else {
				req.session.error = validate_inputs.error;
			}

			res.redirect("/");
		}
		catch(error){
			console.log(error);
		}
	}

	async destroyMessage(req, res){
		try{
			await Message.destroyMessage(req.body.message_id, req.session.user_id);
			res.redirect("/");
		}
		catch(error){
			console.log(error)
		}
	}
}

module.exports = new Messages;
