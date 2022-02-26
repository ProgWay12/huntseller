const express = require('express')
const hbs = require('hbs')
const { engine } = require("express-handlebars");
var bodyParser = require('body-parser');
const mysql = require('mysql2');
var session = require('cookie-session');
const e = require('express');

const app = express()

const jsonParser = express.json();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000
app.set('port', PORT);
app.use('/static', express.static(__dirname + '/static'));

app.set("view engine", "hbs");

app.use(express.static(__dirname));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
/*
const pool = mysql.createPool({
    host: "remotemysql.com",
    port: 3306,
    user: "p4caLCC1oc",
    database: "p4caLCC1oc",
    password: "ys3fXpumpL"   
});
*/

/* Авторизации и регистрации */

app.get("/", (req, res) => {
    res.render("main_page.hbs", {
        layout: "/layouts/main_page_layout"
    })
})

app.get("/user_register", (req, res) => {
    res.render("user_register.hbs", {
        layout: "/layouts/login_layout"
    })
})

app.get("/user_login", (req, res) => {
    res.render("user_login.hbs", {
        layout: "/layouts/login_layout"
    })
})

app.get("/employer_register", (req, res) => {
    res.render("employer_register.hbs", {
        layout: "/layouts/login_layout"
    })
})

app.get("/employer_login", (req, res) => {
    res.render("employer_login.hbs", {
        layout: "/layouts/login_layout"
    })
})

app.get("/admin_login", (req, res) => {
    res.render("admin_login.hbs", {
        layout: "/layouts/login_layout"
    })
})

/* Страницы теста */

app.get("/test_page", (req, res) => {
    res.render("test_page.hbs", {
        layout: "/layouts/test_layout"
    })
})

app.get("/mid_result", (req, res) => {
    res.render("mid_result.hbs", {
        layout: "/layouts/test_layout"
    })
})

app.get("/bad_mid_result", (req, res) => {
    res.render("bad_mid_result.hbs", {
        layout: "/layouts/test_layout",
        result_page: true 
    })
})

app.get("/result", (req, res) => {
    res.render("result.hbs", {
        layout: "/layouts/test_layout",
        result_page: true 
    })
})

/* Кабинет работодателя */

app.get("/employer_cabinet", (req, res) => {
    res.render("employer_cabinet.hbs", {
        layout: "/layouts/employer_cabinet_layout"
    })
})

app.get("/employer_cabinet_result", (req, res) => {
    res.render("employer_cabinet_result.hbs", {
        layout: "/layouts/test_layout",
        result_page: true 
    })
})

/* Админка */

app.get("/admin_main", (req, res) => {
    res.render("admin_main.hbs", {
        layout: "/layouts/employer_cabinet_layout"
    })
})

app.get("/add_admin", (req, res) => {
    res.render("add_admin.hbs", {
        layout: "/layouts/test_layout",
        result_page: true,
        admin_page: true
    })
})

app.get("/all_applications", (req, res) => {
    res.render("all_applications.hbs", {
        layout: "/layouts/test_layout",
        result_page: true,
        admin_page: true
    })
})

app.get("/all_employers", (req, res) => {
    res.render("all_employers.hbs", {
        layout: "/layouts/test_layout",
        result_page: true,
        admin_page: true
    })
})

app.listen(PORT, function() {
    console.log(PORT);
});