// src/pages/Signup.jsx
import { useState } from 'react';
// import createAccount, login
import { useNavigate } from 'react-router-dom';
import { login, createAccount } from './lib/appwriteFunction';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAccount(form.email, form.password, form.name);
      await login(form.email, form.password); // auto-login after signup
      navigate('/generate');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" />
      <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" />
      <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" />
      <button type="submit">Sign Up</button>
    </form>
  );
}
