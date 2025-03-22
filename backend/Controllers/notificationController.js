const NotificationModel = require("../Models/NotificationModel");

// Get notifications for the user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await NotificationModel.find({ userId, markAsRead: false });
    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(400).json(error);
  }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await NotificationModel.findById(notificationId);

    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    notification.markAsRead = true;
    await notification.save();
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Send video call notification
const sendVideoCallNotification = async (req, res) => {
  const { roomId, patientId, doctorId, appointmentId } = req.body;

  try {
    const notification = new NotificationModel({
      userId: patientId,
      doctorId,
      appointmentId,
      message: `Your doctor has started a video call. Click to join.`,
      link: `/video/${roomId}?role=patient`, 
    });

    await notification.save();
    res.status(200).json({ message: 'Notification sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = { getNotifications, markNotificationAsRead, sendVideoCallNotification };
