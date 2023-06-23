const mySqlConnection 	= require("./mySqlConnection");
const bcrypt 		= require('bcrypt');
const saltRounds = 10;

class User extends mySqlConnection{
	validateLogin(user_inputs){
		let response_data = { status: false, error: [] };
		/* Validate Email*/
		if(user_inputs.email.length > 4){
			if( 
				user_inputs.email.lastIndexOf("@")
				< user_inputs.email.lastIndexOf(".com")
			){
				response_data.status = true;
			}
			else{
				response_data.error.push("Email is not valid");
			}
		}
		else{
			response_data.error.push("Email cant be less than 4 letters");
		}
		
		/* Validate Password */
		if(user_inputs.password.length < 1 ){
			response_data.error.push("Password cannot be blank");
			response_data = false;
		}

		return response_data;
	}

	validateRegistration(user_inputs){
		let  response_data = {status: true, error: []}

		/* Validate fields if empty*/
		for(let input in user_inputs){
			if(user_inputs[input] === ""){
				response_data.status = false;
				response_data.error.push(input + " cannot be blank.");
			}
		}

		if(
			user_inputs.password 
			!= user_inputs.confirm_password
		){
			response_data.status = false;
			response_data.error.push("Password and Confirm Password should match");
		}

		return response_data;
	}

	async validateUser(user_inputs){
		let response_data = {status: false, result: [], error: []}

		try{
			let get_user_by_email = (`SELECT *
				FROM users
				WHERE email = ?`);
			
			[[ response_data.result ]] = await this.query(get_user_by_email, [ user_inputs.email ]);
		}catch(error){
			response_data.error.push(error);
		}

		if(response_data.result){
			if(bcrypt.compareSync(user_inputs.password, response_data.result.password)){
				response_data.status = true;
			}
			else{
				response_data.error.push("Incorrect Password");
			}
		}else{
			response_data.error.push("User does not exist");
		}

		return response_data;
	}

	async createUser(user_details, password){
		let response_data = {status: false, result: [], error: []};

		try{
			user_details.push(bcrypt.hashSync(password,saltRounds));

			let insert_new_user_query = (`INSERT INTO users (first_name, last_name, email, password, created_at, updated_at) values(?,?,?,?,NOW(),NOW())`);
			
			response_data.status = true;
			response_data.result = await this.query(insert_new_user_query, user_details);
		}
		catch(error){
			response_data.error.push(error);
		}

		return response_data;
	}
}

module.exports = new User;

