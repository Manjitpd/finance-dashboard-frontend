import api from './api'
import { jwtDecode } from 'jwt-decode'

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', null, {
      params: {
        email: email,
        password: password
      }
    })
    
    // Check if backend returned an error
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    
    const { access_token } = response.data
    
    if (!access_token) {
      throw new Error('No access token received')
    }
    
    localStorage.setItem('token', access_token)
    const user = jwtDecode(access_token)
    localStorage.setItem('user', JSON.stringify(user))
    
    return user
  } catch (error) {
    // Handle different error scenarios
    if (error.response?.status === 401) {
      throw new Error('Invalid email or password')
    } else if (error.response?.status === 422) {
      throw new Error('Please enter both email and password')
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    } else if (error.response?.data?.detail) {
      // Handle FastAPI validation errors
      if (Array.isArray(error.response.data.detail)) {
        const errorMsg = error.response.data.detail[0]?.msg || 'Validation error'
        throw new Error(errorMsg)
      } else {
        throw new Error(error.response.data.detail)
      }
    } else if (error.message === 'Network Error') {
      throw new Error('Unable to connect to server. Please check your connection.')
    } else if (error.message) {
      throw error
    } else {
      throw new Error('Login failed. Please try again.')
    }
  }
}

export const logout = () => {
  // Clear localStorage
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  
  // Use React Router navigation instead of window.location
  // This will be handled by the component using useNavigate
  // For now, return a promise that resolves
  return Promise.resolve()
}

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  
  const user = JSON.parse(userStr)
  const token = localStorage.getItem('token')
  
  if (!token) return null
  
  try {
    const decoded = jwtDecode(token)
    if (decoded.exp * 1000 < Date.now()) {
      // Token expired, clear storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return null
    }
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return null
  }
  
  return user
}

export const hasRole = (role) => {
  const user = getCurrentUser()
  return user?.role === role
}