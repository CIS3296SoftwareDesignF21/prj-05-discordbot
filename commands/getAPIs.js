require('dotenv').config();
const CANVAS_API_DOMAIN = process.env.CANVAS_API_DOMAIN;
const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;

function getSelf(token, domain) {
	console.log('running getself');
	const https = require('https');
	return new Promise((resolve, reject) => {
		const options = {
			hostname: domain,
			port: 443,
			path: '/api/v1/users/self/profile',
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + token,
			},
		};
		https.get(options, response => {
			let result = '';
			response.on('data', chunk => {
				result += chunk;
			});
			response.on('end', () => {
				resolve(result);
			});
			response.on('error', error => {
				reject('Error => ' + error);
			});
		});
	});
}

function getCourses(token, domain, state) {
	console.log('running getCourses');

	const https = require('https');
	return new Promise((resolve, reject) => {
		let options = {
			hostname: domain,
			port: 443,
			path: '/api/v1/courses',
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + token,
			},
		};
		if (state !== null) {
			if (state === 'active' || state === 'completed') {
				options = {
					hostname: domain,
					port: 443,
					path: '/api/v1/courses?enrollment_state=' + state,
					method: 'GET',
					headers: {
						'Authorization': 'Bearer ' + token,
					},
				};
			}
			else {	reject('Wrong state. Pick either one => active/comepleted.');	}
		}
		console.log(' ' + options.path);
		https.get(options, response => {
			let result = '';
			response.on('data', chunk => {
				result += chunk;
			});
			response.on('end', () => {
				resolve(result);
			});
			response.on('error', error => {
				reject(error);
			});
		});
	});
}

module.exports = { getSelf, getCourses };

/* getSelf()
	.then((response) => {
		let js = JSON.parse(response)
		console.log(js.name);
	})
	.catch(error => {
		console.log('Error => ' + error);
	});
console.log('done'); */
