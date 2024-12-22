import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaDumbbell, FaUserMd, FaHandsHelping, FaUsers, FaBars } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`d-flex flex-column bg-light vh-100 ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{ width: isOpen ? '250px' : '80px' }}>
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <button
          onClick={toggleSidebar}
          className="btn btn-light border-0 d-flex align-items-center"
        >
          <FaBars size={20} />
        </button>
      </div>
      <ul className="nav flex-column mt-3">
        <li className="nav-item">
          <Link to="/physical-fitness" className="nav-link d-flex align-items-center text-dark">
            <FaDumbbell size={20} className="me-2" />
            {isOpen && <span>Physical Fitness</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/doctor" className="nav-link d-flex align-items-center text-dark">
            <FaUserMd size={20} className="me-2" />
            {isOpen && <span>Doctor</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/assistance" className="nav-link d-flex align-items-center text-dark">
            <FaHandsHelping size={20} className="me-2" />
            {isOpen && <span>Assistance</span>}
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/social-media" className="nav-link d-flex align-items-center text-dark">
            <FaUsers size={20} className="me-2" />
            {isOpen && <span>Social Media</span>}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
