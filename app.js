const express = require('express')
const hbs = require('hbs')
const { engine } = require("express-handlebars");
var bodyParser = require('body-parser');
const mysql = require('mysql2');
var session = require('cookie-session');
const e = require('express');
const { is } = require('express/lib/request');

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


const pool = mysql.createPool({
    host: "remotemysql.com",
    port: 3306,
    user: "p4caLCC1oc",
    database: "p4caLCC1oc",
    password: "ys3fXpumpL"   
});

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

app.post("/user_register", jsonParser, (req, res) => {
    pool.query("insert into refresh_users (user_name, phone_number, employer_code, ask_id, block_id, fineshed, non_anxiety, slight_anxiety, medium_anxiety, high_anxiety, _never, _sometimes, _often, _always, introvert, extravert, energy_work, energy_talk, switching_work, switching_talk, speed_work, speed_contacting, emotional_event, emotional_talk, lie_scale, k, ot, internal_reference, external_reference, activity, reflection, opportunities, procedures, common, details, myself, another, _system, association, dissociation, similarity, similarity_with_difference, differences, ak, c, ns, pd, ass, sor, amb, ps, introspection, expressions, self_control, communication, understanding_other_emotions, self_development, lie_scale_2, confidence_scale, adaptive_scale, spontaneous_scale, suppression_of_behavior, getting_pleasure, achievements_of_goals, encouragement, forecast_level, lie_scale_3, bad_finished) values (?, ?, ?, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)", [req.body.user_first_name + " " + req.body.user_name, req.body.phone_number, req.body.employer_code], (err, result) => {
        if (err) {
            console.log(err)
            res.sendStatus(502)
        } else {
            res.redirect("/user_login")
        }
    })
})

app.get("/user_login", (req, res) => {
    res.render("user_login.hbs", {
        layout: "/layouts/login_layout"
    })
})

app.post("/user_login", jsonParser, (req, res) => {
    pool.query("select * from refresh_users where phone_number = ?", [req.body.phone_number], (err, user) => {
        if (err) {
            console.log(err)
            res.sendStatus(502 )
        } else {
            if (user.length > 0) {
                if (req.body.employer_code == user[0].employer_code) {
                    req.session.user_logged_in = true
                    req.session.user_id = user[0].id
                    req.session.employer_code = user[0].employer_code
                    req.session.ask_id = user[0].ask_id
                    req.session.block_id = user[0].block_id
                    if (req.session.ask_id == 1 && req.session.block_id != 1 && user[0].bad_finished == 0) {
                        res.redirect("/mid_result")
                    } else {
                        res.redirect("/test_page")
                    }
                } else {
                    res.redirect("/user_login")
                }
            } else {
                res.redirect("/user_register")
            }
        }
    })
})

app.get("/employer_register", (req, res) => {
    res.render("employer_register.hbs", {
        layout: "/layouts/login_layout"
    })
})

app.post("/employer_register", jsonParser, (req, res) => {
    pool.query("select * from refresh_employers where email = ?", [req.body.email], (err, res_of_check) => {
        if (err) {
            console.log(err)
            res.sendStatus(502)
        } else {
            if (typeof(res_of_check[0]) != "undefined") {
                res.redirect("/employer_login")
            } else {
                var personal_employer_code = Math.floor(Math.random() * (99999999999 - 11111111111)) + 11111111111;
                pool.query("insert into refresh_employers (user_name, email, pass, employer_code, is_applied, unapplied) values (?, ?, ?, ?, ?, ?)", [req.body.user_name, req.body.email, req.body.pass, personal_employer_code, 0, 0], (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        res.redirect("/employer_login")
                    }
                })
            }
        }
    })
})

app.get("/employer_login", (req, res) => {
    if (req.session.employer_logged_in) {
        res.redirect("/employer_cabinet")
    } else {
        res.render("employer_login.hbs", {
            layout: "/layouts/login_layout"
        })
    }
})

app.post("/employer_login", jsonParser, (req, res) => {
    pool.query("select * from refresh_employers where email = ?", [req.body.email], (err, employer) => {
        if (err) {
            console.log(err)
            res.sendStatus(502 )
        } else {
            if (employer.length > 0) {
                if (employer[0].is_applied == 0) {
                    if (employer[0].unapplied == 1) {
                        res.redirect("/unapplied")
                    } else {
                        res.redirect("/unapplied_yet")
                    }
                } else {
                    if (employer[0].unapplied == 1) {
                        res.redirect("/unapplied")
                    } else {
                        if (req.body.pass == employer[0].pass) {
                            req.session.employer_logged_in = true
                            req.session.employer_id = employer[0].id
                            req.session.employer_code = employer[0].employer_code
                            res.redirect("/employer_cabinet")
                        } else {
                            res.redirect("/employer_login")
                        }
                    }
                }
            } else {
                res.redirect("/employer_register")
            }
        }
    })
})

app.get("/admin_login", (req, res) => {
    res.render("admin_login.hbs", {
        layout: "/layouts/login_layout"
    })
})

app.post("/admin_login", (req, res) => {
    pool.query("select * from refresh_admins where login = ?", [req.body.login], (err, admin) => {
        if (err) {
            console.log(err)
            res.sendStatus(502 )
        } else {
            if (admin.length > 0) {
                if (req.body.pass == admin[0].pass) {
                    req.session.refresh_admin_logged_in = true
                    req.session.admin_id = admin[0].id
                    res.redirect("/admin")
                } else {
                    res.redirect("/admin_login")
                }
            } else {
                res.redirect("/admin_login")
            }
        }
    })
})

app.get("/logout/:role", (req, res) => {
    if (req.params.role == "admin") {
        req.session.refresh_admin_logged_in = false
        res.redirect("/admin")
    } else if (req.params.role == "user") {
        req.session.user_logged_in = false
        res.redirect("/")
    } else {
        req.session.employer_logged_in = false
        res.redirect("/")
    }
})

/* Страницы теста */

app.get("/test_page", (req, res) => {
    if (req.session.user_logged_in) {
        pool.query("select * from refresh_users where id = ?", [req.session.user_id], (err_user_checking, user_checking) => {
            if (err_user_checking) {
                console.log(err_user_checking)
                res.sendStatus(502)
            } else {
                if (user_checking[0].fineshed == 0 && user_checking[0].bad_finished == 0) {
                    pool.query("select * from refresh_asks where ask_id = ? and block_id = ?", [req.session.ask_id, req.session.block_id], (err, ask) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            if (ask.length > 0) {
                                var first_ask = false
                                if (req.session.ask_id == 1) {
                                    first_ask = true
                                }
                                if (req.session.block_id == 1) {
                                    if (req.session.ask_id <= 24) {
                                        res.render(`test_page_${req.session.block_id}_1.hbs`, {
                                            layout: "/layouts/test_layout",
                                            ask_info: ask[0],
                                            ask_main_text: "Какой у Вас была (бы) тревога, когда (если бы) Вам надо было или Вы могли ",
                                            first_ask: first_ask
                                        })
                                    } else {
                                        res.render(`test_page_${req.session.block_id}_2.hbs`, {
                                            layout: "/layouts/test_layout",
                                            ask_info: ask[0],
                                            ask_main_text: "До какой степени вы избегаете  ситуации, когда  Вам надо было или Вы могли",
                                            first_ask: first_ask
                                        })
                                    }
                                } else if (req.session.block_id == 2) {
                                    if (req.session.ask_id <= 14) {
                                        res.render(`test_page_${req.session.block_id}_1.hbs`, {
                                            layout: "/layouts/test_layout",
                                            ask_info: ask[0],
                                            ask_main_text: "В зависимости от того, согласны ли вы с утверждениями, представленными ниже, ответьте «Да» или «Нет».",
                                            first_ask: first_ask
                                        })
                                    } else {
                                        res.render(`test_page_${req.session.block_id}_2.hbs`, {
                                            layout: "/layouts/test_layout",
                                            ask_info: ask[0],
                                            ask_main_text: "В зависимости от того, согласны ли вы с утверждениями, представленными ниже, ответьте «Да» или «Нет».",
                                            first_ask: first_ask
                                        })
                                    }
                                } else if (req.session.block_id == 7) {
                                    res.render(`test_page_${req.session.block_id}.hbs`, {
                                        layout: "/layouts/test_layout",
                                        ask_info: ask[0],
                                        ask_main_text: "Внимательно прочтите предложения, описывающие реакции на некоторые ситуации. Каждое из них вы должны оценить как верное или неверное применительно к себе. ",
                                        first_ask: first_ask
                                    })
                                } else if (req.session.block_id == 8) {
                                    res.render(`test_page_${req.session.block_id}.hbs`, {
                                        layout: "/layouts/test_layout",
                                        ask_info: ask[0],
                                        ask_main_text: "Укажите, в какой степени Вы согласны или не согласны с утверждениями.",
                                        first_ask: first_ask
                                    })
                                } else if (req.session.block_id == 9) {
                                    res.render(`test_page_${req.session.block_id}.hbs`, {
                                        layout: "/layouts/test_layout",
                                        ask_info: ask[0],
                                        ask_main_text: "Внимательно прочитайте и отметьте  то, что соответствует вашей точке зрения.",
                                        answer_1: String(ask[0].ask_text).split("|")[0],
                                        answer_2: String(ask[0].ask_text).split("|")[1],
                                        first_ask: first_ask
                                    })
                                } 
                                else {
                                    res.render(`test_page_${req.session.block_id}.hbs`, {
                                        layout: "/layouts/test_layout",
                                        ask_info: ask[0],
                                        ask_main_text: "В зависимости от того, согласны ли вы с утверждениями, представленными ниже, ответьте «Да» или «Нет».",
                                        first_ask: first_ask
                                    })
                                }
                            } else {
                                if (req.session.block_id == 9) {
                                    pool.query("update refresh_users set fineshed = ? where id = ?", [1, req.session.user_id], (err_update, result_update) => {
                                        if (err_update) {
                                            console.log(err_update)
                                            res.sendStatus(502)
                                        } else {
                                            res.redirect("/result")
                                        }
                                    })
                                } else {
                                    pool.query("select * from refresh_users where id = ?", [req.session.user_id], (err, user) => {
                                        var bad_result = false
                                        if (req.session.block_id == 1) {
                                            var sum = user[0].slight_anxiety + user[0].medium_anxiety * 2 + user[0].high_anxiety * 3 
                                                sum = sum + user[0]._sometimes + user[0]._often * 2 + user[0]._always * 3 
                                            if (sum > 65) {
                                                bad_result = true
                                            }
                                        }
                                        if (req.session.block_id == 2) {
                                            if (user[0].introvert > 20) {
                                                bad_result = true
                                            }
                                        }
                                        /*
                                        if (!bad_result) {
                                            req.session.ask_id = 1
                                            req.session.block_id = req.session.block_id + 1
                                            pool.query("update refresh_users set ask_id = ?, block_id = ? where id = ?", [req.session.ask_id, req.session.block_id, req.session.user_id], (err_update, result_update) => {
                                                if (err_update) {
                                                    console.log(err_update)
                                                    res.sendStatus(502)
                                                } else {
                                                    res.redirect("/mid_result")
                                                }
                                            }) 
                                        } else {
                                            pool.query("update refresh_users set bad_finished = ? where id = ?", [1, req.session.user_id], (err_update, result_update) => {
                                                if (err_update) {
                                                    console.log(err_update)
                                                    res.sendStatus(502)
                                                } else {
                                                    res.redirect("/bad_mid_result")
                                                }
                                            })
                                        }
                                        */
                                        req.session.ask_id = 1
                                        req.session.block_id = req.session.block_id + 1
                                        pool.query("update refresh_users set ask_id = ?, block_id = ? where id = ?", [req.session.ask_id, req.session.block_id, req.session.user_id], (err_update, result_update) => {
                                            if (err_update) {
                                                console.log(err_update)
                                                res.sendStatus(502)
                                            } else {
                                                res.redirect("/mid_result")
                                            }
                                        }) 
                                    })
                                }
                            }
                        }
                    })
                } else if (user_checking[0].bad_finished == 1) {
                    res.redirect("/bad_mid_result")
                } else {
                    res.redirect("/result")
                }
            }
        })
    } else {
        res.redirect("/")
    }
})

app.post("/accept_ask", jsonParser, (req, res) => {
    if (req.session.block_id == 3) {
        if (req.session.ask_id == 32 || req.session.ask_id == 52 || req.session.ask_id == 59) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set lie_scale = lie_scale + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                })
            }
        } else if (req.session.ask_id == 12 || req.session.ask_id == 23 || req.session.ask_id == 44 || req.session.ask_id == 65 || req.session.ask_id == 73 || req.session.ask_id == 82) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set lie_scale = lie_scale + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                })
            }
        } else if (req.session.ask_id == 4 || req.session.ask_id == 8 || req.session.ask_id == 15 || req.session.ask_id == 22 || req.session.ask_id == 42 || req.session.ask_id == 50 || req.session.ask_id == 58 || req.session.ask_id == 64 || req.session.ask_id == 98) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set energy_work = energy_work + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                })
            }
        } else if (req.session.ask_id == 27 || req.session.ask_id == 83 || req.session.ask_id == 103) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set energy_work = energy_work + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                })
            }
        } else if (req.session.ask_id == 11 || req.session.ask_id == 30 || req.session.ask_id == 57 || req.session.ask_id == 62 || req.session.ask_id == 67 || req.session.ask_id == 78 || req.session.ask_id == 86) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set energy_talk = energy_talk + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                }) 
            }
        } else if (req.session.ask_id == 3 || req.session.ask_id == 34 || req.session.ask_id == 74 || req.session.ask_id == 90 || req.session.ask_id == 105) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set energy_talk = energy_talk + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                }) 
            }
        } else if (req.session.ask_id == 20 || req.session.ask_id == 25 || req.session.ask_id == 35 || req.session.ask_id == 38 || req.session.ask_id == 47 || req.session.ask_id == 66 || req.session.ask_id == 71 || req.session.ask_id == 76 || req.session.ask_id == 101 || req.session.ask_id == 104) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set switching_work = switching_work + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                })
            }
        } else if (req.session.ask_id == 54 || req.session.ask_id == 59) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set switching_work = switching_work + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                })
            }
        } else if (req.session.ask_id == 2 || req.session.ask_id == 9 || req.session.ask_id == 18 || req.session.ask_id == 26 || req.session.ask_id == 45 || req.session.ask_id == 68 || req.session.ask_id == 85 || req.session.ask_id == 99) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set switching_talk = switching_talk + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                }) 
            }
        } else if (req.session.ask_id == 31 || req.session.ask_id == 81 || req.session.ask_id == 87 || req.session.ask_id == 93) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set switching_talk = switching_talk + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                }) 
            }
        } else if (req.session.ask_id == 1 || req.session.ask_id == 13 || req.session.ask_id == 19 || req.session.ask_id == 33 || req.session.ask_id == 46 || req.session.ask_id == 49 || req.session.ask_id == 55 || req.session.ask_id == 77) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set speed_work = speed_work + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                }) 
            }
        } else if (req.session.ask_id == 29 || req.session.ask_id == 43 || req.session.ask_id == 70 || req.session.ask_id == 94) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set speed_work = speed_work + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                }) 
            }
        } else if (req.session.ask_id == 24 || req.session.ask_id == 37 || req.session.ask_id == 51 || req.session.ask_id == 72 || req.session.ask_id == 92) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set speed_contacting = speed_contacting + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                })
            }
        } else if (req.session.ask_id == 5 || req.session.ask_id == 10 || req.session.ask_id == 16 || req.session.ask_id == 39 || req.session.ask_id == 56 || req.session.ask_id == 96 || req.session.ask_id == 102) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set speed_contacting = speed_contacting + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                }) 
            }
        } else if (req.session.ask_id == 14 || req.session.ask_id == 17 || req.session.ask_id == 28 || req.session.ask_id == 40 || req.session.ask_id == 60 || req.session.ask_id == 61 || req.session.ask_id == 69 || req.session.ask_id == 79 || req.session.ask_id == 88 || req.session.ask_id == 91 || req.session.ask_id == 95 || req.session.ask_id == 97) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set emotional_event = emotional_event + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                }) 
            }
        } else if (req.session.ask_id == 6 || req.session.ask_id == 7 || req.session.ask_id == 21 || req.session.ask_id == 36 || req.session.ask_id == 41 || req.session.ask_id == 48 || req.session.ask_id == 53 || req.session.ask_id == 63 || req.session.ask_id == 75 || req.session.ask_id == 80 || req.session.ask_id == 84 || req.session.ask_id == 100) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set emotional_talk = emotional_talk + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                }) 
            }
        } else {
            pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                if (err) {
                    console.log(err)
                    res.sendStatus(502)
                } else {
                    req.session.ask_id = req.session.ask_id + 1
                    res.send() 
                }
            })
        }
    } else if (req.session.block_id == 4) {
        if (req.session.ask_id == 2 || req.session.ask_id == 9 || req.session.ask_id == 10) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set k = k + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ot = ot + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 1 || req.session.ask_id == 3 || req.session.ask_id == 4 || req.session.ask_id == 5 || req.session.ask_id == 6 || req.session.ask_id == 7 || req.session.ask_id == 8) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set k = k + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ot = ot + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 15 || req.session.ask_id == 17) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set external_reference = external_reference + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set internal_reference = internal_reference + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 11 || req.session.ask_id == 12 || req.session.ask_id == 13 || req.session.ask_id == 14 || req.session.ask_id == 16 || req.session.ask_id == 18 || req.session.ask_id == 19 || req.session.ask_id == 20) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set external_reference = external_reference + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set internal_reference = internal_reference + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 21 || req.session.ask_id == 23 || req.session.ask_id == 24 || req.session.ask_id == 25 || req.session.ask_id == 30) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set activity = activity + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set reflection = reflection + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 22 || req.session.ask_id == 26 || req.session.ask_id == 27 || req.session.ask_id == 28 || req.session.ask_id == 29) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set activity = activity + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set reflection = reflection + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 31 || req.session.ask_id == 32 || req.session.ask_id == 35 || req.session.ask_id == 39) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set opportunities = opportunities + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set procedures = procedures + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 33 || req.session.ask_id == 34 || req.session.ask_id == 36 || req.session.ask_id == 37 || req.session.ask_id == 38 || req.session.ask_id == 40) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set opportunities = opportunities + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set procedures = procedures + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 41 || req.session.ask_id == 43 || req.session.ask_id == 44 || req.session.ask_id == 46 || req.session.ask_id == 47 || req.session.ask_id == 48 || req.session.ask_id == 50) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set common = common + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set details = details + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 42 || req.session.ask_id == 45 || req.session.ask_id == 49) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set common = common + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set details = details + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 51 || req.session.ask_id == 52 || req.session.ask_id == 53 || req.session.ask_id == 54 || req.session.ask_id == 55) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set myself = myself + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                if (req.session.ask_id == 51 || req.session.ask_id == 55) {
                    pool.query(`update refresh_users set another = another + 1, _system = _system + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                } else if (req.session.ask_id == 52) {
                    pool.query(`update refresh_users set another = another + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                } else {
                    pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send() 
                        }
                    })
                }
            }
        } else if (req.session.ask_id == 56 || req.session.ask_id == 58 || req.session.ask_id == 59 || req.session.ask_id == 60 || req.session.ask_id == 62 || req.session.ask_id == 63 || req.session.ask_id == 64 || req.session.ask_id == 65) {
            if (req.body.answer == "no") {
                if (req.session.ask_id == 62 || req.session.ask_id == 63 || req.session.ask_id == 64 || req.session.ask_id == 65) {
                    pool.query(`update refresh_users set myself = myself + 1, another = another + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                } else if (req.session.ask_id == 58 || req.session.ask_id == 60) {
                    pool.query(`update refresh_users set myself = myself + 1, _system = _system + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                } else {
                    pool.query(`update refresh_users set myself = myself + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                }
            } else {
                if (req.session.ask_id == 56 || req.session.ask_id == 58 || req.session.ask_id == 59 || req.session.ask_id == 60) {
                    pool.query(`update refresh_users set another = another + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                } else if (req.session.ask_id == 62 || req.session.ask_id == 63 || req.session.ask_id == 64 || req.session.ask_id == 65) {
                    pool.query(`update refresh_users set _system = _system + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                } else {
                    pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send() 
                        }
                    })
                }
            }
        } else if (req.session.ask_id == 61) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set _system = _system + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                }) 
            }
        } else if (req.session.ask_id == 57) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set _system = _system + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                }) 
            }
        } else if (req.session.ask_id == 66 || req.session.ask_id == 67 || req.session.ask_id == 70 || req.session.ask_id == 74) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set association = association + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set dissociation = dissociation + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 68 || req.session.ask_id == 69 || req.session.ask_id == 71 || req.session.ask_id == 72 || req.session.ask_id == 73 || req.session.ask_id == 75) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set association = association + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set dissociation = dissociation + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 76 || req.session.ask_id == 77 || req.session.ask_id == 78 || req.session.ask_id == 79 || req.session.ask_id == 80) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set similarity = similarity + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                }) 
            }
        } else if (req.session.ask_id == 81 || req.session.ask_id == 82 || req.session.ask_id == 83 || req.session.ask_id == 84 || req.session.ask_id == 85) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set similarity_with_difference = similarity_with_difference + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                }) 
            }
        } else if (req.session.ask_id == 86 || req.session.ask_id == 87 || req.session.ask_id == 88 || req.session.ask_id == 89 || req.session.ask_id == 90) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set differences = differences + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send() 
                    }
                }) 
            }
        } else {
            pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                if (err) {
                    console.log(err)
                    res.sendStatus(502)
                } else {
                    req.session.ask_id = req.session.ask_id + 1
                    res.send() 
                }
            })
        }
    } else if (req.session.block_id == 5) {
        if (req.session.ask_id == 1 || req.session.ask_id == 17 || req.session.ask_id == 44 || req.session.ask_id == 61 || req.session.ask_id == 77) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set ak = ak + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 9 || req.session.ask_id == 26 || req.session.ask_id == 35 || req.session.ask_id == 53 || req.session.ask_id == 69) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set ak = ak + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 2 || req.session.ask_id == 18 || req.session.ask_id == 36 || req.session.ask_id == 54 || req.session.ask_id == 70) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set c = c + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 10 || req.session.ask_id == 29 || req.session.ask_id == 47 || req.session.ask_id == 62 || req.session.ask_id == 78) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set c = c + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 11 || req.session.ask_id == 19 || req.session.ask_id == 20 || req.session.ask_id == 27 || req.session.ask_id == 38 || req.session.ask_id == 45 || req.session.ask_id == 55) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set ns = ns + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 3 || req.session.ask_id == 28 || req.session.ask_id == 37 || req.session.ask_id == 46 || req.session.ask_id == 63 || req.session.ask_id == 71 || req.session.ask_id == 79) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set ns = ns + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 30 || req.session.ask_id == 39 || req.session.ask_id == 48 || req.session.ask_id == 56 || req.session.ask_id == 80) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set pd = pd + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 4 || req.session.ask_id == 12 || req.session.ask_id == 21 || req.session.ask_id == 64 || req.session.ask_id == 72) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set pd = pd + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 13 || req.session.ask_id == 22 || req.session.ask_id == 40 || req.session.ask_id == 49 || req.session.ask_id == 73) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set ass = ass + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 5 || req.session.ask_id == 31 || req.session.ask_id == 57 || req.session.ask_id == 65 || req.session.ask_id == 81) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set ass = ass + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 6 || req.session.ask_id == 23 || req.session.ask_id == 32 || req.session.ask_id == 58 || req.session.ask_id == 66) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set sor = sor + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 14 || req.session.ask_id == 41 || req.session.ask_id == 50 || req.session.ask_id == 74 || req.session.ask_id == 82) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set sor = sor + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 7 || req.session.ask_id == 15 || req.session.ask_id == 33 || req.session.ask_id == 42 || req.session.ask_id == 67) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set amb = amb + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 24 || req.session.ask_id == 51 || req.session.ask_id == 59 || req.session.ask_id == 75 || req.session.ask_id == 83) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set amb = amb + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 8 || req.session.ask_id == 25 || req.session.ask_id == 34 || req.session.ask_id == 43 || req.session.ask_id == 52 || req.session.ask_id == 60 || req.session.ask_id == 68) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set ps = ps + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 16 || req.session.ask_id == 76 || req.session.ask_id == 84) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set ps = ps + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else {
            pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                if (err) {
                    console.log(err)
                    res.sendStatus(502)
                } else {
                    req.session.ask_id = req.session.ask_id + 1
                    res.send()
                }
            })
        }
    } else if (req.session.block_id == 6) {
        if (req.session.ask_id == 36 || req.session.ask_id == 57 || req.session.ask_id == 64) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set introspection = introspection + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 1 || req.session.ask_id == 8 || req.session.ask_id == 15 || req.session.ask_id == 22 || req.session.ask_id == 29 || req.session.ask_id == 43 || req.session.ask_id == 50) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set introspection = introspection + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 2 || req.session.ask_id == 58) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set expressions = expressions + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 9 || req.session.ask_id == 16 || req.session.ask_id == 30 || req.session.ask_id == 37 || req.session.ask_id == 44 || req.session.ask_id == 51 || req.session.ask_id == 65 || req.session.ask_id == 23) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set expressions = expressions + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 10 || req.session.ask_id == 38) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set self_control = self_control + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 3 || req.session.ask_id == 17 || req.session.ask_id == 24 || req.session.ask_id == 31 || req.session.ask_id == 45 || req.session.ask_id == 52 || req.session.ask_id == 59 || req.session.ask_id == 66) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set self_control = self_control + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 4 || req.session.ask_id == 11 || req.session.ask_id == 25 || req.session.ask_id == 32 || req.session.ask_id == 39) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set communication = communication + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 18 || req.session.ask_id == 46 || req.session.ask_id == 53 || req.session.ask_id == 60 || req.session.ask_id == 67) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set communication = communication + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 5 || req.session.ask_id == 19 || req.session.ask_id == 40 || req.session.ask_id == 47 || req.session.ask_id == 54 || req.session.ask_id == 61 || req.session.ask_id == 68) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set understanding_other_emotions = understanding_other_emotions + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 12 || req.session.ask_id == 26 || req.session.ask_id == 33) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set understanding_other_emotions = understanding_other_emotions + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 6 || req.session.ask_id == 34 || req.session.ask_id == 41 || req.session.ask_id == 48 || req.session.ask_id == 62) {
            if (req.body.answer == "yes") {
                pool.query(`update refresh_users set self_development = self_development + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 13 || req.session.ask_id == 20 || req.session.ask_id == 27 || req.session.ask_id == 55 || req.session.ask_id == 69) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set self_development = self_development + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 7 || req.session.ask_id == 14 || req.session.ask_id == 21 || req.session.ask_id == 28 || req.session.ask_id == 35 || req.session.ask_id == 42 || req.session.ask_id == 49 || req.session.ask_id == 56 || req.session.ask_id == 63 || req.session.ask_id == 70) {
            if (req.body.answer == "no") {
                pool.query(`update refresh_users set lie_scale_2 = lie_scale_2 + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else {
            pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                if (err) {
                    console.log(err)
                    res.sendStatus(502)
                } else {
                    req.session.ask_id = req.session.ask_id + 1
                    res.send()
                }
            })
        }
    } else if (req.session.block_id == 7) {
        if (req.session.ask_id == 6 || req.session.ask_id == 10 || req.session.ask_id == 14 || req.session.ask_id == 18 || req.session.ask_id == 24 || req.session.ask_id == 31 || req.session.ask_id == 38 || req.session.ask_id == 45 || req.session.ask_id == 50 || req.session.ask_id == 53) {
            if (req.body.answer == "usually_false" || req.body.answer == "false" ) {
                pool.query(`update refresh_users set lie_scale_3 = lie_scale_3 + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 8 || req.session.ask_id == 12 || req.session.ask_id == 16 || req.session.ask_id == 22 || req.session.ask_id == 41) {
            if (req.body.answer == "true" || req.body.answer == "usually_true") {
                pool.query(`update refresh_users set confidence_scale = confidence_scale + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 1 || req.session.ask_id == 4 || req.session.ask_id == 19 || req.session.ask_id == 26 || req.session.ask_id == 29 || req.session.ask_id == 33 || req.session.ask_id == 36 || req.session.ask_id == 44 || req.session.ask_id == 47 || req.session.ask_id == 54) {
            if (req.body.answer == "usually_false" || req.body.answer == "false") {
                pool.query(`update refresh_users set confidence_scale = confidence_scale + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 3 || req.session.ask_id == 5 || req.session.ask_id == 9 || req.session.ask_id == 13 || req.session.ask_id == 23 || req.session.ask_id == 27 || req.session.ask_id == 34 || req.session.ask_id == 40 || req.session.ask_id == 43 || req.session.ask_id == 48 || req.session.ask_id == 55) {
            if (req.body.answer == "true" || req.body.answer == "usually_true") {
                pool.query(`update refresh_users set adaptive_scale = adaptive_scale + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 17 || req.session.ask_id == 20 || req.session.ask_id == 30 || req.session.ask_id == 51) {
            if (req.body.answer == "usually_false" || req.body.answer == "false") {
                pool.query(`update refresh_users set adaptive_scale = adaptive_scale + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 2 || req.session.ask_id == 11 || req.session.ask_id == 15 || req.session.ask_id == 25 || req.session.ask_id == 28 || req.session.ask_id == 27 || req.session.ask_id == 35 || req.session.ask_id == 37 || req.session.ask_id == 42 || req.session.ask_id == 46 || req.session.ask_id == 52) {
            if (req.body.answer == "true" || req.body.answer == "usually_true") {
                pool.query(`update refresh_users set spontaneous_scale = spontaneous_scale + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 7 || req.session.ask_id == 21 || req.session.ask_id == 32 || req.session.ask_id == 39 || req.session.ask_id == 49) {
            if (req.body.answer == "usually_false" || req.body.answer == "false") {
                pool.query(`update refresh_users set spontaneous_scale = spontaneous_scale + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else {
            pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                if (err) {
                    console.log(err)
                    res.sendStatus(502)
                } else {
                    req.session.ask_id = req.session.ask_id + 1
                    res.send()
                }
            })
        }
    } else if (req.session.block_id == 8) {
        if (req.session.ask_id == 2 || req.session.ask_id == 8 || req.session.ask_id == 13 || req.session.ask_id == 16 || req.session.ask_id == 19 || req.session.ask_id == 22 || req.session.ask_id == 24) {
            if (req.session.ask_id == 2 || req.session.ask_id == 22) {
                if (req.body.answer == "true") {
                    pool.query(`update refresh_users set suppression_of_behavior = suppression_of_behavior + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                } else if (req.body.answer == "usually_true") {
                    pool.query(`update refresh_users set suppression_of_behavior = suppression_of_behavior + 2, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                } else if (req.body.answer == "usually_false") {
                    pool.query(`update refresh_users set suppression_of_behavior = suppression_of_behavior + 3, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                } else if (req.body.answer == "false") {
                    pool.query(`update refresh_users set suppression_of_behavior = suppression_of_behavior + 4, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                }
            } else {
                if (req.body.answer == "true") {
                    pool.query(`update refresh_users set suppression_of_behavior = suppression_of_behavior + 4, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                } else if (req.body.answer == "usually_true") {
                    pool.query(`update refresh_users set suppression_of_behavior = suppression_of_behavior + 3, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                } else if (req.body.answer == "usually_false") {
                    pool.query(`update refresh_users set suppression_of_behavior = suppression_of_behavior + 2, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                } else if (req.body.answer == "false") {
                    pool.query(`update refresh_users set suppression_of_behavior = suppression_of_behavior + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.sendStatus(502)
                        } else {
                            req.session.ask_id = req.session.ask_id + 1
                            res.send()
                        }
                    })
                }
            }
        } else if (req.session.ask_id == 5 || req.session.ask_id == 10 || req.session.ask_id == 15 || req.session.ask_id == 20) {
            if (req.body.answer == "true") {
                pool.query(`update refresh_users set getting_pleasure = getting_pleasure + 4, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else if (req.body.answer == "usually_true") {
                pool.query(`update refresh_users set getting_pleasure = getting_pleasure + 3, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else if (req.body.answer == "usually_false") {
                pool.query(`update refresh_users set getting_pleasure = getting_pleasure + 2, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else if (req.body.answer == "false") {
                pool.query(`update refresh_users set getting_pleasure = getting_pleasure + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 3 || req.session.ask_id == 9 || req.session.ask_id == 12 || req.session.ask_id == 21) {
            if (req.body.answer == "true") {
                pool.query(`update refresh_users set achievements_of_goals = achievements_of_goals + 4, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else if (req.body.answer == "usually_true") {
                pool.query(`update refresh_users set achievements_of_goals = achievements_of_goals + 3, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else if (req.body.answer == "usually_false") {
                pool.query(`update refresh_users set achievements_of_goals = achievements_of_goals + 2, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else if (req.body.answer == "false") {
                pool.query(`update refresh_users set achievements_of_goals = achievements_of_goals + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else if (req.session.ask_id == 4 || req.session.ask_id == 7 || req.session.ask_id == 14 || req.session.ask_id == 18 || req.session.ask_id == 23) {
            if (req.body.answer == "true") {
                pool.query(`update refresh_users set encouragement = encouragement + 4, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else if (req.body.answer == "usually_true") {
                pool.query(`update refresh_users set encouragement = encouragement + 3, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else if (req.body.answer == "usually_false") {
                pool.query(`update refresh_users set encouragement = encouragement + 2, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else if (req.body.answer == "false") {
                pool.query(`update refresh_users set encouragement = encouragement + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else {
            pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                if (err) {
                    console.log(err)
                    res.sendStatus(502)
                } else {
                    req.session.ask_id = req.session.ask_id + 1
                    res.send()
                }
            })
        }
    } else if (req.session.block_id == 9) {
        if (req.session.ask_id == 1 || req.session.ask_id == 9 || req.session.ask_id == 12 || req.session.ask_id == 13 || req.session.ask_id == 15) {
            if (req.body.answer == "f") {
                pool.query(`update refresh_users set forecast_level = forecast_level + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        } else {
            if (req.body.answer == "s") {
                pool.query(`update refresh_users set forecast_level = forecast_level + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            } else {
                pool.query(`update refresh_users set ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        req.session.ask_id = req.session.ask_id + 1
                        res.send()
                    }
                })
            }
        }
    }
    else {
        pool.query(`update refresh_users set ${req.body.answer} = ${req.body.answer} + 1, ask_id = ask_id + 1 where id = ${req.session.user_id}`, (err, result) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {
                req.session.ask_id = req.session.ask_id + 1
                res.send()
            }
        })
    }
})

app.get("/mid_result", (req, res) => {
    if (req.session.user_logged_in) {
        pool.query("select * from refresh_users where id = ?", [req.session.user_id], (err, user) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {
                if (req.session.block_id == 2) {
                    var sum = user[0].slight_anxiety + user[0].medium_anxiety * 2 + user[0].high_anxiety * 3 
                        sum = sum + user[0]._sometimes + user[0]._often * 2 + user[0]._always * 3
                    
                    res.render("mid_result.hbs", {
                        layout: "/layouts/test_layout",
                        sum: sum,
                        is_ambiverts: false,
                        is_without_res: false,
                        ask_info: {
                            block_id: req.session.block_id,
                            ask_id: req.session.ask_id
                        }
                    })
                }
                if (req.session.block_id == 3) {
                    var result = ''
                    if (user[0].extravert >= 12 && user[0].introvert >= 12) {
                        result = 'Амбиверт'
                    } else if (user[0].extravert >= 16) {
                        result = 'Экстраверт'
                    } else if (user[0].introvert >= 16) {
                        result = "Интроверт"
                    }
                    res.render("mid_result.hbs", {
                        layout: "/layouts/test_layout",
                        sum: result,
                        is_ambiverts: true,
                        is_without_res: false,
                        ask_info: {
                            block_id: req.session.block_id,
                            ask_id: req.session.ask_id
                        }
                    })
                }
                if (req.session.block_id == 4) {
                        var result_1 = ''

                        if (user[0].energy_work > 9 && user[0].energy_talk > 9 && user[0].switching_work > 9 && user[0].switching_talk > 9 && user[0].speed_work > 9 && user[0].speed_contacting > 9 && user[0].emotional_event > 9 && user[0].emotional_talk > 9) {
                            result_1 = 'холерик'
                        } else if (user[0].energy_work < 5 && user[0].energy_talk < 5 && user[0].switching_work < 5 && user[0].switching_talk < 5 && user[0].speed_work < 5 && user[0].speed_contacting < 5 && user[0].emotional_event < 5 && user[0].emotional_talk < 5) {
                            result_1 = 'флегматик'
                        } else if ((4 < user[0].energy_work < 10) && (4 < user[0].energy_talk < 10) && (4 < user[0].switching_work < 10) && (4 < user[0].switching_talk < 10) && (4 < user[0].speed_work < 10) && (4 < user[0].speed_contacting < 10) && (4 < user[0].emotional_event < 10) && (4 < user[0].emotional_talk < 10)) {
                            result_1 = 'сангвиник'
                        } else {
                            result_1 = 'меланхолик'
                        }
                        
                        var result_2 = ''

                        if (user[0].energy_work > 9 && user[0].energy_talk > 9 && user[0].switching_work > 5 && user[0].switching_talk > 5 && user[0].speed_work > 9 && user[0].speed_contacting > 9 && user[0].emotional_event > 9 && user[0].emotional_talk > 9) {
                            result_2 = 'холерик'
                        } else if (user[0].energy_work < 5 && user[0].energy_talk < 5 && user[0].switching_work < 5 && user[0].switching_talk < 5 && user[0].speed_work < 5 && user[0].speed_contacting < 5 && user[0].emotional_event < 5 && user[0].emotional_talk < 5) {
                            result_2 = 'флегматик'
                        } else if (user[0].energy_work < 5 && user[0].energy_talk < 5 && user[0].switching_work < 5 && user[0].switching_talk < 5 && user[0].speed_work < 5 && user[0].speed_contacting < 5 && user[0].emotional_event > 4 && user[0].emotional_talk > 4) {
                            result_2 = 'меланхолик'
                        } else {
                            result_2 = 'сангвиник'
                        }

                        var result = ''

                        if (result_1 == result_2) {
                            result = result_1
                        } else {
                            result = result_1 + ' ' + result_2
                        }

                        if (result == "флегматик" || result == "меланхолик") {
                            pool.query("update refresh_users set bad_finished = ? where id = ?", [1, req.session.user_id], (err_update, result_update) => {
                                if (err_update) {
                                    console.log(err_update)
                                    res.sendStatus(502)
                                } else {
                                    res.redirect("/bad_mid_result")
                                }
                            })
                        } else {
                            res.render("mid_result.hbs", {
                                layout: "/layouts/test_layout",
                                sum: result,
                                is_ambiverts: true,
                                is_without_res: false,
                                ask_info: {
                                    block_id: req.session.block_id,
                                    ask_id: req.session.ask_id
                                }
                            })
                        }
                }
                if (req.session.block_id == 5) {
                    res.render("mid_result.hbs", {
                        layout: "/layouts/test_layout",
                        sum: result,
                        is_ambiverts: false,
                        is_without_res: true,
                        ask_info: {
                            block_id: req.session.block_id,
                            ask_id: req.session.ask_id
                        }
                    })
                }
                if (req.session.block_id == 6) {
                    var nr = (user[0].ak + user[0].c + user[0].ns + user[0].pd + user[0].ass + user[0].sor + user[0].amb + user[0].ps)/8
                    res.render("mid_result.hbs", {
                        layout: "/layouts/test_layout",
                        sum: parseInt(nr),
                        is_ambiverts: false,
                        is_without_res: false,
                        ask_info: {
                            block_id: req.session.block_id,
                            ask_id: req.session.ask_id
                        }
                    })
                }
                if (req.session.block_id == 7) {
                    var ei = (user[0].introspection + user[0].expressions + user[0].self_control + user[0].communication + user[0].understanding_other_emotions + user[0].self_development)/6
                    res.render("mid_result.hbs", {
                        layout: "/layouts/test_layout",
                        sum: parseInt(ei),
                        is_ambiverts: false,
                        is_without_res: false,
                        ask_info: {
                            block_id: req.session.block_id,
                            ask_id: req.session.ask_id
                        }
                    })
                }
                if (req.session.block_id == 8) {
                    var svi = (user[0].adaptive_scale + user[0].confidence_scale + user[0].spontaneous_scale)/3
                    res.render("mid_result.hbs", {
                        layout: "/layouts/test_layout",
                        sum: parseInt(svi),
                        is_ambiverts: false,
                        is_without_res: false,
                        ask_info: {
                            block_id: req.session.block_id,
                            ask_id: req.session.ask_id
                        }
                    })
                }
                if (req.session.block_id == 9) {
                    res.render("mid_result.hbs", {
                        layout: "/layouts/test_layout",
                        sum: result,
                        is_ambiverts: false,
                        is_without_res: true,
                        ask_info: {
                            block_id: req.session.block_id,
                            ask_id: req.session.ask_id
                        }
                    })
                }
            }
        })
    } else {
        res.redirect("/")
    }
})

app.get("/mid_result_restart", (req, res) => {
    if (req.session.user_logged_in) {
        if (req.session.block_id == 4 && req.session.ask_id == 1) {
            req.session.block_id = 3
            req.session.ask_id = 1
            pool.query("update refresh_users set block_id = 3, ask_id = 1 where id = ?", [req.session.user_id], (err, result) => {
                if (err) {
                    console.log(err)
                    res.sendStatus(502)
                } else {
                    res.render("mid_result_restart.hbs", {
                        layout: "/layouts/test_layout",
                        ask_info: {
                            block_id: req.session.block_id,
                            ask_id: req.session.ask_id
                        }
                    })
                }
            })
        } else {
            res.redirect("/test_page")
        }
    } else {
        res.redirect("/")
    }
})

app.get("/bad_mid_result", (req, res) => {
    if (req.session.user_logged_in) {
        res.render("bad_mid_result.hbs", {
            layout: "/layouts/test_layout",
            result_page: true 
        })
    } else {
        res.redirect("/")
    }
})

app.get("/result", (req, res) => {
    if (req.session.user_logged_in) {
        pool.query("select * from refresh_users where id = ?", [req.session.user_id], (err, user) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {
                //* стоп факторы
                var stop_factors = []

                var phobia_points = user[0].slight_anxiety + user[0].medium_anxiety * 2 + user[0].high_anxiety * 3 
                phobia_points = phobia_points + user[0]._sometimes + user[0]._often * 2 + user[0]._always * 3

                if (phobia_points >= 56) {
                    stop_factors.push({
                        text: "Фобия к продажам",
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                } else if (phobia_points >= 31) {
                    stop_factors.push({
                        text: "Нет фобии",
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else {
                    stop_factors.push({
                        text: "Есть пофигизм",
                        is_red: false,
                        is_green: false,
                        is_yellow: true
                    })
                }
                
                if (user[0].extravert >= 12 && user[0].introvert >= 12) {
                    stop_factors.push({
                        text: "Амбиверт",
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else if (user[0].extravert >= 16) {
                    stop_factors.push({
                        text: "Экстраверт",
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else if (user[0].introvert >= 16) {
                    stop_factors.push({
                        text: "Интроверт",
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                }

                var result_1 = ''

                if (user[0].energy_work > 9 && user[0].energy_talk > 9 && user[0].switching_work > 9 && user[0].switching_talk > 9 && user[0].speed_work > 9 && user[0].speed_contacting > 9 && user[0].emotional_event > 9 && user[0].emotional_talk > 9) {
                    result_1 = 'холерик'
                } else if (user[0].energy_work < 5 && user[0].energy_talk < 5 && user[0].switching_work < 5 && user[0].switching_talk < 5 && user[0].speed_work < 5 && user[0].speed_contacting < 5 && user[0].emotional_event < 5 && user[0].emotional_talk < 5) {
                    result_1 = 'флегматик'
                } else if ((4 < user[0].energy_work < 10) && (4 < user[0].energy_talk < 10) && (4 < user[0].switching_work < 10) && (4 < user[0].switching_talk < 10) && (4 < user[0].speed_work < 10) && (4 < user[0].speed_contacting < 10) && (4 < user[0].emotional_event < 10) && (4 < user[0].emotional_talk < 10)) {
                    result_1 = 'сангвиник'
                } else {
                    result_1 = 'меланхолик'
                }
                        
                var result_2 = ''

                if (user[0].energy_work > 9 && user[0].energy_talk > 9 && user[0].switching_work > 5 && user[0].switching_talk > 5 && user[0].speed_work > 9 && user[0].speed_contacting > 9 && user[0].emotional_event > 9 && user[0].emotional_talk > 9) {
                    result_2 = 'холерик'
                } else if (user[0].energy_work < 5 && user[0].energy_talk < 5 && user[0].switching_work < 5 && user[0].switching_talk < 5 && user[0].speed_work < 5 && user[0].speed_contacting < 5 && user[0].emotional_event < 5 && user[0].emotional_talk < 5) {
                    result_2 = 'флегматик'
                } else if (user[0].energy_work < 5 && user[0].energy_talk < 5 && user[0].switching_work < 5 && user[0].switching_talk < 5 && user[0].speed_work < 5 && user[0].speed_contacting < 5 && user[0].emotional_event > 4 && user[0].emotional_talk > 4) {
                    result_2 = 'меланхолик'
                } else {
                    result_2 = 'сангвиник'
                }

                var result = ''

                if (result_1 == result_2) {
                    result = result_1
                } else {
                    result = result_1 + ' ' + result_2
                }
                
                result = result.charAt(0).toUpperCase() + result.slice(1)

                if (result.indexOf(' ') != -1) {
                    if (result.includes("меланхолик") && result.includes("флегматик")) {
                        stop_factors.push({
                            text: result,
                            is_red: true,
                            is_green: false,
                            is_yellow: false
                        })
                    } else if (result.includes("меланхолик") || result.includes("флегматик")) {
                        stop_factors.push({
                            text: result,
                            is_red: false,
                            is_green: false,
                            is_yellow: true
                        })
                    } else {
                        stop_factors.push({
                            text: result,
                            is_red: false,
                            is_green: true,
                            is_yellow: false
                        })
                    }
                } else {
                    if (result.includes("меланхолик") || result.includes("флегматик")) {
                        stop_factors.push({
                            text: result,
                            is_red: true,
                            is_green: false,
                            is_yellow: false
                        })
                    } else {
                        stop_factors.push({
                            text: result,
                            is_red: false,
                            is_green: true,
                            is_yellow: false
                        })
                    }
                }
                //* Метапрофиль
                var metaprofiles = []

                if (user[0].k >= 5) {
                    metaprofiles.push({
                        text: `К`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else {
                    metaprofiles.push({
                        text: `К`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                }

                if (user[0].internal_reference >= 5) {
                    metaprofiles.push({
                        text: `Внутренняя референция`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else {
                    metaprofiles.push({
                        text: `Внутренняя референция`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                }

                if (user[0].activity >= 5) {
                    metaprofiles.push({
                        text: `Активность`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else {
                    metaprofiles.push({
                        text: `Активность`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                }

                if (user[0].opportunities >= 5) {
                    metaprofiles.push({
                        text: `Возможности`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else {
                    metaprofiles.push({
                        text: `Возможности`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                }

                if (user[0].common >= 5) {
                    metaprofiles.push({
                        text: `Общее`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else {
                    metaprofiles.push({
                        text: `Общее`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                }

                //* Предназначение

                var third = []

                var nr = (user[0].ak + user[0].c + user[0].ns + user[0].pd + user[0].ass + user[0].sor + user[0].amb + user[0].ps)/8
                if (nr < 5) {
                    third.push({
                        text: `Нацеленность на результат`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                } else if (nr < 8) {
                    third.push({
                        text: `Нацеленность на результат`,
                        is_red: false,
                        is_green: false,
                        is_yellow: true
                    })
                } else {
                    third.push({
                        text: `Нацеленность на результат`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                }

                var ei = (user[0].introspection + user[0].expressions + user[0].self_control + user[0].communication + user[0].understanding_other_emotions + user[0].self_development)/6
                if (nr < 5) {
                    third.push({
                        text: `Эмоциональный интеллект`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                } else if (nr < 8) {
                    third.push({
                        text: `Эмоциональный интеллект`,
                        is_red: false,
                        is_green: false,
                        is_yellow: true
                    })
                } else {
                    third.push({
                        text: `Эмоциональный интеллект`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                }

                var svi = (user[0].confidence_scale + user[0].adaptive_scale + user[0].spontaneous_scale ) / 3

                if (user[0].confidence_scale < 6 && user[0].adaptive_scale < 6 && user[0].spontaneous_scale < 6 && svi < 6) {
                    if (user[0].lie_scale_2 < 6 ) {
                        third.push({
                            text: `Коммуникации (результаты достоверны)`,
                            is_red: true,
                            is_green: false,
                            is_yellow: false
                        })
                    } else {
                        third.push({
                            text: `Коммуникации (результаты недостоверны)`,
                            is_red: true,
                            is_green: false,
                            is_yellow: false
                        })
                    }
                } else if (user[0].confidence_scale > 11 && user[0].adaptive_scale > 11 && user[0].spontaneous_scale > 11 && svi > 11) {
                    if (user[0].lie_scale_2 < 6 ) {
                        third.push({
                            text: `Коммуникации (результаты достоверны)`,
                            is_red: false,
                            is_green: true,
                            is_yellow: false
                        })
                    } else {
                        third.push({
                            text: `Коммуникации (результаты недостоверны)`,
                            is_red: false,
                            is_green: true,
                            is_yellow: false
                        })
                    }
                } else {
                    if (user[0].lie_scale_2 < 6 ) {
                        third.push({
                            text: `Коммуникации (результаты достоверны)`,
                            is_red: false,
                            is_green: false,
                            is_yellow: true
                        })
                    } else {
                        third.push({
                            text: `Коммуникации (результаты недостоверны)`,
                            is_red: false,
                            is_green: false,
                            is_yellow: true
                        })
                    }
                }

                if (user[0].achievements_of_goals > 10 && user[0].encouragement > 12 && user[0].suppression_of_behavior < 14 && user[0].getting_pleasure < 10) {
                    third.push({
                        text: `Мотивация`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else if (user[0].achievements_of_goals < 10 && user[0].encouragement < 12 && user[0].suppression_of_behavior > 14 && user[0].getting_pleasure < 10) {
                    third.push({
                        text: `Мотивация`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                } else if (user[0].achievements_of_goals > 10 && user[0].encouragement < 12 && user[0].suppression_of_behavior < 14 && user[0].getting_pleasure < 10) {
                    third.push({
                        text: `Мотивация`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else if (user[0].achievements_of_goals > 10 && user[0].encouragement < 12 && user[0].suppression_of_behavior < 14 && user[0].getting_pleasure > 10) {
                    third.push({
                        text: `Мотивация`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else {
                    third.push({
                        text: `Мотивация`,
                        is_red: false,
                        is_green: false,
                        is_yellow: true
                    })
                }

                if (user[0].forecast_level > 12) {
                    third.push({
                        text: `Прогностическое мышление`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else if (user[0].forecast_level > 7) {
                    third.push({
                        text: `Прогностическое мышление`,
                        is_red: false,
                        is_green: false,
                        is_yellow: true
                    })
                } else {
                    third.push({
                        text: `Прогностическое мышление`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                }

                var category = 0

                if (phobia_points > 65 || user[0].introvert > 20 || (result.toLowerCase() == "флегматик" || result.toLowerCase() == "меланхолик") || (user[0].k < 5 && user[0].activity < 5 && user[0].opportunities < 5) || third[1].is_red || third[0].is_red) {
                    category = 4
                } else if (phobia_points < 30 && user[0].extravert > 16 && result.indexOf(" ") != -1 && (user[0].k > 5 && user[0].activity > 5 && user[0].opportunities > 5 && user[0].external_reference > 5 && user[0].common > 5) && third[1].is_yellow && third[0].is_yellow && third[2].is_red && third[3].is_red && third[4].is_red) {
                    category = 3
                } else if ((phobia_points < 55 && phobia_points > 30) && (user[0].introvert >= 12 && user[0].extravert >= 12) && result.toLowerCase() == "сангвиник" && (user[0].k > 5 && user[0].activity > 5 && user[0].opportunities > 5 && user[0].external_reference > 5 && user[0].common > 5) && third[1].is_green && third[0].is_green && third[2].is_green && third[3].is_green && third[4].is_green) {
                    category = 1
                } else {
                    category = 2
                }

                if (user[0].category == 0) {
                    pool.query("update refresh_users set category = ? where id = ?", [category, req.session.user_id], (err_update, updated) => {
                        if (err_update) {
                            console.log(err_update)
                            res.sendStatus(502)
                        }
                    })
                }

                res.render("result.hbs", {
                    layout: "/layouts/test_layout",
                    result_page: true,
                    stop_factor_1: stop_factors[0],
                    stop_factor_2: stop_factors[1],
                    stop_factor_3: stop_factors[2],
                    metaprofiles_1: metaprofiles[0],
                    metaprofiles_2: metaprofiles[1],
                    metaprofiles_3: metaprofiles[2],
                    metaprofiles_4: metaprofiles[3],
                    metaprofiles_5: metaprofiles[4],
                    user_name: user[0].user_name,
                    third_1: third[0],
                    third_2: third[1],
                    third_3: third[2],
                    third_4: third[3],
                    third_5: third[4],
                    category: category
                })
            }
        })
        
    } else {
        res.redirect("/")
    }
})

/* Кабинет работодателя */

app.get("/unapplied_yet", (req, res) => {
    res.render("unapplied_yet.hbs", {
        layout: "/layouts/test_layout",
        result_page: true,
    })
})

app.get("/unapplied", (req, res) => {
    res.render("unapplied.hbs", {
        layout: "/layouts/test_layout",
        result_page: true,
    })
})

app.get("/employer_cabinet", (req, res) => {
    if (req.session.employer_logged_in) {
        pool.query("select * from refresh_users where employer_code = ?", [req.session.employer_code], (err, user_list) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {

                var res_users_list = []

                user_list.forEach((elem, i) => {
                    var ended = true
                    var is_good = true
                    if (elem.fineshed == 1) {
                        is_good = true
                    }
                    if (elem.bad_finished == 1) {
                        is_good = false
                    }
                    if (elem.bad_finished == 0 && elem.fineshed == 0) {
                        ended = false
                    }

                    var is_best = false

                    if (elem.category == 2 || elem.category == 1) {
                        is_best = true
                    }
                    res_users_list.push({
                        user_name: elem.user_name,
                        category: elem.category,
                        id: elem.id,
                        ended: ended,
                        is_good: is_good,
                        is_best: is_best
                    })
                })

                res.render("employer_cabinet.hbs", {
                    layout: "/layouts/employer_cabinet_layout",
                    role: "employer",
                    employer_code: req.session.employer_code,
                    users: res_users_list.reverse()
                })
            }
        })
    } else {
        res.redirect("/")
    }
})

app.get("/employer_cabinet/:user_name", (req, res) => {
    if (req.session.employer_logged_in) {
        pool.query("select * from refresh_users where employer_code = ? and user_name = ?", [req.session.employer_code, req.params.user_name], (err, user_list) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {

                var res_users_list = []

                user_list.forEach((elem, i) => {
                    var ended = true
                    var is_good = true
                    if (elem.fineshed == 1) {
                        is_good = true
                    }
                    if (elem.bad_finished == 1) {
                        is_good = false
                    }
                    if (elem.bad_finished == 0 && elem.fineshed == 0) {
                        ended = false
                    }

                    res_users_list.push({
                        user_name: elem.user_name,
                        category: elem.category,
                        id: elem.id,
                        ended: ended,
                        is_good: is_good
                    })
                })

                res.render("employer_cabinet.hbs", {
                    layout: "/layouts/employer_cabinet_layout",
                    role: "employer",
                    employer_code: req.session.employer_code,
                    users: res_users_list.reverse(),
                    user_param: req.params.user_name
                })
            }
        })
    } else {
        res.redirect("/")
    }
})

app.get("/employer_cabinet_result/:user_id", (req, res) => {
    if (req.session.employer_logged_in) {
        pool.query("select * from refresh_users where id = ?", [req.params.user_id], (err, user) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {
                //* стоп факторы
                var stop_factors = []

                var phobia_points = user[0].slight_anxiety + user[0].medium_anxiety * 2 + user[0].high_anxiety * 3 
                phobia_points = phobia_points + user[0]._sometimes + user[0]._often * 2 + user[0]._always * 3

                if (phobia_points >= 56) {
                    stop_factors.push({
                        text: "Фобия к продажам",
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                } else if (phobia_points >= 31) {
                    stop_factors.push({
                        text: "Нет фобии",
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else {
                    stop_factors.push({
                        text: "Есть пофигизм",
                        is_red: false,
                        is_green: false,
                        is_yellow: true
                    })
                }
                
                if (user[0].extravert >= 12 && user[0].introvert >= 12) {
                    stop_factors.push({
                        text: "Амбиверт",
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else if (user[0].extravert >= 16) {
                    stop_factors.push({
                        text: "Экстраверт",
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else if (user[0].introvert >= 16) {
                    stop_factors.push({
                        text: "Интроверт",
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                }

                var result_1 = ''

                if (user[0].energy_work > 9 && user[0].energy_talk > 9 && user[0].switching_work > 9 && user[0].switching_talk > 9 && user[0].speed_work > 9 && user[0].speed_contacting > 9 && user[0].emotional_event > 9 && user[0].emotional_talk > 9) {
                    result_1 = 'холерик'
                } else if (user[0].energy_work < 5 && user[0].energy_talk < 5 && user[0].switching_work < 5 && user[0].switching_talk < 5 && user[0].speed_work < 5 && user[0].speed_contacting < 5 && user[0].emotional_event < 5 && user[0].emotional_talk < 5) {
                    result_1 = 'флегматик'
                } else if ((4 < user[0].energy_work < 10) && (4 < user[0].energy_talk < 10) && (4 < user[0].switching_work < 10) && (4 < user[0].switching_talk < 10) && (4 < user[0].speed_work < 10) && (4 < user[0].speed_contacting < 10) && (4 < user[0].emotional_event < 10) && (4 < user[0].emotional_talk < 10)) {
                    result_1 = 'сангвиник'
                } else {
                    result_1 = 'меланхолик'
                }
                        
                var result_2 = ''

                if (user[0].energy_work > 9 && user[0].energy_talk > 9 && user[0].switching_work > 5 && user[0].switching_talk > 5 && user[0].speed_work > 9 && user[0].speed_contacting > 9 && user[0].emotional_event > 9 && user[0].emotional_talk > 9) {
                    result_2 = 'холерик'
                } else if (user[0].energy_work < 5 && user[0].energy_talk < 5 && user[0].switching_work < 5 && user[0].switching_talk < 5 && user[0].speed_work < 5 && user[0].speed_contacting < 5 && user[0].emotional_event < 5 && user[0].emotional_talk < 5) {
                    result_2 = 'флегматик'
                } else if (user[0].energy_work < 5 && user[0].energy_talk < 5 && user[0].switching_work < 5 && user[0].switching_talk < 5 && user[0].speed_work < 5 && user[0].speed_contacting < 5 && user[0].emotional_event > 4 && user[0].emotional_talk > 4) {
                    result_2 = 'меланхолик'
                } else {
                    result_2 = 'сангвиник'
                }

                var result = ''

                if (result_1 == result_2) {
                    result = result_1
                } else {
                    result = result_1 + ' ' + result_2
                }
                
                result = result.charAt(0).toUpperCase() + result.slice(1)

                if (result.indexOf(' ') != -1) {
                    if (result.includes("меланхолик") && result.includes("флегматик")) {
                        stop_factors.push({
                            text: result,
                            is_red: true,
                            is_green: false,
                            is_yellow: false
                        })
                    } else if (result.includes("меланхолик") || result.includes("флегматик")) {
                        stop_factors.push({
                            text: result,
                            is_red: false,
                            is_green: false,
                            is_yellow: true
                        })
                    } else {
                        stop_factors.push({
                            text: result,
                            is_red: false,
                            is_green: true,
                            is_yellow: false
                        })
                    }
                } else {
                    if (result.includes("меланхолик") || result.includes("флегматик")) {
                        stop_factors.push({
                            text: result,
                            is_red: true,
                            is_green: false,
                            is_yellow: false
                        })
                    } else {
                        stop_factors.push({
                            text: result,
                            is_red: false,
                            is_green: true,
                            is_yellow: false
                        })
                    }
                }
                //* Метапрофиль
                var metaprofiles = []

                if (user[0].k >= 5) {
                    metaprofiles.push({
                        text: `К`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else {
                    metaprofiles.push({
                        text: `К`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                }

                if (user[0].internal_reference >= 5) {
                    metaprofiles.push({
                        text: `Внутренняя референция`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else {
                    metaprofiles.push({
                        text: `Внутренняя референция`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                }

                if (user[0].activity >= 5) {
                    metaprofiles.push({
                        text: `Активность`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else {
                    metaprofiles.push({
                        text: `Активность`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                }

                if (user[0].opportunities >= 5) {
                    metaprofiles.push({
                        text: `Возможности`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else {
                    metaprofiles.push({
                        text: `Возможности`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                }

                if (user[0].common >= 5) {
                    metaprofiles.push({
                        text: `Общее`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else {
                    metaprofiles.push({
                        text: `Общее`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                }

                //* Предназначение

                var third = []

                var nr = (user[0].ak + user[0].c + user[0].ns + user[0].pd + user[0].ass + user[0].sor + user[0].amb + user[0].ps)/8
                if (nr < 5) {
                    third.push({
                        text: `Нацеленность на результат`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                } else if (nr < 8) {
                    third.push({
                        text: `Нацеленность на результат`,
                        is_red: false,
                        is_green: false,
                        is_yellow: true
                    })
                } else {
                    third.push({
                        text: `Нацеленность на результат`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                }

                var ei = (user[0].introspection + user[0].expressions + user[0].self_control + user[0].communication + user[0].understanding_other_emotions + user[0].self_development)/6
                if (nr < 5) {
                    third.push({
                        text: `Эмоциональный интеллект`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                } else if (nr < 8) {
                    third.push({
                        text: `Эмоциональный интеллект`,
                        is_red: false,
                        is_green: false,
                        is_yellow: true
                    })
                } else {
                    third.push({
                        text: `Эмоциональный интеллект`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                }

                var svi = (user[0].confidence_scale + user[0].adaptive_scale + user[0].spontaneous_scale ) / 3

                if (user[0].confidence_scale < 6 && user[0].adaptive_scale < 6 && user[0].spontaneous_scale < 6 && svi < 6) {
                    if (user[0].lie_scale_2 < 6 ) {
                        third.push({
                            text: `Коммуникации (результаты достоверны)`,
                            is_red: true,
                            is_green: false,
                            is_yellow: false
                        })
                    } else {
                        third.push({
                            text: `Коммуникации (результаты недостоверны)`,
                            is_red: true,
                            is_green: false,
                            is_yellow: false
                        })
                    }
                } else if (user[0].confidence_scale > 11 && user[0].adaptive_scale > 11 && user[0].spontaneous_scale > 11 && svi > 11) {
                    if (user[0].lie_scale_2 < 6 ) {
                        third.push({
                            text: `Коммуникации (результаты достоверны)`,
                            is_red: false,
                            is_green: true,
                            is_yellow: false
                        })
                    } else {
                        third.push({
                            text: `Коммуникации (результаты недостоверны)`,
                            is_red: false,
                            is_green: true,
                            is_yellow: false
                        })
                    }
                } else {
                    if (user[0].lie_scale_2 < 6 ) {
                        third.push({
                            text: `Коммуникации (результаты достоверны)`,
                            is_red: false,
                            is_green: false,
                            is_yellow: true
                        })
                    } else {
                        third.push({
                            text: `Коммуникации (результаты недостоверны)`,
                            is_red: false,
                            is_green: false,
                            is_yellow: true
                        })
                    }
                }

                if (user[0].achievements_of_goals > 10 && user[0].encouragement > 12 && user[0].suppression_of_behavior < 14 && user[0].getting_pleasure < 10) {
                    third.push({
                        text: `Мотивация`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else if (user[0].achievements_of_goals < 10 && user[0].encouragement < 12 && user[0].suppression_of_behavior > 14 && user[0].getting_pleasure < 10) {
                    third.push({
                        text: `Мотивация`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                } else if (user[0].achievements_of_goals > 10 && user[0].encouragement < 12 && user[0].suppression_of_behavior < 14 && user[0].getting_pleasure < 10) {
                    third.push({
                        text: `Мотивация`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else if (user[0].achievements_of_goals > 10 && user[0].encouragement < 12 && user[0].suppression_of_behavior < 14 && user[0].getting_pleasure > 10) {
                    third.push({
                        text: `Мотивация`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else {
                    third.push({
                        text: `Мотивация`,
                        is_red: false,
                        is_green: false,
                        is_yellow: true
                    })
                }

                if (user[0].forecast_level > 12) {
                    third.push({
                        text: `Прогностическое мышление`,
                        is_red: false,
                        is_green: true,
                        is_yellow: false
                    })
                } else if (user[0].forecast_level > 7) {
                    third.push({
                        text: `Прогностическое мышление`,
                        is_red: false,
                        is_green: false,
                        is_yellow: true
                    })
                } else {
                    third.push({
                        text: `Прогностическое мышление`,
                        is_red: true,
                        is_green: false,
                        is_yellow: false
                    })
                }

                var category = 0

                if (phobia_points > 65 || user[0].introvert > 20 || (result.toLowerCase() == "флегматик" || result.toLowerCase() == "меланхолик") || (user[0].k < 5 && user[0].activity < 5 && user[0].opportunities < 5) || third[1].is_red || third[0].is_red) {
                    category = 4
                } else if (phobia_points < 30 && user[0].extravert > 16 && result.indexOf(" ") != -1 && (user[0].k > 5 && user[0].activity > 5 && user[0].opportunities > 5 && user[0].external_reference > 5 && user[0].common > 5) && third[1].is_yellow && third[0].is_yellow && third[2].is_red && third[3].is_red && third[4].is_red) {
                    category = 3
                } else if ((phobia_points < 55 && phobia_points > 30) && (user[0].introvert >= 12 && user[0].extravert >= 12) && result.toLowerCase() == "сангвиник" && (user[0].k > 5 && user[0].activity > 5 && user[0].opportunities > 5 && user[0].external_reference > 5 && user[0].common > 5) && third[1].is_green && third[0].is_green && third[2].is_green && third[3].is_green && third[4].is_green) {
                    category = 1
                } else {
                    category = 2
                }

                res.render("employer_cabinet_result.hbs", {
                    layout: "/layouts/test_layout",
                    result_page: true,
                    stop_factor_1: stop_factors[0],
                    stop_factor_2: stop_factors[1],
                    stop_factor_3: stop_factors[2],
                    metaprofiles_1: metaprofiles[0],
                    metaprofiles_2: metaprofiles[1],
                    metaprofiles_3: metaprofiles[2],
                    metaprofiles_4: metaprofiles[3],
                    metaprofiles_5: metaprofiles[4],
                    user_name: user[0].user_name,
                    third_1: third[0],
                    third_2: third[1],
                    third_3: third[2],
                    third_4: third[3],
                    third_5: third[4],
                    category: category
                })
            }
        })
    } else {
        res.redirect("/")
    }
})

/* Админка */

app.get("/admin", (req, res) => {
    if (req.session.refresh_admin_logged_in) {
        res.render("admin_main.hbs", {
            layout: "/layouts/employer_cabinet_layout",
            role: 'admin'
        })
    } else {
        res.redirect("/admin_login")
    }
})

app.get("/add_admin", (req, res) => {
    if (req.session.refresh_admin_logged_in) {
        pool.query("select * from refresh_admins", (err, admins) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {
                res.render("add_admin.hbs", {
                    layout: "/layouts/test_layout",
                    result_page: true,
                    admin_page: true,
                    admins: admins
                })
            }
        })
    } else {
        res.redirect("/admin_login")
    }
})

app.post("/add_admin", jsonParser, (req, res) => {
    pool.query("select * from refresh_admins where login = ?", [req.body.login], (err1, result_check) => {
        if (err1) {
            console.log(err1)
            res.sendStatus(502)
        } else {
            if (result_check.length > 0) {
                res.redirect("/add_admin")
            } else {
                pool.query("insert into refresh_admins (login, pass) values (?, ?)", [req.body.login, req.body.pass], (err, result) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(502)
                    } else {
                        res.redirect("/add_admin")
                    }
                })  
            }
        }
    })
})

app.get("/delete_admin/:id", (req, res) => {
    if (req.session.refresh_admin_logged_in) {
        pool.query("delete from refresh_admins where id = ?", [req.params.id], (err, result) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {
                res.redirect("/add_admin")
            }
        })
    } else {
        res.redirect("/admin_login")
    }
})

app.post("/edit_admin_info", jsonParser, (req, res) => {
    pool.query("update refresh_admins set login = ?, pass = ? where id = ?", [req.body.login, req.body.pass, req.body.id], (err, result) => {
        if (err) {
            console.log(err)
            res.sendStatus(502)
        } else {
            res.send()
        }
    })
})

app.get("/all_applications", (req, res) => {
    if (req.session.refresh_admin_logged_in) {
        pool.query("select * from refresh_employers where is_applied = ? and unapplied = ?", [0, 0], (err, employers) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {
                res.render("all_applications.hbs", {
                    layout: "/layouts/test_layout",
                    result_page: true,
                    admin_page: true,
                    employers: employers
                })
            }
        })
    } else {
        res.redirect("/admin")
    }
})

app.get("/apply_employer/:id", (req, res) => {
    if (req.session.refresh_admin_logged_in) {
        pool.query("update refresh_employers set is_applied = ? where id = ?", [1, req.params.id], (err, result) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {
                res.redirect("/all_applications")
            }
        })
    } else {
        res.redirect("/admin")
    }
})

app.get("/unapply_employer/:id", (req, res) => {
    if (req.session.refresh_admin_logged_in) {
        pool.query("update refresh_employers set unapplied = ? where id = ?", [1, req.params.id], (err, result) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {
                res.redirect("/all_applications")
            }
        })
    } else {
        res.redirect("/admin")
    }
})

app.get("/delete_employer/:id", (req, res) => {
    if (req.session.refresh_admin_logged_in) {
        pool.query("update refresh_employers set unapplied = ? where id = ?", [1, req.params.id], (err, result) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {
                res.redirect("/all_employers")
            }
        })
    } else {
        res.redirect("/admin")
    }
})

app.get("/all_employers", (req, res) => {
    if (req.session.refresh_admin_logged_in) {
        pool.query("select * from refresh_employers where is_applied = ? and unapplied = ?", [1, 0], (err, employers) => {
            if (err) {
                console.log(err)
                res.sendStatus(502)
            } else {
                res.render("all_employers.hbs", {
                    layout: "/layouts/test_layout",
                    result_page: true,
                    admin_page: true,
                    employers: employers
                })
            }
        })
    } else {
        res.redirect("/admin")
    }
})

app.listen(PORT, function() {
    console.log(PORT);
});