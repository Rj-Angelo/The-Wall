const config 	= require("../config");
const mysql 	= require("mysql2/promise");

class mySqlConnection{
	constructor(){
		this.pool = mysql.createPool(config.database);
	}

	async query(sql,params) {
		let connection = await this.pool.getConnection();
		try{
			return await connection.query(sql, params);
		}
		finally{
			connection.release();
		}
	}
}

module.exports = mySqlConnection;