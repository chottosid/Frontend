import React, { useState } from 'react';
import { FaBell, FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';

const TopBar = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'John liked your post', time: '5m ago' },
        { id: 2, text: 'New comment on your post', time: '10m ago' }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

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
                                <div className="position-absolute top-100 end-0 mt-2 dropdown-menu show">
                                    {notifications.map(notif => (
                                        <div key={notif.id} className="dropdown-item">
                                            <small className="text-muted">{notif.time}</small>
                                            <p className="mb-0">{notif.text}</p>
                                        </div>
                                    ))}
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