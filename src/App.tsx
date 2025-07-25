import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Classroom from './pages/Classroom'
import Login from './pages/Login'
import Register from './pages/Register'
import Hub from './pages/Hub'
import Settings from './pages/Settings'
import { ClassroomProvider } from './context/ClassroomContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import PrivateRoute from './components/PrivateRoute'
import NotFound from './pages/NotFound'
import { AnimatePresence, motion, easeInOut } from 'framer-motion'

const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 30, 
    background: 'linear-gradient(135deg, #ffb84d 0%, #ffa726 100%)',
    boxShadow: '0 0 0 0 #ffb84d00' 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    background: 'transparent',
    boxShadow: '0 0 0 0 #ffb84d00', 
    transition: { duration: 0.45, ease: easeInOut } 
  },
  exit: { 
    opacity: 0, 
    y: -30, 
    background: 'linear-gradient(135deg, #ffa726 0%, #ffb84d 100%)',
    boxShadow: '0 0 0 0 #ffb84d00', 
    transition: { duration: 0.35, ease: easeInOut } 
  }
}

function AppRoutes() {
  const { user } = useAuth()
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} style={{minHeight: '100vh'}}><Home /></motion.div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hub" element={<PrivateRoute><motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} style={{minHeight: '100vh'}}><Hub /></motion.div></PrivateRoute>} />
        <Route path="/classroom/:id" element={<PrivateRoute><motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} style={{minHeight: '100vh'}}><Classroom /></motion.div></PrivateRoute>} />
        <Route path="/about" element={<motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} style={{minHeight: '100vh'}}><AboutUs /></motion.div>} />
        <Route path="/contact" element={<motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} style={{minHeight: '100vh'}}><Contact /></motion.div>} />
        <Route path="/settings" element={<PrivateRoute><motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} style={{minHeight: '100vh'}}><Settings /></motion.div></PrivateRoute>} />
        <Route path="*" element={<motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} style={{minHeight: '100vh'}}><NotFound /></motion.div>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <AuthProvider>
      <ClassroomProvider>
        <AppRoutes />
      </ClassroomProvider>
    </AuthProvider>
  )
}

export default App
 