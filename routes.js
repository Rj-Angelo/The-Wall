const Express = require("express");
const Routes = Express.Router();

/* Controllers */
const Users = require("./controllers/Users");
const Sessions = require("./controllers/Sessions");
const Messages = require("./controllers/Messages");
const Comments = require("./controllers/Comments");

/* Routes */
Routes.get("/", Messages.index);
Routes.get("/login", Sessions.new);
Routes.get("/register", Users.new);

Routes.post("/create_session", Sessions.create);
Routes.post("/create_user", Users.create);
Routes.post("/create_message", Messages.create);
Routes.post("/create_comment", Comments.create);

Routes.post("/destroy_session", Sessions.destroy); 
Routes.post("/destroy_comment", Comments.destroy);
Routes.post("/destroy_message", Messages.destroy);

module.exports = Routes;