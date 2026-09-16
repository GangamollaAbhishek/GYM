const gymRoutes = require('./gymRoutes');
const attendanceController = require('./controllers/gymAttendanceController');
const membershipController = require('./controllers/gymMembershipController');
const trainerController = require('./controllers/gymTrainerController');

module.exports = {
  gymRoutes,
  attendanceController,
  membershipController,
  trainerController,
};
