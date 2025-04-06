import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      onLogin({email: data.email, userName: data.userName});
    } else {
      alert('Invalid credentials');
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate('/quiz');
    }
  }, []);

  return (
    <>
    <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold">Login</h2>
      <input type="email" className="border p-2 w-full" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
      <input type="password" className="border p-2 w-full" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
    </form>
    <div className="text-center mt-4">
        <button
          className="text-blue-600 underline"
          onClick={() => {
            navigate('/signup');
          }}
        >
          Create an account
        </button>
      </div>
    </>
  );
}