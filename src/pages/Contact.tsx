import React, { useEffect, useRef } from 'react';

const Contact = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          cardRef.current.classList.add('fade-in-up');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark bg-gradient" style={{fontFamily: 'Poppins, Inter, Arial, sans-serif'}}>
      <div ref={cardRef} className="card shadow-lg border-0 rounded-4 p-4 p-md-5 contact-card" style={{maxWidth: 500, background: 'rgba(255,255,255,0.92)', opacity: 0, transform: 'translateY(40px)', transition: 'opacity 0.7s, transform 0.7s'}}>
        <h2 className="fw-bold mb-3 text-dark text-center" style={{fontSize: '2rem'}}>Contact Us</h2>
        <p className="text-dark text-center mb-2" style={{fontWeight: 600}}>
          Email us at <a href="mailto:45808@benjama.ac.th" className="text-warning">45808@benjama.ac.th</a> or <a href="mailto:45816@benjama.ac.th" className="text-warning">45816@benjama.ac.th</a>
        </p>
        <p className="text-secondary text-center mb-0">
          We love hearing from you! Whether you have questions, need support, or want to share your ideas, just drop us a message. We'll get back to you as soon as possible.
        </p>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
        .contact-card.fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
};

export default Contact; 