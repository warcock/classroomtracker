import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface User {
  id?: string
  _id?: string
  name: string
  nickname: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  avatar?: string
  createdAt?: string
  __v?: number
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, nickname: string, email: string, password: string, role: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
  loading: boolean
  updateProfile: (profile: { name: string; nickname: string; avatar?: string }) => Promise<void>
  updateEmail: (email: string) => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_BASE}/api/auth/profile`)
          setUser(response.data)
        } catch (error) {
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [token])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password
      })

      const { token: newToken, user: userData } = response.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
    } catch (error: any) {
      setError(error.response?.data?.error || 'Login failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, nickname: string, email: string, password: string, role: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, {
        name,
        nickname,
        email,
        password,
        role
      })

      const { token: newToken, user: userData } = response.data
      
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setError(null)
  }

  const updateProfile = async (profile: { name: string; nickname: string; avatar?: string }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.put(`${API_BASE}/api/auth/profile`, profile)
      setUser(response.data)
    } catch (error: any) {
      setError(error.response?.data?.error || 'Profile update failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateEmail = async (email: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.put(`${API_BASE}/api/auth/email`, { email })
      setUser(response.data)
    } catch (error: any) {
      setError(error.response?.data?.error || 'Email update failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await axios.put(`${API_BASE}/api/auth/password`, { currentPassword, newPassword })
    } catch (error: any) {
      setError(error.response?.data?.error || 'Password update failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    error,
    loading,
    updateProfile,
    updateEmail,
    updatePassword
  }

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border text-warning" role="status" /></div>
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 