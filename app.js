const express = require("express");
const session = require("express-session");
const path = require("path");

const config = require("./config");
const routes = require("./routes");
const bodyParser = require("body-parser");

const app = express();
const server = app.listen(config.port);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(config.session));
app.use(routes);

app.set("views",path.join(__dirname,config.views));
app.set("view engine","ejs");


