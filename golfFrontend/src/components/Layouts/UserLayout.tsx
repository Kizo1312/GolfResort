import { Outlet } from "react-router-dom";
import Navbar from '../Navbar/Navbar'; // prilagodi put ako treba

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> {/* <-- Stalna navigacija korisnika */}

      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;