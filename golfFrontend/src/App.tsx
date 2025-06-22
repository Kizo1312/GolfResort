import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Modal from './ui/Modal';
import { useEffect } from "react";
// Context
import { AuthProvider } from "./components/Context/AuthContext";
import { useModal } from "./components/Context/ModalContext";

// Layouts & Pages
import HomePage from './Pages/Home';
import ReservationCategory from './Pages/Reservations/ReservationCategory';
import AdminLayout from './components/Layouts/AdminLayout';
import UserLayout from './components/Layouts/UserLayout';
// Admin Pages

import Tereni from "@/Pages/Admin/Tereni";
import Addons from "@/Pages/Admin/Addons";
import Reservations from "@/Pages/Admin/Reservations";
import Wellness from "@/Pages/Admin/Wellness";
import Users from "@/Pages/Admin/Users";
import Dashboard from "@/Pages/Admin/Dashboard";

// Protected Route
import ProtectedRoute from "./components/Context/ProtectedRoute";

const App = () => {
  useEffect(() => {
  fetch("http://127.0.0.1:5000/services")
    .then((res) => {
      if (!res.ok) throw new Error("Greška prilikom dohvata podataka");
      return res.json();
    })
    .then((data) => console.log("SERVISI:", data))
    .catch((err) => console.error("Greška:", err));
}, []);
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Modal />

        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="rezervacije" element={<ReservationCategory />} />
            {/* Ostale korisničke rute mogu ići ovde */}
            {/* <Route path="about" element={<About />} /> */}
            {/* <Route path="contact" element={<Contact />} /> */}
            {/* <Route path="profile" element={<UserProfile />} /> */}
          </Route>

          {/* Admin Routes - ZAŠTIĆENO */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          > 
            <Route index element={<Dashboard />} />
            <Route path="tereni" element={<Tereni />} />
            <Route path="dodatne-usluge" element={<Addons />} />
            <Route path="wellness-usluge" element={<Wellness />} />
            <Route path="korisnici" element={<Users />} />
            <Route path="rezervacije" element={<Reservations />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
