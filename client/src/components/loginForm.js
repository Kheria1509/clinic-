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
          <p style={{ 
  fontSize: '14px', 
  color: '#666', 
  marginBottom: '20px', 
  textAlign: 'center', 
  fontStyle: 'italic' 
}}>
  Made with ❤️ by <strong>
    <a 
      href="https://www.linkedin.com/in/aman-kheria-117371259/" 
      target="_blank" 
      rel="noopener noreferrer" 
      style={{ 
        textDecoration: 'none', 
        color: '#333', 
        background: 'linear-gradient(135deg, #6a11cb, #2575fc)', 
        WebkitBackgroundClip: 'text', 
        WebkitTextFillColor: 'transparent', 
        fontWeight: '700' 
      }}
    >
      Aman Kheria
    </a>
  </strong> | Use <strong>admin@gmail.com</strong> with password- <strong>password</strong> for demo.
</p>
          <button className="auth-form-login-button" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;