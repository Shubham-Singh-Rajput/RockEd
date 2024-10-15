const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
	certificateCode: String,
	name: String,
	issuer: String,
	overView: String,
	startDate: String,
	duration: Number,
	type: String,
});

const certificateDb = mongoose.model('certificate', certificateSchema);

module.exports = certificateDb;
