const User = require("../models/User");

class Users{
	new(req, res){
		res.render("registration");
	}

	async create(req, res){
		const validate_inputs = User.validateRegistration(req.body);

		if(validate_inputs.is_valid){

			let result = await User.create([
				req.body.first_name,
				req.body.last_name,
				req.body.email,
			], req.password);

			if(result.status){
				/* log user in */
				let [ query_data ] = result.data;
				req.session.user_id = query_data.insertId;
				req.session.user_name = req.body.first_name;
				res.redirect("/");
			}else{
				console.log(result);
				res.redirect("/register");
			}
		}
		else{
			res.redirect("/register");
		}
	}
}

module.exports = new Users;