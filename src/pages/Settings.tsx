import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Person, Envelope, Key, PencilSquare, ArrowLeft } from 'react-bootstrap-icons'
import { motion } from 'framer-motion'

const Settings = () => {
  const { user, updateProfile, updateEmail, updatePassword, isLoading, error } = useAuth()
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    nickname: user?.nickname || ''
  })
  const [emailForm, setEmailForm] = useState({
    email: ''
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [section, setSection] = useState<'profile'|'email'|'password'>('profile')
  const navigate = useNavigate()

  // Handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
    setSuccess(null)
  }
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailForm({ ...emailForm, [e.target.name]: e.target.value })
    setSuccess(null)
  }
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
    setSuccess(null)
  }

  // Submits
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile(profileForm)
      setSuccess('Profile updated successfully!')
    } catch {}
  }
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateEmail(emailForm.email)
      setSuccess('Email updated successfully!')
    } catch {}
  }
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSuccess(null)
      return alert('New passwords do not match!')
    }
    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword)
      setSuccess('Password updated successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch {}
  }

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{background: 'rgba(245,245,245,0.92)', fontFamily: 'Poppins, Inter, Arial, sans-serif'}}>
      <motion.div
        className="card shadow-lg border-0 rounded-4 p-4 p-md-5"
        style={{maxWidth: 500, width: '100%', background: 'rgba(255,255,255,0.99)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '1.5px solid #e9ecef'}}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="d-flex align-items-center mb-4 gap-2">
          <button className="btn btn-light border-0 p-0 me-2" onClick={() => navigate('/hub')} title="Back to Hub"><ArrowLeft size={24} /></button>
          <h2 className="fw-bold mb-0 text-warning text-center flex-grow-1" style={{fontSize: '2.1rem', letterSpacing: '-1px'}}>Settings</h2>
        </div>
        <div className="d-flex justify-content-center gap-2 mb-4">
          <button className={`btn btn-sm rounded-pill px-3 fw-bold ${section==='profile'?'btn-warning text-dark':'btn-outline-warning'}`} onClick={()=>setSection('profile')}><Person className="me-1"/>Profile</button>
          <button className={`btn btn-sm rounded-pill px-3 fw-bold ${section==='email'?'btn-warning text-dark':'btn-outline-warning'}`} onClick={()=>setSection('email')}><Envelope className="me-1"/>Email</button>
          <button className={`btn btn-sm rounded-pill px-3 fw-bold ${section==='password'?'btn-warning text-dark':'btn-outline-warning'}`} onClick={()=>setSection('password')}><Key className="me-1"/>Password</button>
        </div>
        {section==='profile' && (
          <form onSubmit={handleProfileSubmit} autoComplete="off">
            <div className="mb-3">
              <label className="form-label fw-bold">Full Name</label>
              <div className="input-group rounded-pill border border-2" style={{overflow: 'hidden', borderColor: '#a259ff', background: '#fff'}}>
                <span className="input-group-text bg-white border-0"><PencilSquare size={18}/></span>
                <input
                  type="text"
                  className="form-control border-0 ps-0"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                  style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', background: 'transparent', color: '#222'}}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Nickname</label>
              <div className="input-group rounded-pill border border-2" style={{overflow: 'hidden', borderColor: '#a259ff', background: '#fff'}}>
                <span className="input-group-text bg-white border-0"><Person size={18}/></span>
                <input
                  type="text"
                  className="form-control border-0 ps-0"
                  name="nickname"
                  value={profileForm.nickname}
                  onChange={handleProfileChange}
                  required
                  style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', background: 'transparent', color: '#222'}}
                />
              </div>
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}
            <button type="submit" className="btn btn-warning w-100 fw-bold mb-2" disabled={isLoading} style={{fontSize: '1.1rem', borderRadius: '2rem'}}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
        {section==='email' && (
          <form onSubmit={handleEmailSubmit} autoComplete="off">
            <div className="mb-3">
              <label className="form-label fw-bold">Current Email Address</label>
              <div className="input-group rounded-pill border border-2 mb-2" style={{overflow: 'hidden', borderColor: '#a259ff', background: '#f8f9fa'}}>
                <span className="input-group-text bg-white border-0"><Envelope size={18}/></span>
                <input
                  type="email"
                  className="form-control border-0 ps-0"
                  value={user?.email || ''}
                  disabled
                  style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', background: 'transparent', color: '#888'}}
                />
              </div>
              <label className="form-label fw-bold">New Email Address</label>
              <div className="input-group rounded-pill border border-2" style={{overflow: 'hidden', borderColor: '#a259ff', background: '#fff'}}>
                <span className="input-group-text bg-white border-0"><Envelope size={18}/></span>
                <input
                  type="email"
                  className="form-control border-0 ps-0"
                  name="email"
                  value={emailForm.email}
                  onChange={handleEmailChange}
                  required
                  style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', background: 'transparent', color: '#222'}}
                />
              </div>
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}
            <button type="submit" className="btn btn-warning w-100 fw-bold mb-2" disabled={isLoading} style={{fontSize: '1.1rem', borderRadius: '2rem'}}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
        {section==='password' && (
          <form onSubmit={handlePasswordSubmit} autoComplete="off">
            <div className="mb-3">
              <label className="form-label fw-bold">Current Password</label>
              <div className="input-group rounded-pill border border-2" style={{overflow: 'hidden', borderColor: '#a259ff', background: '#ededed'}}>
                <span className="input-group-text bg-white border-0"><Key size={18}/></span>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  className="form-control border-0 ps-0"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', background: 'transparent', color: '#222'}}
                />
                <button
                  type="button"
                  className="btn btn-light border-0"
                  tabIndex={-1}
                  onClick={() => setShowCurrent(v => !v)}
                  style={{outline: 'none'}}
                >
                  <span className="text-muted">{showCurrent ? '🙈' : '👁️'}</span>
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">New Password</label>
              <div className="input-group rounded-pill border border-2" style={{overflow: 'hidden', borderColor: '#a259ff', background: '#ededed'}}>
                <span className="input-group-text bg-white border-0"><Key size={18}/></span>
                <input
                  type={showNew ? 'text' : 'password'}
                  className="form-control border-0 ps-0"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', background: 'transparent', color: '#222'}}
                />
                <button
                  type="button"
                  className="btn btn-light border-0"
                  tabIndex={-1}
                  onClick={() => setShowNew(v => !v)}
                  style={{outline: 'none'}}
                >
                  <span className="text-muted">{showNew ? '🙈' : '👁️'}</span>
                </button>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Confirm New Password</label>
              <div className="input-group rounded-pill border border-2" style={{overflow: 'hidden', borderColor: '#a259ff', background: '#ededed'}}>
                <span className="input-group-text bg-white border-0"><Key size={18}/></span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="form-control border-0 ps-0"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', background: 'transparent', color: '#222'}}
                />
                <button
                  type="button"
                  className="btn btn-light border-0"
                  tabIndex={-1}
                  onClick={() => setShowConfirm(v => !v)}
                  style={{outline: 'none'}}
                >
                  <span className="text-muted">{showConfirm ? '🙈' : '👁️'}</span>
                </button>
              </div>
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {success && <div className="alert alert-success py-2">{success}</div>}
            <button type="submit" className="btn btn-warning w-100 fw-bold mb-2" disabled={isLoading} style={{fontSize: '1.1rem', borderRadius: '2rem'}}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}

export default Settings 