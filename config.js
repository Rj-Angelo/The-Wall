const config = {
	port: 3000,
	assets: "/assets",
	views: "/views",
	session:{
		secret:'keyboardkitteh',
		resave:false,
		saveUninitialized:true,
		cookie:{ maxAge: 60000 }
	},
	database:{
		host:"127.0.0.1",
		user: "root",
		password: "1234",
		database: "thewall",
		port:3306
	}
}

module.exports = config;