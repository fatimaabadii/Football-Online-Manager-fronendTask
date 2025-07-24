import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Market from './Market';
function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register-login', { email, password });

      localStorage.setItem('token', res.data.token);
      alert('Logged in!');
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
      alert('Error logging in/registering');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '3rem' }}>
      <h2 className="mb-4 text-center">Register / Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="d-flex justify-content-between">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => setIsRegister(false)}
          >
            Login
          </button>

          <button
            type="submit"
            className="btn btn-secondary"
            onClick={() => setIsRegister(true)}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/market" element={<Market />} />
      </Routes>
    </Router>
  );
}
