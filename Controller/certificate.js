const {certificateDb} = require('../Model');
const createCertificate = async (req, resp) => {
	try {
		const {certificateCode, name, issuer, overView, startDate, duration, type} =
			req.body;

		const checkCertificate = await certificateDb.findOne({
			certificateCode,
		});

		if (checkCertificate) {
			return resp.json({
				message: `certificateCode already exist in Db ${certificateCode}`,
			});
		}

		const newCertificate = await certificateDb.create({
			certificateCode,
			name,
			issuer,
			overView,
			startDate,
			duration,
			type: type || 'save',
		});
		return resp.json({
			message: 'certificate Created Successfully',
			newCertificate,
		});
	} catch (error) {
		console.log(error.message);
		return resp.json({
			message: 'Internal Server Error',
		});
	}
};

const getCertificate = async (req, resp) => {
	try {
		let {limit, round, startDate, endDate, field} = req.query;

		limit = Number(limit) || 10;
		skip = limit * Number(round) || 0;

		const certrificateList = await certificateDb
			.find({})
			.sort({[field]: 1})
			.skip(skip)
			.limit(limit);

		let modifiCertificateList = certrificateList.map((certrificate) => {
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
			return {
				startDate: new Date(certrificate.startDate),
				endDate: new Date(endDate),
				certificateCode: certrificate.certificateCode,
				name: certrificate.name,
				issuer: certrificate.issuer,
				overView: certrificate.overView,
				status: status || certrificate.type,
			};
		});

		if (startDate && endDate) {
			modifiCertificateList = modifiCertificateList.filter((item) => {
				startDate = new Date(startDate);
				endDate = new Date(endDate);
				if (startDate >= item.startDate && endDate >= item.endDate) {
					return item;
				}
			});
		}
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

const updateCertificate = async (req, resp) => {
	try {
		let {certificateCode, name, issuer, overView, startDate, duration, type} =
			req.body;

		const checkCertificate = await certificateDb.findOne({
			certificateCode,
		});

		name = name || checkCertificate.name;
		issuer = issuer || checkCertificate.issuer;
		overView = overView || checkCertificate.overView;
		startDate = startDate || checkCertificate.startDate;
		duration = duration || checkCertificate.duration;
		type = type || checkCertificate.type;

		if (!checkCertificate) {
			return resp.json({
				message: `certrificate is not present in Db In DB ${certificateCode}`,
			});
		}

		if (checkCertificate.type != 'save') {
			return resp.json({
				message: `certrificate Is already Published ${certificateCode}`,
			});
		}

		const update = await certificateDb.findOneAndUpdate(
			{certificateCode},
			{
				name,
				issuer,
				overView,
				startDate,
				duration,
				type,
			},
			{new: true}
		);
		return resp.json({
			message: 'certificate Updated  Successfully',
			update,
		});
	} catch (error) {
		console.log(error.message);
		return resp.json({
			message: 'Internal Server Error',
		});
	}
};

const getCertificateDetails = async (req, resp) => {
	try {
		const {certificateCode} = req.params;

		const certrificate = await certificateDb.findOne({
			certificateCode,
		});

		if (!certrificate) {
			return resp.json({
				message: `certificateCode not Present in Db ${certificateCode}`,
			});
		}
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
		return resp.json({
			startDate: new Date(certrificate.startDate),
			endDate: new Date(endDate),
			certificateCode: certrificate.certificateCode,
			name: certrificate.name,
			issuer: certrificate.issuer,
			overView: certrificate.overView,
			status: status || certrificate.type,
		});
	} catch (error) {
		console.log(error.message);
		return resp.json({
			message: 'Internal Server Error',
		});
	}
};

module.exports = {
	createCertificate,
	getCertificate,
	updateCertificate,
	getCertificateDetails,
};

// sample input from frontend for createCertificate and updateCertificate
// {
//     "certificateCode":"React_1_3",
//     "name":"First React ",
//     "issuer":"Some XYZ",
//     "overView":"For Test only",
//     "startDate":"Tue Oct 15 2024 11:28:55 GMT+0530",
//     "duration":2,
//     "type":"publish"
// }

//for get  getCertificateDetails
// React_1_3 is certificateCode
// http://localhost:3000/certificate/React_1_3

// for getCertificate

// api will be

// http://localhost:3000/certificate/?limit=50&round=0&startDate=Tue Oct 15 2024 11:28:55 GMT+0530&endDate=Tue Oct 15 2025 11:28:55 GMT+0530&field=certificateCode
