import React from 'react'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react';

const PatientDashboard = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  return (
    <div>
      {notifications.map(notification => (
        <div key={notification._id}>
          <p>{notification.message}</p>
          <a href={notification.link} target="_blank" rel="noopener noreferrer">Join Call</a>
        </div>
      ))}
    </div>
  );
};

export default PatientDashboard;
