const mySqlConnection = require("./mySqlConnection");

class Message extends mySqlConnection {
	constructor() {
		super();
	}
	
	async getAllMessages(){
		let response_data = {status: false, result: [], error: []};
		
		try{
			let get_all_messages_query = (
				`SELECT messages.id, messages.user_id, CONCAT(users.first_name, ' ', users.last_name) AS name, message,
					DATE_FORMAT(messages.created_at, '%M, %D %Y') AS date,
					( SELECT 
						JSON_ARRAYAGG( 
							JSON_OBJECT(
								'id', comments.id,
								'message_id', comments.message_id,
								'user_id', comments.user_id,
								'name', CONCAT(users.first_name, ' ', users.last_name),
								'comment', comments.comment,
								'date', DATE_FORMAT(comments.created_at, '%M, %D %Y'))
						) FROM comments
						INNER JOIN users ON comments.user_id = users.id
						WHERE comments.message_id = messages.id
						ORDER BY comments.id DESC
					) AS comments
				FROM messages
				INNER JOIN users ON messages.user_id = users.id
				ORDER BY date DESC;`);

			response_data.status = true;
			[ response_data.result ] = await this.query(get_all_messages_query);
		}
		catch(error){
			response_data.error.push(error); 
		}

		return response_data;
	}

	async validateMessage(user_inputs){
		let response_data = {status: false, error: []};

		if(user_inputs.message.length < 3){
			response_data.error.push("Message must be longger than 3 letters");
		}
		else{
			response_data.status = true;
		}

		return response_data;
	}

	async createMessage(user_id, user_message){
		let response_data = {status: false, result: [], error: []};

		try{
			let create_message_query = (`INSERT INTO messages (user_id, message, created_at, updated_at) values(?,?,NOW(),NOW())`);
			
			response_data.result = await this.query(create_message_query, [user_id, user_message]);

			if(response_data.result.length > 0){
				response_data.status = true;
			}
		}
		catch(error){
			response_data.error.push(error); 
		}

		return response_data;
	}

	async destroyMessage(message_id, user_id){
		let response_data = {status: false, result: {}, error: []}
	
		try{
			let delete_message_query = (`DELETE FROM messages where id = ? and user_id = ?`);
			response_data.status = true;
			response_data.result = await this.query(delete_message_query, [message_id, user_id]);
		}
		catch(error){
			response_data.error.push(error);
		}

		return response_data;
	}
}

module.exports = new Message;