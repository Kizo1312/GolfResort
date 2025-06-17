import React, { useState } from "react";
import toast from 'react-hot-toast';
import { useModal } from '../../ui/ModalContext';

type UserInfo = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
};

const Register = () => {
  const { close } = useModal();
  const [user, setUser] = useState<UserInfo>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: ''
  });

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Registration not successful.');
        return;
      }

      toast.success('Your registration was successful!');
      close();
    } catch (error) {
      console.error('Error:', error);
      toast.error('There was an error during the registration process.');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user.password !== user.repeatPassword) {
      toast.error("The passwords don't match.");
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
            <label htmlFor="name" className="block mb-1">Name</label>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="w-1/2">
            <label htmlFor="lastName" className="block mb-1">Last Name</label>
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        <label htmlFor='email'>Email</label>
        <input
          type='email'
          placeholder='Email'
          name='email'
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <label htmlFor="password">Password</label>
        <input
          type='password'
          placeholder='Password'
          name='password'
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <label htmlFor="repeat-password">Repeat Password</label>
        <input
          type='password'
          placeholder='Repeat Password'
          name='repeatPassword'
          value={user.repeatPassword}
          onChange={(e) => setUser({ ...user, repeatPassword: e.target.value })}
          className="border p-2 mb-3 block w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <div className='w-full flex justify-end'>
          <button type="submit" className="ml-auto bg-blue-500 text-white px-4 py-2 rounded">
            Register
          </button>
        </div>
      </form>
    </>
  );
};

export default Register;
