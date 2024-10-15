const {
	createCertificate,
	getCertificate,
	updateCertificate,
	getCertificateDetails,
} = require('../Controller');

const certificate = require('express').Router();

certificate.post('/certificate', createCertificate);
certificate.get('/certificate', getCertificate);
certificate.put('/certificate', updateCertificate);
certificate.get('/certificate/:certificateCode', getCertificateDetails);

module.exports = certificate;
