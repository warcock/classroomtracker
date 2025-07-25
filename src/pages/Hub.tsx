import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { PlusCircle, LogOut, Users, DoorOpen, BookOpen, Trash2, LogOut as LeaveIcon, Settings as SettingsIcon } from 'lucide-react'
import { motion, AnimatePresence, easeInOut } from 'framer-motion'
import { Plus, ArrowRight, Eye, EyeSlash } from 'react-bootstrap-icons'
import Avataaars from 'avataaars'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function generateClassroomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function avatarStringToConfig(str: string | undefined) {
  if (!str) return undefined
  try { return JSON.parse(str) } catch { return undefined }
}

interface Classroom {
  _id: string;
  code: string;
  name: string;
  createdBy: {
    _id: string;
    name: string;
    nickname: string;
  };
  createdAt: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeInOut } }
}

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.12 } }
}

const Hub = () => {
  const { user, logout } = useAuth()
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [newClassroomName, setNewClassroomName] = useState('')
  const [newClassroomPassword, setNewClassroomPassword] = useState('')
  const [showCreatePassword, setShowCreatePassword] = useState(false)
  const [joinPassword, setJoinPassword] = useState('')
  const [showJoinPassword, setShowJoinPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch classrooms the user has joined
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return
        
        const response = await axios.get(`${API_BASE}/api/classrooms`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setClassrooms(response.data)
        console.log('Fetched classrooms:', response.data)
      } catch (error) {
        console.error('Failed to fetch classrooms:', error)
      }
    }

    fetchClassrooms()
  }, [])

  const handleCreateClassroom = async () => {
    setError('')
    setIsLoading(true)
    
    if (!newClassroomName.trim()) {
      setError('Classroom name required')
      setIsLoading(false)
      return
    }
    if (!newClassroomPassword.trim()) {
      setError('Classroom password required')
      setIsLoading(false)
      return
    }
    
    const code = generateClassroomCode()
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`${API_BASE}/api/classrooms`, 
        { code, name: newClassroomName, password: newClassroomPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Patch createdBy to be the full user object for immediate UI update
      const classroomWithCreator = {
        ...res.data,
        createdBy: {
          _id: user?._id,
          name: user?.name,
          nickname: user?.nickname
        }
      }
      setClassrooms([...classrooms, classroomWithCreator])
      setNewClassroomName('')
      setNewClassroomPassword('')
      setShowCreate(false)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create classroom')
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinClassroom = async () => {
    setError('')
    setIsLoading(true)
    
    if (!joinCode.trim()) {
      setError('Classroom code required')
      setIsLoading(false)
      return
    }
    if (!joinPassword.trim()) {
      setError('Classroom password required')
      setIsLoading(false)
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`${API_BASE}/api/classrooms/join`,
        { code: joinCode.trim(), password: joinPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setClassrooms([...classrooms, res.data])
      setJoinCode('')
      setJoinPassword('')
      setShowJoin(false)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to join classroom')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeaveClassroom = async () => {
    if (!selectedClassroom) return
    
    setActionLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_BASE}/api/classrooms/${selectedClassroom.code}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Remove classroom from local state
      setClassrooms(classrooms.filter(c => c._id !== selectedClassroom._id))
      setShowLeaveModal(false)
      setSelectedClassroom(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to leave classroom')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteClassroom = async () => {
    if (!selectedClassroom) return
    
    setActionLoading(true)
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE}/api/classrooms/${selectedClassroom.code}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Remove classroom from local state
      setClassrooms(classrooms.filter(c => c._id !== selectedClassroom._id))
      setShowDeleteModal(false)
      setSelectedClassroom(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete classroom')
    } finally {
      setActionLoading(false)
    }
  }


return (
  <div className="w-100 min-vh-100 d-flex flex-column" style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}>
    <motion.div
      className="card border-0 rounded-0 p-4 w-100"
      style={{
        width: '100%',
        height: '100vh',
        maxWidth: 'none',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.7))',
        boxShadow: 'none', // Ensure no shadow
        border: 'none', // Remove any border
        borderRadius: '0', // Ensure sharp corners with no radius
        padding: '20px',
      }}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
            <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center" style={{width: 56, height: 56, fontSize: 28, fontWeight: 700, color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', background: '#fff'}}>
              {user?.avatar && avatarStringToConfig(user.avatar) ? (
                <Avataaars style={{width:48,height:48}} {...avatarStringToConfig(user.avatar)} />
              ) : (
                user?.nickname?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div>
              <h2 className="fw-bold mb-0" style={{fontSize: '2.1rem'}}>Welcome, {user?.nickname || user?.name}!</h2>
              <div className="text-muted" style={{fontSize: '1.1rem'}}>{user?.email}</div>
              {/* Admin Panel button for admin users */}
              {user?.role === 'admin' && (
                <button
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-3"
                  onClick={() => navigate('/admin/analytics')}
                >
                  Admin Panel
                </button>
              )}
            </div>
          </div>
          <div className="d-flex gap-2 align-items-center">
          <button className="btn btn-outline-danger rounded-pill px-4 d-flex align-items-center gap-2" onClick={logout}>
            <LogOut size={18} /> Log out
          </button>
            <button className="btn btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-2" onClick={() => navigate('/settings')} title="Settings">
              <SettingsIcon size={18} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <motion.div className="row g-4 mb-5" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div className="col-12 col-md-6" variants={cardVariants}>
            <div className="card h-100 shadow-sm border-0 rounded-4 p-4 d-flex flex-row align-items-center gap-3 hub-action-card" style={{cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s'}} onClick={()=>setShowCreate(true)}>
              <div className="bg-warning bg-gradient rounded-circle d-flex align-items-center justify-content-center" style={{width: 48, height: 48}}>
                <PlusCircle size={28} color="#fff" />
              </div>
              <div>
                <h5 className="fw-bold mb-1">Create New Classroom</h5>
                <div className="text-muted">Start a new class for your group</div>
              </div>
            </div>
          </motion.div>
          <motion.div className="col-12 col-md-6" variants={cardVariants}>
            <div className="card h-100 shadow-sm border-0 rounded-4 p-4 d-flex flex-row align-items-center gap-3 hub-action-card" style={{cursor: 'pointer', transition: 'transform 0.18s, box-shadow 0.18s'}} onClick={()=>setShowJoin(true)}>
              <div className="bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center" style={{width: 48, height: 48}}>
                <DoorOpen size={28} color="#fff" />
              </div>
              <div>
                <h5 className="fw-bold mb-1">Join Classroom</h5>
                <div className="text-muted">Enter a code to join an existing class</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Your Classrooms */}
        <h4 className="fw-bold mb-3 mt-4"><Users size={22} className="me-2 text-warning" />Your Classrooms</h4>
        <motion.div className="row g-4" variants={staggerContainer} initial="hidden" animate="visible">
          {classrooms.length === 0 ? (
            <motion.div className="col-12 text-center text-muted py-5" variants={cardVariants}>
              <BookOpen size={48} className="mb-3 text-warning" />
              <div style={{fontSize: '1.2rem'}}>No classrooms yet. Create or join one to get started!</div>
            </motion.div>
          ) : (
            classrooms.map((c, i) => {
              const userId = user?._id;
              const creatorId = typeof c.createdBy === 'object' ? c.createdBy._id : c.createdBy;
              const isCreator = userId && creatorId && userId === creatorId;
              return (
                <motion.div key={c._id} className="col-12 col-md-6 col-lg-4" variants={cardVariants}>
                  <div className="card h-100 shadow-sm border-0 rounded-4 p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold mb-0 text-dark">{c.name}</h5>
                        {isCreator && (
                          <span className="badge bg-success text-white px-2 py-1" style={{fontSize: '0.75rem'}}>
                            Creator
                          </span>
                        )}
                      </div>
                      <div className="mb-3"><span className="badge bg-warning text-dark px-3 py-2" style={{fontSize: '1.1rem', letterSpacing: 1}}>Code: {c.code}</span></div>
                      <div className="text-muted small mb-3">
                        Created by: {typeof c.createdBy === 'object' ? (c.createdBy.nickname || c.createdBy.name) : 'You'}
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary rounded-pill flex-grow-1" onClick={() => navigate(`/classroom/${c.code}`)}>
                        Go to Classroom
                      </button>
                      {isCreator ? (
                        <button 
                          className="btn btn-outline-danger rounded-pill px-3" 
                          onClick={() => {
                            setSelectedClassroom(c)
                            setShowDeleteModal(true)
                          }}
                          title="Delete Classroom"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button 
                          className="btn btn-outline-warning rounded-pill px-3" 
                          onClick={() => {
                            setSelectedClassroom(c)
                            setShowLeaveModal(true)
                          }}
                          title="Leave Classroom"
                        >
                          <LeaveIcon size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </motion.div>

        {/* Create Classroom Modal */}
        <AnimatePresence>
        {showCreate && (
          <motion.div className="modal d-block" tabIndex={-1} style={{background: 'rgba(0,0,0,0.18)'}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="modal-dialog modal-dialog-centered">
              <motion.div className="modal-content rounded-4 border-0" initial={{y:40, opacity:0}} animate={{y:0, opacity:1}} exit={{y:40, opacity:0}} transition={{duration:0.3}}>
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Create New Classroom</h5>
                  <button className="btn-close" onClick={()=>setShowCreate(false)}></button>
                </div>
                <div className="modal-body">
                  <input className="form-control mb-3" placeholder="e.g. 9A Math Group" value={newClassroomName} onChange={e => setNewClassroomName(e.target.value)} autoComplete="off" />
                  <div className="position-relative mb-3">
                    <input 
                      className="form-control pe-5" 
                      type={showCreatePassword ? "text" : "password"} 
                      placeholder="Set a classroom password" 
                      value={newClassroomPassword} 
                      onChange={e => setNewClassroomPassword(e.target.value)} 
                      autoComplete="new-password" 
                    />
                    <button 
                      type="button" 
                      className="btn position-absolute end-0 top-0 h-100 px-3" 
                      onClick={() => setShowCreatePassword(!showCreatePassword)}
                      style={{background: 'none', border: 'none'}}
                    >
                      {showCreatePassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {error && <div className="alert alert-danger py-2">{error}</div>}
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-outline-secondary rounded-pill" onClick={()=>setShowCreate(false)} disabled={isLoading}>Cancel</button>
                  <button className="btn btn-gradient rounded-pill px-4" onClick={handleCreateClassroom} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating...
                      </>
                    ) : (
                      'Create'
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Join Classroom Modal */}
        <AnimatePresence>
        {showJoin && (
          <motion.div className="modal d-block" tabIndex={-1} style={{background: 'rgba(0,0,0,0.18)'}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="modal-dialog modal-dialog-centered">
              <motion.div className="modal-content rounded-4 border-0" initial={{y:40, opacity:0}} animate={{y:0, opacity:1}} exit={{y:40, opacity:0}} transition={{duration:0.3}}>
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Join Classroom</h5>
                  <button className="btn-close" onClick={()=>setShowJoin(false)}></button>
                </div>
                <div className="modal-body">
                  <input className="form-control mb-3" placeholder="Enter Classroom Code" value={joinCode} onChange={e => setJoinCode(e.target.value)} autoComplete="off" />
                  <div className="position-relative mb-3">
                    <input 
                      className="form-control pe-5" 
                      type={showJoinPassword ? "text" : "password"} 
                      placeholder="Classroom password" 
                      value={joinPassword} 
                      onChange={e => setJoinPassword(e.target.value)} 
                      autoComplete="new-password" 
                    />
                    <button 
                      type="button" 
                      className="btn position-absolute end-0 top-0 h-100 px-3" 
                      onClick={() => setShowJoinPassword(!showJoinPassword)}
                      style={{background: 'none', border: 'none'}}
                    >
                      {showJoinPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {error && <div className="alert alert-danger py-2">{error}</div>}
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-outline-secondary rounded-pill" onClick={()=>setShowJoin(false)} disabled={isLoading}>Cancel</button>
                  <button className="btn btn-primary rounded-pill px-4" onClick={handleJoinClassroom} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Joining...
                      </>
                    ) : (
                      'Join'
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Leave Classroom Confirmation Modal */}
        <AnimatePresence>
        {showLeaveModal && (
          <motion.div className="modal d-block" tabIndex={-1} style={{background: 'rgba(0,0,0,0.18)'}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="modal-dialog modal-dialog-centered">
              <motion.div className="modal-content rounded-4 border-0" initial={{y:40, opacity:0}} animate={{y:0, opacity:1}} exit={{y:40, opacity:0}} transition={{duration:0.3}}>
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold text-warning">Leave Classroom</h5>
                  <button className="btn-close" onClick={()=>{
                    setShowLeaveModal(false)
                    setError('')
                    setSelectedClassroom(null)
                  }}></button>
                </div>
                <div className="modal-body">
                  <p className="mb-0">
                    Are you sure you want to leave <strong>{selectedClassroom?.name}</strong>? 
                    You won't be able to access this classroom anymore unless you rejoin with the code.
                  </p>
                  {error && <div className="alert alert-danger py-2 mt-3">{error}</div>}
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-outline-secondary rounded-pill" onClick={()=>{
                    setShowLeaveModal(false)
                    setError('')
                    setSelectedClassroom(null)
                  }} disabled={actionLoading}>Cancel</button>
                  <button className="btn btn-warning rounded-pill px-4" onClick={handleLeaveClassroom} disabled={actionLoading}>
                    {actionLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Leaving...
                      </>
                    ) : (
                      'Leave Classroom'
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Delete Classroom Confirmation Modal */}
        <AnimatePresence>
        {showDeleteModal && (
          <motion.div className="modal d-block" tabIndex={-1} style={{background: 'rgba(0,0,0,0.18)'}} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="modal-dialog modal-dialog-centered">
              <motion.div className="modal-content rounded-4 border-0" initial={{y:40, opacity:0}} animate={{y:0, opacity:1}} exit={{y:40, opacity:0}} transition={{duration:0.3}}>
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold text-danger">Delete Classroom</h5>
                  <button className="btn-close" onClick={()=>{
                    setShowDeleteModal(false)
                    setError('')
                    setSelectedClassroom(null)
                  }}></button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-warning mb-3">
                    <strong>Warning:</strong> This action cannot be undone!
                  </div>
                  <p className="mb-0">
                    Are you sure you want to delete <strong>{selectedClassroom?.name}</strong>? 
                    This will permanently remove the classroom and all its tasks and messages.
                  </p>
                  {error && <div className="alert alert-danger py-2 mt-3">{error}</div>}
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-outline-secondary rounded-pill" onClick={()=>{
                    setShowDeleteModal(false)
                    setError('')
                    setSelectedClassroom(null)
                  }} disabled={actionLoading}>Cancel</button>
                  <button className="btn btn-danger rounded-pill px-4" onClick={handleDeleteClassroom} disabled={actionLoading}>
                    {actionLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Classroom'
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .hub-action-card:hover {
          transform: scale(1.035);
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
        }
      `}</style>
    </div>
  )
}

export default Hub 