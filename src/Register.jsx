import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaUserMd, FaHandsHelping } from 'react-icons/fa';
import "bootstrap/dist/css/bootstrap.min.css";

const RegisterPage = () => {
  const [activeRole, setActiveRole] = useState('user');
  const [formData, setFormData] = useState({
    // Common fields
    name: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    profile_picture: null,
    // User specific
    address: "",
    number: "",
    // Doctor specific
    reg_no: "",
    id_proof: null,
    specialization: "",
    experience: "",
    // Assistant specific
    latitude: "",
    longitude: "",
  });

  // Add specialization options
  const specializations = [
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Orthopedic",
    "Neurologist",
    "General Physician"
  ];

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (activeRole === 'assistant') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => setError("Location access is required for assistant registration")
      );
    }
  }, [activeRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Common fields
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('dob', formData.dob);
    
    if (formData.profile_picture) {
        formDataToSend.append('profile_picture', formData.profile_picture);
    }

    // Role specific fields
    if (activeRole === 'doctor') {
        formDataToSend.append('reg_no', formData.reg_no);
        formDataToSend.append('specialization', formData.specialization);
        formDataToSend.append('experience', formData.experience);
        formDataToSend.append('address', formData.address);
        if (formData.id_proof) {
            formDataToSend.append('id_proof', formData.id_proof);
        }
    } else if (activeRole === 'assistant') {
        formDataToSend.append('number', formData.number);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('latitude', formData.latitude);
        formDataToSend.append('longitude', formData.longitude);
        if (formData.id_proof) {
            formDataToSend.append('id_proof', formData.id_proof);
        }
    } else {
        formDataToSend.append('number', formData.number);
        formDataToSend.append('address', formData.address);
    }

    try {
        const baseUrl = 'http://localhost:8000';
        const endpoints = {
            'doctor': '/doctor/register/',
            'user': '/user/register/',
            'assistant': '/assistant/register/'
        };

        const response = await axios.post(
            `${baseUrl}${endpoints[activeRole]}`,
            formDataToSend,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        setSuccess("Registration successful!");
        window.location.href = "/";
    } catch (error) {
        console.error('Registration error:', error.response?.data);
        setError(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Register as {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}</h2>

      {/* Role Selection */}
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group">
          <button 
            className={`btn ${activeRole === 'user' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveRole('user')}
          >
            <FaUser className="me-2" />
            User
          </button>
          <button 
            className={`btn ${activeRole === 'doctor' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveRole('doctor')}
          >
            <FaUserMd className="me-2" />
            Doctor
          </button>
          <button 
            className={`btn ${activeRole === 'assistant' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveRole('assistant')}
          >
            <FaHandsHelping className="me-2" />
            Assistant
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="mt-4">
        {/* Common Fields */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="form-control"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Profile Picture</label>
            <input
              type="file"
              name="profile_picture"
              className="form-control"
              onChange={handleFileChange}
              required
            />
          </div>
        </div>

        {/* User & Assistant Fields */}
        {(activeRole === 'user' || activeRole === 'assistant') && (
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="number"
                className="form-control"
                value={formData.number}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}

        {/* Doctor Fields */}
        {activeRole === 'doctor' && (
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Registration Number</label>
              <input
                type="text"
                name="reg_no"
                className="form-control"
                value={formData.reg_no}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Specialization</label>
              <select
                name="specialization"
                className="form-select"
                value={formData.specialization}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Specialization</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Experience (years)</label>
              <input
                type="number"
                name="experience"
                className="form-control"
                value={formData.experience}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">ID Proof</label>
              <input
                type="file"
                name="id_proof"
                className="form-control"
                onChange={handleFileChange}
                required
              />
            </div>
          </div>
        )}

        {/* Assistant ID Proof */}
        {activeRole === 'assistant' && (
          <div className="mb-3">
            <label className="form-label">ID Proof</label>
            <input
              type="file"
              name="id_proof"
              className="form-control"
              onChange={handleFileChange}
              required
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">
          Register as {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
