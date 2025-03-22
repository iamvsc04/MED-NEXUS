import React, { useEffect, useState } from "react";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:3000/allNotifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setNotifications(data.notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Handle clicking Join Call
  const handleJoinCall = (notification) => {
    if (notification.link) {
      const fullUrl = `http://localhost:5173${notification.link}`;
      console.log("Notification Link:", notification.link);
      window.open(fullUrl, "_blank"); // Open video call in a new tab
    }
  };

  // Handle Mark as Read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await fetch(`http://localhost:3000/api/notifications/${notificationId}/mark-as-read`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
      alert('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification._id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
            <p>{notification.message}</p>


            <button onClick={() => handleJoinCall(notification)} style={{ marginRight: '10px' }}>
              Join Video Call
              </button>
            <button onClick={() => handleMarkAsRead(notification._id)}>Mark as Read</button>
          </div>
        ))
      ) : (
        <p>No notifications available</p>
      )}
    </div>
  );
};

export default NotificationComponent;
