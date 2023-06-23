const mySqlConnection = require("./mySqlConnection");

class Comment extends mySqlConnection{
	constructor() {
		super();
	}

	validateComment(user_input){
		let response_data = {status: false, error: []};

		if(!user_input ||
			user_input.trim() < 1){
			response_data.error.push("Comment cannot be blank");	
		}
		else{
			response_data.status = true;
		}

		return response_data;
	}

	async createComment(user_input, message_id, user_id){
		let response_data = {status: false, result: [], error: []}

		try{
			let insert_new_comment_query = (`INSERT INTO comments (message_id, user_id, comment, created_at, updated_at) values(?,?,?,NOW(),NOW())`);

			[ response_data.result ] = await this.query(insert_new_comment_query,[message_id,user_id,user_input]);

			if(response_data.result){
				response_data.status = true;
			}
		}
		catch(error){
			response_data.error.push(error);
		}

		return response_data;
	}

	async destroyComment(message_id, user_id){
		let response_data = { status: false, result: [], error: []}
		
		try{
			let delete_comment_query = (`DELETE FROM comments WHERE id = ? and user_id = ?`);
			
			response_data.result = await this.query(delete_comment_query, [ message_id, user_id ]);
			response_data.status = true;
		}
		catch(error){
			response_data.error.push(error);
		}
	}
}

module.exports = new Comment;