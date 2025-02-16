import React, { useState } from 'react';
import { useAuth } from "../Contexts/authContex";
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }

    // Simulated login validation
    if (username === 'user' && password === 'password') {
      setError('');
      login("Success");
      navigate('/dashboard');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <div className="form-group">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;