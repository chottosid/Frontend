import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarLayout from './components/SidebarLayout';
import { format, addDays, startOfDay, parseISO } from 'date-fns';
import { FaCalendar, FaClock, FaUser, FaCheck } from 'react-icons/fa';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [viewType, setViewType] = useState('day');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const doctor_id = localStorage.getItem('doctor_id');
            const response = await axios.get(
                `http://localhost:8000/doctor/appointment/doctor/${doctor_id}/`
            );
            setAppointments(response.data);
        } catch (error) {
            setError("Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [viewType]);

    const handleConfirmAppointment = async (appointment_id) => {
        try {
            await axios.post('http://localhost:8000/doctor/appointment/confirm/', {
                appointment_id,
                doctor_id: localStorage.getItem('doctor_id')
            });
            fetchAppointments(); // Refresh list after confirmation
        } catch (error) {
            setError("Failed to confirm appointment");
        }
    };

    return (
            <div className="container mt-4">
                <div className="row mb-4">
                    <div className="col-md-6">
                        <h2>My Appointments</h2>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                        <div className="btn-group">
                            <button 
                                className={`btn ${viewType === 'day' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setViewType('day')}
                            >
                                Today
                            </button>
                            <button 
                                className={`btn ${viewType === 'threeDays' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setViewType('threeDays')}
                            >
                                3 Days
                            </button>
                            <button 
                                className={`btn ${viewType === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setViewType('week')}
                            >
                                Week
                            </button>
                        </div>
                    </div>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        {appointments.map(appointment => (
                            <div key={appointment.appointment_id} className="col-md-6 mb-3">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="card-title mb-0">
                                                <FaUser className="me-2" />
                                                {appointment.user_name}
                                            </h5>
                                            <span className={`badge ${appointment.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                        <div className="mb-2">
                                            <FaCalendar className="me-2" />
                                            {appointment.date}
                                        </div>
                                        <div className="mb-3">
                                            <FaClock className="me-2" />
                                            {appointment.time}
                                        </div>
                                        {appointment.status === 'pending' && (
                                            <div className="d-flex justify-content-end">
                                                <button 
                                                    className="btn btn-success"
                                                    onClick={() => handleConfirmAppointment(appointment.appointment_id)}
                                                >
                                                    <FaCheck className="me-2" />
                                                    Confirm Appointment
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
    );
};

export default DoctorDashboard;