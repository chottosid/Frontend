import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell, FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';

const TopBar = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const userId = localStorage.getItem('user_id');
                const response = await axios.get(`http://localhost:8000/user/notifications/all/${userId}/`);
                setNotifications(response.data);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    // Format time difference
    const formatTime = (dateString) => {
        const diff = new Date() - new Date(dateString);
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return new Date(dateString).toLocaleDateString();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
            <div className="container-fluid">
                <div className="d-flex align-items-center w-100">
                    <div className="flex-grow-1">
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0">
                                <FaSearch className="text-muted" />
                            </span>
                            <input
                                type="text"
                                className="form-control border-0 bg-light"
                                placeholder="Search..."
                            />
                        </div>
                    </div>
                    
                    <div className="ms-3 d-flex align-items-center">
                        <div className="position-relative me-3">
                            <button
                                className="btn btn-light position-relative"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <FaBell />
                                {notifications.length > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                            
                            {showNotifications && (
                                <div className="position-absolute top-100 end-0 mt-2 dropdown-menu show" 
                                    style={{ 
                                        width: '300px',
                                        maxHeight: '400px',
                                        overflowY: 'auto'
                                    }}>
                                    {notifications.length > 0 ? (
                                        notifications.map(notif => (
                                            <div key={notif.notification_id} 
                                                className="dropdown-item py-2"
                                                style={{ whiteSpace: 'normal' }}>
                                                <small className="text-muted d-block mb-1">
                                                    {formatTime(notif.created_at)}
                                                </small>
                                                <p className="mb-0" 
                                                    style={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: '2',
                                                        WebkitBoxOrient: 'vertical',
                                                        lineHeight: '1.3'
                                                    }}>
                                                    {notif.content}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="dropdown-item text-muted">
                                            No new notifications
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="position-relative">
                            <button
                                className="btn btn-light rounded-circle"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <FaUser />
                            </button>
                            
                            {showUserMenu && (
                                <div className="position-absolute top-100 end-0 mt-2 dropdown-menu show">
                                    <button className="dropdown-item" onClick={handleLogout}>
                                        <FaSignOutAlt className="me-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopBar;