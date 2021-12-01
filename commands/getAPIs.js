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

		const options = {
			hostname: CANVAS_API_DOMAIN,
			port: 443,
			path: '/api/v1/courses?enrollment_state=' + state + '&per_page=100',
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + CANVAS_API_TOKEN,
			},
		};

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

function getCourseSummary(id) {
	console.log('running getCourseSummary');
	const https = require('https');
	return new Promise((resolve, reject) => {
		let options = {
			hostname: CANVAS_API_DOMAIN,
			port: 443,
			path: '/api/v1/courses/' + id + '/activity_stream/summary',
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + CANVAS_API_TOKEN,
			},
		};
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
	console.log('running getAssignments => course_id: ' + course_id + ', type: ' + type + '&per_page=100');
	const https = require ('https');

	return new Promise((resolve, reject) => {
		// only allow command to be used with course id specified as an argument
		const options = {
			hostname: CANVAS_API_DOMAIN,
			port: 443,
			path: '/api/v1/courses/' + course_id + '/assignments?order_by=due_at' + '&bucket=' + type + '&per_page=100',
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

function getTodo(id) {
	console.log('running getTodo');
	const https = require('https');
	return new Promise((resolve, reject) => {
		let options = {
			hostname: CANVAS_API_DOMAIN,
			port: 443,
			path: '/api/v1/users/self/todo',
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + CANVAS_API_TOKEN,
			},
		};
		if(id !== undefined){
			options = {
				hostname: CANVAS_API_DOMAIN,
				port: 443,
				path: '/api/v1/courses/'+id+'/todo',
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

/* getCourses("active").then(response => console.log(JSON.parse(response)))
	.catch(error => console.log(error)) */

module.exports = { getSelf, getCourses, getCourseSummary, getTodo, getAsssignments };
