/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import Loading from './Loading';
import { Auth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(Auth);
  const nav = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/getAppointments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user}`,
        },
      });
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
    setLoading(false);
  };

  const handleAddPrescription = (id) => {
    nav(`/dashboard/doctor/addPrescription/${id}`);
  };

  const handleMarkAsCompleted = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/markAsCompleted/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user}`,
        },
      });
      if (response.ok) {
        fetchAppointments();
      } else {
        console.error('Failed to mark appointment as completed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const adjustTime = (date, hours, minutes, seconds) => {
    return new Date(date.getTime() - (hours * 3600000 + minutes * 60000 + seconds * 1000));
  };
  
  const handleStartCall = async (appointment) => {
    const currentTime = new Date();
    const appointmentTime = new Date(appointment.startTime);
    const adjustedAppointmentTime = adjustTime(appointmentTime, 5, 25, 39);
  
    if (currentTime < adjustedAppointmentTime) {
      alert('Appointment time not reached yet!');
      return;
    }
  
    const roomId = uuidV4();
  
    try {
      // Notify backend to start the call and store roomId
      const response = await fetch('http://localhost:3000/api/start-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, patientId: appointment.patientId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to start video call');
      }
  
      // Notify patient using the correct roomId
      await fetch('http://localhost:3000/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, patientId: appointment.patientId, doctorId: appointment.doctorId }),
      });
  
      // Open a new tab for the doctor to join with role=doctor
      const videoCallURL = `http://localhost:5173/video/${roomId}?role=doctor`;
      window.open(videoCallURL, "_blank");
    } catch (error) {
      console.error('Error starting call:', error);
      alert("Failed to start video call. Please try again.");
    }
  };  

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Today's Appointments</h1>
      {appointments.length === 0 ? (
        <p>No appointments for today.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="p-4 border rounded shadow-lg bg-white">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Patient: {appointment.patientId.userName}</h2>
                  <p>Time: {new Date(appointment.startTime).toUTCString()}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleAddPrescription(appointment.patientId._id)}
                    className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add Prescription
                  </button>
                  <button
                    onClick={() => handleMarkAsCompleted(appointment._id)}
                    className="mr-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => handleStartCall(appointment)}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Start Video Call
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodayAppointments;
