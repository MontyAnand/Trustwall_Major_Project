import React, { useEffect, useState } from 'react';
import { useAuth } from "../Contexts/authContex";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../Contexts/socketContex";
import './Login.css';
import hide from '../Images/hide.png';
import view from '../Images/view.png';
import key from '../Images/key.png';
import face_id from '../Images/face-id.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsAuthenticated } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [isPassword,setIsPassword] = useState('password');
  const [PasswordContent,setPasswordContent] = useState(hide);

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
    <div className='login_container'>
          <div className="login-page">
          <h1>Login</h1>
          <div className="form-group-1">
            <div className='form-internal-container' >
            <img src={face_id} alt='user-img'/>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            </div>
          </div>
          <div className="form-group-2">
          <div className='form-internal-container' >
          <img src={key} alt='key-img'/>
            <input
              type={isPassword}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
            <img className='password-content' src={PasswordContent} alt='Img' onClick={()=>{
              if(isPassword === 'password'){
                  setIsPassword('text');
                  setPasswordContent(view);
              }
              else if(isPassword === 'text'){
                  setIsPassword('password');
                  setPasswordContent(hide);
              }
            }}/>
          </div>
          {error && <p className="error">{error}</p>}
          <button onClick={handleLogin}>Login</button>
        </div>
    </div>
  );
}

export default Login;