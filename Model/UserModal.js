const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	certificateCode: String,
	email: String,
});

const userDb = mongoose.model('user', userSchema);

module.exports = userDb;
