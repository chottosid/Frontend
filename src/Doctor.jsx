import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarLayout from './components/SidebarLayout';
import { FaSearch, FaUserMd, FaMapMarkerAlt, FaClock, FaCalendar } from 'react-icons/fa';
// import './css/doctor.css';

const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAppointments, setShowAppointments] = useState(false);
    const [appointments, setAppointments] = useState([]);

    // Morning slots: 9:00 AM to 12:00 PM
    const morningSlots = ['09:00', '10:00', '11:00', '12:00'];
    // Evening slots: 4:00 PM to 9:00 PM
    const eveningSlots = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:8000/doctor/all/');
            setDoctors(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            setLoading(false);
        }
    };

    const fetchAppointments = async () => {
        try {
            const user_id = localStorage.getItem('user_id');
            const response = await axios.get(
                `http://localhost:8000/doctor/appointment/user/${user_id}/`
            );
            setAppointments(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch appointments');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!showAppointments) {
            fetchDoctors();
        } else {
            fetchAppointments();
        }
    }, [showAppointments]);

    // Add useEffect for body class management
    useEffect(() => {
        if (showModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [showModal]);

    const handleBookAppointment = (doctor) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
        setError('');
    };

    const handleSubmitAppointment = async (e) => {
        e.preventDefault();
        setBookingLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:8000/doctor/appointment/add/', {
                user_id: localStorage.getItem('user_id'),
                doctor_id: selectedDoctor.doctor_id,
                date: appointmentDate,
                time: appointmentTime
            });

            setShowModal(false);
            setSelectedDoctor(null);
            setAppointmentDate('');
            setAppointmentTime('');
            alert('Appointment booked successfully!');
        } catch (error) {
            setError('Failed to book appointment. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSpecialty = specialtyFilter === 'all' || 
            doctor.specialization === specialtyFilter;

        return matchesSearch && matchesSpecialty;
    });

    // Update modal styles
    const modalStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black
        backdropFilter: 'blur(3px)', // slight blur effect
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    // Update modalContentStyles
    const modalContentStyles = {
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: '700px', // Increased from 500px
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
    };

    const DoctorCard = ({ doctor, onBookAppointment }) => (
        <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                        {doctor.profile_picture ? (
                            <img
                                src={doctor.profile_picture}
                                alt={doctor.name}
                                className="rounded-circle me-3"
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div className="me-3">
                                <div className="bg-primary text-white rounded-circle p-3">
                                    <FaUserMd size={24} />
                                </div>
                            </div>
                        )}
                        <div>
                            <h5 className="card-title mb-1">{doctor.name}</h5>
                            <p className="card-text text-muted mb-1">
                                {doctor.specialization}
                            </p>
                            <small className="text-muted">
                                {doctor.gender}
                            </small>
                        </div>
                    </div>
                    <div className="border-top pt-3">
                        <div className="row mb-3">
                            <div className="col-12 mb-2">
                                <small className="text-muted">Experience</small>
                                <p className="mb-0">{doctor.experience} years</p>
                            </div>
                            <div className="col-12">
                                <small className="text-muted">
                                    <FaMapMarkerAlt className="me-1" />
                                    Address
                                </small>
                                <p className="mb-0">{doctor.address}</p>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary w-100"
                            onClick={() => onBookAppointment(doctor)}
                        >
                            Book Appointment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <SidebarLayout>
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>{showAppointments ? 'My Appointments' : 'Find a Doctor'}</h2>
                    <button 
                        className="btn btn-outline-primary"
                        onClick={() => setShowAppointments(!showAppointments)}
                    >
                        {showAppointments ? 'Find Doctors' : 'View My Appointments'}
                    </button>
                </div>

                {!showAppointments && (
                    <div className="row mb-4">
                        <div className="col-md-8">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FaSearch />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search doctors..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={specialtyFilter}
                                onChange={(e) => setSpecialtyFilter(e.target.value)}
                            >
                                <option value="all">All Specialties</option>
                                <option value="Cardiologist">Cardiologist</option>
                                <option value="Orthopedic">Orthopedic</option>
                                <option value="Pediatrician">Pediatrician</option>
                            </select>
                        </div>
                    </div>
                )}
                
                {!showAppointments && (
                    <div className="row">
                        {filteredDoctors.map(doctor => (
                            <DoctorCard key={doctor.doctor_id} doctor={doctor} onBookAppointment={handleBookAppointment} />
                        ))}
                    </div>
                )}
                
                {showAppointments && (
                    <div className="row">
                        {appointments.map(appointment => (
                            <div key={appointment.appointment_id} className="col-md-6 mb-4">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between mb-3">
                                            <h5 className="card-title">
                                                <FaUserMd className="me-2" />
                                                Dr. {appointment.doctor_name}
                                            </h5>
                                            <span className={`badge ${
                                                appointment.status === 'pending' ? 'bg-warning' : 'bg-success'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                        <p className="text-muted mb-2">
                                            <strong>Specialization:</strong> {appointment.specialization}
                                        </p>
                                        <div className="d-flex mb-2">
                                            <div className="me-4">
                                                <FaCalendar className="me-2" />
                                                {appointment.date}
                                            </div>
                                            <div>
                                                <FaClock className="me-2" />
                                                {appointment.time}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Appointment Booking Modal */}
            {showModal && (
                <div style={modalStyles}>
                    <div className="modal-dialog" style={modalContentStyles}>
                        <div className="modal-content">
                            <div className="modal-header border-bottom">
                                <h4 className="modal-title fw-bold">Book Appointment with Dr. {selectedDoctor.name}</h4>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmitAppointment}>
                                <div className="modal-body p-4">
                                    {error && <div className="alert alert-danger">{error}</div>}
                                    
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Select Date</label>
                                            <input
                                                type="date"
                                                className="form-control form-control-lg"
                                                value={appointmentDate}
                                                onChange={(e) => setAppointmentDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold">Select Time</label>
                                            <select
                                                className="form-select form-select-lg"
                                                value={appointmentTime}
                                                onChange={(e) => setAppointmentTime(e.target.value)}
                                                required
                                            >
                                                <option value="">Choose a time slot</option>
                                                <optgroup label="Morning Slots">
                                                    {morningSlots.map(slot => (
                                                        <option key={slot} value={slot}>
                                                            {slot} {parseInt(slot) < 12 ? 'AM' : 'PM'}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                                <optgroup label="Evening Slots">
                                                    {eveningSlots.map(slot => (
                                                        <option key={slot} value={slot}>
                                                            {parseInt(slot) > 12 ? 
                                                                `${parseInt(slot)-12}:00 PM` : 
                                                                `${slot} PM`}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="alert alert-info mt-3">
                                        <small>
                                            <FaClock className="me-2" />
                                            Each appointment slot is for 1 hour duration
                                        </small>
                                    </div>
                                </div>
                                <div className="modal-footer border-top p-3">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary btn-lg px-4"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg px-4" 
                                        disabled={bookingLoading}
                                    >
                                        {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
};

export default Doctor;