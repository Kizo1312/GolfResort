import { useFetchData } from "@/hooks/useFetchData";

type User = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role: "user" | "admin";
};

const Users = () => {
  const { data, loading, error, refetch } = useFetchData<User[]>("/users");

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p>Greška: {error}</p>;
  if (!data) return <p>Nema korisnika</p>;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b font-semibold text-gray-700 grid grid-cols-4">
        <span>Ime</span>
        <span>Prezime</span>
        <span>Email</span>
        <span>Uloga</span>
      </div>
      <ul>
        {data.map((user) => (
          <li key={user.id} className="px-6 py-3 border-b grid grid-cols-4 items-center hover:bg-gray-50">
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
