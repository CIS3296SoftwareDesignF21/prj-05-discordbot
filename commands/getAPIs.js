require('dotenv').config();
const CANVAS_API_DOMAIN = process.env.CANVAS_API_DOMAIN;
const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;

function getSelf() {
	console.log('running getself');
	const https = require('https');
	return new Promise((resolve, reject) => {
		const options = {
			hostname: CANVAS_API_DOMAIN,
			port: 443,
			path: '/api/v1/users/self/profile',
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + CANVAS_API_TOKEN,
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

function getCourses(state) {
	console.log('running getCourses => state: ' + state);

	const https = require('https');
	return new Promise((resolve, reject) => {
		let options = {
			hostname: CANVAS_API_DOMAIN,
			port: 443,
			path: '/api/v1/courses',
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + CANVAS_API_TOKEN,
			},
		};
		if (state !== undefined) {
			if (state !== null) {
				if (state === 'active' || state === 'completed') {
					options = {
						hostname: CANVAS_API_DOMAIN,
						port: 443,
						path: '/api/v1/courses?enrollment_state=' + state,
						method: 'GET',
						headers: {
							'Authorization': 'Bearer ' + CANVAS_API_TOKEN,
						},
					};
				}
				else { reject('Wrong state. Pick either one => active/comepleted.'); }
			}
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

function getAssignments(course_id, type) {
	console.log('running getAssignments => course_id: ' + course_id + ', type: ' + type);
	const https = require ('https');

	return new Promise((resolve, reject) => {
		// only allow command to be used with course id specified as an argument
		const options = {
			hostname: CANVAS_API_DOMAIN,
			port: 443,
			path: '/api/v1/courses/' + course_id + '/assignments?order_by=due_at' + '&bucket=' + type,
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + CANVAS_API_TOKEN,
			},
		};

		https.get(options, response => {
			let result = '';
			response.on('data', chunk => {
				result += chunk;
				// console.log(chunk.toString());
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

function getActivityStream(state) {
	console.log('running getActivityStream');
	console.log('state : = > ' + state);
	const https = require('https');
	return new Promise((resolve, reject) => {
		let options = {
			hostname: CANVAS_API_DOMAIN,
			port: 443,
			path: '/api/v1/users/self/activity_stream',
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + CANVAS_API_TOKEN,
			},
		};
		if (state) {
			options = {
				hostname: CANVAS_API_DOMAIN,
				port: 443,
				path: '/api/v1/courses?only_active_courses=' + state,
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + CANVAS_API_TOKEN,
				},
			};
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


/* getActivityStream().then(response => console.log(JSON.parse(response)))
	.catch(error => console.log(error)) */

/* getCourses("active").then(response => console.log(JSON.parse(response)))
	.catch(error => console.log(error)) */


module.exports = { getSelf, getCourses, getAssignments };

/* getSelf()
	.then((response) => {
		let js = JSON.parse(response)
		console.log(js.name);
	})
	.catch(error => {
		console.log('Error => ' + error);
	});
console.log('done'); */

