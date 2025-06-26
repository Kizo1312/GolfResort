import { useEffect, useState } from "react";
import { apiRequest } from "@/hooks/apiHookAsync"; // <-- adjust path if needed

type User = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role: "user" | "admin";
};

const Users = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p>Greška: {error}</p>;
  if (!users) return <p>Nema korisnika</p>;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b font-semibold text-gray-700 grid grid-cols-4">
        <span>Ime</span>
        <span>Prezime</span>
        <span>Email</span>
        <span>Uloga</span>
      </div>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="px-6 py-3 border-b grid grid-cols-4 items-center hover:bg-gray-50"
          >
            <span className="text-gray-800">{user.name}</span>
            <span className="text-gray-800">{user.last_name}</span>
            <span className="text-blue-600">{user.email}</span>
            <span className="text-sm text-gray-600">{user.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
