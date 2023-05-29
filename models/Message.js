const config = require("../config");
const mysql = require("mysql2/promise");

class Message{
	constructor(res, req){
	}

	async getAll(){
		const con = await mysql.createConnection(config.database);
		
		let result = {
			status: 0, 
			data: [], 
			err: ""
		};
		
		try{
			const get_all_messages_query = (`SELECT messages.id, messages.users_id, CONCAT(users.first_name," ",users.last_name) AS "name", message, DATE_FORMAT(messages.created_at, "%M, %D %Y") AS "date"
				FROM messages
				INNER JOIN users ON users_id = users.id
				ORDER BY date DESC`);

			result.status = 1;
			[ result.data ] = await con.query(get_all_messages_query);
		}
		catch(e){
			console.log(e);
			result.err = e; 
		}

		return result;
	}

	async validate_input(user_inputs){
		let result = {status: 0, err: ""};

		if(user_inputs.message.length < 3){
			result.err = "Message must be longger than 3 letters"
		}
		else{
			result.status = 1;
		}

		return result;
	}

	async create(user_id, user_message){
		const con = await mysql.createConnection(config.database);

		let result = {status: 0, data: [], err: ""};

		try{
			const create_message_query = (`INSERT INTO messages (users_id, message, created_at, updated_at) values(?,?,NOW(),NOW())`);
			
			result.data = await con.query(create_message_query, [user_id, user_message]);

			if(result.data.length > 0){
				result.status = 1;
			}
		}
		catch(e){
			console.log(e);
			result.err = e;
		}

		return result;
	}

	async destroy(message_id, user_id){
		const con = await mysql.createConnection(config.database);

		let result = {
			status: 0, 
			data: {},
			err: ""}
	
		try{
			const delete_message_query = (`DELETE FROM messages where id = ? and users_id = ?`);
			result.status = 1;
			result.data = await con.query(delete_message_query, [message_id, user_id]);
			
			console.log(result.data);
		}
		catch(e){
			console.log(e);
			result.err = e;
		}

		return result;
	}
}

module.exports = new Message;