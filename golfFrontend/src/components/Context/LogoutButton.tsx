import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Odjavljeni ste.");
    navigate("/home");
  };

  return (
    <li>
      <button
        onClick={handleLogout}
        className="text-red-500 font-semibold cursor-pointer bg-transparent border-none p-0 m-0"
      >
        Log Out
      </button>
    </li>
  );
};

export default LogoutButton;