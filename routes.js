const Express = require("express");
const Routes = Express.Router();

/* Controllers */
const Users = require("./controllers/Users");
const Sessions = require("./controllers/Sessions");
const Messages = require("./controllers/Messages");
const Comments = require("./controllers/Comments");

/* Middleware*/
const Authentication = require("./middleware/Authentication");

/* Routes */
Routes.get("/",Authentication, Messages.index);
Routes.get("/login", Sessions.new);
Routes.get("/register", Users.new);

Routes.post("/create_session", Sessions.create);
Routes.post("/create_user", Users.create);
Routes.post("/create_message", Authentication ,Messages.createMessage);
Routes.post("/create_comment", Authentication ,Comments.createComment);

Routes.post("/destroy_session", Sessions.destroy); 
Routes.post("/destroy_comment", Authentication ,Comments.destroyComment);
Routes.post("/destroy_message", Authentication ,Messages.destroyMessage);

module.exports = Routes;