import React from 'react';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

const SidebarLayout = ({ children }) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-auto p-0">
          <Sidebar />
        </div>
        <div className="col">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;