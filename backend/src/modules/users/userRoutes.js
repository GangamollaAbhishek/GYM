const express = require('express');
const router = express.Router();
const userController = require('./userController');
const { authenticateToken, authorizeRoles } = require('../../middleware/authMiddleware');

const { ROLES } = require('../../constants/roles');

router.get('/', authenticateToken, authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.TRAINER), userController.getAllUsers);
router.post('/', authenticateToken, authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.RECEPTIONIST), userController.createUser);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMIN), userController.deleteUser);

module.exports = router;
