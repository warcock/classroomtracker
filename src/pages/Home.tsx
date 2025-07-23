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
            <div className="position-absolute end-0 mt-2 nav-glass rounded-3 shadow-lg p-3 d-flex flex-column gap-2 animate-fade-in" style={{minWidth: 180}}>
              <Link to="/" className="nav-link nav-link-custom active" onClick={()=>setNavOpen(false)}>HOME</Link>
              <a href="#about" className="nav-link nav-link-custom" onClick={()=>setNavOpen(false)}>ABOUT US</a>
              <a href="#contact" className="nav-link nav-link-custom" onClick={()=>setNavOpen(false)}>CONTACT</a>
              <Link to="/login" className="nav-link nav-link-custom" onClick={()=>setNavOpen(false)}>LOGIN</Link>
            </div>
          </>
        )}
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center px-4" style={{zIndex: 1, minHeight: '100vh'}}>
        <div className="card shadow-lg border-0 rounded-4 px-4 px-md-5 py-5" style={{maxWidth: 800, width: '100%', background: 'rgba(255,255,255,0.9)', fontFamily: 'Poppins, Inter, Arial, sans-serif'}}>
          <h2 className="fw-bold mb-4 text-warning text-center" style={{fontSize: '2.7rem', letterSpacing: '-1px', marginTop: 0}}>
            Welcome to <span className="text-dark">Classroom Tracker</span>
          </h2>
          <p className="fs-5 text-dark mb-4 text-center" style={{fontSize: '1.25rem', fontWeight: 500}}>
            Stay on top of your schoolwork with ease. Classroom Tracker is a simple and powerful tool designed to help students and teachers organize assignments, track due dates, and manage classwork – all in one place.
          </p>
          
          {/* Features Grid */}
          <div className="row g-3 mb-4">
            {features.map((feature, index) => (
              <div key={index} className="col-12 col-md-6">
                <div className="d-flex align-items-start p-3 rounded-3" style={{background: '#f8f9fa', border: '1px solid #e9ecef'}}>
                  <div className="text-warning me-3" style={{fontSize: '1.5rem'}}>
                    {feature.icon}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 text-dark">{feature.text}</h6>
                    <p className="text-muted mb-0 small">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link to="/register" className="btn py-2 px-4" style={{background: '#ffb84d', color: '#222', fontWeight: 700, fontSize: '1.2rem', borderRadius: '2rem', fontFamily: 'Poppins, Inter, Arial, sans-serif'}}>
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section id="about" className="d-flex align-items-center justify-content-center py-5" style={{minHeight: '60vh', zIndex: 1}}>
        <div className="card shadow-lg border-0 rounded-4 px-4 px-md-5 py-5 mx-auto" style={{maxWidth: 600, background: 'rgba(255,255,255,0.9)', fontFamily: 'Poppins, Inter, Arial, sans-serif'}}>
          <h2 className="fw-bold mb-3 text-warning text-center" style={{fontSize: '2.1rem', letterSpacing: '-1px'}}>About Us</h2>
          <p className="text-dark text-center mb-2" style={{fontWeight: 600, fontSize: '1.1rem'}}>
            Made by Zen and Potter - 307 EPBM'25
          </p>
          <p className="text-dark text-center mb-2">
            Contact: <a href="mailto:45808@benjama.ac.th" className="text-warning">45808@benjama.ac.th</a> &amp; <a href="mailto:45816@benjama.ac.th" className="text-warning">45816@benjama.ac.th</a>
          </p>
          <p className="text-secondary text-center mb-0" style={{fontSize: '1.05rem'}}>
            We built Classroom Tracker to help students and teachers stay organized, collaborate, and succeed together. If you have feedback, ideas, or just want to say hi, feel free to reach out!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="d-flex align-items-center justify-content-center py-5" style={{minHeight: '60vh', zIndex: 1}}>
        <div className="card shadow-lg border-0 rounded-4 px-4 px-md-5 py-5 mx-auto" style={{maxWidth: 600, background: 'rgba(255,255,255,0.9)', fontFamily: 'Poppins, Inter, Arial, sans-serif'}}>
          <h2 className="fw-bold mb-3 text-warning text-center" style={{fontSize: '2.1rem', letterSpacing: '-1px'}}>Contact Us</h2>
          <p className="text-dark text-center mb-2" style={{fontWeight: 600, fontSize: '1.1rem'}}>
            Email us at <a href="mailto:45808@benjama.ac.th" className="text-warning">45808@benjama.ac.th</a> or <a href="mailto:45816@benjama.ac.th" className="text-warning">45816@benjama.ac.th</a>
          </p>
          <p className="text-secondary text-center mb-0" style={{fontSize: '1.05rem'}}>
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
        @media (max-width: 991.98px) {
          .card {
            max-width: 98vw !important;
            margin: 1rem !important;
          }
        }
        @media (max-width: 575.98px) {
          .position-absolute.top-0.start-0.mt-4.ms-4.z-2 {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Home
 
 
 
 