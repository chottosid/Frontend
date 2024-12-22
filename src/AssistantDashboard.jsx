import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaMapMarkerAlt, FaClipboardList, FaCheck, FaClock } from 'react-icons/fa';

const AssistantDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [activeRequest, setActiveRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [acceptingRequestId, setAcceptingRequestId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('pending');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const assistantId = localStorage.getItem('assistant_id');
                const response = await axios.get(`http://localhost:8000/pending/requests/${assistantId}/`);
                setRequests(response.data);
            } catch (error) {
                setError('Failed to fetch requests');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleAcceptRequest = async (request) => {
        if (activeRequest) {
            alert("You already have an active request!");
            return;
        }

        setAcceptingRequestId(request.requestId);
        try {
            await axios.post('http://localhost:8000/pending/confirm/', {
                "requestId": request.requestId,
                "assistantId": localStorage.getItem('assistant_id')
            });

            setActiveRequest(request);
            setRequests(prevRequests => 
                prevRequests.filter(req => req.requestId !== request.requestId)
            );
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('Failed to accept request. Please try again.');
        } finally {
            setAcceptingRequestId(null);
        }
    };

    const handleCompleteRequest = async (request) => {
        try {
            await axios.post('http://localhost:8000/pending/completed/', {
                "requestId": request.requestId,
                "assistantId": localStorage.getItem('assistant_id')
            });
            
            setActiveRequest(null);
            setRequests(prevRequests => 
                prevRequests.map(req => 
                    req.requestId === request.requestId 
                        ? {...req, status: 'completed'} 
                        : req
                )
            );
        } catch (error) {
            console.error('Error completing request:', error);
            alert('Failed to complete request. Please try again.');
        }
    };

    return (
        <div className="min-vh-100 bg-light py-4">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>
                        <FaClipboardList className="me-2 text-primary" />
                        Assistance Requests
                    </h2>
                    <div className="btn-group">
                        <button 
                            className={`btn ${statusFilter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setStatusFilter('pending')}
                        >
                            Pending
                        </button>
                        <button 
                            className={`btn ${statusFilter === 'accepted' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setStatusFilter('accepted')}
                        >
                            Accepted
                        </button>
                        <button 
                            className={`btn ${statusFilter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setStatusFilter('completed')}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {requests
                            .filter(request => request.status === statusFilter)
                            .map(request => (
                                <div key={request.requestId} className="col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="card-title mb-0">
                                                    <FaUser className="me-2 text-primary" />
                                                    {request.userName}
                                                </h5>
                                                <small className="text-muted">
                                                    {new Date(request.created_at).toLocaleString()}
                                                </small>
                                            </div>
                                            <div className="mb-3">
                                                <FaClipboardList className="me-2 text-muted" />
                                                <strong>Type:</strong> {request.category}
                                            </div>
                                            <div className="mb-3">
                                                <FaMapMarkerAlt className="me-2 text-danger" />
                                                <span className="text-muted">
                                                    Location: {request.latitude}, {request.longitude}
                                                </span>
                                            </div>
                                            <p className="mb-4 text-muted">{request.description}</p>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <span className={`badge ${
                                                    request.status === 'pending' ? 'bg-warning' :
                                                    request.status === 'accepted' ? 'bg-info' :
                                                    'bg-success'
                                                }`}>
                                                    {request.status}
                                                </span>
                                            </div>
                                            {request.status === 'pending' && !activeRequest && (
                                                <button 
                                                    className="btn btn-primary w-100"
                                                    onClick={() => handleAcceptRequest(request)}
                                                    disabled={acceptingRequestId === request.requestId}
                                                >
                                                    {acceptingRequestId === request.requestId ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" />
                                                            Accepting...
                                                        </>
                                                    ) : (
                                                        'Accept Request'
                                                    )}
                                                </button>
                                            )}

                                            {request.status === 'accepted' && (
                                                <button 
                                                    className="btn btn-success w-100"
                                                    onClick={() => handleCompleteRequest(request)}
                                                >
                                                    <FaCheck className="me-2" />
                                                    Mark as Completed
                                                </button>
                                            )}

                                            {/* No buttons for completed requests */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssistantDashboard;