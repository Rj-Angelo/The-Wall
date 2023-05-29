const config = require("../config");
const Mysql = require("mysql2/promise");
const bcrypt = require('bcrypt');
const saltRounds = 10;


class User{
	constructor(){
	}

	validate_login_inputs(user_inputs){
		let result = {
			is_valid: 0, 
			err: ""
		};

		/* Validate Email*/
		if(user_inputs.email.length > 4){
			if( 
				user_inputs.email.lastIndexOf("@")
				< user_inputs.email.lastIndexOf(".com")
			) {
				result.is_valid = 1;
			}
		}
		else{
			result.err = "Email cant be less than 4 letters"
		}
		
		/* Validate Password */
		if(user_inputs.password.length > 0){
			result.is_valid *= 1;
		}
		else{
			result.is_valid = 0;
			result.err = "Password cannot be blank";
		}
		return result;
	}

	validate_registration_inputs(user_inputs){
		let  result = {
			is_valid: 1,
			err: []
		}

		/* Validate fields if empty*/
		for(let input in user_inputs){
			if(user_inputs[input] === ""){
				result.is_valid  = 0;
				result.err.push(input + " cannot be blank.");
			}else{
				result.is_valid *= 1;
			}
		}

		if(
			user_inputs.password 
			!= user_inputs.confirm_password
		) {
			result.is_valid = 0;
			result.err.push("Password and Confirm Password should match");
		}

		return result;
	}

	async validate_user(user_inputs){
		const con = await Mysql.createConnection(config.database);

		let result = {
			status: 0,
			data: [],
			err: ""
		}

		try{
			const get_user_by_email = (`SELECT *
				FROM users
				WHERE email = ?`);
			
			[[ result.data ]] = await con.query(get_user_by_email, [ user_inputs.email ]);
		}catch(e){
			result.err = e;
		}
		if(result.data){
			if(bcrypt.compareSync(user_inputs.password, result.data.password)){
				result.status = 1;
			}
			else{
				result.err = "Incorrect Password";
			}
		}else{
			result.err = "User does not exist";
		}

		return result;
	}

	async create(user_details, password){
		const con = await Mysql.createConnection(config.database);

		let result = {
			status: 0,
			data: [],
			err: ""
		};

		try{
			user_details.push(bcrypt.hashSync(password,saltRounds));

			const insert_new_user_query = (`INSERT INTO users (first_name, last_name, email, password, created_at, updated_at) values(?,?,?,?,NOW(),NOW())`);
			
			result.status = 1;
			result.data = await con.query(insert_new_user_query,user_details);
		}
		catch(e){
			result.err = e;
		}

		return result;
	}
}

module.exports = new User;