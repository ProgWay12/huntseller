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

/* 
create table refresh_users (
id integer auto_increment key not null,
user_name longtext,
phone_number longtext,
employer_code longtext,
ask_id integer,
fineshed boolean
);

create table refresh_employers (
id integer auto_increment key not null,
user_name longtext,
email longtext,
pass longtext,
employer_code longtext
);

create table refresh_admins (
id integer auto_increment key not null,
login longtext,
pass longtext
);

create table refresh_asks (
id integer auto_increment key not null,
ask_id integer not null,
ask_text longtext,
block_id integer not null
);

insert into refresh_asks (ask_id, ask_text, block_id) values (1, 'Поговорить по телефону в присутствии других людей.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (2, 'Пообщаться в небольшой группе коллег.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (3, 'Услышать, как клиент начнет с Вами спорить.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (4, 'Забыть характеристики товара, представляя его клиенту.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (5, 'Поговорить с руководством отдела/директором.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (6, 'Публично выступить на совещании.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (7, 'Пойти на корпоративное мероприятие.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (8, 'Выполнять работу под наблюдением другого человека.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (9, 'Услышать, как клиент начнет Вас перебивать', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (10, 'Сделать первый «холодный» звонок   потенциальному клиенту.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (11, 'Побеседовать с потенциальным клиентом лично.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (12, 'Встретиться с потенциальными клиентами.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (13, 'Услышать отказ клиента.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (14, 'Войти в комнату для переговоров, в которой уже сидят клиенты.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (15, 'Предложить руководителю новый способ увеличения продаж.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (16, 'Без предупреждения взять слово на собрании.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (17, 'Сдавать тесты на практические умения или навыки.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (18, 'Выразить своё неодобрение или несогласие коллегам.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (19, 'Услышать возражения клиента.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (20, 'Сделать устный доклад коллегам.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (21, 'Услышать	молчание	клиента	в	ответ	на	Ваше предложение.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (22, 'Во время продажи отойти от скрипта.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (23, 'Сообщить клиенту о переносе сроков поставки на более позднее время.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (24, 'Услышать негативную оценку себя от клиента.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (25, 'Поговорить по телефону в присутствии других людей.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (26, 'Пообщаться в небольшой группе коллег.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (27, 'Услышать, как клиент начнет с Вами спорить.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (28, 'Забыть характеристики товара, представляя его клиенту.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (29, 'Поговорить с руководством отдела/директором.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (30, 'Публично выступить на совещании.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (31, 'Пойти на корпоративное мероприятие.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (32, 'Выполнять работу под наблюдением другого человека.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (33, 'Услышать, как клиент начнет Вас перебивать', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (34, 'Сделать первый «холодный» звонок   потенциальному клиенту.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (35, 'Побеседовать с потенциальным клиентом лично.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (36, 'Встретиться с потенциальными клиентами.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (37, 'Услышать отказ клиента.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (38, 'Войти в комнату для переговоров, в которой уже сидят клиенты.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (39, 'Предложить руководителю новый способ увеличения продаж.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (40, 'Без предупреждения взять слово на собрании.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (41, 'Сдавать тесты на практические умения или навыки.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (42, 'Выразить своё неодобрение или несогласие коллегам.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (43, 'Услышать возражения клиента.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (44, 'Сделать устный доклад коллегам.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (45, 'Услышать	молчание	клиента	в	ответ	на	Ваше предложение.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (46, 'Во время продажи отойти от скрипта.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (47, 'Сообщить клиенту о переносе сроков поставки на более позднее время.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (48, 'Услышать негативную оценку себя от клиента.', 1);
insert into refresh_asks (ask_id, ask_text, block_id) values (1, 'Ваш день богат событиями: вы можете посмотреть два фильма, спектакль,  прочитать книгу и прийти только на одну из пяти назначенных встреч.', 2);

insert into refresh_asks (ask_id, ask_text, block_id) values (1, 'Ваш день богат событиями: вы можете посмотреть два фильма, спектакль,  прочитать книгу и прийти только на одну из пяти назначенных встреч.', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (2, 'Отсутствие в доме радио, телевизора и телефона производит на вас  удручающее впечатление', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (3, 'Количество ваших друзей и знакомых постоянно растет', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (4, 'Вы легче запоминаете лица, случаи, биографии, чем даты, формулы и чужие  мысли', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (5, 'Вы любите веселые компании и совершенно беспомощны перед лицом  одиночества', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (6, 'Вы любите шутить, обсуждать свежие сплетни, рассказывать анекдоты. Как  правило, вы не конфликтны', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (7, 'Вы любите выступать перед публикой и предпочитаете находиться в центре  всеобщего внимания', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (8, 'Вы всегда в курсе всех последних событий', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (9, 'Вы быстро сходитесь с незнакомыми людьми, хорошо ориентируетесь в  незнакомой ситуации', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (10, 'Ваши решения очень часто скоропалительны', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (11, 'Поездки в другие города доставляют вам большое удовольствие', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (12, 'Вы не в состоянии осуществить и десятой доли всех ваших планов, намерений  и идей', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (13, 'Вам не очень нравятся постоянно беспокоящиеся о вашем здоровье люди,  особенно если вы их об этом не просите', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (14, 'Для вас жизненно необходимо производить хорошее впечатление на окружающих', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (15, 'Важное для вас решение может быть изменено или отложено под влиянием различных событий', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (16, 'Вам приятно предаваться воспоминаниям. На вас производит сильное впечатление просмотр хорошего спектакля, фильма', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (17, 'У вас немного друзей, вас не привлекают незнакомые компании', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (18, 'Вы лучше запоминаете какую-то ситуацию в целом, подробности часто ускользают от вас', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (19, 'Громкий шум, смех, музыка раздражают вас', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (20, 'Вы предпочитаете носить только те вещи, которые, на ваш взгляд, вам идут,  пусть даже их будет немного', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (21, 'Вы любите фотографироваться, вам нравятся украшения и красивые сувениры', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (22, 'Вы любите готовить', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (23, 'Вы предпочтете компанию, где можно остаться незамеченным (уединиться), той,  где постоянно нужно быть у всех на виду', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (24, 'Вам трудно быстро приспособиться к новой обстановке, ситуации, коллективу', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (25, 'Вы достаточно принципиальный человек', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (26, 'Вы ипохондрик. Постоянные мысли о своем здоровье и страх заболеть угнетают вас', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (27, 'Вы способны долго обдумывать занимающий вас вопрос, прежде чем принять окончательное решение', 2);
insert into refresh_asks (ask_id, ask_text, block_id) values (28, 'Иногда вас считают немного странным, но вы не обращаете на это внимания', 2);

insert into refresh_asks (ask_id, ask_text, block_id) values (1, 'Подвижный ли Вы человек?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (2, 'Всегда ли Вы готовы с ходу, не раздумывая, включиться в интересующий Вас разговор?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (3, 'Предпочитаете ли Вы уединение большой компании?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (4, 'Испытываете ли Вы постоянное желание чем-либо заниматься, что-либо делать?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (5, 'Медленно ли Вы говорите?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (6, 'Ранимый ли Вы человек?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (7, 'Часто ли Вам не спится из-за того, что Вы поссорились с друзьями?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (8, 'Всегда ли Вам хочется в свободное время чем-либо заняться?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (9, 'Часто ли Вы в разговорах с людьми говорите, не подумав как следует?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (10, 'Раздражает ли Вас быстрая речь собеседника?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (11, 'Чувствовали ли Вы себя несчастным человеком, если бы надолго лишись возможности разговаривать с людьми?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (12, 'Опаздывали ли Вы на назначенную встречу или на работу?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (13, 'Нравится ли Вам быстро бегать?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (14, 'Сильно ли Вы переживаете из-за замечаний в свой адрес, плохую оценку своей работы?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (15, 'Легко ли Вам выполнять работу, требующую длительного внимания и сосредоточенности?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (16, 'Трудно ли Вам быстро говорить?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (17, 'Часто ли Вы испытываете беспокойство, если не выполнили как следует какую-нибудь работу?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (18, 'Часто ли Ваши мысли перескакивают с одной темы на другую во время разговора?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (19, 'Нравится ли Вам игры, требующие ловкости и быстроты?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (20, 'Легко ли Вам найти вариант решения какой-нибудь задачи?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (21, 'Испытываете ли Вы чувство беспокойства, если Вас неправильно поняли во время разговора?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (22, 'Охотно ли Вы выполняете сложную, ответственную работу?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (23, 'Говорите ли Вы о вещах, в которых не разбираетесь?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (24, 'Легко ли Вы меняете тему разговора?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (25, 'Легко ли Вам выполнять одновременно несколько различных дел?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (26, 'Возникают ли у Вас конфликты с друзьями из-за того, что Вы говорите, не подумав?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (27, 'Любите ли Вы простую, не требующую усилий работу?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (28, 'Легко ли Вы расстраиваетесь, когда обнаруживаете, что сделали что-нибудь не так?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (29, 'Любите ли Вы сидячую работу?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (30, 'Легко ли Вам общаться с людьми?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (31, 'Предпочитаете ли Вы подумать, взвесить свои слова прежде, чем высказываться?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (32, 'Все ли Ваши привычки хорошие?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (33, 'Быстро ли двигаются Ваши руки, когда Вы работаете?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (34, 'Молчите ли Вы, не торопясь вступить в контакт, в обществе незнакомых людей?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (35, 'Легко ли Вам переключиться с одного способа решения задачи на другой?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (36, 'Плохо ли к Вам относятся близкие люди?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (37, 'Разговорчивый ли Вы человек?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (38, 'Легко ли Вы выполняете работу, требующую мгновенной реакции?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (39, 'Вы, обычно, говорите свободно, без запинки?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (40, 'Беспокоит ли Вас то, что связано с работой или учебой?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (41, 'Обижаетесь ли Вы, когда люди указывают на Ваши личные недостатки?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (42, 'Есть ли у Вас желание заниматься какой-нибудь ответственной работой?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (43, 'Любите ли Вы все делать медленно и неторопливо?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (44, 'Бывают ли у Вас мысли, которые Вы бы хотели скрыть от других?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (45, 'Можете ли Вы без долгих рассуждений задать другому человеку щекотливый, трудный для него вопрос?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (46, 'Доставляет ли Вам удовольствие быстрое движение?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (47, 'Легко ли Вам придумывать новые идеи, связанные с тем, чем Вы занимаетесь?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (48, 'Возникает ли у Вас тревога, беспокойство перед каким-нибудь важным, ответственным разговором?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (49, 'Можно о Вас сказать, что Вы быстро выполняете то, что Вам поручается?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (50, 'Любите ли Вы работать самостоятельно?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (51, 'Легко ли определить Ваше внутреннее состояние по выражению Вашего лица?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (52, 'Всегда ли Вы выполняете данное Вами обещание?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (53, 'Обижаетесь ли Вы на то, как окружающие обходятся с Вами?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (54, 'Любите ли Вы одновременно заниматься только одним делом?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (55, 'Любите ли Вы быстрые игры?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (56, 'Любите ли Вы делать паузы в своей речи?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (57, 'Любите ли Вы вносить оживление в компанию?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (58, 'Чувствуете ли Вы в себе избыток сил и желание заняться каким-либо трудным делом?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (59, 'Трудно ли Вам переключить внимание с одного дела на другое?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (60, 'Бывает ли так, что у Вас надолго портится настроение из-за того, что неожиданно срывается какое-нибудь важное дело?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (61, 'Часто ли Вам не спится из-за того, что дела идут не так как надо?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (62, 'Любите ли Вы бывать в компании?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (63, 'Волнуетесь ли Вы, выясняя отношения с друзьями?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (64, 'Испытываете ли Вы потребность в работе, требующей полной отдачи сил?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (65, 'Часто ли Вы злитесь и выходите из себя?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (66, 'Любите ли Вы заниматься сразу многими делами?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (67, 'Держитесь ли Вы свободно в большой компании?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (68, 'Часто ли Вы утверждаете нечто на основе первого впечатления, не подумав как следует?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (69, 'Возникает ли у Вас чувство неуверенности в процессе выполнения какого-либо дела и беспокоит ли оно Вас?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (70, 'Медленно ли Вы работаете?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (71, 'Легко ли Вы переключаетесь с одной работы на другую?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (72, 'Быстро ли Вы читаете вслух?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (73, 'Сплетничаете ли Вы иногда?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (74, 'Молчаливы ли Вы в кругу друзей?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (75, 'Нуждаетесь ли Вы в людях, которые бы Вас утешили и поддержали?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (76, 'Охотно ли Вы выполняете одновременно много разных дел?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (77, 'Охотно ли Вы делаете быструю работу?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (78, 'Тянет ли Вас пообщаться с людьми в свободное время?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (79, 'Часто ли у Вас бывает бессонница, если у Вас что-то не ладится на работе?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (80, 'Дрожат ли у Вас руки во время ссоры?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (81, 'Долго ли Вы мысленно готовитесь прежде, чем высказать свое мнение?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (82, 'Есть ли среди Ваших знакомых люди, которые Вам явно не нравятся?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (83, 'Предпочитаете ли Вы заниматься легкой работой?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (84, 'Легко ли Вас обидеть?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (85, 'Начинаете ли Вы первым разговор в компании?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (86, 'Испытываете ли Вы желание больше быть среди коллег?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (87, 'Склонны ли Вы сначала подумать, а потом говорить?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (88, 'Часто ли Вы волнуетесь по поводу работы или учебы?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (89, 'Всегда бы Вы платили за провоз багажа на транспорте, если не опасались проверки?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (90, 'Держитесь ли Вы обособлено в компаниях, на вечеринках?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (91, 'Склонны ли Вы преувеличивать неудачи, которые случаются у Вас на работе?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (92, 'Нравится ли Вам быстро говорить?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (93, 'Легко ли Вам удержаться от высказывания вслух неожиданно возникшей мысли?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (94, 'Предпочитаете ли Вы работать медленно?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (95, 'Переживаете ли Вы из-за неполадок в работе?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (96, 'Нравится ли Вам говорить с людьми спокойно и медленно?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (97, 'Часто ли Вы волнуетесь из-за ошибок?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (98, 'Способны ли Вы хорошо выполнять долгую, трудоемкую работу?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (99, 'Можете ли вы, не раздумывая, обратиться с просьбой личного характера к незнакомому человеку?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (100, 'Часто ли Вы чувствуете себя неуверенно при общении с людьми?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (101, 'Легко ли Вы беретесь за выполнение новой, незнакомой работы?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (102, 'Устаете ли Вы, когда Вам приходится долго говорить?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (103, 'Нравится ли Вам работать неторопливо, без особого напряжения?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (104, 'Нравится ли Вам разнообразная работа, требующая сосредоточения и переключения внимания с одного дела на другое?', 3);
insert into refresh_asks (ask_id, ask_text, block_id) values (105, 'Любите ли Вы подолгу бывать наедине с собой?', 3);

insert into refresh_asks (ask_id, ask_text, block_id) values (1, "Опасаетесь ли вы совершать ошибки в вашей профессиональной деятельности.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (2, "Готовы ли вы пойти на риск ради достижения цели.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (3, "Вас пугает перспектива возможного увольнения.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (4, "Неудачи в делах мотивируют вас на достижение больше, чем успех.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (5, "Считаете ли вы, что «синица в руках» лучше, чем «журавль в небе».", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (6, "Продумываете ли вы «План Б» на случай неудачи.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (7, "Считаете ли вы, что отсутствие критики – это лучшая похвала.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (8, "В своей работе вы строго следуете принципу «доверяй, но проверяй».", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (9, "Безопасность государства больше зависит от стратегических ракет, чем от противовоздушной обороны.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (10, "Считаете ли вы, что цель всегда оправдывает средства.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (11, "Ориентируетесь ли вы на приметы, предчувствия и предсказания.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (12, "При столкновении с нестандартной ситуацией на работе обратитесь ли вы за советом к коллегам.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (13, "Интересуетесь ли вы тем, что о вас говорят.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (14, "Является ли статусность должности для вас одним из важнейших критериев при поиске работы.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (15, "Возглавите ли вы отдел, в котором вы работаете, если только половина сотрудников отдела поддержат вас на этой должности.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (16, "Последуете ли вы совету более опытного коллеги, если его совет кардинально отличается от вашего видения ситуации.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (17, "Будете ли вы настаивать на своем варианте разрешения проблемной ситуации, если ощущаете его явное неприятие коллегами.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (18, "Придаете ли вы значение комментариям коллег относительно вашего образа жизни, мыслей, увлечений и внешнего вида.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (19, "Измените ли вы негативную точку зрения о человеке, если у вашего друга о нем лучшее мнение.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (20, "Вступите ли вы в спор с сотрудником, если уверены в том, что он не прав.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (21, "Предпочитаете ли вы в компании первым знакомиться и заговорить с интересным для вас человеком.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (22, "Вас больше привлекает работа по анализу и структурированию информации, чем активная работа в «полях».", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (23, "Проявляете ли вы инициативу во время рабочих собраний и совещаний.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (24, "Можете ли вы приступить к реализации проекта еще до его полного утверждения руководством.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (25, "Вы живете по принципу «куй железо пока горячо», ничего не откладывая на потом.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (26, "Вы в больше степени рассудительный, чем активный человек.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (27, "Вы часто откладываете дела на «потом».", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (28, "Вы никогда не возьметесь за реализацию проекта, хорошенько его не обдумав.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (29, "Вы всегда тщательно взвешиваете все «за» и «против» при принятии решений.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (30, "В своей работе вы являетесь сторонником быстрых, активных решений и действий.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (31, "Вы не готовите речь предварительно для того, чтобы выступить с небольшим сообщением перед аудиторией.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (32, "Вы предпочитаете многозадачную работу, чем одноплановую.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (33, "Вы предпочитаете позицию, в которой полномочия и ответственность четко определены, должности с широкими возможностями и большой ответственностью.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (34, "Вам предпочтительнее, чтобы вам подробно объяснили, как конкретно необходимо выполнить поставленное перед вами задание, чем предоставили возможность для творчества.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (35, "В своей профессиональной деятельности вы больше ориентированы на результат, чем на соблюдение инструкций и проверенные временем стандарты.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (36, "При достижении цели вы равномерно распределяете свои усилия во времени, исключая авралы и непредвиденные ситуации.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (37, "Вас больше интересует налаживание существующих и уже проверенных бизнес-процессов, чем поиск новых путей достижения цели.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (38, "Вы считаете себя человеком, больше склонным к структурированию и упорядочиванию информации, чем к творчеству и креативу.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (39, "Вы предпочли бы работать на небольшой оклад и значительные проценты от результата, чем на значительный оклад и небольшие проценты.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (40, "Есть ли у вас склонность к регулярному ведению ежедневника, странички в социальной сети или дневника(блога).", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (41, "Вы человек, который больше думает о тенденциях и трендах, чем о конкретных фактах и цифрах.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (42, "Считаете ли вы, что в вашей профессиональной деятельности не бывает ненужной информации.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (43, "Перестанете ли вы собирать и рассматривать дополнительную информацию относительно интересующего вас события после того, как уже сделали вывод.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (44, "Будет ли вам достаточно принципиальной договоренности с партнером о сотрудничестве, чтобы начать реализовывать проект.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (45, "Стараетесь ли вы всегда узнавать как можно больше деталей происходящих событий.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (46, "Вам важнее понимать основную концепцию, чем хорошо разбираться в деталях.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (47, "Считаете ли вы, что общего стратегического плана будет достаточно, чтобы начать действовать.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (48, "Вы больше говорите по существу, немногословно, чем о каких-либо подробностях и нюансах.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (49, "Вы человек, которому больше интересны конкретные факты, чем общие концепции.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (50, "Читая книгу, вы больше обращаете внимание на анализ сюжета, а не на ее отдельные главы.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (51, "Нравиться ли вам длительное время находиться в центре общественного внимания.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (52, "В конфликтной ситуации вы склонны больше концентрироваться на собственных интересах и статусе, а не на поисках компромисса и встречных шагах.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (53, "При рассказе о себе вы склонны преувеличивать собственные достижения и заслуги.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (54, "Вы предпочитаете «замыкать» основные процессы на себя ради возможности их контролировать и управлять.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (55, "В командной работе вы склонны занимать обособленное положение (функционал), позволяющее не заниматься рутинной работой и находиться в центре принятия решений.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (56, "Склонны ли вы избегать повышенного внимания общества к вашей персоне.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (57, "Свойственно ли вам устанавливать с людьми более личные, индивидуальные, а не деловые отношения.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (58, "Вы никогда не идете на открытый конфликт, а спорные ситуации обязательно стремитесь решать с сохранением хороших отношений с оппонентом.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (59, "Вам часто трудно прервать и закончить разговор или общение с человеком, который рассказывать что-либо о себе.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (60, "В своей деятельности вы обращаете особое внимание на то, чтобы не навредить и не причинить неудобства другим людям.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (61, "В компании вы более склонны занимать наблюдательную позицию, вовлекаясь в общение лишь для того, чтобы показать собеседникам, что сохраняете внимание к ним.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (62, "В конфликтной ситуации с коллегой вы склонны концентрироваться на интересах компании и ее целях и рассматривать данный конфликт исключительно в этом русле.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (63, "На работе вы всегда стремитесь к тому, чтобы каждый сотрудник выполнял свой конкретный функционал с минимизацией человеческого фактора.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (64, "Для себя вы считаете правильной фразу «Сократ мне друг, но истина дороже».", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (65, "Считаете ли вы, что для каждой профессии без исключения должны быть разработаны и описаны четкие критерии эффективности.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (66, "Вы чаще стремитесь быть участником событий, а не их наблюдателем.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (67, "Вы предпочитаете отдых в компании отдыху в одиночестве.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (68, "Вы стараетесь со своими сотрудниками поддерживать исключительно рабочие отношения.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (69, "Следите ли вы за течением времени и своими дальнейшими планами при встрече с друзьями.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (70, "Считаете ли вы себя эмоциональным человеком.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (71, "Вы предпочитаете жестко соблюдать регламент деловой встречи, а не уходить во второстепенные вопросы.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (72, "Вы предпочитаете сохранять отстраненность и невозмутимость даже в самых нестандартных ситуациях.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (73, "Считаете ли вы для себя верным правило «война – войной, а обед – по расписанию».", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (74, "Вовлекаетесь ли вы в рабочие дела настолько, что иногда забываете про время.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (75, "Склонны ли вы больше жить разумом, а не эмоциями.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (76, "Вы крайне не любите менять «насиженные» места на новые: рестораны и кафе, домашнюю и рабочую обстановку, круг общения и др.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (77, "Вас не тяготит, и вы не избегаете рутинных действий и работы.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (78, "В целом, вы придерживаетесь консервативных точек зрения и мироощущения.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (79, "При анализе нескольких ситуаций вы, прежде всего, ищите в них сходство с тем, что вы уже знаете.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (80, "Вам обычно не нравится непредсказуемость событий и обстановки.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (81, "Вы предпочитаете постепенные эволюционные изменения в своей профессиональной деятельности и жизни.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (82, "В рутинных делах вы стараетесь найти новые грани и нюансы.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (83, "При анализе нескольких ситуаций вам одинаково важно и то, что они между собой схожи, и то, чем они отличаются.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (84, "Вы не часто меняете свои привычки и пересматриваете убеждения.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (85, "Вы периодически меняете «насиженные» места друг на друга, не стараясь добавлять много нового: рестораны и кафе, домашнюю и рабочую обстановку, одежду, круг общения и др.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (86, "Вам необходимо часто менять сферу деятельности и окружающую обстановку.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (87, "Вам очень не нравится рутинная деятельность, вы постоянно ее избегаете.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (88, "Вы часто теряете интерес к делу, как только добиваетесь (первоначального) успеха в нем.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (89, "Вы любите начинать деятельность в новых вам областях.", 4);
insert into refresh_asks (ask_id, ask_text, block_id) values (90, "Вы стремитесь к тому, чтобы выделяться на фоне окружающих.", 4);

insert into refresh_asks (ask_id, ask_text, block_id) values (1, "Вы предпочитаете первым познакомиться и заговорить с интересным вам человеком.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (2, "Успех – скорее, результат упорного труда, чем способностей.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (3, "Если что-то не клеится, Вы легко сможете бросить начатое дело.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (4, "Вы думаете, что успех в жизни, скорее, зависит от случая, чем от расчета.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (5, "Если бы вы выполняли сложное, незнакомое задание, то сделали бы его вместе с кем-нибудь, а не трудились над ним в одиночку.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (6, "Ради успеха вы можете рискнуть, даже если шансы невелики.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (7, "Когда вы начинаете с кем-то играть, всегда уверены, что выиграете.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (8, "Вы предпочитаете выполнять работу, где отсутствуют четкие указания.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (9, "Вы больше предпочитаете работу по анализу и структурированию информации, чем активную деятельность в «полях».", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (10, "Отдыхая, вы способны совсем забыть о работе.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (11, "Вы не отказываетесь от своих планов и дел, даже если приходится выбирать между ними и приятной компанией.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (12, "В любом деле Вам важнее не его исполнение, а конечный результат.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (13, "Когда вы беретесь за трудные задачи, всегда уверены, что сможете их решить.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (14, "Вы придерживаетесь принципа: «Тише едешь, дальше будешь».", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (15, "Вы думаете, что у вас есть все необходимые навыки, чтобы добиться желаемого.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (16, "Для вас важно, чтобы вы могли выполнять свою работу, как считаете нужным, а, не следуя четким указаниям руководителя.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (17, "Вы проявляете инициативу во время рабочих собраний и совещаний.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (18, "Вы трудитесь больше, чем получаете за свой труд отдачу.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (19, "Обычно вы сохраняете спокойствие, ожидая опаздывающего на встречу человека.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (20, "Если вы работаете, то ничто не может вас отвлечь от этого занятия.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (21, "Вы думаете, что большинство людей живут далекими целями, а не близкими.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (22, "Вы скорее сделаете дело так, как считаете нужным, даже рискуя ошибиться, чем будете использовать чужие советы.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (23, "Вы уверены, что если не рисковать, то высоких результатов не добиться.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (24, "Вы живете, как большинство людей, и вас это устраивает.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (25, "Работа вам нравится, если вы четко представляете себе, что от вас требуется.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (26, "Вы в больше степени рассудительный, чем деятельный человек.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (27, "При необходимости Вы легко контролируете свои эмоции.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (28, "Вас сильно выбивает из колеи физическая боль.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (29, "Человек, вставая у вас на пути, не всегда намеревается вам помешать.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (30, "Даже обычную работу Вы стараетесь довести до совершенства.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (31, "Когда вы беретесь за трудное дело, то скорее опасаетесь, что не справитесь с ним, чем надеетесь, что оно получиться.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (32, "Только неожиданные обстоятельства и некоторое чувство опасности позволяют вам мобилизовать свои силы.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (33, "Вы уверены, что однажды обязательно достигнете желаемой цели.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (34, "Лучшей является такая работа, где есть четкие инструкции и разъяснения по поводу ее содержания.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (35, "Вы часто начинаете дело, и через время решаете, что закончить его можно и позже.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (36, "Вы всегда продумываете пути достижения своих целей.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (37, "Ваши планы слишком часто перечеркиваются внешними обстоятельствами.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (38, "Вы считаете себя терпеливым человеком.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (39, "В вас больше настойчивости, чем способностей.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (40, "Вы легко можете высказывать свое мнение по реализации проекта, не опасаясь быть непонятым.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (41, "Вы предпочитаете идти к своей цели осторожными шагами.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (42, "Вам бы хотелось, чтобы другие люди работали на вас.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (43, "Вам не нравится работа, если вы четко не знаете правил и процедур ее выполнения.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (44, "Вы живете здесь и сейчас, ничего не откладывая на потом.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (45, "Если надо, вы способны не спать ночь, работая над проектом, и весь следующий день быть в «хорошей форме».", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (46, "Вам редко удается заставить себя продолжать работу после серии обидных неудач.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (47, "Вы всегда принимаете решения, посоветовавшись с авторитетными для вас людьми.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (48, "Если вы взялись за дело, то завершите его, чего бы это ни стоило.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (49, "Вы отлично знаете свои сильные и слабые черты характера.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (50, "Вы считаете, что у любого проекта должен быть запасной страховочный план реализации.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (51, "Вы пока не до конца определились со своими жизненными целями.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (52, "Вы полагаете, что к должности должны быть приложены четкие должностные инструкции с очерченным кругом обязанностей.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (53, "Вы не готовы взяться за проект, если вам не известны все его детали.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (54, "Если вас хвалят, вы уверены в объективности похвалы.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (55, "Обычно вы выслушиваете собеседника, не перебивая, до конца, даже если есть что возразить.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (56, "Решая профессиональную задачу, вы всегда ищите наиболее эффективные способы.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (57, "Вы часто советуетесь с окружающими по тем или иным вопросам.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (58, "Вы думаете, что стоит верить в свои шансы, даже когда перевес не на вашей стороне.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (59, "Вы определили цели, но как их достичь, пока не знаете.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (60, "Вы получаете большее удовлетворения от работы, следуя строго по инструкции.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (61, "Вы живете по принципу: «Чего тут думать, надо действовать!».", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (62, "Окажись препятствие на пути к цели, вы готовы пересмотреть свою цель.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (63, "Вам сильно усложняет работу ограниченный дедлайн.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (64, "Вы считаете, что не важно, как выполнена работа, главное, что выполнена.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (65, "Сделав выбор, вы всегда не до конца уверены в его правильности.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (66, "Вы полагаете, что в деле главное – дерзкий замысел, даже если в результате ждет неудача из-за нелепых случайностей.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (67, "Вы готовы поменять работу, если вас ждут благоприятные карьерные перспективы.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (68, "Хорошо спланированная работа обязательно имеет четкие рекомендации по выполнению и должностные обязанности.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (69, "Принимая решение, вы всегда тщательно взвешиваете все «за» и «против».", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (70, "Достижение поставленных вами целей в большей мере зависит от вас.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (71, "Занимаясь делом, вы легко можете переключиться на посторонние занятия.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (72, "Вы думаете, что в достижении успеха немаловажную роль играет удача.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (73, "Вы, даже выслушав окружающих, все равно поступите по-своему.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (74, "Большинство людей не понимают, до какой степени их судьба зависит от стечения обстоятельств.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (75, "Вы уверены, что необходимо довольствоваться, тем, что у вас уже есть.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (76, "При выполнении работы не обязательно придерживаться плана, некоторые его пункты можно и пропускать.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (77, "В своей работе вы сторонник быстрых, активных решений и действий.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (78, "Для вас важно, что о вас думают окружающие.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (79, "Если человек вам неприятен, вы не считаете нужным скрывать свое отношение.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (80, "Вы скорее выбрали бы дело, в котором имеется некоторая вероятность неудачи, но есть и возможность достигнуть большего, чем такое, где ваше положение не ухудшится, но и существенно не улучшится.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (81, "Вам определенно не хватает уверенности в себе, чтобы браться за сложные проекты.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (82, "Вы считаете, что все ошибки в любой работе, чаще всего, связаны с принятием рискованных решений.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (83, "Вы считаете, что при других обстоятельствах вы смогли бы достигнуть большего.", 5);
insert into refresh_asks (ask_id, ask_text, block_id) values (84, "Успешная реализация проекта в большей степени зависит от везения, а не от тщательного планирования действий по его реализации.", 5);

insert into refresh_asks (ask_id, ask_text, block_id) values (1, "Бывает, что человек мне не нравится, а почему, объяснить не могу.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (2, "Я всегда могу улучшить свое настроение.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (3, "Бывает, что в стрессовых ситуациях мои эмоции берут верх над рассудком.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (4, "Когда я вижу, что человек на меня обижен, я пытаюсь наладить с ним хорошие отношения.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (5, "Обычно я замечаю, если люди в моем окружении чувствуют себя плохо, даже если они не говорят об этом.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (6, "Я всегда прислушиваюсь к собственным эмоциям.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (7, "Бывает, что я могу рассердиться.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (8, "Иногда я могу разозлиться без видимой причины.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (9, "Если мне очень грустно, я стараюсь скрыть это от окружающих.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (10, "Испытав сильную эмоцию, я могу сразу же успокоиться.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (11, "Я знаю, как поднять настроение окружающим.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (12, "Я не всегда могу определить эмоции других людей по выражению их лиц.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (13, "Если мне плохо, у меня не всегда получается улучшить свое душевное состояние.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (14, "Иногда я думаю о таких нехороших вещах, что лучше о них никому не рассказывать.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (15, "Бывает, мне говорят, что я хмурый(-ая), но сам(-а) я этого не замечаю.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (16, "Я обижаюсь, когда другие люди не считаются с моим мнением.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (17, "Когда я общаюсь с другими людьми, они без труда могут заметить мое волнение.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (18, "Обычно я не знаю, как поддержать человека, когда он плачет.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (19, "Обычно я способен определяет душевное состояние человека без слов.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (20, "Когда я испытываю отрицательные эмоции, то предпочитаю подождать, пока они сами пройдут.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (21, "Бывает, что я что-то обещаю, а потом забываю об этом.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (22, "Иногда то, что я чувствую, словами не передать.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (23, "Иногда люди обижаются, когда я высказываю свои замечания или критику в их адрес.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (24, "Бывает, что мне не удается сдержать вспышку гнева.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (25, "Мои знакомые всегда обращаются ко мне, когда им нужна поддержка.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (26, "Я не всегда замечаю, если близкий человек переживает, особенно если он (она) пытается это скрыть.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (27, "Я не считаю нужным менять свою жизнь. Меня всё устраивает.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (28, "Я могу обмануть в собственных интересах.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (29, "Иногда я могу беспокоиться без видимой причины.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (30, "Обычно другие люди обижаются на мои замечания или критику в их адрес.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (31, "Если меня ждет трудное дело, я буду сильно тревожиться о том, смогу ли я справиться.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (32, "Обычно я знаю, как успокоить встревоженного человека.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (33, "Бывает, увлекшись разговором, я не сразу замечаю, что общение со мной кому-то неприятно.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (34, "Когда у меня появляется состояние грусти, я начинаю искать причины этого.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (35, "Бывает, что я говорю о вещах, в которых не разбираюсь.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (36, "Я легко могу объяснить другому человеку свои эмоции и чувства.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (37, "Бывает, что, пережив неприятные события, я долго не могу уснуть.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (38, "В экстремальной ситуации я могу усилием воли «взять себя в руки».", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (39, "Я склонен сочувствовать и сопереживать другим людям.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (40, "Если человек пытается скрыть эмоцию, я замечаю это.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (41, "Для злости на другого человека всегда должна быть причина.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (42, "Бывает, что я откладываю на потом выполнение срочных дел.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (43, "Иногда я испытываю страх, не осознавая причины.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (44, "Бывает, что свой гнев и злость я переношу на окружающих.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (45, "Бывает, что я не могу приступить к делу из-за страха и сомнений.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (46, "Я стараюсь не вступать в конфликты, потому что не знаю, как их эффективно разрешать.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (47, "Я сразу замечаю, когда собеседник испытывает скуку в общении.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (48, "Когда я чего-то боюсь, то всегда ищу способы избавления от страха.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (49, "Не все мои знакомые мне нравятся.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (50, "Иногда я переживаю негативные эмоции, не понимая из-за чего.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (51, "Если я в плохом настроении, ко мне лучше не подходить, могу не сдержаться и резко ответить.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (52, "Бывает, что страх или тревога мешает мне вовремя закончить начатое дело.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (53, "Разговаривая с людьми не важно, в какой форме доносить свои мысли, главное содержание. Кому надо, тот поймет.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (54, "Я могу определить причину раздражения и злости другого человека, даже если он не говорит об этом.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (55, "В жизни не обязательно разбираться в собственных чувствах, важнее быть рассудительным.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (56, "В игре я предпочитаю выигрывать.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (57, "Если человек меня раздражает, я могу точно выделить, что именно мне в нем неприятно.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (58, "Если тема общения мне неприятна, я могу легко сказать об этом собеседнику.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (59, "Когда я раздражен, то обычно не сдерживаюсь, и могу наговорить резких слов.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (60, "Я предпочитаю промолчать, если меня что-то не устраивает в общении с другими людьми.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (61, "Я, чаще всего, могу понять, когда человек врет.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (62, "Понимание своих чувств помогает мне добиваться успеха в жизни.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (63, "Бывали случаи, когда я обсуждал кого-то за его спиной.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (64, "Если я чувствую зависть или ревность, то могу легко себе признаться в этом.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (65, "Бывает, на душе «кошки скребут», а сказать об этом не могу.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (66, "Когда на меня кто-то пытается «надавить», я начинаю беспокоиться.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (67, "Бывает, что я невнимательно слушаю собеседника.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (68, "Я могу определить отношение человека ко мне, лишь взглянув на него.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (69, "Чтобы добиться успеха, надо больше прислушиваться к голосу разума, а не сердца.", 6);
insert into refresh_asks (ask_id, ask_text, block_id) values (70, "Бывали случаи, когда я приходил куда-то и забывал, зачем пришел.", 6);

insert into refresh_asks (ask_id, ask_text, block_id) values (1, "Вы предпочитаете не входить в комнату, где собрались люди, один, полагая, что ваше появление обязательно заметят.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (2, "Ваши знакомые говорят про вас, что вы за словом в карман не полезете.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (3, "Вы не особо тревожитесь, если у вас что-то не получается с первого раза.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (4, "Вы чувствуете себя неловко, если окружающие почему-то начинают обращать на вас внимание.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (5, "Вы легко «вливаетесь» в новый рабочий коллектив.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (6, "Иногда вам в голову приходят такие нехорошие мысли, что лучше о них никому не рассказывать.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (7, "Если вы не знаете, что ответить, предпочитаете промолчать.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (8, "Вас не легко смутить.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (9, "Вы считаете, что любую неловкую ситуацию лучше всего «разрядить» шуткой.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (10, "Бывали случаи, что вы не выполняли своих обещаний.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (11, "Вы легко можете поддержать беседу, даже если тема разговора вам мало знакома.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (12, "Обычно вы решительны и действуете быстро.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (13, "Если вы попали в неловкую ситуацию, позже легко забываете о ней.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (14, "Иногда вы можете обмануть.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (15, "Вы без труда подбираете нужные слова, когда вас о чем-то спрашивают. ", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (16, "Когда вы чего-то боитесь, у вас пересыхает во рту, дрожат руки и ноги. ", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (17, "Вам трудно открыть свои чувства другому человеку.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (18, "Бывает, что вы говорите о вещах, в которых не разбираетесь.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (19, "Обычно вам трудно возражать своим знакомым.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (20, "Вы склонны раз за разом мысленно возвращаться к пережитым неприятным моментам в жизни.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (21, "Вас легко застать врасплох неожиданным вопросом.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (22, "Вы любите быть в центре внимания даже в незнакомой компании.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (23, "Если этого требуют обстоятельства, ты вы можете изменить свое поведение.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (24, "Бывает, что вы откладываете на завтра то, что должны были сделать сегодня.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (25, "При желании вы могли бы стать хорошим радиоведущим. ", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (26, "Вы робеете при выступлении перед большой аудиторией. ", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (27, "Вы можете открыто выражать собственные чувства", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (28, "Иногда вы можете вначале сказать, а потом подумать.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (29, "Вы обычно не знаете, куда деться при встрече с человеком, который был в компании, где вы вели себя неловко.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (30, "Вы считаете, что не всех людей следует принимать такими, какие они есть.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (31, "Если вам не грозит штраф, и машин поблизости нет, вы можете перейти улицу там, где вам хочется, а не там, где положено.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (32, "Вы не любите неожиданные вопросы, потому что часто не знаете, как на них отвечать.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (33, "Даже после длительных рассуждений по важным вопросам вы можете сомневаться в правильности принятого решения.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (34, "Вы к каждому человеку ищите свой подход.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (35, "В беседе вы легко можете переходить от одной темы к другой.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (36, "Ваш девиз: «Ввяжемся в бой, а там посмотрим!»", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (37, "У вас определенно развиты актерские способности.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (38, "В игре вы предпочитаете выигрывать.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (39, "Прежде чем что-то ответить, вам необходимо тщательно обдумать свой ответ.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (40, "Вы легко знакомитесь с людьми, оказавшись в новой обстановке (вечеринка, новая работа, спортивная секция и т.д.).", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (41, "Вы откажетесь, если от вас требуют услугу, которая может принести вам неприятность.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (42, "У вас всегда найдется пара интересных историй, чтобы поддержать разговор.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (43, "Вам легко понять потребности и желания окружающих Вас людей.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (44, "Принимая решение, вы всегда с кем-нибудь советуетесь.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (45, "Среди ваших знакомых есть люди, которые вам не нравятся. ", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (46, "На любой вопрос у вас всегда найдется подходящий ответ. ", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (47, "Для вас очень важно, что о вас думают окружающие. ", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (48, "Вы легко переключаетесь от одной задачи к другой.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (49, "Прежде чем ответить на вопрос, вам необходимо взять паузу.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (50, "Бывает, что вы с кем-нибудь сплетничаете.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (51, "Вы предпочитаете стабильность, ведь перемены непредсказуемы.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (52, "Вам всегда есть, что сказать, не зависимо от темы разговора.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (53, "Иногда вы можете рассердиться.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (54, "Вы легко можете поменять свое мнение, если оппонент начнет возражать.", 7);
insert into refresh_asks (ask_id, ask_text, block_id) values (55, "Вы меняете свое поведение, подстраиваясь под настроение собеседника.", 7);

insert into refresh_asks (ask_id, ask_text, block_id) values (1, "Семья человека – самая важная вещь в жизни.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (2, "Я редко ощущаю страх или нервозность, даже если со мной должно случиться что-нибудь плохое", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (3, "Я стараюсь изо всех сил, чтобы получить то, что хочу.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (4, "Когда мне что-то хорошо удается, мне хочется это продолжить.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (5, "Я всегда хочу попробовать что-нибудь новенькое, если думаю, что будет весело.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (6, "Для меня важно как я одеваюсь.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (7, "Когда я получаю то, что хочу, я чувствую возбуждение и прилив энергии.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (8, "Критика или брань сильно задевают меня.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (9, "Если я чего-то хочу, я обычно выкладываюсь на все сто чтобы это получить.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (10, "Я часто делаю что-нибудь только потому, что это может меня развлечь.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (11, "Мне трудно найти время, чтобы сделать обычные вещи, например, подстричься.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (12, "Если я вижу возможность получить то, что хочу, я тут же хватаюсь за нее.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (13, "Если я думаю или знаю, что кто-то злится на меня, я сильно расстраиваюсь и беспокоюсь.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (14, "Если я вижу возможность осуществить то, что мне хочется, я сразу возбуждаюсь.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (15, "Я часто действую под влиянием момента.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (16, "Если я думаю, что должно случиться что-то неприятное, я начинаю сильно нервничать.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (17, "Я часто удивляюсь, почему люди действуют таким образом.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (18, "Если со мной случается что-то хорошее, это сильно на меня действует.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (19, "Я беспокоюсь, когда думаю, что сделал(а) плохо что-нибудь важное.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (20, "Я обожаю новые ощущения и то, что меня возбуждает.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (21, "Когда я стремлюсь к чему-то, для меня нет запрещенных приемов.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (22, "По сравнению с моими друзьями у меня очень мало страхов.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (23, "Победа в споре или соревновании меня бы стимулировала.", 8);
insert into refresh_asks (ask_id, ask_text, block_id) values (24, "Я беспокоюсь о том, чтобы не сделать ошибок.", 8);

insert into refresh_asks (ask_id, ask_text, block_id) values (1, "Чтобы принять решение, необходимо проанализировать все факты.|Для принятия решения минимального количества информации вполне достаточно. ", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (2, "Принимая решение, я редко задумываюсь о последствиях.|При принятии решений я продумываю и близкие, и отдаленные последствия. ", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (3, "В повествовании важно конкретно и образно описать все подробности.|Рассказывая о чем-либо, достаточно передавать лишь общую суть.", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (4, "Бывает, я могу планировать что-либо и действовать, забыв о цели. |Обычно, я не забываю цели составленных мной планов.", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (5, "Размышляя о будущее, я обычно задумываюсь, почему я представил его именно таким.|«Заглянув в будущем», я не ищу источники знаний о том, почему оно такое, а не иное.", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (6, "Устанавливая связи между знакомым и незнакомым, старым и новым я чаще вижу не более одной связующей линии.|При сравнении старого и нового, знакомого и незнакомого мне удается найти несколько связующих их линий.", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (7, "У способного человека больше времени для развлечений. |У способного человека больше шансов на успех в деле.", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (8, "Я предпочитаю решать любую задачу поэтапно, проверяя верность каждого пройденного этапа.|В любой проблеме я ищу общий подход к её решению, прикидываю его верность, а потом действую.", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (9, "Обычно устанавливая причинно-следственные связи, я вижу несколько вариантов развития событий.|Задумываясь о последствиях, я вижу, как они выстраиваются в одну цепочку, вытекая одно из другого.", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (10, "Для подтверждения предположения мне достаточно 1-2 фактов.|Для подтверждения предположения я ищу все возможные доказательства.", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (11, "Мне не известна «Игра воображения», я не могу из знакомых образов создать новые причудливые комбинации.|Моё воображение часто «играет», создавая новые затейливые комбинации из знакомых образов.", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (12, "Я легко могу полно и всестороннее проанализировать причины и следствия любой ситуации.|Оценивая проблему, ситуацию и т.п., обычно я провожу глубокий односторонний анализ.", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (13, "Задумываясь о последствиях событий и поступков, я обычно учитываю все вызывающие их причины.|Я, как правило, не ищу причины известных мне последствий событий и поступков. ", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (14, "Для подтверждения верности причинно-следственных связей достаточно привести один хороший пример.|Причинно-следственные связи нельзя доказать единичными примерами. ", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (15, "При необходимости я легко могу  переформулировать свою неверную  гипотезу (предположение).|Если я уже сформулировал какую-то гипотезу (предположение), то заменить её новой – для меня сложная задача.", 9);
insert into refresh_asks (ask_id, ask_text, block_id) values (16, "Решая задачи или оценивая других людей, я предпочитаю пользоваться готовыми шаблонами.|При решении задач или оценке других людей я предпочитаю каждый раз новый (не стереотипный) подход.", 9);
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

app.post("/user_register", jsonParser, (req, res) => {
    pool.query("insert into refresh_users (user_name, phone_number, employer_code, ask_id, block_id, fineshed, non_anxiety, slight_anxiety, medium_anxiety, high_anxiety, _never, _sometimes, _often, _always, introvert, extravert, energy_work, energy_talk, switching_work, switching_talk, speed_work, speed_contacting, emotional_event, emotional_talk, lie_scale, k, ot, internal_reference, external_reference, activity, reflection, opportunities, procedures, common, details, myself, another, _system, association, dissociation, similarity, similarity_with_difference, differences, ak, c, ns, pd, ass, sor, amb, ps, introspection, expressions, self_control, communication, understanding_other_emotions, self_development, lie_scale_2, confidence_scale, adaptive_scale, spontaneous_scale, suppression_of_behavior, getting_pleasure, achievements_of_goals, encouragement, forecast_level, lie_scale_3, bad_finished) values (?, ?, ?, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)", [req.body.user_name, req.body.phone_number, req.body.employer_code], (err, result) => {
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
                                if (req.session.block_id == 1) {
                                    if (req.session.ask_id <= 24) {
                                        res.render(`test_page_${req.session.block_id}_1.hbs`, {
                                            layout: "/layouts/test_layout",
                                            ask_info: ask[0],
                                            ask_main_text: "Какой у Вас была (бы) тревога, когда (если бы) Вам надо было или Вы могли "
                                        })
                                    } else {
                                        res.render(`test_page_${req.session.block_id}_2.hbs`, {
                                            layout: "/layouts/test_layout",
                                            ask_info: ask[0],
                                            ask_main_text: "До какой степени вы избегаете или избегали бы такого рода ситуации, когда (если бы) Вам надо было или Вы могли "
                                        })
                                    }
                                } else if (req.session.block_id == 2) {
                                    if (req.session.ask_id <= 14) {
                                        res.render(`test_page_${req.session.block_id}_1.hbs`, {
                                            layout: "/layouts/test_layout",
                                            ask_info: ask[0],
                                            ask_main_text: "В зависимости от того, согласны ли вы с утверждениями, представленными ниже, ответьте «Да» или «Нет»."
                                        })
                                    } else {
                                        res.render(`test_page_${req.session.block_id}_2.hbs`, {
                                            layout: "/layouts/test_layout",
                                            ask_info: ask[0],
                                            ask_main_text: "В зависимости от того, согласны ли вы с утверждениями, представленными ниже, ответьте «Да» или «Нет»."
                                        })
                                    }
                                } else if (req.session.block_id == 7) {
                                    res.render(`test_page_${req.session.block_id}.hbs`, {
                                        layout: "/layouts/test_layout",
                                        ask_info: ask[0],
                                        ask_main_text: "Внимательно прочтите предложения, описывающие реакции на некоторые ситуации. Каждое из них вы должны оценить как верное или неверное применительно к себе. "
                                    })
                                } else if (req.session.block_id == 8) {
                                    res.render(`test_page_${req.session.block_id}.hbs`, {
                                        layout: "/layouts/test_layout",
                                        ask_info: ask[0],
                                        ask_main_text: "Укажите, в какой степени Вы согласны или не согласны с утверждениями."
                                    })
                                } else if (req.session.block_id == 9) {
                                    res.render(`test_page_${req.session.block_id}.hbs`, {
                                        layout: "/layouts/test_layout",
                                        ask_info: ask[0],
                                        ask_main_text: "Внимательно прочитайте и отметьте  то, что соответствует вашей точке зрения.",
                                        answer_1: String(ask[0].ask_text).split("|")[0],
                                        answer_2: String(ask[0].ask_text).split("|")[1]
                                    })
                                } 
                                else {
                                    res.render(`test_page_${req.session.block_id}.hbs`, {
                                        layout: "/layouts/test_layout",
                                        ask_info: ask[0],
                                        ask_main_text: "В зависимости от того, согласны ли вы с утверждениями, представленными ниже, ответьте «Да» или «Нет»."
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
                    if (user[0].lie_scale > 3) {
                        res.redirect("/mid_result_restart")
                    } else {
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