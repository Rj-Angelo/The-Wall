const User = require("../models/User");

class Sessions{
	newSession(req, res){
		try{
			let errors = req.session.error ?? null;
			req.session.error = [];

			res.render("login", {errors});
		}
		catch(error){
			console.log(error);
		}
	}

	async createSession(req,res){
		try{
			/* Validate user inputs */
			let validate_inputs = User.validateLogin(req.body);
			console.log(validate_inputs);
			if (validate_inputs.status){
				/* Find user in database and validate password */
				let validate_user = await User.validateUser(req.body);

				if(validate_user.status){
					req.session.user_id = validate_user.result.id;
					req.session.name = validate_user.result.first_name;

					res.redirect("/");
				}else{
					req.session.error = validate_user.error;
					res.redirect("/login");
				}
			}
			else{
				req.session.error = validate_inputs.error;
				res.redirect("/login");
			}
		}
		catch(error){
			console.log(error);
		}
	}

	destroySession(req, res){
		try{
			req.session.destroy();
			res.redirect("/login");
		}
		catch(error){
			console.log(error);
		}
	}
}

module.exports = new Sessions;