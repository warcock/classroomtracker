import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import axios from 'axios'
import { io, Socket } from 'socket.io-client'

interface Task {
  _id?: string
  id?: string
  name: string
  description: string
  subject: string
  dateAssigned: string
  dueDate: string
  completed: boolean
  createdBy: {
    id: string
    name: string
    nickname: string
    email?: string
  }
}

interface Message {
  _id?: string
  id?: string
  author: string
  content: string
  timestamp: string
}

interface ClassroomContextType {
  currentClassroom: string | null
  setCurrentClassroom: (id: string | null) => void
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  messages: Message[]
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
}

const ClassroomContext = createContext<ClassroomContextType | undefined>(undefined)

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const ClassroomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentClassroom, setCurrentClassroom] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)

  // Fetch tasks and messages when classroom changes
  useEffect(() => {
    if (!currentClassroom) return
    // Fetch tasks
    axios.get(`${API_BASE}/api/classrooms/${currentClassroom}/tasks`).then(res => {
      setTasks(res.data)
      console.log('Fetched tasks:', res.data.map((t: any) => t._id))
    })
    // Fetch messages
    axios.get(`${API_BASE}/api/classrooms/${currentClassroom}/messages`).then(res => setMessages(res.data))
    // Setup socket.io
    const s = io(API_BASE)
    s.emit('join-classroom', currentClassroom)
    s.on('new-message', (msg: Message) => {
      setMessages(prev => [...prev, msg])
    })
    setSocket(s)
    return () => { s.disconnect() }
  }, [currentClassroom])

  // Add task
  const addTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    if (!currentClassroom) return
    const res = await axios.post(`${API_BASE}/api/classrooms/${currentClassroom}/tasks`, task)
    setTasks(prev => [...prev, res.data])
  }

  // Toggle task
  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t._id === id)
    if (!task) return
    const realId = task._id
    const res = await axios.put(`${API_BASE}/api/tasks/${realId}`, { completed: !task.completed })
    setTasks(prev => {
      const updated = prev.map(t => (t._id === realId ? res.data : t))
      console.log('Tasks after toggle:', updated.map(t => ({ _id: t._id, completed: t.completed })))
      return updated
    })
  }

  // Delete task
  const deleteTask = async (id: string) => {
    const task = tasks.find(t => t._id === id || t.id === id)
    if (!task) return
    const realId = task._id || task.id
    await axios.delete(`${API_BASE}/api/tasks/${realId}`)
    setTasks(prev => prev.filter(t => (t._id !== realId && t.id !== realId)))
  }

  // Add message (send via socket.io)
  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    if (!currentClassroom || !socket) return
    socket.emit('send-message', { classroomId: currentClassroom, ...message })
  }

  return (
    <ClassroomContext.Provider value={{
      currentClassroom,
      setCurrentClassroom,
      tasks,
      addTask,
      toggleTask,
      deleteTask,
      messages,
      addMessage
    }}>
      {children}
    </ClassroomContext.Provider>
  )
}

export const useClassroom = () => {
  const context = useContext(ClassroomContext)
  if (!context) throw new Error('useClassroom must be used within ClassroomProvider')
  return context
}
 