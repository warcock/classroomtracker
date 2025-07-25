import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, ClipboardList, MessageSquare } from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'https://classroomtracker-backend.onrender.com';

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/hub');
      return;
    }
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/admin/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user, token, navigate]);

  if (!user || user.role !== 'admin') return null;

  // Helper for skeleton card
  const SkeletonCard = ({ colorClass }: { colorClass: string }) => (
    <div className={`card h-100 shadow-sm border-0 rounded-4 p-4 d-flex flex-column justify-content-between align-items-center position-relative ${colorClass} bg-gradient`} style={{minHeight: 230}}>
      <div className="d-flex align-items-center gap-2 mb-2 w-100">
        <span className="placeholder-glow w-50"><span className="placeholder col-8 rounded-pill" style={{height: 28, display: 'inline-block'}}></span></span>
      </div>
      <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center w-100">
        <div className="placeholder-glow mb-2 w-75">
          <span className="placeholder col-12 rounded" style={{height: 48, display: 'inline-block'}}></span>
        </div>
        <div className="placeholder-glow w-75">
          <span className="placeholder col-10 rounded-pill" style={{height: 18, display: 'inline-block'}}></span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <div
        className="p-4 p-md-5 mb-4 rounded-4 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.7))',
          boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
          border: 'none',
          borderRadius: '1.5rem',
        }}
      >
        <h1 className="fw-bold mb-5" style={{fontSize: '2.3rem'}}>Admin Analytics Dashboard</h1>
        <div className="row g-4">
          {/* Users Card */}
          <div className="col-12 col-md-6 col-lg-3">
            {loading || error ? (
              <SkeletonCard colorClass="bg-primary text-white" />
            ) : (
              <div className="card h-100 shadow-sm border-0 rounded-4 p-4 d-flex flex-column justify-content-between align-items-center position-relative bg-primary bg-gradient text-white" style={{minHeight: 230}}>
                <div className="d-flex align-items-center gap-2 mb-2 w-100">
                  <Users size={28} className="me-2" />
                  <span className="fw-bold fs-5">Users</span>
                </div>
                <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center w-100">
                  <div className="fs-1 fw-bold mb-2">{analytics.users}</div>
                  <div className="small">Total registered users</div>
                </div>
              </div>
            )}
          </div>
          {/* Classrooms Card */}
          <div className="col-12 col-md-6 col-lg-3">
            {loading || error ? (
              <SkeletonCard colorClass="bg-success text-white" />
            ) : (
              <div className="card h-100 shadow-sm border-0 rounded-4 p-4 d-flex flex-column justify-content-between align-items-center position-relative bg-success bg-gradient text-white" style={{minHeight: 230}}>
                <div className="d-flex align-items-center gap-2 mb-2 w-100">
                  <BookOpen size={28} className="me-2" />
                  <span className="fw-bold fs-5">Classrooms</span>
                </div>
                <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center w-100">
                  <div className="fs-1 fw-bold mb-2">{analytics.classrooms}</div>
                  <div className="small">Active classrooms</div>
                </div>
              </div>
            )}
          </div>
          {/* Tasks Card */}
          <div className="col-12 col-md-6 col-lg-3">
            {loading || error ? (
              <SkeletonCard colorClass="bg-warning text-dark" />
            ) : (
              <div className="card h-100 shadow-sm border-0 rounded-4 p-4 d-flex flex-column justify-content-between align-items-center position-relative bg-warning bg-gradient text-dark" style={{minHeight: 230}}>
                <div className="d-flex align-items-center gap-2 mb-2 w-100">
                  <ClipboardList size={28} className="me-2" />
                  <span className="fw-bold fs-5">Tasks</span>
                </div>
                <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center w-100">
                  <div className="fs-1 fw-bold mb-2">{analytics.tasks}</div>
                  <div className="small">Tasks created</div>
                </div>
              </div>
            )}
          </div>
          {/* Messages Card */}
          <div className="col-12 col-md-6 col-lg-3">
            {loading || error ? (
              <SkeletonCard colorClass="bg-info text-white" />
            ) : (
              <div className="card h-100 shadow-sm border-0 rounded-4 p-4 d-flex flex-column justify-content-between align-items-center position-relative bg-info bg-gradient text-white" style={{minHeight: 230}}>
                <div className="d-flex align-items-center gap-2 mb-2 w-100">
                  <MessageSquare size={28} className="me-2" />
                  <span className="fw-bold fs-5">Messages</span>
                </div>
                <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center w-100">
                  <div className="fs-1 fw-bold mb-2">{analytics.messages}</div>
                  <div className="small">Chat messages sent</div>
                </div>
              </div>
            )}
          </div>
        </div>
        {error && <div className="text-danger mt-4">Error: {error}</div>}
      </div>
    </div>
  );
};

export default AdminAnalytics; 