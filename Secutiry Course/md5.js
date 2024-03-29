
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
// const encrypt = require("mongoose-encryption");

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/securityDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {

    const registeredUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    registeredUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("User was successfully registered.");
            res.render("secrets");
        }
    });
});

app.post("/login", (req, res) => {
    const enteredEmail = req.body.username;
    const enteredPassword = md5(req.body.password);

    User.findOne({ email: enteredEmail }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === enteredPassword) {
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server has been started on 3000");
});