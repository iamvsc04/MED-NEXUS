import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar';
import Login from './Pages/Login';
import Home from './Components/Home';
import Signup from './Pages/Signup';
import HomePage from './Pages/HomePage';
import Footer from "./Components/Footer";
import BookAppointment from "./Components/BookAppointment";
import Prescriptions from "./Components/Prescriptions";
import ViewDoctor from "./Components/ViewDoctor";
import AddDoctor from "./Components/AddDoctor";
import NotificationAdmin from "./Components/NotificationAdmin";
import AddPrescription from "./Components/AddPrescription";
import AddAdmin from "./Components/AddAdmin";
import AdminDashboard from "./Components/AdminDashboard";
import PatientDashboard from "./Components/PatientDashboard";
import AdminLayout from "./Layouts/AdminLayout";
import ConfirmationStatus from "./Components/ConfirmationStatus";
import DoctorDashboard from "./Components/DoctorDashboard";
import YourAppointments from "./Components/YourAppointments";
import DoctorProfile from "./Components/DoctorProfile";
import ViewPrescription from "./Components/ViewPrescription";
import VideoCall from "./Pages/VideoCall.jsx";
//import TodayAppointments from './pages/TodayAppointments';


function App() {
  return (
    <>
      <Navbar />
      <hr className='bg-slate-400 h-[1px]' />
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/dashboard" element={<HomePage />}>
    <Route path="admin" element={<AdminLayout />} >
      <Route index element={<AdminDashboard />} />
      <Route path="addDoctor" element={<AddDoctor />} />
      <Route path="addAdmin" element={<AddAdmin />} />
      <Route path="notifications" element={<NotificationAdmin />} />
    </Route>
    <Route path="patient" element={<AdminLayout/>} >
      <Route index element={<PatientDashboard />} />
      <Route path="bookAppointment" element={<BookAppointment />} />
      <Route path="bookAppointment/:id" element={<ViewDoctor />} />
      <Route path="getPrescriptions" element={<Prescriptions />} />
      <Route path="viewPrescription/:id" element={<ViewPrescription />} />
      <Route path="status" element={<ConfirmationStatus />} />
    </Route>
    <Route path="doctor"  element={<AdminLayout />}>
      <Route index element={<DoctorDashboard />} />
      <Route path="addPrescription/:id" element={<AddPrescription />} />
      <Route path="getAppointments" element={<YourAppointments />} />
      <Route path="profile" element={<DoctorProfile />} />
    </Route>
  </Route>
  <Route path="/video/:roomId" element={<VideoCall />} />
</Routes>
      <Footer />
    </>
  );
}
export default App;