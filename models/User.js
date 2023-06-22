const config = require("../config");
const Mysql = require("mysql2/promise");
const bcrypt = require('bcrypt');
const saltRounds = 10;


class User{
	constructor(){
	}

	validateLogin(user_inputs){
		let response = { is_valid: false, error: [] };

		/* Validate Email*/
		if(user_inputs.email.length > 4){
			if( 
				user_inputs.email.lastIndexOf("@")
				< user_inputs.email.lastIndexOf(".com")
			){
				response.is_valid = true;
			}
		}
		else{
			response.error = "Email cant be less than 4 letters";
		}
		
		/* Validate Password */
		if(user_inputs.password.length < 1 &&
			response.is_valid == true){
			response.is_valid == false;
			response.error.push("Password cannot be blank");
		}

		return response;
	}

	validateRegistration(user_inputs){
		let  response = {is_valid: true, error: []}

		/* Validate fields if empty*/
		for(let input in user_inputs){
			if(user_inputs[input] === ""){
				response.is_valid = false;
				response.error.push(input + " cannot be blank.");
			}
		}

		if(
			user_inputs.password 
			!= user_inputs.confirm_password
		){
			response.is_valid = false;
			response.error.push("Password and Confirm Password should match");
		}

		return response;
	}

	async validateUser(user_inputs){
		const con = await Mysql.createConnection(config.database);

		let response = {status: false, result: [], error: []}

		try{
			const get_user_by_email = (`SELECT *
				FROM users
				WHERE email = ?`);
			
			[[ response.result ]] = await con.query(get_user_by_email, [ user_inputs.email ]);
		}catch(error){
			response.error.push(error);
		}
		if(response.result){
			if(bcrypt.compareSync(user_inputs.password, response.result.password)){
				response.status = true;
			}
			else{
				response.error.push("Incorrect Password");
			}
		}else{
			response.error.push("User does not exist");
		}

		return response;
	}

	async createUser(user_details, password){
		const con = await Mysql.createConnection(config.database);

		let response = {status: false, result: [], error: []};

		try{
			user_details.push(bcrypt.hashSync(password,saltRounds));

			const insert_new_user_query = (`INSERT INTO users (first_name, last_name, email, password, created_at, updated_at) values(?,?,?,?,NOW(),NOW())`);
			
			response.status = true;
			response.result = await con.query(insert_new_user_query,user_details);
		}
		catch(error){
			response.error = error;
		}

		return response;
	}
}

module.exports = new User;

