import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login } from '../services/auth'
import toast from 'react-hot-toast'
import { DollarSign, Loader2, Wifi, WifiOff } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('idle') // idle, connecting, connected, error
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })
  
  const onSubmit = async (data) => {
    setLoading(true)
    setConnectionStatus('connecting')
    
    // Simulate connection delay for animation (remove in production)
    const connectionTimer = setTimeout(() => {
      setConnectionStatus('connected')
    }, 1000)
    
    try {
      const user = await login(data.email, data.password)
      clearTimeout(connectionTimer)
      setConnectionStatus('connected')
      
      // Success animation delay before redirect
      setTimeout(() => {
        toast.success(`Welcome ${user.email || 'User'}!`)
        navigate('/')
      }, 500)
    } catch (error) {
      clearTimeout(connectionTimer)
      setConnectionStatus('error')
      console.error('Login failed:', error)
      
      // Reset connection status after error
      setTimeout(() => {
        setConnectionStatus('idle')
      }, 2000)
    } finally {
      // Don't set loading false immediately - let animation complete
      setTimeout(() => {
        setLoading(false)
        if (connectionStatus !== 'error') {
          setConnectionStatus('idle')
        }
      }, 1500)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full animate-ping"></div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-8 animate-fade-in relative z-10">
        {/* Logo with connection animation */}
        <div className="flex justify-center mb-8">
          <div className={`p-3 rounded-full transition-all duration-500 ${
            connectionStatus === 'connecting' 
              ? 'bg-primary-200 dark:bg-primary-800 animate-pulse' 
              : connectionStatus === 'connected'
              ? 'bg-green-100 dark:bg-green-900'
              : connectionStatus === 'error'
              ? 'bg-red-100 dark:bg-red-900'
              : 'bg-primary-100 dark:bg-primary-900'
          }`}>
            {connectionStatus === 'connecting' ? (
              <Loader2 className="w-12 h-12 text-primary-600 dark:text-primary-400 animate-spin" />
            ) : connectionStatus === 'connected' ? (
              <Wifi className="w-12 h-12 text-green-600 dark:text-green-400 animate-bounce" />
            ) : connectionStatus === 'error' ? (
              <WifiOff className="w-12 h-12 text-red-600 dark:text-red-400" />
            ) : (
              <DollarSign className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            )}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Finance Dashboard Login
        </h2>
        
        {/* Connection status message */}
        {connectionStatus === 'connecting' && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg animate-pulse">
            <p className="text-sm text-blue-600 dark:text-blue-400 text-center flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting to server...
            </p>
          </div>
        )}
        
        {connectionStatus === 'connected' && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg animate-slide-down">
            <p className="text-sm text-green-600 dark:text-green-400 text-center flex items-center justify-center gap-2">
              <Wifi className="w-4 h-4" />
              Connected! Redirecting...
            </p>
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg animate-shake">
            <p className="text-sm text-red-600 dark:text-red-400 text-center flex items-center justify-center gap-2">
              <WifiOff className="w-4 h-4" />
              Connection failed. Please try again.
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="admin@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-slide-down">
                {errors.email.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-slide-down">
                {errors.password.message}
              </p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="relative w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {connectionStatus === 'connecting' ? 'Connecting...' : 'Logging in...'}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Login
              </span>
            )}
            
            {/* Loading progress bar animation */}
            {loading && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/30">
                <span className="absolute inset-0 bg-white animate-progress-bar"></span>
              </span>
            )}
          </button>
        </form>        
      </div>
      
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes progressBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-progress-bar {
          animation: progressBar 2s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}

export default Login