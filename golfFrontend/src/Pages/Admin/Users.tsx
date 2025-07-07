import { useEffect, useState, useRef } from "react";
import { apiRequest } from "@/hooks/apiHookAsync";
import { useModal } from "@/components/Context/ModalContext";

type User = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role: "user" | "admin";
};

type SortField = "last_name" | "role";

const Users = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { open } = useModal();

  const [sortField, setSortField] = useState<SortField>("last_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<User[]>("/users");
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sortedUsers = () => {
    if (!users) return [];
    const sorted = [...users].sort((a, b) => {
      let aField = a[sortField];
      let bField = b[sortField];

      if (typeof aField === "string") aField = aField.toLowerCase();
      if (typeof bField === "string") bField = bField.toLowerCase();

      if (aField < bField) return sortOrder === "asc" ? -1 : 1;
      if (aField > bField) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleDelete = async (userId: number) => {
    
    try {
      await apiRequest(`/users/${userId}`, "DELETE");
      fetchUsers();
    } catch (err: any) {
      alert("Greška: " + err.message);
    }
  };

  const handleEdit = (user: User) => {
    open("edit-user", {
      user,
      onUpdate: fetchUsers,
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p>Greška: {error}</p>;
  if (!users) return <p>Nema korisnika</p>;

  const displayedUsers = sortedUsers();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden relative">
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="font-semibold text-gray-700 text-lg">Korisnici</h2>

        {/* Sort dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="border border-gray-400 text-gray-700 text-sm font-normal rounded px-3 py-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1"
          >
            Sortiraj po:{" "}
            <span className="font-normal lowercase ml-1">
              {sortField === "last_name" ? "prezimenu" : "ulozi"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded shadow-md w-48 z-10">
              <button
                className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                  sortField === "last_name"
                    ? "font-semibold bg-gray-100"
                    : "font-normal"
                }`}
                onClick={() => {
                  setSortField("last_name");
                  setSortOrder("asc");
                  setDropdownOpen(false);
                }}
              >
                Abecedno po prezimenu
              </button>
              <button
                className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                  sortField === "role"
                    ? "font-semibold bg-gray-100"
                    : "font-normal"
                }`}
                onClick={() => {
                  setSortField("role");
                  setSortOrder("asc");
                  setDropdownOpen(false);
                }}
              >
                Sortiraj po roli
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div
        className="grid gap-4 px-6 py-3 border-b font-semibold text-gray-700"
        style={{
          gridTemplateColumns: "1.5fr 1.5fr 4fr 1fr minmax(100px, auto)",
        }}
      >
        <span>Ime</span>
        <span>Prezime</span>
        <span>Email</span>
        <span>Uloga</span>
        <span className="text-right">Akcije</span>
      </div>

      {/* List of users */}
      <ul>
        {displayedUsers.map((user) => (
          <li
            key={user.id}
            className="grid gap-4 items-center px-6 py-3 border-b hover:bg-gray-50"
            style={{
              gridTemplateColumns: "1.5fr 1.5fr 4fr 1fr minmax(100px, auto)",
            }}
          >
            <span className="text-gray-800">{user.name}</span>
            <span className="text-gray-800">{user.last_name}</span>
            <span className="text-blue-600 truncate">{user.email}</span>
            <span className="text-sm text-gray-600">{user.role}</span>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => handleEdit(user)}
                className="text-blue-600 hover:underline text-sm"
              >
                Uredi
              </button>
              <button
                onClick={() => {
                  setUserToDelete(user);
                  setShowConfirmDelete(true);
                }}
                className="text-red-500 hover:underline text-sm"
              >
                Obriši
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showConfirmDelete && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <p className="mb-4 text-gray-800">
              Jeste li sigurni da želite obrisati korisnika{" "}
              <strong>
                {userToDelete.name} {userToDelete.last_name}
              </strong>
              ?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Odustani
              </button>
              <button
                onClick={async () => {
                  setShowConfirmDelete(false);
                  if (userToDelete) {
                    await handleDelete(userToDelete.id);
                  }
                  setUserToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Obriši
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
