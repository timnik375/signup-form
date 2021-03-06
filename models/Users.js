const {Schema, model} = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const schema = new Schema({
	firstName: {
		type: String,
		// required: true
	},
	lastName: {
		type: String,
		// required: true
	},
	gender: {
		type: String,
	},
	telephone: {
		type: String,
		// required: true
	},
	email: {
		type: String,
		// required: true
	},
	password: {
		type: String,
		// required: true
	}
})

schema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = model('Users', schema);
