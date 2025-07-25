import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light" style={{background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)'}}>
      <div className="card p-5 shadow-lg rounded-4 text-center" style={{maxWidth: 480}}>
        <h1 className="display-3 fw-bold text-warning mb-3">404</h1>
        <h2 className="fw-bold mb-2">Page Not Found</h2>
        <p className="text-muted mb-4">Sorry, the page you are looking for does not exist or has been moved.</p>
        <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold" onClick={() => navigate('/')}>Go to Home</button>
      </div>
      <style>{`
        body { background: linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%); }
      `}</style>
    </div>
  );
};

export default NotFound;
