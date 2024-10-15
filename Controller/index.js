const {
	createCertificate,
	getCertificate,
	updateCertificate,
	getCertificateDetails,
} = require('./certificate');
const {enroll, getAllCertrificate} = require('./user');

const certificate = {
	createCertificate,
	getCertificate,
	updateCertificate,
	getCertificateDetails,
};

const users = {
	enroll,
	getAllCertrificate,
};

module.exports = {
	...certificate,
	...users,
};
