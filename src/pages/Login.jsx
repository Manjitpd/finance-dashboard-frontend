import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login } from '../services/auth'
import toast from 'react-hot-toast'
import { DollarSign, Loader2, Wifi, WifiOff, AlertCircle } from 'lucide-react'

const schema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required')
    .min(4, 'Password must be at least 4 characters'),
})

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('idle') // idle, connecting, connected, error
  const [errorMessage, setErrorMessage] = useState('')
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur' // Validate on blur for better UX
  })
  
  // Watch form values to clear error message when user starts typing
  const watchEmail = watch('email')
  const watchPassword = watch('password')
  
  // Clear error message when user starts typing
  React.useEffect(() => {
    if (errorMessage && (watchEmail || watchPassword)) {
      setErrorMessage('')
    }
  }, [watchEmail, watchPassword, errorMessage])
  
  const onSubmit = async (data) => {
    setLoading(true)
    setConnectionStatus('connecting')
    setErrorMessage('')
    
    try {
      const user = await login(data.email, data.password)
      setConnectionStatus('connected')
      
      // Success animation delay before redirect
      setTimeout(() => {
        toast.success(`Welcome ${user.email?.split('@')[0] || 'User'}!`)
        navigate('/')
      }, 500)
    } catch (error) {
      console.error('Login failed:', error)
      
      // Set error message based on error type
      let message = error.message || 'Login failed. Please try again.'
      
      // Customize messages for common errors
      if (message.includes('Invalid email or password') || 
          message.includes('Invalid credentials') ||
          message.includes('401')) {
        message = 'Invalid email or password. Please try again.'
      } else if (message.includes('email and password') || message.includes('422')) {
        message = 'Please enter both email and password.'
      } else if (message.includes('Network Error')) {
        message = 'Unable to connect to server. Please check your internet connection.'
      } else if (message.includes('No access token')) {
        message = 'Authentication failed. Please try again.'
      }
      
      setErrorMessage(message)
      toast.error(message)
      setConnectionStatus('error')
      
      // Clear only password field on error for security
      reset({ email: data.email, password: '' })
      
      // Reset connection status after error
      setTimeout(() => {
        setConnectionStatus('idle')
      }, 3000)
    } finally {
      setTimeout(() => {
        setLoading(false)
        if (connectionStatus !== 'error') {
          setConnectionStatus('idle')
        }
      }, 1000)
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
        
        {/* Error Message Display */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg animate-shake">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {errorMessage}
              </p>
            </div>
          </div>
        )}
        
        {/* Connection status message */}
        {connectionStatus === 'connecting' && !errorMessage && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg animate-pulse">
            <p className="text-sm text-blue-600 dark:text-blue-400 text-center flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting to server...
            </p>
          </div>
        )}
        
        {connectionStatus === 'connected' && !errorMessage && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg animate-slide-down">
            <p className="text-sm text-green-600 dark:text-green-400 text-center flex items-center justify-center gap-2">
              <Wifi className="w-4 h-4" />
              Connected! Redirecting...
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('email')}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="admin@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-slide-down flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email.message}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register('password')}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-slide-down flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
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
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes progressBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
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