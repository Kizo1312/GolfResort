import React, { useState } from "react";
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
        <NavLink to="/home">
        
        <div className="text-xl font-bold">Golf resort</div>
        </NavLink>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-4 text-sm font-medium">
          <li>
            <NavLink to="/home" className={linkStyle}>
              Početna
            </NavLink>
          </li>
          <li>
            <NavLink to="/golf-tereni" className={linkStyle}>
              Golf Tereni
            </NavLink>
          </li>
          <li>
            <NavLink to="/wellness" className={linkStyle}>
              Wellness
            </NavLink>
          </li>
          <li>
            <NavLink to="/rezervacije" className={linkStyle}>
              Rezerviraj
            </NavLink>
          </li>

          {user?.role === "user" && (
            <li>
              <NavLink to="/moje-rezervacije" className={linkStyle}>
                Moje rezervacije
              </NavLink>
            </li>
          )}

          <li>
            <div
              className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-green-100 hover:text-green-700 font-semibold cursor-pointer"
              onClick={handleAuthClick}
            >
              {user ? "Log out" : "Log in"}
            </div>
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
          isOn ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-0">
          {[
            { to: "/home", label: "Home" },
            { to: "/golf-tereni", label: "Golf Courses" },
            { to: "/wellness", label: "Wellness" },
            { to: "/rezervacije", label: "Rezervacije" },
            ...(user?.role === "user"
              ? [{ to: "/moje-rezervacije", label: "Moje rezervacije" }]
              : []),
          ].map(({ to, label }) => (
            <li key={to} className="w-full">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `block w-full px-4 py-2 text-sm font-medium flex items-center ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-green-100 hover:text-green-700"
                  }`
                }
                onClick={() => setIsOn(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}

          <li className="w-full">
            <button
              onClick={() => {
                handleAuthClick();
                setIsOn(false);
              }}
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
