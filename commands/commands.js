require('dotenv').config();
const CANVAS_API_DOMAIN = process.env.CANVAS_API_DOMAIN;
const CANVAS_KEY = process.env.CANVAS_API_TOKEN;

function getSelf() {
	console.log("running getself");
	const https = require('https');
	return new Promise((resolve, reject) => {
		const options = {
			hostname: CANVAS_API_DOMAIN,
			port: 443,
			path: '/api/v1/users/self',
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + CANVAS_API_TOKEN,
			},
		};
		https.get(options, response => {
			let result = ''
			response.on('data', chunk => {
				result += chunk
			})
			response.on('end', () => {
				resolve(result)
			})
			response.on('error', error => {
				reject('Error => ' + error)
			})
		})
	});
}

module.exports = {
	getSelf: getSelf()
}

/* getSelf()
	.then((response) => {
		let js = JSON.parse(response)
		console.log(js.name);
		
	})
	.catch(error => {
		console.log('Error => ' + error);
	});
    
console.log('done'); */

