const canvasAPI = require('node-canvas-api');

canvasAPI.getSelf().then(function(user) {
  console.log(user);
  canvasAPI.getCoursesByUser(user.id).then(function(course) {
    console.log(course);
  });
});
