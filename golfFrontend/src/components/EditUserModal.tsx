import { useState } from "react";
import { apiRequest } from "@/hooks/apiHookAsync";

type User = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role: "user" | "admin";
};

type Props = {
  user: User;
  onClose: () => void;
  onUpdate: () => void;
};

const EditUserModal = ({ user, onClose, onUpdate }: Props) => {
  const [name, setName] = useState(user.name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<"user" | "admin">(user.role);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await apiRequest(`/users/${user.id}`, "PUT", {
        name,
        last_name: lastName,
        email,
        role,
      });
      onClose();
      onUpdate();
    } catch (err: any) {
      alert(err.message || "Greska pri spremanju");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Uredi korisnika</h2>

      <label className="block">
        <span className="text-sm">Ime</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-1"
        />
      </label>

      <label className="block">
        <span className="text-sm">Prezime</span>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-1"
        />
      </label>

      <label className="block">
        <span className="text-sm">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border rounded px-3 py-1"
        />
      </label>

      <label className="block">
        <span className="text-sm">Uloga</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "user" | "admin")}
          className="mt-1 block w-full border rounded px-3 py-1"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <div className="pt-3 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300">
          Odustani
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
        >
          Spremi
        </button>
      </div>
    </div>
  );
};

export default EditUserModal;
