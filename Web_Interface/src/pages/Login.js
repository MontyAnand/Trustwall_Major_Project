import React, { useEffect, useState } from 'react';
import { useAuth } from "../Contexts/authContex";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../Contexts/socketContex";
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsAuthenticated } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  useEffect(()=>{
    if (!socket) return;
    socket.on('auth-result',(data)=>{
      if(data.status === 0){
        setError(data.message);
        return;
      }
      setIsAuthenticated(true);
      navigate('/dashboard');
    });

    return ()=>{
      socket.off('auth-result');
    }
  },[socket]);

  const handleLogin = () => {
    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }
    socket.emit('authenticate-user', {
      userId : username,
      password : password
    });
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