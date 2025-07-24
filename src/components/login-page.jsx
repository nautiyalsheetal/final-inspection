import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import './login-page.css'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Please enter both email and password.');
      setMessageType('error');
      return;
    }

    const data = { username: email, password };

    try {
      const response = await fetch('https://pel.quadworld.in/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorRes = await response.json();
        throw new Error(errorRes.message || 'Login failed.');
      }

      const result = await response.json();
      localStorage.setItem('userLoginData', JSON.stringify(result));
      navigate('/dashboard');
    } catch (err) {
      setMessage('Login failed: ' + err.message);
      setMessageType('error');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* <h1 className="login-logo">
          Aut <FaCog className="gear-icon" /> sys
        </h1> */}
        <h1 className="login-logo">
  Aut <FaCog className="gear-icon" /> sys
</h1>


        <div className="login-card">
          <h3 className="welcome-text">Welcome back</h3>
          <p className="subtext">Login to manage your account</p>

          <form onSubmit={handleSubmit} autoComplete="off">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter email"
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />

            <div className="checkbox-container">
              <input type="checkbox" id="rememberMe" name="rememberMe" />
              <label htmlFor="rememberMe">Remember me</label>
            </div>

            <button type="submit">Sign in</button>
          </form>

          {message && (
            <div className={`message ${messageType}`}>{message}</div>
          )}
        </div>

        <div className="copyright">
          <span className="dim-text">Copyright © 2018</span>
          <span className="company-name">Autosys Industrial Solutions Pvt. Ltd.</span>
          <span className="dim-text"> All rights reserved. </span>
          <span className="sm-links">
            <a href="#">Terms of use</a> | <a href="#">Privacy Policy</a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
