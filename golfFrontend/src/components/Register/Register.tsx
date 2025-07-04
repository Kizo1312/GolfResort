import React, { useState } from "react";
import toast from "react-hot-toast";
import { useModal } from "../Context/ModalContext";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

type UserInfo = {
  name: string;
  last_name: string;
  email: string;
  password: string;
  repeatPassword: string;
};

const Register = () => {
  const { close } = useModal();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserInfo>({
    name: "",
    last_name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

const [showPassword, setShowPassword] = useState(false);
const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // ▶️ login nakon uspješne registracije
  const autoLogin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login neuspješan nakon registracije.");
        return;
      }

      login(data); // spremi u AuthContext
      toast.success("Prijava uspješna!");
      close(); // zatvori modal

      // 👇 redirect samo za admina
      if (data.user.role === "admin") {
        navigate("/admin/tereni");
      }
      // user (role === 'user') ostaje gdje jest
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Greška pri automatskoj prijavi.");
    }
  };

  const fetchUser = async () => {
    const { name, last_name, email, password } = user;

    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, last_name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Registracija neuspješna.");
        return;
      }

      toast.success(data.message || "Registracija uspješna!");
      await autoLogin(); // automatska prijava
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Došlo je do greške pri registraciji.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, last_name, email, password, repeatPassword } = user;

    if (!name || !last_name || !email || !password || !repeatPassword) {
      toast.error("Sva polja su obavezna.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Unesite ispravan email.");
      return;
    }

    if (password.length < 8) {
      toast.error("Lozinka mora imati najmanje 8 znakova.");
      return;
    }

    const passwordStrength = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordStrength.test(password)) {
      toast.error("Lozinka mora sadržavati velika i mala slova te broj.");
      return;
    }

    if (password !== repeatPassword) {
      toast.error("Lozinke se ne podudaraju.");
      return;
    }

    fetchUser();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block mb-1">Ime</label>
            <input
              type="text"
              placeholder="First Name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="w-1/2">
            <label className="block mb-1">Prezime</label>
            <input
              type="text"
              placeholder="Last Name"
              value={user.last_name}
              onChange={(e) => setUser({ ...user, last_name: e.target.value })}
              className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <label className="block mb-1">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <label className="block mb-1">Lozinka</label>
        <div className="relative mb-3">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="border p-2 block w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xl"
          aria-label="Prikaži/sakrij lozinku"
        >
        {showPassword ? "👁️" : "👁️"}
        </button>
        </div>
        <p className="text-sm text-gray-500 mt-1 mb-3">
          Lozinka mora imati najmanje 8 znakova, uključujući veliko slovo, malo slovo i broj.
        </p>


        <label className="block mb-1">Ponovite lozinku</label>
<div className="relative mb-3">
  <input
    type={showRepeatPassword ? "text" : "password"}
    placeholder="Repeat Password"
    value={user.repeatPassword}
    onChange={(e) => setUser({ ...user, repeatPassword: e.target.value })}
    className="border p-2 block w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
  />
  <button
    type="button"
    onClick={() => setShowRepeatPassword((prev) => !prev)}
    className="absolute right-2 top-1/2 -translate-y-1/2 text-xl"
    aria-label="Prikaži/sakrij ponovljenu lozinku"
  >
    {showRepeatPassword ? "👁️" : "👁️"}
  </button>
</div>


        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="ml-auto bg-blue-500 text-white px-4 py-2 rounded"
          >
            Potvrdi registraciju
          </button>
        </div>
      </form>
    </>
  );
};

export default Register;
