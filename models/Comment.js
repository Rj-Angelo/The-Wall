const config = require("../config");
const mysql = require("mysql2/promise");

class Comment{
	constructor(){
	}

	async getAll(req, res){
		const con = await mysql.createConnection(config.database);

		let result = {
			status: 0,
			data: [],
			err: ""
		}

		try{
			const get_all_comments_query = (`SELECT comments.id, messages_id, comments.users_id, CONCAT(users.first_name," ", users.last_name) as "name", comment, DATE_FORMAT(comments.created_at,"%M, %D %Y") as "date"
			FROM comments
			INNER JOIN users ON users_id = users.id
			ORDER BY comments.id DESC`);

			result.status = 1;
			[ result.data ] = await con.query(get_all_comments_query); 
		}
		catch(e){
			result.err = e;
		}

		return result;
	}

	validate_input(user_input){
		let result = {
			status: 0,
			err: []
		};

		if(!user_input ||
			user_input.trim() < 1){
			result.err.push("Comment cannot be blank");	
		}
		else{
			result.status = 1;
		}

		return result;
	}

	async create(user_input, message_id, user_id){
		const con = await mysql.createConnection(config.database);
		
		let result = {
			status: 0,
			data: [],
			err: ""
		}

		try{
			const insert_new_comment_query = (`INSERT INTO comments (messages_id, users_id, comment, created_at, updated_at) values(?,?,?,NOW(),NOW())`);

			[result.data] = await con.query(insert_new_comment_query,[message_id,user_id,user_input]);

			if(result.data){
				result.status = 1;
			}
		}
		catch(e){
			console.log(e)
			result.err = e;
		}

		return result;
	}

	async destroy(message_id, user_id){
		const con = await mysql.createConnection(config.database);

		let result = {
			status: 0,
			data: [],
			err: ""
		}
		
		try{
			const delete_comment_query = (`DELETE FROM comments WHERE id = ? and users_id = ?`);
			
			result.data = await con.query(delete_comment_query, [ message_id, user_id ]);
			result.status = 1;
		}
		catch(e){
			console.log(e);
			result.err = e;
		}
	}
}

module.exports = new Comment;