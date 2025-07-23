import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useClassroom } from '../context/ClassroomContext'
import TaskBoard from '../components/TaskBoard'
import ChatRoom from '../components/ChatRoom'
import AddTaskModal from '../components/AddTaskModal'
import { MessageCircle, Calendar, Plus, Copy, Check, Clock, ArrowLeft, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Avataaars from 'avataaars'
import { avatarStringToConfig } from './Settings'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const Classroom = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('tasks')
  const [showAddTask, setShowAddTask] = useState(false)
  const [copied, setCopied] = useState(false)
  const { tasks, setCurrentClassroom } = useClassroom()
  const navigate = useNavigate()
  const [showMembers, setShowMembers] = useState(false)
  const [members, setMembers] = useState<any[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [classroomName, setClassroomName] = useState('')
  const { user } = useAuth()
  const [creatorId, setCreatorId] = useState<string | undefined>(undefined)

  const copyRoomCode = () => {
    navigator.clipboard.writeText(id || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const completedTasks = tasks.filter(t => t.completed).length
  const pendingTasks = tasks.length - completedTasks

  // Framer Motion variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }
  const tabVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.3 } }
  }

  useEffect(() => {
    setCurrentClassroom(id || null)
    // Fetch classroom name and creator
    if (id) {
      axios.get(`${API_BASE}/api/classrooms/${id}`)
        .then(res => {
          setClassroomName(res.data.name)
          setCreatorId(res.data.createdBy?._id || res.data.createdBy || undefined)
        })
        .catch(() => {
          setClassroomName('')
          setCreatorId(undefined)
        })
    }
    return () => setCurrentClassroom(null)
  }, [id, setCurrentClassroom])

  const fetchMembers = async () => {
    setLoadingMembers(true)
    try {
      const res = await axios.get(`${API_BASE}/api/classrooms/${id}/members`)
      setMembers(res.data)
    } catch (e) {
      setMembers([])
    } finally {
      setLoadingMembers(false)
    }
  }

  return (
    <div className="min-vh-100 classroom-bg">
      {/* Glassy Header */}
      <div className="container-fluid px-0">
        <motion.div className="classroom-header-glass d-flex align-items-center justify-content-between px-4 px-md-5 py-3 mb-3"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button 
            className="btn back-to-hub-btn rounded-pill d-flex align-items-center fw-bold px-4 py-2 me-3"
            onClick={() => navigate('/hub')}
          >
            <ArrowLeft size={20} className="me-2" /> Back to Hub
          </button>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="classroom-avatar d-flex align-items-center justify-content-center me-2">
              <Users size={28} />
            </div>
            <div>
              <h3 className="fw-bold mb-0 text-dark" style={{letterSpacing: '-1px'}}>
                Classroom <span className="text-primary">{classroomName || id}</span>
              </h3>
              <div className="d-flex align-items-center gap-2 mt-1">
                <span className="badge bg-light text-dark px-3 py-2" style={{fontSize: '1.05rem', letterSpacing: 1}}>Room Code: {id}</span>
                <button 
                  className="btn btn-sm btn-outline-primary rounded-pill px-3"
                  onClick={copyRoomCode}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 ms-auto">
            <button className="btn btn-outline-secondary rounded-pill px-4 me-2" onClick={() => { setShowMembers(true); fetchMembers(); }}>
              <Users size={18} className="me-2" /> Class Members
            </button>
            <button 
              className="btn btn-gradient rounded-pill px-4"
              onClick={() => setShowAddTask(true)}
            >
              <Plus size={18} className="me-2" />
              Add Task
            </button>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="container mb-4">
        <div className="row g-4">
          <motion.div className="col-md-4" variants={cardVariants} initial="hidden" animate="visible">
            <div className="card stat-card glass border-0 rounded-4 h-100 shadow-sm">
              <div className="card-body text-center">
                <Calendar size={40} className="text-primary mb-2" />
                <h5 className="fw-bold mb-1">{tasks.length}</h5>
                <small className="text-muted">Total Tasks</small>
              </div>
            </div>
          </motion.div>
          <motion.div className="col-md-4" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <div className="card stat-card glass border-0 rounded-4 h-100 shadow-sm">
              <div className="card-body text-center">
                <Check size={40} className="text-success mb-2" />
                <h5 className="fw-bold mb-1">{completedTasks}</h5>
                <small className="text-muted">Completed</small>
              </div>
            </div>
          </motion.div>
          <motion.div className="col-md-4" variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <div className="card stat-card glass border-0 rounded-4 h-100 shadow-sm">
              <div className="card-body text-center">
                <Clock size={40} className="text-warning mb-2" />
                <h5 className="fw-bold mb-1">{pendingTasks}</h5>
                <small className="text-muted">Pending</small>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Card with Tabs */}
      <div className="container pb-5">
        <div className="card glass border-0 rounded-4 shadow">
          <div className="card-header bg-transparent border-0 pt-4">
            <ul className="nav nav-pills nav-fill gap-2">
              <li className="nav-item">
                <button 
                  className={`nav-link rounded-pill ${activeTab === 'tasks' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tasks')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <Calendar size={18} className="me-2" />
                  Tasks & Assignments
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link rounded-pill ${activeTab === 'chat' ? 'active' : ''}`}
                  onClick={() => setActiveTab('chat')}
                  style={{fontWeight: 600, fontSize: '1.1rem'}}
                >
                  <MessageCircle size={18} className="me-2" />
                  Class Chat
                </button>
              </li>
            </ul>
          </div>
          <div className="card-body">
            <AnimatePresence mode="wait">
              {activeTab === 'tasks' ? (
                <motion.div
                  key="tasks"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {tasks.length === 0 ? (
                    <div className="d-flex flex-column align-items-center justify-content-center py-5">
                      <Calendar size={56} className="mb-3 text-primary" />
                      <h5 className="fw-bold mb-2">No tasks yet</h5>
                      <p className="text-muted mb-3">Click <span className="fw-bold">Add Task</span> to create your first assignment</p>
                      <button className="btn btn-gradient rounded-pill px-4" onClick={() => setShowAddTask(true)}>
                        <Plus size={18} className="me-2" /> Add Task
                      </button>
                    </div>
                  ) : (
                    <TaskBoard />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <ChatRoom />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showAddTask && (
        <AddTaskModal 
          onClose={() => setShowAddTask(false)}
          onAdd={() => setShowAddTask(false)}
        />
      )}

      {/* Members Modal */}
      {showMembers && (
        <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.3)'}}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title">Class Members</h5>
                <button className="btn-close" onClick={() => setShowMembers(false)}></button>
              </div>
              <div className="modal-body">
                {user && (
                  <div className="d-flex align-items-center mb-4 p-3 rounded-3" style={{background:'#f8f9fa', border:'1.5px solid #e0e0e0'}}>
                    <div className="me-3">
                      <Avataaars style={{width:48,height:48}} {...avatarStringToConfig(user.avatar)} />
                    </div>
                    <div>
                      <div className="fw-bold" style={{fontSize:'1.15rem'}}>{user.name} <span className="badge bg-primary ms-2">You</span></div>
                      <div className="text-muted">{user.nickname} &middot; {user.email}</div>
                      <div className="text-secondary" style={{fontSize:'0.98rem'}}>{(creatorId && (user._id === creatorId || user.id === creatorId)) ? 'Creator' : user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}</div>
                    </div>
                  </div>
                )}
                {loadingMembers ? (
                  <div className="text-center py-4"><span className="spinner-border" /></div>
                ) : (
                  <div className="table-responsive">
                    <table className="table custom-members-table mb-0">
                      <thead>
                        <tr>
                          <th>Profile</th>
                          <th>Name</th>
                          <th>Nickname</th>
                          <th>Email</th>
                          <th>Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m, idx) => {
                          const isCreator = creatorId && (m._id === creatorId || m.id === creatorId)
                          const isCurrentUser = user && ((user._id && m._id && user._id === m._id) || (user.id && m.id && user.id === m.id) || (user.email && m.email && user.email.toLowerCase() === m.email.toLowerCase()))
                          const roleLabel = isCreator ? 'Creator' : m.role?.charAt(0).toUpperCase() + m.role?.slice(1)
                          return (
                            <tr
                              key={m._id || m.id || m.email}
                              className={
                                'member-row' +
                                (isCurrentUser ? ' table-primary current-user-row' : '') +
                                (idx % 2 === 1 ? ' table-zebra' : '')
                              }
                              style={{position:'relative'}}
                            >
                              <td style={{width:48, minWidth:40}}>
                                {isCurrentUser ? (
                                  <Avataaars style={{width:36,height:36}} {...avatarStringToConfig(user.avatar)} />
                                ) : (
                                  <Avataaars style={{width:36,height:36}} {...avatarStringToConfig(m.avatar)} />
                                )}
                              </td>
                              <td className="fw-semibold">
                                {m.name}
                                {isCurrentUser && <span className="badge bg-primary ms-2">You</span>}
                                {!isCurrentUser && isCreator && <span className="badge bg-warning text-dark ms-2">Creator</span>}
                              </td>
                              <td>{m.nickname}</td>
                              <td className="text-break email-cell" title={m.email} style={{cursor:'pointer', position:'relative'}}>
                                <span style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', display:'inline-block', maxWidth:'100%'}}>{m.email}</span>
                              </td>
                              <td>
                                <span className={isCreator ? 'badge bg-warning text-dark' : 'badge bg-light text-dark'} style={{fontWeight:500}}>
                                  {roleLabel}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-outline-secondary rounded-pill" onClick={() => setShowMembers(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom styles for classroom page */}
      <style>{`
        .custom-members-table {
          border-radius: 1.1rem;
          overflow: hidden;
          background: #fff;
        }
        .custom-members-table thead tr {
          background: #f6f7fa;
        }
        .custom-members-table th, .custom-members-table td {
          vertical-align: middle;
          padding-top: 0.65rem;
          padding-bottom: 0.65rem;
          border: none;
        }
        .custom-members-table td:first-child {
          text-align: center;
        }
        .custom-members-table tbody tr.member-row.table-zebra {
          background: #f9fafb;
        }
        .custom-members-table tbody tr.member-row.current-user-row {
          box-shadow: 0 2px 12px rgba(80,120,255,0.07);
        }
        .custom-members-table tbody tr.member-row:hover {
          background: #f1f3ff;
          transition: background 0.18s;
        }
        .custom-members-table .badge {
          font-size: 0.92rem;
          vertical-align: middle;
        }
        .custom-members-table td {
          font-size: 1.04rem;
        }
        .custom-members-table th {
          font-size: 1.07rem;
          font-weight: 600;
          color: #3a3a3a;
        }
        .custom-members-table .email-cell {
          max-width: 180px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (max-width: 600px) {
          .custom-members-table td, .custom-members-table th {
            font-size: 0.98rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          .custom-members-table .email-cell {
            max-width: 90px;
          }
        }
        .classroom-bg {
          position: relative;
          min-height: 100vh;
          background: url('/Rama5UpscaledBetter.jpg') center/cover no-repeat fixed;
        }
        .classroom-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.72);
          z-index: 0;
        }
        .classroom-header-glass, .container, .container-fluid, .card, .glass, .stat-card {
          position: relative;
          z-index: 1;
        }
        .classroom-header-glass {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          border-radius: 2rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
          margin-top: 1.5rem;
        }
        .classroom-avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffb84d 0%, #ffd580 100%);
          color: #fff;
          font-size: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .stat-card {
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .stat-card:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
        }
        .back-to-hub-btn {
          background: rgba(255,255,255,0.92) !important;
          color: #222 !important;
          box-shadow: 0 2px 12px rgba(0,0,0,0.10);
          border: 1.5px solid #e0e0e0 !important;
          font-weight: 700;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s;
        }
        .back-to-hub-btn:hover, .back-to-hub-btn:focus {
          background: #ffb84d !important;
          color: #222 !important;
          box-shadow: 0 4px 18px rgba(0,0,0,0.16);
          border-color: #ffb84d !important;
        }
        @media (max-width: 767.98px) {
          .classroom-header-glass {
            flex-direction: column;
            align-items: flex-start !important;
            padding: 1.2rem 1rem !important;
            border-radius: 1.2rem;
          }
          .classroom-avatar {
            width: 44px;
            height: 44px;
            font-size: 1.3rem;
          }
        }
      `}</style>
      <style>{`
        @media (max-width: 600px) {
          .modal-lg { max-width: 98vw; }
          .table-responsive { overflow-x: auto; }
          .table { min-width: 520px; }
        }
      `}</style>
    </div>
  )
}

export default Classroom
