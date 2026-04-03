// src/components/Layout.jsx
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Moon,
  Sun
} from 'lucide-react'
import { getCurrentUser, logout } from '../services/auth'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const user = getCurrentUser()
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: CreditCard },
    ...(user?.role === 'admin' ? [{ name: 'Users', href: '/users', icon: Users }] : [])
  ]
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col flex-1 w-64 bg-white dark:bg-gray-800">
          <div className="absolute top-0 right-0 p-2">
            <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>
          <SidebarContent navigation={navigation} location={location} />
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
        <SidebarContent navigation={navigation} location={location} />
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user?.email}
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                  {user?.role}
                </span>
              </span>
              <button onClick={logout} className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

const SidebarContent = ({ navigation, location }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true')
  
  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Finance Dashboard</h1>
        <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Layout