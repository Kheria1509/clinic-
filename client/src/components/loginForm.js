import React from 'react';
import authStores from '../stores/authStores';
import "../App.css";
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const store = authStores();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await store.submitLogin(e);
    navigate("/");
  }

  return (
    <div className="login-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form-content">
          <h3 className="auth-form-title">Sign In</h3>
          <div className="input-group">
            <label>Email address</label>
            <input 
              onChange={store.updateLogin} 
              value={store.login.email} 
              type="email" 
              name="email" 
              className="form-control" 
              placeholder="Enter email" 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              onChange={store.updateLogin} 
              value={store.login.password} 
              type="password" 
              name="password" 
              className="form-control" 
              placeholder="Enter password" 
            />
          </div>
          <button className="auth-form-login-button" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
