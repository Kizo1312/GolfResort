import { useState } from "react";
import { useModal } from "../Context/ModalContext";
import { useAuth } from "../Context/AuthContext";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOn, setIsOn] = useState(false);
  const { open } = useModal();
  const { user, logout } = useAuth();

  const handleAuthClick = () => {
    if (user) logout();
    else open("auth");
  };

  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "block px-4 py-2 rounded-lg bg-green-600 text-white font-semibold"
      : "block px-4 py-2 rounded-lg text-gray-700 hover:bg-green-100 hover:text-green-700 font-semibold";

  return (
    <nav className="text-black px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">Golf resort</div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-4 text-sm font-medium">
          <li>
            <NavLink to="/home" className={linkStyle}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/golf-courses" className={linkStyle}>
              Golf Courses
            </NavLink>
          </li>
          <li>
            <NavLink to="/wellness" className={linkStyle}>
              Wellness
            </NavLink>
          </li>
          <li>
            <NavLink to="/rezervacije" className={linkStyle}>
              Rezervacije
            </NavLink>
          </li>
          <li>
            <button onClick={handleAuthClick} className="hover:text-gray-500 font-semibold">
              {user ? "Log out" : "Log in"}
            </button>
          </li>
        </ul>

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsOn(!isOn)}
          className="md:hidden text-black focus:outline-none"
        >
          <svg
            className="w-6 h-6 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={isOn ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isOn ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-0">
          <li className="w-full">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block w-full px-4 py-2 text-sm font-medium flex items-center ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-green-100 hover:text-green-700"
                }`
              }
            >
              Home
            </NavLink>
          </li>
          <li className="w-full">
            <NavLink
              to="/golf"
              className={({ isActive }) =>
                `block w-full px-4 py-2 text-sm font-medium flex items-center ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-green-100 hover:text-green-700"
                }`
              }
            >
              Golf Courses
            </NavLink>
          </li>
          <li className="w-full">
            <NavLink
              to="/wellness"
              className={({ isActive }) =>
                `block w-full px-4 py-2 text-sm font-medium flex items-center ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-700 hover:bg-green-100 hover:text-green-700"
                }`
              }
            >
              Wellness
            </NavLink>
          </li>
          <li className="w-full">
            <button
              onClick={handleAuthClick}
              className="w-full px-4 py-2 text-left text-sm font-medium flex items-center text-gray-700 hover:bg-green-100 hover:text-green-700"
            >
              {user ? "Log out" : "Log in"}
            </button>
          </li>
        </ul>
      </div>


    </nav>
  );
};

export default Navbar;
