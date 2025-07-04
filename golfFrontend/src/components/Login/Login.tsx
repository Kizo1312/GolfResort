import React, { useState } from "react";
import { useModal } from "../Context/ModalContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type Credentials = {
  email: string;
  password: string;
};

const Login = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });

  const { close } = useModal();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login neuspješan.");
        return;
      }

      toast.success("Uspješna prijava!");
      localStorage.setItem("token", data.access_token);

      login(data); // postavi globalni context
      close(); // zatvori modal

      // ✅ Redirect samo ako je admin
      if (data.user.role === "admin") {
        navigate("/admin");
      }
      // korisnik ostaje gdje jest
    } catch (err) {
      toast.error("Greška pri prijavi.");
      console.error(err);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const { email, password } = credentials;
    e.preventDefault();
    if (!email || !password) {
      toast.error("Ispunite sva polja");
      return;
    }

    fetchUser();
  };

  return (
    <>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email-field">Email</label>
        <input
          id="email-field"
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <label htmlFor="password-field">Lozinka</label>
<div className="relative mb-3">
  <input
    id="password-field"
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={credentials.password}
    onChange={(e) =>
      setCredentials({ ...credentials, password: e.target.value })
    }
    className="border p-2 block w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
  />
  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-2 top-1/2 -translate-y-1/2 text-xl"
    aria-label="Toggle password visibility"
  >
    {showPassword ? "👁️" : "👁️"}
  </button>
</div>


        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="ml-auto bg-blue-500 text-white px-4 py-2 rounded"
          >
            Prijavi se
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;
