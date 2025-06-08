import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Lock, User, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        navigate('/admin')
      } else {
        setError('Invalid username or password')
      }
    } catch (error) {
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-violet-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-200 rounded-full opacity-15 animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-violet-200 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4 w-20 h-20 border-2 border-violet-300 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-purple-300 rounded-full"></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-3xl font-serif bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Admin Panel
              </h1>
              
              <div className="flex justify-center mb-4">
                <div className="w-16 h-1 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full"></div>
              </div>
              
              <p className="text-gray-600">
                Sign in to manage website content
              </p>
            </div>

            {/* Setup Notice */}
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Setup Required</p>
                  <p>For full functionality, create a Supabase user with email: <code className="bg-amber-100 px-1 rounded">admin@wedding.local</code> and password: <code className="bg-amber-100 px-1 rounded">Admin2025!</code></p>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-violet-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-violet-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-violet-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 border-2 border-violet-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-violet-500 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-violet-500 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 text-white py-4 px-6 rounded-2xl hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 relative overflow-hidden group"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-3" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Use credentials: admin / Admin2025!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage