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
            Prijavi se
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;
