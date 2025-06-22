import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Modal from './ui/Modal';

// Context
import { AuthProvider } from "./components/Context/AuthContext";
import { useModal } from "./components/Context/ModalContext";

// Layouts & Pages
import HomePage from './Pages/Home';
import AdminLayout from './components/Layouts/AdminLayout';
import ItemList from './Pages/Admin/List';
import UserLayout from './components/Layouts/UserLayout';

// Protected Route
import ProtectedRoute from "./components/Context/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Modal />

        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route path="home" element={<HomePage />} />
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
            <Route path="tereni" element={<ItemList />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
