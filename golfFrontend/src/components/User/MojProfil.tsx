import { useState, useEffect } from "react";
import { apiRequest } from "@/hooks/apiHookAsync";
import toast from "react-hot-toast";

type UserData = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role: string;
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
  const [form, setForm] = useState<FormData>({
    name: "",
    last_name: "",
    email: "",
    currentPassword: "",  
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);

    // Validacija lozinke ako je unesena
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
      const payload = { ...form };
      if (!payload.password) delete payload.password;

      const updatedUser = await apiRequest<UserData>("/users/me", "PUT", payload);
      setUserData(updatedUser);
      setForm((prev) => ({ ...prev, password: "" }));
      setSuccessMsg("Podaci su uspješno ažurirani.");
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
            if (isEditing) {
              // Ako korisnik klikne "Odustani", resetiraj formu na originalne podatke
              if (userData) {
                setForm({
                  name: userData.name,
                  last_name: userData.last_name,
                  email: userData.email,
                  currentPassword: "",
                  password: "",
                });
              }
            }
            setIsEditing((prev) => !prev); // Okreće stanje editiranja
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
          <input
            name="currentPassword"
            type="password"
            value={form.currentPassword || ""}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Unesi trenutnu lozinku"
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Nova lozinka</label>
          <input
            name="password"
            type="password"
            value={form.password || ""}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Unesi novu lozinku"
            disabled={!isEditing}
          />
          <p className="text-sm text-gray-500 mt-1">
            Lozinka mora imati barem 8 znakova, uključujući velika i mala slova te broj.
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
      </form>
      {successMsg && <p className="mt-4 text-green-600">{successMsg}</p>}
    </div>
  );
};

export default MojProfil;
