import React from 'react';
import SidebarLayout from './components/SidebarLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
const HomePage = () => {
    return (
        <SidebarLayout>
            <div className="container mt-5">
                <h1 className="text-center">Home</h1>
                <p className="text-center">Welcome to the home page.</p>
            </div>
        </SidebarLayout>
    )
};

export default HomePage;