import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Modal from './ui/Modal';
import { useEffect } from "react";
// Context
import { AuthProvider } from "./components/Context/AuthContext";
import { useModal } from "./components/Context/ModalContext";

// Layouts & Pages
import HomePage from './Pages/Home';
import RezervacijaUspjeh from "@/Pages/Reservations/RezervacijaUspjeh";
import RezervacijaPregled from "@/Pages/Reservations/RezervacijaPregled";
import RezervacijaTermin from "@/Pages/Reservations/RezervacijaTermin";
import ReservationCategory from './Pages/Reservations/ReservationCategory';
import AdminLayout from './components/Layouts/AdminLayout';
import UserLayout from './components/Layouts/UserLayout';
import GolfCourses from "./Pages/GolfCourses";
import WellnessInfo from "./Pages/WellnessInfo";
import MojeRezervacije from './Pages/MojeRezervacije';
// Admin Pages

import Tereni from "@/Pages/Admin/Tereni";
import Addons from "@/Pages/Admin/Addons";
import Reservations from "./Pages/Admin/Reservations";
import Wellness from "@/Pages/Admin/Wellness";
import Users from "@/Pages/Admin/Users";
import Dashboard from "@/Pages/Admin/Dashboard";

// Protected Route
import ProtectedRoute from "./components/Context/ProtectedRoute";
import UserDashboard from "./components/User/UserDashboard";

const App = () => {
  return (
      <Router>
        <Toaster position="top-right" />
        <Modal />

        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="rezervacije" element={<ReservationCategory />} />
            <Route path="/rezervacija/termin" element={<RezervacijaTermin />} />
            <Route
              path="/rezervacija/pregled"
              element={
                <ProtectedRoute requiredRole="user">
                  <RezervacijaPregled />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rezervacija/uspjeh"
              element={
                <ProtectedRoute requiredRole="user">
                  <RezervacijaUspjeh />
                </ProtectedRoute>
              }
            />
            <Route path="golf-tereni" element={<GolfCourses />} />
            <Route path="wellness" element={<WellnessInfo />} />  
            <Route
              path="/moje-rezervacije"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
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
  );
};

export default App;
