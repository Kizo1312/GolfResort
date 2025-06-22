import { Outlet, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import LogoutButton from "../Context/LogoutButton";

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow p-4 flex justify-between items-center w-full">
        <h1 className="text-xl font-bold">DASHBOARD</h1>
        <span className="text-gray-600">hello, admin</span>
      </header>

      {/* Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/admin/tereni"
                className={({ isActive }) =>
                  isActive
                    ? "block px-4 py-2 rounded-lg bg-green-600 text-white font-semibold"
                    : "block px-4 py-2 rounded-lg text-gray-700 hover:bg-green-100 hover:text-green-700 font-semibold"
                }
              >
                TERENI
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/dodatne-usluge"
                className={({ isActive }) =>
                  isActive
                    ? "block px-4 py-2 rounded-lg bg-green-600 text-white font-semibold"
                    : "block px-4 py-2 rounded-lg text-gray-700 hover:bg-green-100 hover:text-green-700 font-semibold"
                }
              >
                DODATNE USLUGE
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/wellness-usluge"
                className={({ isActive }) =>
                  isActive
                    ? "block px-4 py-2 rounded-lg bg-green-600 text-white font-semibold"
                    : "block px-4 py-2 rounded-lg text-gray-700 hover:bg-green-100 hover:text-green-700 font-semibold"
                }
              >
                WELLNESS USLUGE
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/korisnici"
                className={({ isActive }) =>
                  isActive
                    ? "block px-4 py-2 rounded-lg bg-green-600 text-white font-semibold"
                    : "block px-4 py-2 rounded-lg text-gray-700 hover:bg-green-100 hover:text-green-700 font-semibold"
                }
              >
                KORISNICI
              </NavLink>
            </li>
          </ul>

          <div className="pt-6 border-t mt-6">
            <ul className="space-y-2">
              <li className="text-gray-600 cursor-pointer">View as user</li>
              <LogoutButton />
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
