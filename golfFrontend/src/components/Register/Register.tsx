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
              placeholder="Vaše Ime"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="w-1/2">
            <label className="block mb-1">Prezime</label>
            <input
              type="text"
              placeholder="Vaše Prezime"
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
            placeholder="Lozinka"
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
            {showPassword ? (
              // Eye Off SVG (hidden)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.255.241-2.454.675-3.55m3.675 6.45A3 3 0 1112 9c.795 0 1.515.31 2.05.825M15 15l6 6M3 3l18 18"
                />
              </svg>
            ) : (
              // Eye SVG (visible)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1 mb-3">
          Lozinka mora imati najmanje 8 znakova, uključujući veliko slovo, malo
          slovo i broj.
        </p>

        <label className="block mb-1">Ponovite lozinku</label>
        <div className="relative mb-3">
          <input
            type={showRepeatPassword ? "text" : "password"}
            placeholder="Ponovite lozinku"
            value={user.repeatPassword}
            onChange={(e) =>
              setUser({ ...user, repeatPassword: e.target.value })
            }
            className="border p-2 block w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="button"
            onClick={() => setShowRepeatPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xl"
            aria-label="Prikaži/sakrij ponovljenu lozinku"
          >
            {showPassword ? (
              // Eye Off SVG (hidden)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.255.241-2.454.675-3.55m3.675 6.45A3 3 0 1112 9c.795 0 1.515.31 2.05.825M15 15l6 6M3 3l18 18"
                />
              </svg>
            ) : (
              // Eye SVG (visible)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
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
