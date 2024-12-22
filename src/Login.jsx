import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaUserMd, FaHandsHelping, FaEnvelope, FaLock } from "react-icons/fa";

const LoginPage = () => {
  const [activeRole, setActiveRole] = useState('user');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      if(activeRole === 'user') {
        const response = await axios.post("http://localhost:8000/user/login/", { "email": email, "password": password });
        //returns user_id, name and email
        //store the user_id in localStorage
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("role", "user");
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("email", response.data.email);
        window.location.href = "/home";
      }
      else if(activeRole === 'assistant') {
        const response = await axios.post("http://localhost:8000/assistant/login/", { "email": email, "password": password });
        //returns assistant_id, name and email
        //store the assistant_id in localStorage
        localStorage.setItem("assistant_id", response.data.assistant_id);
        localStorage.setItem("role", "assistant");
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("email", response.data.email);
        window.location.href = "/assistant_dashboard";
      }
      else if(activeRole === 'doctor') {
        const response = await axios.post("http://localhost:8000/doctor/login/", { "email": email, "password": password });
        //returns doctor_id, name and email
        //store the doctor_id in localStorage
        localStorage.setItem("doctor_id", response.data.doctor_id);
        localStorage.setItem("role", "doctor");
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("email", response.data.email);
        window.location.href = "/doctor_dashboard";
      }
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center" 
         style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="card shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body p-5">
          <h2 className="text-center mb-4">Welcome Back!</h2>

          {/* Role Selection Tabs */}
          <div className="d-flex justify-content-around mb-4">
            <div 
              className={`role-option ${activeRole === 'user' ? 'active' : ''}`}
              onClick={() => setActiveRole('user')}
              style={{ cursor: 'pointer', padding: '10px', borderRadius: '5px',
                      background: activeRole === 'user' ? '#007bff' : '#f8f9fa',
                      color: activeRole === 'user' ? 'white' : 'black' }}>
              <FaUser className="me-2" />
              User
            </div>
            <div 
              className={`role-option ${activeRole === 'assistant' ? 'active' : ''}`}
              onClick={() => setActiveRole('assistant')}
              style={{ cursor: 'pointer', padding: '10px', borderRadius: '5px',
                      background: activeRole === 'assistant' ? '#007bff' : '#f8f9fa',
                      color: activeRole === 'assistant' ? 'white' : 'black' }}>
              <FaHandsHelping className="me-2" />
              Assistant
            </div>
            <div 
              className={`role-option ${activeRole === 'doctor' ? 'active' : ''}`}
              onClick={() => setActiveRole('doctor')}
              style={{ cursor: 'pointer', padding: '10px', borderRadius: '5px',
                      background: activeRole === 'doctor' ? '#007bff' : '#f8f9fa',
                      color: activeRole === 'doctor' ? 'white' : 'black' }}>
              <FaUserMd className="me-2" />
              Doctor
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FaLock />
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-3"
                    style={{ background: 'linear-gradient(to right, #007bff, #0056b3)' }}>
              Login
            </button>
          </form>

          <div className="text-center">
            <p className="mb-0">Don't have an account?</p>
            <button 
              className="btn btn-link text-decoration-none"
              onClick={() => window.location.href = "/register"}
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
