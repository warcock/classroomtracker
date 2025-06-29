import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Person, Lock } from 'react-bootstrap-icons'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const unauth = location.state && location.state.unauth

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await login(email, password)
      navigate('/hub')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div
      className="min-vh-100 position-relative d-flex flex-column"
      style={{ backgroundImage: 'url(public/Rama5UpscaledBetter.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.4)', zIndex: 0 }} />

      {/* Logo at top left */}
      <div className="position-absolute top-0 start-0 mt-4 ms-4 z-2" style={{userSelect: 'none'}}>
        <span style={{display: 'block', fontWeight: 800, fontSize: '3.2rem', color: '#ffb84d', lineHeight: 1, letterSpacing: '-2px', fontFamily: 'Poppins, Inter, Arial, sans-serif'}}>Classroom</span>
        <span style={{display: 'block', fontWeight: 800, fontSize: '3.2rem', color: '#fff', lineHeight: 1, letterSpacing: '-2px', fontFamily: 'Poppins, Inter, Arial, sans-serif', marginLeft: '32px'}}>Tracker</span>
      </div>

      {/* Navigation Bar - floating at top right */}
      <nav className="position-absolute top-0 end-0 mt-3 me-2 me-md-5 z-2" aria-label="Main navigation">
        <div className="d-none d-md-flex nav-glass rounded-pill px-4 py-2 gap-3 align-items-center shadow-lg">
          <Link to="/" className="nav-link nav-link-custom px-2">HOME</Link>
          <a href="/#about" className="nav-link nav-link-custom px-2">ABOUT US</a>
          <a href="/#contact" className="nav-link nav-link-custom px-2">CONTACT</a>
          <Link to="/login" className="nav-link nav-link-custom active px-2">LOGIN</Link>
        </div>
      </nav>

      {/* Login Card */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-end pe-0 pe-md-5" style={{zIndex: 1, minHeight: '100vh'}}>
        <div className="card shadow-lg border-0 rounded-4 px-4 px-md-5 py-5" style={{maxWidth: 600, minHeight: '70vh', width: '100%', background: 'rgba(255,255,255,0.9)', fontFamily: 'Poppins, Inter, Arial, sans-serif', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h2 className="fw-bold mb-4 text-warning text-start" style={{fontSize: '2.7rem', letterSpacing: '-1px', marginTop: 0}}>Sign in</h2>
          {unauth && (
            <div className="alert alert-warning mb-3" role="alert">
              You must be signed in to access that page.
            </div>
          )}
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
                  type="email"
                  className="form-control border-0 ps-0"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1.1rem', background: 'transparent', color: '#222'}}
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="input-group rounded-pill border-0" style={{overflow: 'hidden', background: '#ededed'}}>
                <span className="input-group-text bg-transparent border-0"><Lock size={20} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control border-0 ps-0"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe" style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500}}>Remember Me</label>
              </div>
              <Link to="#" className="text-decoration-none text-secondary" style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1rem'}}>Forgot Password?</Link>
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
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
            <div className="text-start">
              <span style={{fontFamily: 'Poppins, Inter, Arial, sans-serif', fontWeight: 500, fontSize: '1rem'}}>or <Link to="/register" className="text-warning fw-bold">Sign up</Link></span>
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
        .form-control:focus, .input-group:focus-within {
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
      `}</style>
    </div>
  )
}

export default Login
 