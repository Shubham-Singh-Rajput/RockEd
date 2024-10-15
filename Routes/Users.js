const {enroll, getAllCertrificate} = require('../Controller');

const user = require('express').Router();

user.post('/enroll', enroll);
user.get('/enroll/:email', getAllCertrificate);

module.exports = user;
