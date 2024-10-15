const certificate = require('./certificate');
const user = require('./Users');

module.exports = (app) => {
	app.use(certificate);
	app.use(user);
};
