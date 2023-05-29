const User = require("../models/User");

class Sessions{
	new(req, res){
		if(req.session.user_id){
			res.redirect("/");
		}
		else{
			res.render("login");
		}
	}

	async create(req,res){
		/* Validate user inputs */
		const validate_inputs = User.validate_login_inputs(req.body);
		
		if(validate_inputs.is_valid){

			/* Find user in database and validate password */
			let user_details = await User.validate_user(req.body);
			if(user_details.status){
				req.session.user_id = user_details.data.id;
				req.session.name = user_details.data.first_name;
				res.redirect("/");
			}else{
				console.log(user_details.err);
				res.redirect("/login");
			}
		}
		else{
			console.log(validate_inputs.err);
			res.redirect("/login");
		}
	}

	destroy(req, res){
		req.session.destroy();
		res.redirect("/login");
	}
}

module.exports = new Sessions;