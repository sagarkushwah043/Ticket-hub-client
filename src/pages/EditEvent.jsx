import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Users,
  Image,
  FileText,
  Tag,
  ArrowLeft,
  Save,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle,
  Loader,
  Eye,
  X,
} from 'lucide-react';

const useTheme = () => ({ theme: 'dark' }); // Mock hook for demo

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    venue: '',
    price: '',
    category: '',
    capacity: '',
    imageUrl: '',
    organizer: ''
  });
  
  const [originalData, setOriginalData] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('PM');
  const [changedFields, setChangedFields] = useState([]);

  // Popular locations
  const popularLocations = [
    { city: 'New York', state: 'NY', icon: '🗽' },
    { city: 'Los Angeles', state: 'CA', icon: '🌴' },
    { city: 'Chicago', state: 'IL', icon: '🌆' },
    { city: 'San Francisco', state: 'CA', icon: '🌉' },
    { city: 'Miami', state: 'FL', icon: '🏖️' },
    { city: 'Austin', state: 'TX', icon: '🎸' },
  ];

  // Theme-based styling
  const bgClass = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900' 
    : 'bg-gradient-to-br from-fuchsia-100 via-pink-200 to-rose-200';
  
  const cardBg = theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const inputBg = theme === 'dark' ? 'bg-gray-700/50' : 'bg-white';
  const inputBorder = theme === 'dark' ? 'border-gray-600' : 'border-pink-300';
  const inputFocus = theme === 'dark' ? 'focus:ring-purple-500 focus:border-purple-500' : 'focus:ring-fuchsia-500 focus:border-fuchsia-500';
  const buttonPrimary = theme === 'dark' 
    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
    : 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700';
  const decorBlur = theme === 'dark' ? 'bg-purple-500' : 'bg-fuchsia-400';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-pink-100';
  const selectedBg = theme === 'dark' ? 'bg-purple-600' : 'bg-gradient-to-r from-fuchsia-500 to-pink-500';
  const calendarBg = theme === 'dark' ? 'bg-gray-800/95' : 'bg-white';
  const changedFieldBorder = theme === 'dark' ? 'border-yellow-500' : 'border-orange-400';

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    // Initialize time picker from formData.time
    if (formData.time) {
      const [hours24, minutes] = formData.time.split(':').map(Number);
      const period = hours24 >= 12 ? 'PM' : 'AM';
      const hours12 = hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24;
      setSelectedHour(hours12);
      setSelectedMinute(minutes);
      setSelectedPeriod(period);
    }
  }, [formData.time]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      // Simulating API call with demo data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const demoEvent = {
        title: 'Summer Music Festival 2025',
        description: 'Join us for an amazing outdoor music festival featuring top artists from around the world. Experience three days of non-stop entertainment!',
        date: '2025-07-15',
        time: '18:30',
        location: 'Los Angeles, CA',
        venue: 'Hollywood Bowl',
        price: '149.99',
        category: 'Festival',
        capacity: '5000',
        imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
        organizer: 'Live Nation Entertainment'
      };
      
      setFormData(demoEvent);
      setOriginalData(demoEvent);
    } catch (error) {
      console.error('Error fetching event:', error);
      alert('Failed to load event');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Track changed fields
    if (value !== originalData[name] && !changedFields.includes(name)) {
      setChangedFields(prev => [...prev, name]);
    } else if (value === originalData[name]) {
      setChangedFields(prev => prev.filter(field => field !== name));
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateSelect = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = formatDate(selected);
    setFormData(prev => ({ ...prev, date: dateStr }));
    if (dateStr !== originalData.date && !changedFields.includes('date')) {
      setChangedFields(prev => [...prev, 'date']);
    }
    setShowCalendar(false);
  };

  const convertTo24Hour = (hour, period) => {
    if (period === 'AM') {
      return hour === 12 ? 0 : hour;
    } else {
      return hour === 12 ? 12 : hour + 12;
    }
  };

  const handleTimeSelect = () => {
    const hour24 = convertTo24Hour(selectedHour, selectedPeriod);
    const time = `${String(hour24).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
    setFormData(prev => ({ ...prev, time }));
    if (time !== originalData.time && !changedFields.includes('time')) {
      setChangedFields(prev => [...prev, 'time']);
    }
    setShowTimePicker(false);
  };

  const handleLocationSelect = (location) => {
    const locationStr = `${location.city}, ${location.state}`;
    setFormData(prev => ({ ...prev, location: locationStr }));
    if (locationStr !== originalData.location && !changedFields.includes('location')) {
      setChangedFields(prev => [...prev, 'location']);
    }
    setShowLocationSearch(false);
    setLocationSearch('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);

    setTimeout(() => {
      setSubmitSuccess(false);
      // navigate('/admin');
    }, 2500);
  };

  const handleCancel = () => {
    if (changedFields.length > 0) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirm) return;
    }
    navigate('/admin');
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

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
            Loading event details...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} py-12 relative overflow-hidden transition-colors duration-700`}>
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <motion.div 
          className={`absolute top-20 left-20 w-96 h-96 ${decorBlur} rounded-full blur-3xl`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className={`absolute bottom-20 right-20 w-96 h-96 ${decorBlur} rounded-full blur-3xl`}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.button
            onClick={handleCancel}
            className={`flex items-center ${textSecondary} hover:${textPrimary} mb-4 transition-colors`}
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </motion.button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-5xl font-bold ${textPrimary} bg-gradient-to-r ${theme === 'dark' ? 'from-purple-400 to-blue-400' : 'from-fuchsia-600 to-pink-600'} bg-clip-text text-transparent`}>
                Edit Event
              </h1>
              <p className={`${textSecondary} mt-2 flex items-center gap-2 text-lg`}>
                <Sparkles className="h-5 w-5" />
                Update your event details
              </p>
            </div>
            
            {changedFields.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`px-4 py-2 rounded-xl ${theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-orange-100 text-orange-600'} border-2 ${theme === 'dark' ? 'border-yellow-500/50' : 'border-orange-300'} font-semibold`}
              >
                {changedFields.length} field{changedFields.length > 1 ? 's' : ''} modified
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <motion.div 
            className={`lg:col-span-2 ${cardBg} rounded-3xl shadow-2xl p-8 border-2 ${inputBorder}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <motion.div 
                  className="md:col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                    <FileText className="h-5 w-5" />
                    Event Title *
                    {changedFields.includes('title') && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-yellow-400' : 'text-orange-600'}`}>
                        (Modified)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 ${inputBg} border-2 ${changedFields.includes('title') ? changedFieldBorder : inputBorder} rounded-xl ${inputFocus} focus:ring-2 ${textPrimary} transition-all`}
                    placeholder="Enter event title"
                    required
                  />
                </motion.div>

                {/* Description */}
                <motion.div 
                  className="md:col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                    <FileText className="h-5 w-5" />
                    Description *
                    {changedFields.includes('description') && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-yellow-400' : 'text-orange-600'}`}>
                        (Modified)
                      </span>
                    )}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 ${inputBg} border-2 ${changedFields.includes('description') ? changedFieldBorder : inputBorder} rounded-xl ${inputFocus} focus:ring-2 ${textPrimary} transition-all`}
                    rows="4"
                    placeholder="Describe your event"
                    required
                  />
                </motion.div>

                {/* Date */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                    <Calendar className="h-5 w-5" />
                    Date *
                    {changedFields.includes('date') && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-yellow-400' : 'text-orange-600'}`}>
                        (Modified)
                      </span>
                    )}
                  </label>
                  <motion.button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className={`w-full ${inputBg} border-2 ${changedFields.includes('date') ? changedFieldBorder : inputBorder} rounded-xl px-4 py-3 text-left ${textPrimary} transition-all flex items-center justify-between font-medium`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{formData.date || 'Select date'}</span>
                    <Calendar className="h-5 w-5" />
                  </motion.button>

                  <AnimatePresence>
                    {showCalendar && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className={`absolute top-full mt-2 ${calendarBg} border-2 ${inputBorder} rounded-2xl shadow-2xl p-6 z-50 w-96`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <motion.button
                            type="button"
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                            className={`p-2 ${hoverBg} rounded-xl transition-colors ${textPrimary}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </motion.button>
                          <h3 className={`${textPrimary} font-bold text-lg`}>
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </h3>
                          <motion.button
                            type="button"
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                            className={`p-2 ${hoverBg} rounded-xl transition-colors ${textPrimary}`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ChevronRight className="h-6 w-6" />
                          </motion.button>
                        </div>

                        <div className="grid grid-cols-7 gap-2 mb-3">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                            <div key={day} className={`text-center ${textSecondary} text-sm font-bold py-2`}>
                              {day}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                          {[...Array(startingDayOfWeek)].map((_, i) => (
                            <div key={`empty-${i}`} />
                          ))}
                          {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1;
                            const isSelected = formData.date === formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
                            return (
                              <motion.button
                                key={day}
                                type="button"
                                onClick={() => handleDateSelect(day)}
                                className={`p-3 rounded-xl text-center transition-all font-semibold ${
                                  isSelected 
                                    ? `${selectedBg} text-white shadow-lg` 
                                    : `${textPrimary} ${hoverBg}`
                                }`}
                                whileHover={{ scale: 1.15, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {day}
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Time */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative"
                >
                  <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                    <Clock className="h-5 w-5" />
                    Time *
                    {changedFields.includes('time') && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-yellow-400' : 'text-orange-600'}`}>
                        (Modified)
                      </span>
                    )}
                  </label>
                  <motion.button
                    type="button"
                    onClick={() => setShowTimePicker(!showTimePicker)}
                    className={`w-full ${inputBg} border-2 ${changedFields.includes('time') ? changedFieldBorder : inputBorder} rounded-xl px-4 py-3 text-left ${textPrimary} transition-all flex items-center justify-between font-medium`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{formData.time || 'Select time'}</span>
                    <Clock className="h-5 w-5" />
                  </motion.button>

                  <AnimatePresence>
                    {showTimePicker && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className={`absolute top-full mt-2 ${calendarBg} border-2 ${inputBorder} rounded-2xl shadow-2xl p-6 z-50 w-80`}
                      >
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <h4 className={`${textPrimary} text-sm font-bold mb-3 text-center`}>Hour</h4>
                            <div className="max-h-48 overflow-y-auto space-y-2">
                              {[...Array(12)].map((_, i) => {
                                const hour = i + 1;
                                return (
                                  <motion.button
                                    key={hour}
                                    type="button"
                                    onClick={() => setSelectedHour(hour)}
                                    className={`w-full p-2 rounded-lg text-center transition-all font-semibold ${
                                      selectedHour === hour
                                        ? `${selectedBg} text-white shadow-lg`
                                        : `${textPrimary} ${hoverBg}`
                                    }`}
                                    whileHover={{ scale: 1.1, x: 3 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {hour}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className={`${textPrimary} text-sm font-bold mb-3 text-center`}>Min</h4>
                            <div className="max-h-48 overflow-y-auto space-y-2">
                              {[0, 15, 30, 45].map((minute) => (
                                <motion.button
                                  key={minute}
                                  type="button"
                                  onClick={() => setSelectedMinute(minute)}
                                  className={`w-full p-2 rounded-lg text-center transition-all font-semibold ${
                                    selectedMinute === minute
                                      ? `${selectedBg} text-white shadow-lg`
                                      : `${textPrimary} ${hoverBg}`
                                  }`}
                                  whileHover={{ scale: 1.1, x: 3 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {String(minute).padStart(2, '0')}
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className={`${textPrimary} text-sm font-bold mb-3 text-center`}>Period</h4>
                            <div className="space-y-2">
                              {['AM', 'PM'].map((period) => (
                                <motion.button
                                  key={period}
                                  type="button"
                                  onClick={() => setSelectedPeriod(period)}
                                  className={`w-full p-3 rounded-lg text-center transition-all font-bold ${
                                    selectedPeriod === period
                                      ? `${selectedBg} text-white shadow-lg`
                                      : `${textPrimary} ${hoverBg}`
                                  }`}
                                  whileHover={{ scale: 1.1, x: 3 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {period}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <motion.button
                          type="button"
                          onClick={handleTimeSelect}
                          className={`w-full ${buttonPrimary} text-white font-bold py-3 rounded-xl shadow-lg`}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Apply Time
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Location */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="relative"
                >
                  <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                    <MapPin className="h-5 w-5" />
                    Location *
                    {changedFields.includes('location') && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-yellow-400' : 'text-orange-600'}`}>
                        (Modified)
                      </span>
                    )}
                  </label>
                  <motion.button
                    type="button"
                    onClick={() => setShowLocationSearch(!showLocationSearch)}
                    className={`w-full ${inputBg} border-2 ${changedFields.includes('location') ? changedFieldBorder : inputBorder} rounded-xl px-4 py-3 text-left ${textPrimary} transition-all flex items-center justify-between font-medium`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{formData.location || 'Select location'}</span>
                    <Search className="h-5 w-5" />
                  </motion.button>

                  <AnimatePresence>
                    {showLocationSearch && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className={`absolute top-full mt-2 ${calendarBg} border-2 ${inputBorder} rounded-2xl shadow-2xl p-6 z-50 w-full`}
                      >
                        <input
                          type="text"
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          placeholder="Search location..."
                          className={`w-full px-4 py-3 ${inputBg} border-2 ${inputBorder} rounded-xl mb-4 ${textPrimary} font-medium`}
                        />
                        <div className="space-y-2">
                          <p className={`${textSecondary} text-xs uppercase tracking-wider mb-3 font-bold`}>Popular Cities</p>
                          {popularLocations.map((loc, idx) => (
                            <motion.button
                              key={idx}
                              type="button"
                              onClick={() => handleLocationSelect(loc)}
                              className={`w-full p-4 rounded-xl ${textPrimary} ${hoverBg} transition-all text-left flex items-center gap-3 border-2 ${inputBorder}`}
                              whileHover={{ scale: 1.03, x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <span className="text-3xl">{loc.icon}</span>
                              <div>
                                <div className="font-bold text-lg">{loc.city}</div>
                                <div className={`text-sm ${textSecondary}`}>{loc.state}</div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Venue */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                    <MapPin className="h-5 w-5" />
                    Venue *
                    {changedFields.includes('venue') && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-yellow-400' : 'text-orange-600'}`}>
                        (Modified)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className={`w-full ${inputBg} border-2 ${changedFields.includes('venue') ? changedFieldBorder : inputBorder} rounded-xl px-4 py-3 ${inputFocus} focus:ring-2 ${textPrimary} transition-all`}
                    placeholder="Venue name"
                    required
                  />
                </motion.div>

                {/* Price */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                    <DollarSign className="h-5 w-5" />
                    Price *
                    {changedFields.includes('price') && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-yellow-400' : 'text-orange-600'}`}>
                        (Modified)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full ${inputBg} border-2 ${changedFields.includes('price') ? changedFieldBorder : inputBorder} rounded-xl px-4 py-3 ${inputFocus} focus:ring-2 ${textPrimary} transition-all`}
                    placeholder="0.00"
                    required
                  />
                </motion.div>

                {/* Capacity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                    <Users className="h-5 w-5" />
                    Capacity *
                    {changedFields.includes('capacity') && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-yellow-400' : 'text-orange-600'}`}>
                        (Modified)
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className={`w-full ${inputBg} border-2 ${changedFields.includes('capacity') ? changedFieldBorder : inputBorder} rounded-xl px-4 py-3 ${inputFocus} focus:ring-2 ${textPrimary} transition-all`}
                    placeholder="100"
                    required
                  />
                </motion.div>

                {/* Category */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                    <Tag className="h-5 w-5" />
                    Category *
                    {changedFields.includes('category') && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-yellow-400' : 'text-orange-600'}`}>
                        (Modified)
                      </span>
                    )}
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full ${inputBg} border-2 ${changedFields.includes('category') ? changedFieldBorder : inputBorder} rounded-xl px-4 py-3 ${inputFocus} focus:ring-2 ${textPrimary} transition-all font-medium`}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Concert">Concert</option>
                    <option value="Sports">Sports</option>
                    <option value="Theater">Theater</option>
                    <option value="Conference">Conference</option>
                    <option value="Festival">Festival</option>
                    <option value="Other">Other</option>
                  </select>
                </motion.div>

                {/* Organizer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                    <Users className="h-5 w-5" />
                    Organizer *
                    {changedFields.includes('organizer') && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-yellow-400' : 'text-orange-600'}`}>
                        (Modified)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    className={`w-full ${inputBg} border-2 ${changedFields.includes('organizer') ? changedFieldBorder : inputBorder} rounded-xl px-4 py-3 ${inputFocus} focus:ring-2 ${textPrimary} transition-all`}
                    placeholder="Organizer name"
                    required
                  />
                </motion.div>

                {/* Image */}
                <motion.div 
                  className="md:col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                >
                  <label className={`block ${textPrimary} font-semibold mb-2 flex items-center gap-2`}>
                    <Image className="h-5 w-5" />
                    Image URL *
                    {changedFields.includes('imageUrl') && (
                      <span className={`text-xs ${theme === 'dark' ? 'text-yellow-400' : 'text-orange-600'}`}>
                        (Modified)
                      </span>
                    )}
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className={`w-full ${inputBg} border-2 ${changedFields.includes('imageUrl') ? changedFieldBorder : inputBorder} rounded-xl px-4 py-3 ${inputFocus} focus:ring-2 ${textPrimary} transition-all`}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </motion.div>
              </div>

              {/* Actions */}
              <motion.div 
                className="flex justify-end space-x-4 mt-8 pt-6 border-t-2 border-opacity-30"
                style={{ borderColor: theme === 'dark' ? '#4B5563' : '#F9A8D4' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
              >
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  className={`px-8 py-3 border-2 ${inputBorder} ${hoverBg} ${textPrimary} rounded-xl transition-all font-bold`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  className={`flex items-center px-8 py-3 ${buttonPrimary} text-white rounded-xl shadow-xl font-bold transition-all relative overflow-hidden`}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2, 
                    boxShadow: theme === 'dark' ? '0 20px 40px rgba(147, 51, 234, 0.5)' : '0 20px 40px rgba(236, 72, 153, 0.5)' 
                  }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader className="h-5 w-5 mr-2" />
                        </motion.div>
                        Updating Event...
                      </motion.div>
                    ) : submitSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                        </motion.div>
                        Updated Successfully!
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center"
                      >
                        <Save className="h-5 w-5 mr-2" />
                        Update Event
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {submitSuccess && (
                    <>
                      {[...Array(30)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-3 h-3 rounded-full"
                          style={{
                            background: theme === 'dark' 
                              ? ['#f472b6', '#c084fc', '#60a5fa', '#34d399'][i % 4]
                              : ['#ec4899', '#f97316', '#eab308', '#10b981', '#06b6d4'][i % 5],
                            left: '50%',
                            top: '50%',
                          }}
                          initial={{ scale: 0, x: 0, y: 0 }}
                          animate={{
                            scale: [0, 1.5, 0],
                            x: (Math.random() - 0.5) * 250,
                            y: (Math.random() - 0.5) * 250,
                            opacity: [1, 1, 0],
                          }}
                          transition={{
                            duration: 1.2,
                            delay: i * 0.02,
                            ease: "easeOut"
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

          {/* Preview Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Image Preview Card */}
            <motion.div 
              className={`${cardBg} rounded-3xl shadow-xl p-6 border-2 ${inputBorder}`}
              whileHover={{ y: -5 }}
            >
              <h3 className={`${textPrimary} font-bold text-lg mb-4 flex items-center gap-2`}>
                <Eye className="h-5 w-5" />
                Image Preview
              </h3>
              {formData.imageUrl ? (
                <motion.div 
                  className="relative group cursor-pointer"
                  onClick={() => setShowImagePreview(true)}
                  whileHover={{ scale: 1.02 }}
                >
                  <img 
                    src={formData.imageUrl} 
                    alt="Event" 
                    className="w-full h-48 object-cover rounded-xl"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                </motion.div>
              ) : (
                <div className={`w-full h-48 ${inputBg} border-2 ${inputBorder} border-dashed rounded-xl flex items-center justify-center ${textSecondary}`}>
                  <div className="text-center">
                    <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No image yet</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Event Summary Card */}
            <motion.div 
              className={`${cardBg} rounded-3xl shadow-xl p-6 border-2 ${inputBorder}`}
              whileHover={{ y: -5 }}
            >
              <h3 className={`${textPrimary} font-bold text-lg mb-4 flex items-center gap-2`}>
                <Sparkles className="h-5 w-5" />
                Event Summary
              </h3>
              <div className="space-y-3">
                <div className={`${textSecondary} text-sm`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold">Date & Time</span>
                  </div>
                  <p className={`${textPrimary} ml-6`}>
                    {formData.date || 'Not set'} at {formData.time || 'Not set'}
                  </p>
                </div>
                
                <div className={`${textSecondary} text-sm`}>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="font-semibold">Location</span>
                  </div>
                  <p className={`${textPrimary} ml-6`}>
                    {formData.venue || 'Not set'}
                    {formData.location && <span className="block text-xs">{formData.location}</span>}
                  </p>
                </div>
                
                <div className={`${textSecondary} text-sm`}>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">Price</span>
                  </div>
                  <p className={`${textPrimary} ml-6 text-lg font-bold`}>
                    ${formData.price || '0.00'}
                  </p>
                </div>
                
                <div className={`${textSecondary} text-sm`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">Capacity</span>
                  </div>
                  <p className={`${textPrimary} ml-6`}>
                    {formData.capacity || '0'} attendees
                  </p>
                </div>
                
                <div className={`${textSecondary} text-sm`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="h-4 w-4" />
                    <span className="font-semibold">Category</span>
                  </div>
                  <p className={`${textPrimary} ml-6`}>
                    {formData.category || 'Not set'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Full Screen Image Preview Modal */}
      <AnimatePresence>
        {showImagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowImagePreview(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setShowImagePreview(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-8 w-8" />
              </motion.button>
              <img 
                src={formData.imageUrl} 
                alt="Event Preview" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Overlay */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
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
                🎉 Updated! 🎉
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-xl font-semibold relative z-10 drop-shadow"
              >
                Your event has been successfully updated!
              </motion.p>
              
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