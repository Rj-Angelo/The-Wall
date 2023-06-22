const config = require("../config");
const mysql = require("mysql2/promise");

class Message{

	async getAllMessages(){
		const con = await mysql.createConnection(config.database);
		
		let response = {status: false, result: [], error: []};
		
		try{
			const get_all_messages_query = (`SELECT messages.id, messages.user_id, CONCAT(users.first_name," ",users.last_name) AS "name", message, DATE_FORMAT(messages.created_at, "%M, %D %Y") AS "date"
				FROM messages
				INNER JOIN users ON user_id = users.id
				ORDER BY date DESC`);

			response.status = true;
			[ response.result ] = await con.query(get_all_messages_query);
		}
		catch(error){
			console.log(error);
			response.error.push(error); 
		}

		return response;
	}

	async validateMessage(user_inputs){
		let response = {status: false, error: []};

		if(user_inputs.message.length < 3){
			response.error = "Message must be longger than 3 letters";
		}
		else{
			response.status = true;
		}

		return response;
	}

	async createMessage(user_id, user_message){
		const con = await mysql.createConnection(config.database);
		
		let response = {status: false, result: [], error: []};

		try{
			const create_message_query = (`INSERT INTO messages (user_id, message, created_at, updated_at) values(?,?,NOW(),NOW())`);
			
			response.result = await con.query(create_message_query, [user_id, user_message]);

			if(response.result.length > 0){
				response.status = true;
			}
		}
		catch(error){
			console.log(error);
			response.error.push(error); 
		}

		return response;
	}

	async destroyMessage(message_id, user_id){
		const con = await mysql.createConnection(config.database);

		let response = {status: false, result: {}, error: []}
	
		try{
			const delete_message_query = (`DELETE FROM messages where id = ? and user_id = ?`);
			response.status = true;
			response.result = await con.query(delete_message_query, [message_id, user_id]);
		}
		catch(error){
			console.log(error);
			response.error.push(error);
		}

		return response;
	}
}

module.exports = new Message;