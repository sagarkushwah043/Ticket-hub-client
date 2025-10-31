import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_EMAIL = 'admin@tickethub.com';
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
        const fakeToken = 'fake-jwt-token-' + Date.now();
        localStorage.setItem('adminToken', fakeToken);
        navigate('/admin');
      } else {
        setError('Invalid email or password. Please check your credentials.');
      }
      setLoading(false);
    }, 800);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const errorVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const isDark = theme === 'dark';

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-25 px-4 transition-all duration-500"
      style={{
        background: isDark 
          ? 'linear-gradient(to bottom right, #111827, #1f2937, #111827)'
          : 'linear-gradient(to bottom right, #f9fafb, #f3f4f6, #e5e7eb)'
      }}
    >
      {/* Theme Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        style={{
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          color: isDark ? '#9ca3af' : '#374151'
        }}
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </motion.button>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full"
      >
        {/* Logo/Brand Section */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mb-4 shadow-lg"
          >
            <Lock className="h-8 w-8 text-white" />
          </motion.div>
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: isDark ? '#ffffff' : '#111827' }}
          >
            Welcome Back
          </h1>
          <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
            Sign in to access your dashboard
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl shadow-2xl p-8 backdrop-blur-sm border transition-all duration-300"
          style={{
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderColor: isDark ? '#374151' : '#e5e7eb'
          }}
        >
          {/* Demo Credentials */}
          <motion.div
            variants={itemVariants}
            className="border rounded-xl p-4 mb-6 transition-all duration-300"
            style={{
              background: isDark 
                ? 'linear-gradient(to right, rgba(30, 58, 138, 0.2), rgba(88, 28, 135, 0.2))'
                : 'linear-gradient(to right, #eff6ff, #faf5ff)',
              borderColor: isDark ? '#1e3a8a' : '#bfdbfe'
            }}
          >
            <h3 
              className="font-semibold mb-2 flex items-center"
              style={{ color: isDark ? '#93c5fd' : '#1e40af' }}
            >
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Demo Credentials
            </h3>
            <p 
              className="text-sm"
              style={{ color: isDark ? '#93c5fd' : '#1e40af' }}
            >
              📧 Email: {ADMIN_EMAIL}
            </p>
            <p 
              className="text-sm"
              style={{ color: isDark ? '#93c5fd' : '#1e40af' }}
            >
              🔑 Password: {ADMIN_PASSWORD}
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="border rounded-xl p-4 mb-6 flex items-start transition-all duration-300"
                style={{
                  backgroundColor: isDark ? 'rgba(127, 29, 29, 0.2)' : '#fef2f2',
                  borderColor: isDark ? '#991b1b' : '#fecaca'
                }}
              >
                <AlertCircle 
                  className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"
                  style={{ color: isDark ? '#fca5a5' : '#dc2626' }}
                />
                <p 
                  className="text-sm"
                  style={{ color: isDark ? '#fca5a5' : '#b91c1c' }}
                >
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <motion.div variants={itemVariants} className="mb-5">
              <label 
                className="block font-medium mb-2"
                style={{ color: isDark ? '#d1d5db' : '#374151' }}
              >
                Email Address
              </label>
              <div className="relative group">
                <Mail 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors"
                  style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-300"
                  style={{
                    backgroundColor: isDark ? '#374151' : '#ffffff',
                    borderColor: isDark ? '#4b5563' : '#d1d5db',
                    color: isDark ? '#ffffff' : '#111827'
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants} className="mb-6">
              <label 
                className="block font-medium mb-2"
                style={{ color: isDark ? '#d1d5db' : '#374151' }}
              >
                Password
              </label>
              <div className="relative group">
                <Lock 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors"
                  style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-300"
                  style={{
                    backgroundColor: isDark ? '#374151' : '#ffffff',
                    borderColor: isDark ? '#4b5563' : '#d1d5db',
                    color: isDark ? '#ffffff' : '#111827'
                  }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                  style={{ color: isDark ? '#6b7280' : '#9ca3af' }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-md relative overflow-hidden"
              style={{
                background: loading 
                  ? 'linear-gradient(to right, #a78bfa, #818cf8)'
                  : 'linear-gradient(to right, #9333ea, #3b82f6)',
                opacity: loading ? 0.7 : 1
              }}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Logging in...
                  </motion.span>
                ) : (
                  <motion.span
                    key="login"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          </form>
        </motion.div>

       
      </motion.div>
    </div>
  );
};

export default Login;