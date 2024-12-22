import React, { useState, useEffect } from 'react';
import SidebarLayout from './components/SidebarLayout';
import MapComponent from './components/MapComponent';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const AssistancePage = () => {
    const [location, setLocation] = useState(null);
    const [assistanceType, setAssistanceType] = useState('');
    const [description, setDescription] = useState('');
    const [assistants, setAssistants] = useState([]);
    const [selectedAssistant, setSelectedAssistant] = useState(null);
    const [showAssistants, setShowAssistants] = useState(false);
    const [showPendingRequests, setShowPendingRequests] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => console.error(error)
        );
    }, []);

    // Add function to calculate distance
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return (R * c).toFixed(1); // Distance in km
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:8000/assistant/all/');
            
            // Add distance calculation to each assistant
            const assistantsWithDistance = response.data.map(assistant => ({
                ...assistant,
                id: assistant.assistant_id,
                distance: `${calculateDistance(
                    location.lat, 
                    location.lng, 
                    assistant.latitude, 
                    assistant.longitude
                )} km`,
                location: {
                    lat: assistant.latitude,
                    lng: assistant.longitude
                }
            }));

            setAssistants(assistantsWithDistance);
            setShowAssistants(true);
        } catch (error) {
            console.error("Error fetching assistants:", error);
            alert("Failed to fetch nearby assistants");
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const user_id = localStorage.getItem('user_id');
            const response = await axios.get(
                `http://localhost:8000/pending/requests/user/${user_id}/`
            );
            setPendingRequests(response.data);
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            alert("Failed to fetch pending requests");
        }
    };

    const handleRequestAssistant = async (assistant) => {
        try {
            const requestData = {
                userId: localStorage.getItem('user_id'),
                assistantId: assistant.assistant_id,
                category: assistanceType,
                description: description,
                latitude: location.lat,
                longitude: location.lng
            };

            await axios.post('http://localhost:8000/pending/send/', requestData);
            
            alert('Request sent successfully!');
            setAssistanceType('');
            setDescription('');
            setSelectedAssistant(null);
            setShowAssistants(false);
        } catch (error) {
            console.error('Error sending request:', error);
            alert('Failed to send request. Please try again.');
        }
    };

    return (
        <SidebarLayout>
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>{showPendingRequests ? 'My Pending Requests' : 'Request Assistance'}</h2>
                    <button 
                        className="btn btn-outline-primary"
                        onClick={() => {
                            setShowPendingRequests(!showPendingRequests);
                            if (!showPendingRequests) {
                                fetchPendingRequests();
                            }
                        }}
                    >
                        {showPendingRequests ? 'New Request' : 'View My Requests'}
                    </button>
                </div>

                {!showPendingRequests ? (
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title mb-4">Request Assistance</h5>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <select 
                                                className="form-select"
                                                value={assistanceType}
                                                onChange={(e) => setAssistanceType(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Assistance Type</option>
                                                <option value="emergency">Emergency</option>
                                                <option value="grocery">Grocery</option>
                                                <option value="doctor">Doctor Visit</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <textarea
                                                className="form-control"
                                                placeholder="Describe your needs..."
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                rows="3"
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary w-100">
                                            Find Assistants
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Add Assistants List */}
                            {showAssistants && assistants.length > 0 && (
                                <div className="card shadow-sm mt-4">
                                    <div className="card-body">
                                        <h5 className="card-title mb-4">Available Assistants</h5>
                                        {assistants.map(assistant => (
                                            <div 
                                                key={assistant.assistant_id} 
                                                className={`d-flex align-items-center p-3 border rounded mb-3 ${
                                                    selectedAssistant?.assistant_id === assistant.assistant_id 
                                                        ? 'bg-light' 
                                                        : ''
                                                }`}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setSelectedAssistant(assistant)}
                                            >
                                                {assistant.profile_picture && (
                                                    <img 
                                                        src={assistant.profile_picture}
                                                        alt=""
                                                        className="rounded-circle me-3"
                                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                                    />
                                                )}
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-0">{assistant.name}</h6>
                                                    <small className="text-muted">
                                                        <FaMapMarkerAlt className="me-1" />
                                                        {assistant.distance}
                                                    </small>
                                                    {assistant.number && (
                                                        <small className="text-muted d-block">
                                                            Contact: {assistant.number}
                                                        </small>
                                                    )}
                                                </div>
                                                <button 
                                                    className="btn btn-primary btn-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRequestAssistant(assistant);
                                                    }}
                                                >
                                                    Request
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <MapComponent 
                                        userLocation={location}
                                        assistants={assistants}
                                        selectedAssistant={selectedAssistant}
                                        onAssistantSelect={setSelectedAssistant}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        {pendingRequests.map(request => (
                            <div key={request.requestId} className="col-md-6 mb-4">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="card-title">{request.category}</h5>
                                            <span className={`badge ${
                                                request.status === 'pending' ? 'bg-warning' :
                                                request.status === 'accepted' ? 'bg-info' :
                                                'bg-success'
                                            }`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <p className="mb-3">{request.description}</p>
                                        <div className="mb-2">
                                            <FaMapMarkerAlt className="text-danger me-2" />
                                            <small>
                                                Location: {request.latitude}, {request.longitude}
                                            </small>
                                        </div>
                                        <small className="text-muted d-block">
                                            Created: {new Date(request.created_at).toLocaleString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
};

export default AssistancePage;