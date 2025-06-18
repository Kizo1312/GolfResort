import { useState } from "react";
import {useModal } from '../Context/ModalContext'

const Navbar = () => {
  const [isOn, setIsOn] = useState(false);
  const {open, isOpen} = useModal()

  return (
    <nav className="text-black px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">Golf resort</div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          <li><a href="#" className="hover:text-gray-300">Golf Courses</a></li>
          <li><a href="#" className="hover:text-gray-300">Welness</a></li>
          <li onClick={() => open("auth")}><a href="#" className="hover:text-gray-300">Log in</a></li>
          
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
        <ul className="flex flex-col items-center gap-4 px-4 pt-4 pb-6 text-sm font-medium rounded-b-lg">

          <li><a href="#" className="hover:text-gray-300">Home</a></li>
          <li><a href="#" className="hover:text-gray-300">Golf Courses</a></li>
          <li><a href="#" className="hover:text-gray-300">Welness</a></li>
          <li onClick={() => open("auth")}><a href="#" className="hover:text-gray-300">Log in</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

