import { useAuth } from "./Context/AuthContext"; // prilagodi put ako treba
import { Link } from "react-router-dom";

const Footer = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // dok se učitava user, ništa ne prikazuj

  return (
    <footer className="bg-gray-100 text-center p-4 mt-10">
      <p className="mb-2">© 2025 My App. All rights reserved.</p>

      {user?.role === "admin" && (
        <Link to="/admin" className="text-blue-600 hover:underline">
          Admin Panel
        </Link>
      )}
    </footer>
  );
};

export default Footer;
