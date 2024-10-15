(async () => {
	try {
		const connect = require('./connect');
		const Routes = require('./Routes');
		const express = require('express');
		const app = express();

		app.use(express.json());
		connect();
		Routes(app);

		app.listen(3000);
	} catch (error) {
		console.log(error?.message);
	}
})();
