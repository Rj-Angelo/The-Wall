const User = require("../models/User");

class Users{
	newUser(req, res){
		try{
			res.render("registration");
		}
		catch(error){
			console.log(error);
		}
	}

	async createUser(req, res){
		try{
			let validate_registration = User.validateRegistration(req.body);

			if (validate_registration.status) {

				let result = await User.create([
					req.body.first_name,
					req.body.last_name,
					req.body.email,
				],req.password);

				if (result.status) {
					/* log user in */
					let [query_data] = result.data;

					req.session.user_id = query_data.insertId;
					req.session.user_name = req.body.first_name;

					res.redirect("/");
				} else {
					res.redirect("/register");
				}
			}
			else {
				res.redirect("/register");
			}
		}
		catch(error){
			console.log(error);
		}
	}
}

module.exports = new Users;