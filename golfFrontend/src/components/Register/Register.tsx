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
  const { login } = useAuth(); // ✅ dodano
  const navigate = useNavigate(); // ✅ dodano

  const [user, setUser] = useState<UserInfo>({
    name: "",
    last_name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

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
        toast.error(data.message || "Login failed after registration.");
        return;
      }

      login(data); // ✅ postavi globalni context
      toast.success("Prijava uspješna!");
      close(); // zatvori modal

      // ✅ redirect po ulozi
      navigate(data.user.role === "admin" ? "/admin/tereni" : "/user/home");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login error after registration.");
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
        toast.error(data.message || "Registration failed.");
        return;
      }

      toast.success(data.message || "Registration successful!");
      await autoLogin(); // ✅ auto login nakon registracije
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred during registration.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user.password !== user.repeatPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    fetchUser();
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Register Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label htmlFor="name" className="block mb-1">
              First Name
            </label>
            <input
              type="text"
              placeholder="First Name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="last_name" className="block mb-1">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Last Name"
              value={user.last_name}
              onChange={(e) => setUser({ ...user, last_name: e.target.value })}
              className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <label htmlFor="repeatPassword">Repeat Password</label>
        <input
          type="password"
          placeholder="Repeat Password"
          value={user.repeatPassword}
          onChange={(e) =>
            setUser({ ...user, repeatPassword: e.target.value })
          }
          className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="ml-auto bg-blue-500 text-white px-4 py-2 rounded"
          >
            Register
          </button>
        </div>
      </form>
    </>
  );
};

export default Register;
