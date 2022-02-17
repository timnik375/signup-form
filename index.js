const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Users = require('./models/Users');
const {body, checkSchema, validationResult} = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session')
const methodOverride = require('method-override');
const flash = require('express-flash')

const PORT = process.env.PORT || 1604;

const app = express();

app.set('view engine', 'ejs')


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(flash());
app.use(session({
	secret: 'Secret',
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

passport.use(Users.createStrategy());
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());


const registrationSchema = {
	firstName: {
		notEmpty: true,
		errorMessage: "First name cannot be empty"
	},
	lastName: {
		notEmpty: true,
		errorMessage: "Last name cannot be empty"
	},
	gender: {
		notEmpty: true,
		errorMessage: "Gender field cannot be empty"
	},
	password: {
		isLength: {
			options: {
				min: 8
			},
			errorMessage: 'Password should be at least 8 chars long'
		}
	},
	confirmPassword: {
		custom: {
			options: (value, {req}) => {
				if (value !== req.body.password) {
					throw new Error('Password confirmation does not match password');
				}

				return true;
			}
		}
	},
	telephone: {
		isMobilePhone: true,
		errorMessage: "Please use correct phone number"
	},
	email: {
		isEmail: true,
		errorMessage: "Please enter correct email",
		normalizeEmail: true,
		custom: {
			options: value => {
				return Users.find({
					email: value
				}).then(user => {
					if (user.length > 0) {
						return Promise.reject('Email address already taken')
					}
				})
			}
		}
	}
}

app.post('/sign-up', checkSchema(registrationSchema), async function(req,res){
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(200).json({
			errors: errors.array()
		})
	};

	Users.register(({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		gender: req.body.gender,
		telephone: req.body.telephone,
		email: req.body.email
	}), req.body.password,
		function (err, user) {
		if (err) {
			res.redirect('/register')
		}
		passport.authenticate('local')(req, res, function(){
			res.redirect('/')
		})
	})
})

app.post('/sign-in', checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/register',
	failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
	res.render('register.ejs')
})


app.get('/', checkAuthenticated, (req, res) => {
	res.render('index.ejs')
})

app.delete('/logout', (req, res) => {
	req.logOut()
	res.redirect('/register')
})

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	} else {
		res.redirect('/register')
	}
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('index')
	}
	next()
}

async function start() {
	try {
		await mongoose.connect('mongodb+srv://timnik375:admin@cluster0.b1dgi.mongodb.net/users', {
			useNewUrlParser: true
		})

		app.listen(PORT, () => {
			console.log('Server has been started...')
		})
	} catch (e) {
		console.log(e);
	}
}

start();
