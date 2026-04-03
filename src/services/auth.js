import api from './api'
import { jwtDecode } from 'jwt-decode'

export const login = async (email, password) => {
  const response = await api.post('/auth/login', null, {
    params: {
      email: email,
      password: password
    }
  })
  
  const { access_token } = response.data
  
  if (!access_token) {
    throw new Error('No access token received')
  }
  
  localStorage.setItem('token', access_token)
  const user = jwtDecode(access_token)
  localStorage.setItem('user', JSON.stringify(user))
  
  return user
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
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
      logout()
      return null
    }
  } catch {
    logout()
    return null
  }
  
  return user
}

export const hasRole = (role) => {
  const user = getCurrentUser()
  return user?.role === role
}