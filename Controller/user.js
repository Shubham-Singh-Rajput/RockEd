const {userDb} = require('../Model');
const {certificateDb} = require('../Model');

const enroll = async (req, resp) => {
	try {
		const {email, certificateCode} = req.body;

		const certificate = await certificateDb.findOne({certificateCode});
		if (!certificate) {
			return resp.send('Please send the valid certificateCode');
		}
		const User = await userDb.findOne({email, certificateCode});
		if (User) {
			return resp.send('User has already enrolled certificateCode');
		}

		const newData = await userDb.create({
			email,
			certificateCode,
		});
		return resp.json({
			message: 'User has enrolled now',
			newData,
		});
	} catch (error) {
		console.log(error.message);
		return resp.json({
			message: 'Internal Server Error',
		});
	}
};

const getAllCertrificate = async (req, resp) => {
	try {
		const {email} = req.params;

		const certrificateList = await certificateDb.find({});
		let modifiCertificateList = await Promise.all(
			certrificateList.map(async (certrificate) => {
				const months = new Date(certrificate.startDate).getMonth();
				let endDate = new Date(certrificate.startDate).setMonth(
					months + certrificate.duration
				);
				let status = '';

				if (
					new Date(endDate) > new Date() &&
					new Date(certrificate.startDate) > new Date()
				) {
					if (certrificate.type == 'save') {
						status = 'draft';
					} else {
						status = 'publish';
					}
				} else if (
					new Date(certrificate.startDate) <= new Date() &&
					new Date(endDate) > new Date()
				) {
					if (certrificate.type == 'save') {
						status = 'draft';
					} else {
						status = 'active';
					}
				} else if (
					new Date(certrificate.startDate) < new Date() &&
					new Date(endDate) < new Date()
				) {
					status = 'expired';
				}

				const User = await userDb.findOne({
					email,
					certificateCode: certrificate.certificateCode,
				});
				return {
					startDate: new Date(certrificate.startDate),
					endDate: new Date(endDate),
					certificateCode: certrificate.certificateCode,
					name: certrificate.name,
					issuer: certrificate.issuer,
					overView: certrificate.overView,
					status: status || certrificate.type,
					userHas: User ? 'enrolled' : 'enroll',
				};
			})
		);

		modifiCertificateList = modifiCertificateList.filter(
			(item) => item.status == 'publish' || item.status == 'active'
		);
		return resp.json({
			modifiCertificateList,
		});
	} catch (error) {
		console.log(error.message);
		return resp.json({
			message: 'Internal Server Error',
		});
	}
};

module.exports = {
	enroll,
	getAllCertrificate,
};

// sample input enroll
// {
//     "certificateCode":"React_1_3",
//     "email":"shubham.singh7705@gmail.con"
// }

// for enroll api will be
// http://localhost:3000/enroll/shubham.singh7705@gmail.con
