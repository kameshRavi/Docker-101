import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

export default function Signup({ onSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleSignup = async e => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, userName })
    });

    if (res.ok) {
      const data = await res.json();
      onSignup({email: data.email, userName: userName});
    } else {
      const err = await res.json();
      alert(err.message || 'Signup failed');
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
    <form onSubmit={handleSignup} className="space-y-4 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold">Sign Up</h2>
      <input type="text" className="border p-2 w-full" placeholder="User Name" onChange={e => setUserName(e.target.value)} required />
      <input type="email" className="border p-2 w-full" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
      <input type="password" className="border p-2 w-full" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
      <button className="bg-green-600 text-white px-4 py-2 rounded">Sign Up</button>
    </form>
    <div className="text-center mt-4">
        <button
          className="text-blue-600 underline"
          onClick={() => {
            navigate('/');
          }}
        >
          Already have an account? Log in
        </button>
      </div>
    </>
  );
}