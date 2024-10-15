const mongoose = require('mongoose');

const connect = () => {
	try {
		mongoose.connect('mongodb://localhost:27017/test', {});
		console.log('connected');
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = connect;
