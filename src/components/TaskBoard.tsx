import { useState } from 'react'
import  { useClassroom } from '../context/ClassroomContext'
import { Check, Clock, Book, Calendar, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const subjects = {
  Thai: { color: 'danger', class: 'subject-thai' },
  English: { color: 'success', class: 'subject-english' },
  Math: { color: 'primary', class: 'subject-math' },
  Science: { color: 'warning', class: 'subject-science' },
  Social: { color: 'teal', class: 'subject-social' }, // teal
  History: { color: 'orange', class: 'subject-history' }, // orange
  Chinese: { color: 'rose', class: 'subject-chinese' }, // rose/pink
  Socials: { color: 'secondary', class: 'subject-socials' } // legacy, just in case
}

const TaskBoard = () => {
  const { tasks, toggleTask, deleteTask } = useClassroom()
  const { user } = useAuth()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const getCreatorLabel = (task: any) => {
    if (!task.createdBy) return 'Unknown'
    return task.createdBy.nickname || task.createdBy.name || task.createdBy.email || 'Unknown'
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-5">
        <Book size={60} className="text-muted mb-3" />
        <h5 className="text-muted">No tasks yet</h5>
        <p className="text-muted">Click "Add Task" to create your first assignment</p>
      </div>
    )
  }

  return (
    <>
      <div className="row">
        {tasks.map(task => (
          <div key={task._id || task.id} className="col-lg-6 mb-4">
            <div className={`card subject-card ${subjects[task.subject as keyof typeof subjects]?.class} h-100 border-0 shadow-sm`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className={`badge bg-${subjects[task.subject as keyof typeof subjects]?.color} rounded-pill`}>
                    {task.subject}
                  </span>
                  <div className="d-flex align-items-center gap-2">
                    {task._id && (
                      <button 
                        className={`btn btn-sm rounded-circle ${task.completed ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => toggleTask(task._id!)}
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {(user && task.createdBy && (user.id === task.createdBy.id || user.role === 'teacher') && task._id) && (
                      <button className="btn btn-sm btn-outline-danger rounded-circle ms-1" title="Delete Task" onClick={() => setDeleteId(task._id!)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                <h6 className={`fw-bold mb-2 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                  {task.name}
                </h6>
                
                <p className={`small mb-1 ${task.completed ? 'text-muted' : 'text-secondary'}`}>
                  {task.description}
                </p>
                
                <div className="d-flex justify-content-between align-items-center small mb-1">
                  <div className="d-flex align-items-center text-muted">
                    <Calendar size={14} className="me-1" />
                    Assigned: {new Date(task.dateAssigned).toLocaleDateString()}
                  </div>
                  <div className={`d-flex align-items-center ${new Date(task.dueDate) < new Date() && !task.completed ? 'text-danger' : 'text-muted'}`}>
                    <Clock size={14} className="me-1" />
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-muted small">Added by: <span className="fw-semibold">{getCreatorLabel(task)}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Confirmation Modal */}
      {deleteId && (
        <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.3)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title">Delete Task</h5>
                <button className="btn-close" onClick={() => setDeleteId(null)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this task? This action cannot be undone.</p>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-outline-secondary rounded-pill" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger rounded-pill px-4" onClick={() => { deleteTask(deleteId); setDeleteId(null); }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TaskBoard
 