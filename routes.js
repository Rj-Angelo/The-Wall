const Express = require("express");
const Routes = Express.Router();

/* Controllers */
const Users = require("./controllers/Users");
const Sessions = require("./controllers/Sessions");
const Messages = require("./controllers/Messages");
const Comments = require("./controllers/Comments");

/* Middleware*/
const Authentication = require("./middleware/Authentication");
const Trimmer = require("./middleware/Trimmer");
/* Routes */
Routes.get("/", Authentication, Messages.index);
Routes.get("/login", Sessions.newSession);
Routes.get("/register", Users.newUser);

Routes.post("/create_session", Trimmer, Sessions.createSession);
Routes.post("/create_user", Trimmer, Users.createUser);
Routes.post("/create_message", Authentication, Trimmer, Messages.createMessage);
Routes.post("/create_comment", Authentication, Trimmer, Comments.createComment);

Routes.post("/destroy_session", Sessions.destroySession); 
Routes.post("/destroy_comment", Authentication ,Comments.destroyComment);
Routes.post("/destroy_message", Authentication ,Messages.destroyMessage);

module.exports = Routes;