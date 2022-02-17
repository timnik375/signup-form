const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Users = require('./models/User');
const {body, checkSchema, validationResult} = require('express-validator');

const PORT = process.env.PORT || 1604;

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));


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

	const users = new Users({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		gender: req.body.gender,
		telephone: req.body.telephone,
		email: req.body.email,
		password: req.body.password
	})

	await users.save();

	return res.status(200).json({ok: 'ok'});
})

app.post('/sign-in', async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	Users.findOne({email: email, password: password}, function (err, user) {
		if (!user) {
			return res.status(200).json({
				errors: 'Use correct data'
			});
		} else {
			return res.status(200).json({ok: 'ok'});
		}
	});
})


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
