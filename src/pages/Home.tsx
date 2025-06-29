import React from 'react'
import { Link } from 'react-router-dom'
import { House, Layers, FileText, CheckCircle, Phone } from 'react-bootstrap-icons'

const features = [
  { text: 'Create & Join Classrooms', icon: <House className="me-2" />, desc: 'Shareable auto-generated codes for easy access with classmates.' },
  { text: 'Subject-Based Organization', icon: <Layers className="me-2" />, desc: 'Tasks sorted into five core school subjects for clarity.' },
  { text: 'Add Work with Details', icon: <FileText className="me-2" />, desc: 'Title, description, due date, and a done checkbox for each task.' },
  { text: 'Track Completion Easily', icon: <CheckCircle className="me-2" />, desc: 'Mark tasks as complete and stay on top of your progress.' },
  { text: 'Clean & Responsive Design', icon: <Phone className="me-2" />, desc: 'Works smoothly on all devices, built for students on the go.' },
]

const Home = () => {
  // Hamburger menu state for mobile nav
  const [navOpen, setNavOpen] = React.useState(false)

  return (
    <div
      className="min-vh-100 position-relative d-flex flex-column"
      style={{ backgroundImage: 'url(public/Rama5UpscaledBetter.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.4)', zIndex: 0 }} />

      {/* Logo at top left */}
      <div className="position-absolute top-0 start-0 mt-4 ms-4 z-2 home-logo" style={{userSelect: 'none'}}>
        <span className="home-logo-main">Classroom</span>
        <span className="home-logo-sub">Tracker</span>
      </div>

      {/* Navigation Bar - floating at top right */}
      <nav className="position-absolute top-0 end-0 mt-3 me-2 me-md-5 z-2" aria-label="Main navigation">
        <div className="d-none d-md-flex nav-glass rounded-pill px-4 py-2 gap-3 align-items-center shadow-lg">
          <Link to="/" className="nav-link nav-link-custom active px-2">HOME</Link>
          <a href="#about" className="nav-link nav-link-custom px-2">ABOUT US</a>
          <a href="#contact" className="nav-link nav-link-custom px-2">CONTACT</a>
          <Link to="/login" className="nav-link nav-link-custom px-2">LOGIN</Link>
        </div>
        {/* Hamburger for mobile */}
        <button className="d-md-none btn nav-glass rounded-circle p-2 border-0 shadow-lg" aria-label="Open navigation menu" onClick={() => setNavOpen(v => !v)}>
          <span className="navbar-toggler-icon" />
        </button>
        {navOpen && (
          <>
            <div className="nav-backdrop" onClick={()=>setNavOpen(false)}></div>
            <div className="position-absolute end-0 mt-2 nav-glass rounded-3 shadow-lg p-3 d-flex flex-column gap-2 animate-fade-in mobile-nav-menu">
              <Link to="/" className="nav-link nav-link-custom active" onClick={()=>setNavOpen(false)}>HOME</Link>
              <a href="#about" className="nav-link nav-link-custom" onClick={()=>setNavOpen(false)}>ABOUT US</a>
              <a href="#contact" className="nav-link nav-link-custom" onClick={()=>setNavOpen(false)}>CONTACT</a>
              <Link to="/login" className="nav-link nav-link-custom" onClick={()=>setNavOpen(false)}>LOGIN</Link>
            </div>
          </>
        )}
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center px-2 px-sm-3 px-md-4" style={{zIndex: 1, minHeight: '100vh'}}>
        <div className="card shadow-lg border-0 rounded-4 px-2 px-sm-3 px-md-5 py-4 py-md-5 home-main-card">
          <h2 className="fw-bold mb-4 text-warning text-center home-title">
            Welcome to <span className="text-dark">Classroom Tracker</span>
          </h2>
          <p className="fs-5 text-dark mb-4 text-center home-desc">
            Stay on top of your schoolwork with ease. Classroom Tracker is a simple and powerful tool designed to help students and teachers organize assignments, track due dates, and manage classwork – all in one place.
          </p>
          {/* Features Grid */}
          <div className="row g-3 mb-4">
            {features.map((feature, index) => (
              <div key={index} className="col-12 col-sm-6">
                <div className="d-flex align-items-start p-3 rounded-3 home-feature-card">
                  <div className="text-warning me-3 home-feature-icon">
                    {feature.icon}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-dark home-feature-title">{feature.text}</h6>
                    <p className="text-muted mb-0 small home-feature-desc">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* CTA Button */}
          <div className="text-center">
            <Link to="/register" className="btn py-2 px-4 home-cta-btn">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section id="about" className="d-flex align-items-center justify-content-center py-5 home-section">
        <div className="card shadow-lg border-0 rounded-4 px-2 px-sm-4 px-md-5 py-4 py-md-5 mx-auto home-section-card">
          <h2 className="fw-bold mb-3 text-warning text-center home-section-title">About Us</h2>
          <p className="text-dark text-center mb-2 home-section-lead">
            Made by Zen and Potter - 307 EPBM'25
          </p>
          <p className="text-dark text-center mb-2">
            Contact: <a href="mailto:45808@benjama.ac.th" className="text-warning">45808@benjama.ac.th</a> &amp; <a href="mailto:45816@benjama.ac.th" className="text-warning">45816@benjama.ac.th</a>
          </p>
          <p className="text-secondary text-center mb-0 home-section-desc">
            We built Classroom Tracker to help students and teachers stay organized, collaborate, and succeed together. If you have feedback, ideas, or just want to say hi, feel free to reach out!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="d-flex align-items-center justify-content-center py-5 home-section">
        <div className="card shadow-lg border-0 rounded-4 px-2 px-sm-4 px-md-5 py-4 py-md-5 mx-auto home-section-card">
          <h2 className="fw-bold mb-3 text-warning text-center home-section-title">Contact Us</h2>
          <p className="text-dark text-center mb-2 home-section-lead">
            Email us at <a href="mailto:45808@benjama.ac.th" className="text-warning">45808@benjama.ac.th</a> or <a href="mailto:45816@benjama.ac.th" className="text-warning">45816@benjama.ac.th</a>
          </p>
          <p className="text-secondary text-center mb-0 home-section-desc">
            We love hearing from you! Whether you have questions, need support, or want to share your ideas, just drop us a message. We'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Custom styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
        html { scroll-behavior: smooth; }
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
        /* Responsive logo */
        .home-logo-main {
          display: block;
          font-weight: 800;
          font-size: 2.2rem;
          color: #ffb84d;
          line-height: 1;
          letter-spacing: -2px;
          font-family: 'Poppins', Inter, Arial, sans-serif;
        }
        .home-logo-sub {
          display: block;
          font-weight: 800;
          font-size: 2.2rem;
          color: #fff;
          line-height: 1;
          letter-spacing: -2px;
          font-family: 'Poppins', Inter, Arial, sans-serif;
          margin-left: 18px;
        }
        @media (min-width: 400px) {
          .home-logo-main, .home-logo-sub { font-size: 2.7rem; }
        }
        @media (min-width: 600px) {
          .home-logo-main, .home-logo-sub { font-size: 3.2rem; }
          .home-logo-sub { margin-left: 32px; }
        }
        .mobile-nav-menu {
          min-width: 70vw !important;
          max-width: 90vw !important;
        }
        .home-main-card {
          max-width: 98vw !important;
          width: 100%;
        }
        .home-title {
          font-size: 2rem;
        }
        .home-desc {
          font-size: 1.05rem;
        }
        .home-feature-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
        }
        .home-feature-icon {
          font-size: 1.3rem;
        }
        .home-feature-title {
          font-size: 1.05rem;
        }
        .home-feature-desc {
          font-size: 0.95rem;
        }
        .home-cta-btn {
          background: #ffb84d;
          color: #222;
          font-weight: 700;
          font-size: 1.1rem;
          border-radius: 2rem;
          font-family: 'Poppins', Inter, Arial, sans-serif;
          width: 100%;
          max-width: 320px;
        }
        .home-section {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }
        .home-section-card {
          max-width: 98vw !important;
        }
        .home-section-title {
          font-size: 1.3rem;
        }
        .home-section-lead {
          font-size: 1rem;
        }
        .home-section-desc {
          font-size: 0.98rem;
        }
        @media (min-width: 400px) {
          .home-title { font-size: 2.2rem; }
          .home-section-title { font-size: 1.5rem; }
        }
        @media (min-width: 600px) {
          .home-title { font-size: 2.7rem; }
          .home-section-title { font-size: 2.1rem; }
        }
        @media (max-width: 991.98px) {
          .card, .home-main-card, .home-section-card {
            max-width: 98vw !important;
            margin: 1rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
        }
        @media (max-width: 575.98px) {
          .home-main-card, .home-section-card {
            padding: 1.2rem 0.5rem !important;
          }
          .home-title, .home-section-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Home
 
 
 
 