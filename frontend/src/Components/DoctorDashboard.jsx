import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from 'uuid';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:3000/getAppointments", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
      }
    };
    fetchAppointments();
  }, []);

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
      // Notify backend to start the call
      const response = await fetch('http://localhost:3000/api/start-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, patientId: appointment.patientId }),
      });
  
      if (!response.ok) throw new Error('Failed to start video call');
  
      // Send the notification with proper role and appointmentId
      await fetch('http://localhost:3000/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomId, 
          patientId: appointment.patientId, 
          doctorId: appointment.doctorId,
          appointmentId: appointment._id,
          role: "patient" // Specify patient role
        }),
      });
  
      // Redirect doctor to video call with role=doctor
      window.location.href = `http://localhost:5173/video/${roomId}?role=doctor`;
    } catch (error) {
      console.error('Error starting call:', error);
      alert("Failed to start video call. Please try again.");
    }
  };
  
  
  

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
      {appointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Patient: {appointment.patientId?.userName}</h2>
              <p className="text-gray-600">Time: {new Date(appointment.startTime).toLocaleString()}</p>
              <p className="text-gray-500">Status: {appointment.status}</p>
              
              <button
                onClick={() => handleStartCall(appointment)}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Start Video Call
              </button>
              
              <button
                onClick={() => handleWritePrescription(appointment._id)}
                className="mt-2 ml-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Write Prescription
              </button>
              
              <button
                onClick={() => handleMarkCompleted(appointment._id)}
                className="mt-2 ml-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                disabled={appointment.status === "Completed"}
              >
                Mark as Completed
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No appointments available.</p>
      )}
      <Outlet />
    </div>
  );
};

export default DoctorDashboard;
