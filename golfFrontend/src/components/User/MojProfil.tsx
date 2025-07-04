import { useState, useEffect } from "react";
import { apiRequest } from "@/hooks/apiHookAsync";
import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

type UserData = {
  id: number;
  name: string;
  last_name: string;
  email: string;
};

type FormData = {
  name: string;
  last_name: string;
  email: string;
  currentPassword?: string;
  password?: string;
};

const MojProfil = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: "",
    last_name: "",
    email: "",
    currentPassword: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const {logout} = useAuth();

  const { user, accessToken } = useAuth();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);


  useEffect(() => {
    if (!user || !accessToken) {
      // No logged-in user, clear form and data
      setUserData(null);
      setForm({
        name: "",
        last_name: "",
        email: "",
        currentPassword: "",
        password: "",
      });
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await apiRequest<UserData>("/users/me");
        setUserData(data);
        setForm({
          name: data.name,
          last_name: data.last_name,
          email: data.email,
          currentPassword: "",
          password: "",
        });
      } catch (err: any) {
        toast.error(err.message || "Greška pri dohvaćanju podataka.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user, accessToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = (newPass: string) => {
    if (newPass.length < 8) {
      toast.error("Lozinka mora imati najmanje 8 znakova.");
      return false;
    }
    const strengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!strengthRegex.test(newPass)) {
      toast.error("Lozinka mora sadržavati velika i mala slova te broj.");
      return false;
    }
    return true;
  };

  const handleDeleteProfile = async () => {
    try {
      await apiRequest("/users/me", "DELETE");
      toast.success("Profil je uspješno obrisan.");
      setShowConfirmDelete(false);
      logout();
      navigate("/home");
    } catch (err: any) {
      toast.error(err.message || "Greška pri brisanju profila.");
      setShowConfirmDelete(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);

    if (form.password) {
      if (!form.currentPassword) {
        toast.error("Za promjenu lozinke unesite trenutnu lozinku.");
        return;
      }

      if (form.password === form.currentPassword) {
        toast.error("Nova lozinka ne može biti ista kao trenutna.");
        return;
      }

      if (!validatePassword(form.password)) return;
    }

    try {
      const payload: Record<string, any> = {};
      Object.entries(form).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          payload[key] = value;
        }
      });

      // Remove currentPassword as backend does not accept it
      delete payload.currentPassword;

      const updatedUser = await apiRequest<UserData>("/users/me", "PUT", payload);
      setUserData(updatedUser);
      setForm((prev) => ({ ...prev, password: "" }));
      setSuccessMsg("Podaci su uspješno ažurirani.");
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Greška pri ažuriranju.");
    }
  };

  if (loading) return <p>Učitavanje podataka...</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Moj profil</h2>
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => {
            if (isEditing && userData) {
              setForm({
                name: userData.name,
                last_name: userData.last_name,
                email: userData.email,
                currentPassword: "",
                password: "",
              });
            }
            setIsEditing((prev) => !prev);
            setSuccessMsg(null);
          }}
          className="text-blue-600 hover:underline text-sm"
        >
          {isEditing ? "Odustani" : "Uredi profil"}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Ime</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Prezime</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Trenutna lozinka</label>
          <div className="relative">
            <input
              name="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={form.currentPassword || ""}
              onChange={handleChange}
              className="border p-2 w-full pr-10 rounded"
              placeholder="Unesi trenutnu lozinku"
              disabled={!isEditing}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xl"
              aria-label="Prikaži/sakrij trenutnu lozinku"
            >
              {showCurrentPassword ? "👁️" : "👁️"}
            </button>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Nova lozinka</label>
          <div className="relative">
            <input
              name="password"
              type={showNewPassword ? "text" : "password"}
              value={form.password || ""}
              onChange={handleChange}
              className="border p-2 w-full pr-10 rounded"
              placeholder="Unesi novu lozinku"
              disabled={!isEditing}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xl"
              aria-label="Prikaži/sakrij novu lozinku"
            >
              {showNewPassword ? "👁️" : "👁️"}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Lozinka mora imati barem 8 znakova, uključujući velika i mala slova
            te broj.
          </p>
        </div>

        {isEditing && (
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Spremi promjene
          </button>
        )}

        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={() => setShowConfirmDelete(true)}
            className="text-red-600 hover:underline text-sm"
          >
            Obriši profil
          </button>
        </div>
      </form>

      {/* Custom Confirm Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm mx-auto">
            <p className="mb-4 text-gray-800">
              Jeste li sigurni da želite obrisati svoj profil? Vaš profil bit će
              nepovratno izbrisan.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Odustani
              </button>
              <button
                onClick={handleDeleteProfile}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Obriši
              </button>
            </div>
          </div>
        </div>
      )}

      {successMsg && <p className="mt-4 text-green-600">{successMsg}</p>}
    </div>
  );
};

export default MojProfil;
