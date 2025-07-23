import  { useState } from 'react'
import { useClassroom } from '../context/ClassroomContext'

const subjects = ['Thai', 'English', 'Math', 'Science', 'Social', 'History', 'Chinese']

interface AddTaskModalProps {
  onClose: () => void
  onAdd: () => void
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onAdd }) => {
  const [task, setTask] = useState({
    name: '',
    description: '',
    subject: 'Math',
    dateAssigned: new Date().toISOString().split('T')[0],
    dueDate: ''
  })
  
  const { addTask } = useClassroom()

  const handleSubmit = () => {
    if (task.name && task.dueDate) {
      addTask({
        ...task,
        createdBy: {
          id: '', // Provide actual user id here if available
          name: '', // Provide actual user name here if available
          nickname: '', // Provide actual user nickname here if available
          email: '', // Optionally provide email
        }
      })
      onAdd()
    }
  }

  return (
    <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">Add New Assignment</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">Task Name</label>
                <input 
                  className="form-control rounded-pill"
                  value={task.name}
                  onChange={(e) => setTask({...task, name: e.target.value})}
                  placeholder="e.g., Chapter 5 Math Problems"
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">Subject</label>
                <select 
                  className="form-select rounded-pill"
                  value={task.subject}
                  onChange={(e) => setTask({...task, subject: e.target.value})}
                  style={{ background: '#f3f4f6', fontWeight: 500 }}
                >
                  {subjects.map(subject => (
                    <option 
                      key={subject} 
                      value={subject}
                      style={{
                        background: '#e0e7ef',
                        borderRadius: '999px',
                        color: '#222',
                        fontWeight: 500,
                        margin: '2px 0',
                        padding: '6px 16px'
                      }}
                    >
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-medium">Description</label>
              <textarea 
                className="form-control rounded-3"
                rows={3}
                value={task.description}
                onChange={(e) => setTask({...task, description: e.target.value})}
                placeholder="Detailed description of the assignment..."
              />
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">Date Assigned</label>
                <input 
                  type="date"
                  className="form-control rounded-pill"
                  value={task.dateAssigned}
                  onChange={(e) => setTask({...task, dateAssigned: e.target.value})}
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">Due Date</label>
                <input 
                  type="date"
                  className="form-control rounded-pill"
                  value={task.dueDate}
                  onChange={(e) => setTask({...task, dueDate: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <div className="modal-footer border-0">
            <button className="btn btn-outline-secondary rounded-pill" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn btn-gradient rounded-pill px-4"
              onClick={handleSubmit}
              disabled={!task.name || !task.dueDate}>
              Add Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddTaskModal
 