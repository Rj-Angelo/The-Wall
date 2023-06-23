const Trimmer = (req, res, next) => {
	for(index in req.body){
		if (typeof req.body[index] === "string"){
			req.body[index] = req.body[index].trim(); 
		}
	}
	next();
};

module.exports = Trimmer;