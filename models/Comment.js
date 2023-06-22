const config = require ("../config");
const mysql = require("mysql2/promise");

class Comment{
	constructor(){
	}

	async getAllComments(){
		const con = await mysql.createConnection(config.database);

		let response = { status: false, result: [], error: [] }

		try{
			const get_all_comments_query = (`SELECT comments.id, message_id, comments.user_id, CONCAT(users.first_name," ", users.last_name) as "name", comment, DATE_FORMAT(comments.created_at,"%M, %D %Y") as "date"
			FROM comments
			INNER JOIN users ON user_id = users.id
			ORDER BY comments.id DESC`);

			response.status = true;
			[ response.result ] = await con.query(get_all_comments_query); 
		}
		catch(error){
			console.log(error);
			response.error.push(error); 
		}

		return response;
	}

	validateComment(user_input){
		let response = {status: false, error: []};

		if(!user_input ||
			user_input.trim() < 1){
			response.error.push("Comment cannot be blank");	
		}
		else{
			response.status = true;
		}

		return response;
	}

	async createComment(user_input, message_id, user_id){
		const con = await mysql.createConnection(config.database);
		
		let response = {status: false, result: [], error: []}

		try{
			const insert_new_comment_query = (`INSERT INTO comments (message_id, user_id, comment, created_at, updated_at) values(?,?,?,NOW(),NOW())`);

			[ response.result ] = await con.query(insert_new_comment_query,[message_id,user_id,user_input]);

			if(response.result){
				response.status = true;
			}
		}
		catch(error){
			console.log(error)
			response.error.push(error);
		}

		return response;
	}

	async destroyComment(message_id, user_id){
		const con = await mysql.createConnection(config.database);

		let response = { status: false, result: [], error: []}
		
		try{
			const delete_comment_query = (`DELETE FROM comments WHERE id = ? and user_id = ?`);
			
			response.result = await con.query(delete_comment_query, [ message_id, user_id ]);
			response.status = true;
		}
		catch(error){
			console.log(error);
			response.error.push(error);
		}
	}
}

module.exports = new Comment;