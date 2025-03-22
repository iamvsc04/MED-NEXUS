const express = require('express');
const router = express.Router();
const { markNotificationAsRead, sendVideoCallNotification } = require('../../Controllers/notificationController');

// Mark Notification as Read
router.post('/api/notifications/:id/mark-as-read', markNotificationAsRead);

// Start Video Call and Notify Patient
router.post('/api/start-call', sendVideoCallNotification);

module.exports = router;
