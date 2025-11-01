import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Save,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Tag,
  FileText
} from 'lucide-react';

const useTheme = () => ({ theme: 'dark' });

// API URL Configuration
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ticket-hub-server-sv0b.onrender.com'
  : 'http://localhost:5000';

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    venue: '',
    category: '',
    totalSeats: '',
    pricePerSeat: '',
    image: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  // Theme-based styling
  const bgClass = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900' 
    : 'bg-gradient-to-br from-fuchsia-50 via-pink-100 to-rose-100';
  
  const cardBg = theme === 'dark' ? 'bg-gray-800/70 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-pink-200';
  const inputBg = theme === 'dark' ? 'bg-gray-700/50' : 'bg-white';
  const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-pink-300';
  const focusRing = theme === 'dark' 
    ? 'focus:ring-purple-500 focus:border-purple-500' 
    : 'focus:ring-fuchsia-500 focus:border-fuchsia-500';
  const buttonPrimary = theme === 'dark' 
    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
    : 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700';
  const decorBlur = theme === 'dark' ? 'bg-purple-500' : 'bg-fuchsia-400';

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://ticket-hub-server-sv0b.onrender.com/api/events/${id}`);
      const data = await response.json();

      if (data.success) {
        const event = data.data;
        const formattedDate = new Date(event.date).toISOString().split('T')[0];
        
        setFormData({
          title: event.title || '',
          description: event.description || '',
          date: formattedDate,
          location: event.location || '',
          venue: event.venue || '',
          category: event.category || '',
          totalSeats: event.totalSeats || '',
          pricePerSeat: event.pricePerSeat || '',
          image: event.image || '',
          status: event.status || 'active'
        });
      } else {
        setError(data.message || 'Failed to load event');
      }
    } catch (error) {
      console.error('Error loading event:', error);
      setError('Failed to connect to server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.pricePerSeat || formData.pricePerSeat < 0) newErrors.pricePerSeat = 'Valid price is required';
    if (!formData.totalSeats || formData.totalSeats <= 0) newErrors.totalSeats = 'Valid capacity is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`https://ticket-hub-server-sv0b.onrender.com/api/events/${id}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          location: formData.location,
          venue: formData.venue,
          category: formData.category,
          totalSeats: parseInt(formData.totalSeats),
          pricePerSeat: parseFloat(formData.pricePerSeat),
          image: formData.image,
          status: formData.status
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Failed to update event. Please check if the backend is running.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center`}>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`rounded-full h-20 w-20 border-4 ${theme === 'dark' ? 'border-purple-600' : 'border-fuchsia-600'} border-t-transparent mx-auto mb-6`}
          />
          <motion.div 
            className={`text-2xl font-bold ${textPrimary}`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading event...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className={`min-h-screen ${bgClass} flex items-center justify-center p-4`}>
        <motion.div 
          className={`${cardBg} rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 border-red-500`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold ${textPrimary} mb-2`}>Error Loading Event</h2>
            <p className={`${textSecondary} mb-6`}>{error}</p>
            <motion.button
              onClick={() => navigate('/admin/dashboard')}
              className={`${buttonPrimary} text-white px-6 py-3 rounded-xl font-semibold`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} py-12 relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <motion.div 
          className={`absolute top-20 left-20 w-96 h-96 ${decorBlur} rounded-full blur-3xl`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className={`absolute bottom-20 right-20 w-96 h-96 ${decorBlur} rounded-full blur-3xl`}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={handleCancel}
            className={`flex items-center gap-2 ${textSecondary} mb-4 ${theme === 'dark' ? 'hover:text-purple-400' : 'hover:text-fuchsia-600'} transition-colors`}
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </motion.button>
          
          <h1 className={`text-5xl font-black ${textPrimary} bg-gradient-to-r ${theme === 'dark' ? 'from-purple-400 to-blue-400' : 'from-fuchsia-600 to-pink-600'} bg-clip-text text-transparent mb-2`}>
            Edit Event
          </h1>
          <p className={`${textSecondary} text-lg`}>Update your event details</p>
        </motion.div>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'} border-2 border-green-500 rounded-xl flex items-center gap-3`}
            >
              <CheckCircle className={`h-6 w-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              <div>
                <p className={`font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>Event Updated Successfully!</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>Redirecting to dashboard...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && formData.title && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 ${theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'} border-2 border-red-500 rounded-xl flex items-center gap-3`}
            >
              <AlertCircle className={`h-6 w-6 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
              <div>
                <p className={`font-bold ${theme === 'dark' ? 'text-red-300' : 'text-red-800'}`}>Error Updating Event</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className={`${cardBg} rounded-2xl shadow-2xl p-8 border-2 ${borderColor}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="md:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                  <FileText className="h-5 w-5" />
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${inputBg} border-2 ${errors.title ? 'border-red-500' : inputBorder} rounded-xl ${focusRing} focus:ring-2 ${textPrimary} transition-all`}
                  placeholder="Enter event title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </motion.div>

              <motion.div 
                className="md:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                  <FileText className="h-5 w-5" />
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${inputBg} border-2 ${errors.description ? 'border-red-500' : inputBorder} rounded-xl ${focusRing} focus:ring-2 ${textPrimary} transition-all`}
                  rows="4"
                  placeholder="Describe your event"
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                  <Calendar className="h-5 w-5" />
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${inputBg} border-2 ${errors.date ? 'border-red-500' : inputBorder} rounded-xl ${focusRing} focus:ring-2 ${textPrimary} transition-all`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                  <Tag className="h-5 w-5" />
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${inputBg} border-2 ${errors.category ? 'border-red-500' : inputBorder} rounded-xl ${focusRing} focus:ring-2 ${textPrimary} transition-all`}
                >
                  <option value="">Select category</option>
                  <option value="Concert">Concert</option>
                  <option value="Sports">Sports</option>
                  <option value="Theater">Theater</option>
                  <option value="Conference">Conference</option>
                  <option value="Festival">Festival</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Exhibition">Exhibition</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                  <MapPin className="h-5 w-5" />
                  Venue *
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${inputBg} border-2 ${errors.venue ? 'border-red-500' : inputBorder} rounded-xl ${focusRing} focus:ring-2 ${textPrimary} transition-all`}
                  placeholder="Venue name"
                />
                {errors.venue && <p className="mt-1 text-sm text-red-500">{errors.venue}</p>}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                  <MapPin className="h-5 w-5" />
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${inputBg} border-2 ${errors.location ? 'border-red-500' : inputBorder} rounded-xl ${focusRing} focus:ring-2 ${textPrimary} transition-all`}
                  placeholder="City, State"
                />
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                  <DollarSign className="h-5 w-5" />
                  Price Per Seat *
                </label>
                <input
                  type="number"
                  name="pricePerSeat"
                  value={formData.pricePerSeat}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 ${inputBg} border-2 ${errors.pricePerSeat ? 'border-red-500' : inputBorder} rounded-xl ${focusRing} focus:ring-2 ${textPrimary} transition-all`}
                  placeholder="0.00"
                />
                {errors.pricePerSeat && <p className="mt-1 text-sm text-red-500">{errors.pricePerSeat}</p>}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                  <Users className="h-5 w-5" />
                  Total Seats *
                </label>
                <input
                  type="number"
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-4 py-3 ${inputBg} border-2 ${errors.totalSeats ? 'border-red-500' : inputBorder} rounded-xl ${focusRing} focus:ring-2 ${textPrimary} transition-all`}
                  placeholder="100"
                />
                {errors.totalSeats && <p className="mt-1 text-sm text-red-500">{errors.totalSeats}</p>}
              </motion.div>

              <motion.div 
                className="md:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                  <ImageIcon className="h-5 w-5" />
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${inputBg} border-2 ${inputBorder} rounded-xl ${focusRing} focus:ring-2 ${textPrimary} transition-all`}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <motion.div 
                    className="mt-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <img 
                      src={formData.image} 
                      alt="Event preview" 
                      className="w-full h-48 object-cover rounded-xl shadow-lg"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800';
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                  <CheckCircle className="h-5 w-5" />
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${inputBg} border-2 ${inputBorder} rounded-xl ${focusRing} focus:ring-2 ${textPrimary} transition-all`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </motion.div>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t-2"
              style={{ borderColor: theme === 'dark' ? '#4B5563' : '#F9A8D4' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <motion.button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className={`px-8 py-3 border-2 ${inputBorder} ${inputBg} ${textPrimary} rounded-xl transition-all font-bold disabled:opacity-50`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                disabled={saving}
                className={`flex items-center justify-center px-8 py-3 ${buttonPrimary} text-white rounded-xl shadow-xl font-bold transition-all disabled:opacity-70 relative overflow-hidden`}
                whileHover={{ 
                  scale: saving ? 1 : 1.02, 
                  y: saving ? 0 : -2,
                  boxShadow: theme === 'dark' ? '0 20px 40px rgba(147, 51, 234, 0.5)' : '0 20px 40px rgba(236, 72, 153, 0.5)' 
                }}
                whileTap={{ scale: 0.98 }}
              >
                {saving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <RefreshCw className="h-5 w-5" />
                    </motion.div>
                    Updating Event...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Update Event
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`${theme === 'dark' ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600' : 'bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500'} rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden`}
            >
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                style={{
                  backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                  backgroundSize: '30px 30px'
                }}
              />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="relative z-10"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <CheckCircle className="h-32 w-32 text-white mx-auto mb-8 drop-shadow-2xl" />
                </motion.div>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-black text-white mb-4 relative z-10 drop-shadow-lg"
              >
                🎉 Success! 🎉
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-xl font-semibold relative z-10 drop-shadow"
              >
                Your event has been updated successfully!
              </motion.p>
              
              {/* Celebration particles */}
              {[...Array(60)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 rounded-full"
                  style={{
                    background: ['#fbbf24', '#f472b6', '#c084fc', '#60a5fa', '#34d399', '#fb923c'][i % 6],
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: (Math.random() - 0.5) * 500,
                    y: (Math.random() - 0.5) * 500,
                    opacity: [1, 1, 0],
                    rotate: Math.random() * 360
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.01,
                    ease: "easeOut"
                  }}
                />
              ))}

              {/* Sparkle stars */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute text-4xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditEvent;