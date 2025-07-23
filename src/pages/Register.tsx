import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Person, Lock, Envelope } from 'react-bootstrap-icons'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, isLoading, error } = useAuth()
  const navigate = useNavigate()
  const [navOpen, setNavOpen] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    try {
      await register(formData.name, formData.nickname, formData.email, formData.password, formData.role)
      navigate('/hub')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <div
      className="min-vh-100 position-relative d-flex flex-column"
      style={{ backgroundImage: 'url(/Rama5UpscaledBetter.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.4)', zIndex: 0 }} />

      {/* Logo at top left */}
      <div className="position-absolute top-0 start-0 mt-4 ms-4 z-2" style={{ userSelect: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          <img src="/1.png" alt="Logo" style={{ width: '200px', height: '200px' }} />
        </div>
      </div>

      {/* Navigation Bar - floating at top right */}
      <nav className="position-absolute top-0 end-0 mt-3 me-2 me-md-5 z-2" aria-label="Main navigation">
        <div className="d-none d-md-flex nav-glass rounded-pill px-4 py-2 gap-3 align-items-center shadow-lg">
          <Link to="/" className="nav-link nav-link-custom px-2">HOME</Link>
          <a href="/#about" className="nav-link nav-link-custom px-2">ABOUT US</a>
          <a href="/#contact" className="nav-link nav-link-custom px-2">CONTACT</a>
          <Link to="/login" className="nav-link nav-link-custom px-2">LOGIN</Link>
        </div>
        {/* Hamburger for mobile */}
        <button className="d-md-none btn nav-glass rounded-circle p-2 border-0 shadow-lg" aria-label="Open navigation menu" onClick={() => setNavOpen(v => !v)}>
          <span className="navbar-toggler-icon" />
        </button>
        {navOpen && (
          <>
            <div className="nav-backdrop" onClick={()=>setNavOpen(false)}></div>
            <div className="position-absolute end-0 mt-2 nav-glass rounded-3 shadow-lg p-3 d-flex flex-column gap-2 animate-fade-in" style={{minWidth: 180}}>
              <Link to="/" className="nav-link nav-link-custom" onClick={()=>setNavOpen(false)}>HOME</Link>
              <a href="/#about" className="nav-link nav-link-custom" onClick={()=>setNavOpen(false)}>ABOUT US</a>
              <a href="/#contact" className="nav-link nav-link-custom" onClick={()=>setNavOpen(false)}>CONTACT</a>
              <Link to="/login" className="nav-link nav-link-custom" onClick={()=>setNavOpen(false)}>LOGIN</Link>
            </div>
          </>
        )}
      </nav>

      {/* Register Card */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-end pe-0 pe-md-5" style={{zIndex: 1, minHeight: '100vh'}}>
        <div className="card shadow-lg border-0 rounded-4 px-4 px-md-5 py-5" style={{maxWidth: 600, minHeight: '70vh', width: '100%', background: 'rgba(255,255,255,0.9)', fontFamily: 'Poppins, Inter, Arial, sans-serif', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h2 className="fw-bold mb-4 text-warning text-start" style={{fontSize: '2.7rem', letterSpacing: '-1px', marginTop: 0}}>Sign up</h2>
          
          {error && (
            <div className="alert alert-danger mb-3" role="alert">
              {error}
            </div>
          )}
          
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="input-group rounded-pill border border-2" style={{overflow: 'hidden', borderColor: '#a259ff', background: '#fff'}}>
                <span className="input-group-text bg-white border-0"><Person size={20} /></span>
                <input
                  type="text"
                  name="name"
                  className="form-control border-0 ps-0"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', background: 'transparent', color: '#222'}}
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group rounded-pill border border-2" style={{overflow: 'hidden', borderColor: '#a259ff', background: '#fff'}}>
                <span className="input-group-text bg-white border-0"><Person size={20} /></span>
                <input
                  type="text"
                  name="nickname"
                  className="form-control border-0 ps-0"
                  placeholder="Nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  required
                  style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', background: 'transparent', color: '#222'}}
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group rounded-pill border border-2" style={{overflow: 'hidden', borderColor: '#a259ff', background: '#fff'}}>
                <span className="input-group-text bg-white border-0"><Envelope size={20} /></span>
                <input
                  type="email"
                  name="email"
                  className="form-control border-0 ps-0"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', background: 'transparent', color: '#222'}}
                />
              </div>
            </div>
            <div className="mb-3">
              <select
                name="role"
                className="form-select rounded-pill border border-2"
                value={formData.role}
                onChange={handleChange}
                style={{borderColor: '#a259ff', fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', color: '#222'}}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div className="mb-3">
              <div className="input-group rounded-pill border-0" style={{overflow: 'hidden', background: '#ffffffff'}}>
                <span className="input-group-text bg-transparent border-0"><Lock size={20} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control border-0 ps-0"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', background: 'transparent', color: '#222'}}
                />
                <button
                  type="button"
                  className="btn btn-light border-0"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  style={{outline: 'none'}}
                >
                  <span className="text-muted">{showPassword ? '🙈' : '👁️'}</span>
                </button>
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group rounded-pill border-0" style={{overflow: 'hidden', background: '#ffffffff'}}>
                <span className="input-group-text bg-transparent border-0"><Lock size={20} /></span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-control border-0 ps-0"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', background: 'transparent', color: '#222'}}
                />
                <button
                  type="button"
                  className="btn btn-light border-0"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(v => !v)}
                  style={{outline: 'none'}}
                >
                  <span className="text-muted">{showConfirmPassword ? '🙈' : '👁️'}</span>
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              className="btn w-100 py-2 mb-3" 
              disabled={isLoading}
              style={{background: '#ffb84d', color: '#222', fontWeight: 700, fontSize: '1.2rem', borderRadius: '2rem', fontFamily: 'Poppins, Inter, Arial, sans-serif'}}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Creating Account...
                </>
              ) : (
                'Sign up'
              )}
            </button>
            <div className="text-start">
              <span style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1rem'}}>Already have an account? <Link to="/login" className="text-warning fw-bold">Login</Link></span>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
        .nav-glass {
          background: rgba(30, 30, 40, 0.65);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 24px rgba(0,0,0,0.18);
        }
        .nav-link-custom {
          color: #fff;
          font-family: 'Poppins', 'Inter', Arial, sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          position: relative;
          transition: color 0.2s;
        }
        .nav-link-custom:hover, .nav-link-custom:focus {
          color: #ffb84d;
          text-decoration: none;
        }
        .nav-link-custom.active {
          color: #ffb84d;
        }
        .nav-link-custom.active::after, .nav-link-custom:hover::after, .nav-link-custom:focus::after {
          content: '';
          display: block;
          margin: 0 auto;
          width: 60%;
          border-bottom: 2.5px solid #ffb84d;
          border-radius: 2px;
          margin-top: 2px;
        }
        .nav-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.18);
          z-index: 1040;
          animation: fadeIn 0.2s;
        }
        .animate-fade-in {
          animation: fadeIn 0.25s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-control:focus, .input-group:focus-within, .form-select:focus {
          border-color: #ffb84d !important;
          box-shadow: 0 0 0 2px #ffb84d33 !important;
        }
        @media (max-width: 991.98px) {
          .flex-grow-1.d-flex.justify-content-end {
            justify-content: center !important;
            padding-right: 0 !important;
          }
          .card {
            min-height: unset !important;
            max-width: 98vw !important;
            padding: 2rem 1rem !important;
          }
        }
        @media (max-width: 575.98px) {
          /* Logo is now always visible */
        }
      `}</style>
    </div>
  )
}

export default Register
 