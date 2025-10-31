import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Eye,
  MapPin,
  Clock,
  Ticket,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

const useTheme = () => ({ theme: 'dark' }); // Mock hook for demo

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeEvents: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, eventId: null, eventTitle: '' });
  const [deletingId, setDeletingId] = useState(null);

  // Theme-based styling
  const bgClass = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900' 
    : 'bg-gradient-to-br from-fuchsia-50 via-pink-100 to-rose-100';
  
  const cardBg = theme === 'dark' ? 'bg-gray-800/70 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-pink-200';
  const hoverBg = theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-pink-50';
  const buttonPrimary = theme === 'dark' 
    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
    : 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700';
  const decorBlur = theme === 'dark' ? 'bg-purple-500' : 'bg-fuchsia-400';

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Simulate API call with demo data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const demoEvents = [
        {
          _id: '1',
          title: 'Summer Music Festival 2025',
          description: 'Amazing outdoor music festival',
          date: '2025-07-15',
          time: '18:30',
          location: 'Los Angeles, CA',
          venue: 'Hollywood Bowl',
          price: 149.99,
          capacity: 5000,
          availableSeats: 4523,
          bookings: 477,
          category: 'Festival',
          image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
          organizer: 'Live Nation',
          status: 'active'
        },
        {
          _id: '2',
          title: 'Tech Conference 2025',
          description: 'Annual technology conference',
          date: '2025-08-20',
          time: '09:00',
          location: 'San Francisco, CA',
          venue: 'Moscone Center',
          price: 299.00,
          capacity: 2000,
          availableSeats: 1856,
          bookings: 144,
          category: 'Conference',
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
          organizer: 'TechWorld',
          status: 'active'
        },
        {
          _id: '3',
          title: 'Food & Wine Festival',
          description: 'Culinary excellence showcase',
          date: '2025-09-10',
          time: '12:00',
          location: 'New York, NY',
          venue: 'Central Park',
          price: 89.50,
          capacity: 3000,
          availableSeats: 2734,
          bookings: 266,
          category: 'Festival',
          image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
          organizer: 'Culinary Arts',
          status: 'active'
        },
        {
          _id: '4',
          title: 'Jazz Night Live',
          description: 'Intimate jazz performance',
          date: '2025-06-25',
          time: '20:00',
          location: 'Chicago, IL',
          venue: 'Blue Note Jazz Club',
          price: 65.00,
          capacity: 500,
          availableSeats: 412,
          bookings: 88,
          category: 'Concert',
          image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
          organizer: 'Jazz Society',
          status: 'active'
        },
        {
          _id: '5',
          title: 'Marathon 2025',
          description: 'Annual city marathon',
          date: '2025-10-05',
          time: '07:00',
          location: 'Boston, MA',
          venue: 'City Streets',
          price: 125.00,
          capacity: 10000,
          availableSeats: 8945,
          bookings: 1055,
          category: 'Sports',
          image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
          organizer: 'Marathon Org',
          status: 'active'
        }
      ];
      
      setEvents(demoEvents);
      
      // Calculate stats
      const totalBookings = demoEvents.reduce((sum, event) => sum + event.bookings, 0);
      const totalRevenue = demoEvents.reduce((sum, event) => sum + (event.bookings * event.price), 0);
      
      setStats({
        totalEvents: demoEvents.length,
        totalBookings: totalBookings,
        totalRevenue: totalRevenue,
        activeEvents: demoEvents.filter(e => e.status === 'active').length
      });
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleDelete = async (eventId, eventTitle) => {
    setDeleteModal({ show: true, eventId, eventTitle });
  };

  const confirmDelete = async () => {
    const eventId = deleteModal.eventId;
    setDeletingId(eventId);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEvents(events.filter(e => e._id !== eventId));
      setDeleteModal({ show: false, eventId: null, eventTitle: '' });
      
      // Recalculate stats
      const updatedEvents = events.filter(e => e._id !== eventId);
      const totalBookings = updatedEvents.reduce((sum, event) => sum + event.bookings, 0);
      const totalRevenue = updatedEvents.reduce((sum, event) => sum + (event.bookings * event.price), 0);
      
      setStats({
        totalEvents: updatedEvents.length,
        totalBookings: totalBookings,
        totalRevenue: totalRevenue,
        activeEvents: updatedEvents.filter(e => e.status === 'active').length
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateEvent = () => {
    navigate('/admin/create-event');
  };

  const handleEditEvent = (id) => {
    navigate(`/admin/edit-event/${id}`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setTimeout(() => setRefreshing(false), 500);
  };

  const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
      className={`${cardBg} rounded-2xl shadow-xl p-6 border-2 ${borderColor} relative overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-10">
        <Icon className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${color} mb-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className={`${textMuted} text-sm font-semibold uppercase tracking-wider mb-1`}>
          {label}
        </h3>
        <motion.p 
          className={`text-3xl font-black ${textPrimary}`}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring" }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );

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
            Loading dashboard...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgClass} py-25 relative overflow-hidden transition-colors duration-700`}>
      {/* Decorative background */}
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

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className={`text-5xl font-black ${textPrimary} bg-gradient-to-r ${theme === 'dark' ? 'from-purple-400 to-blue-400' : 'from-fuchsia-600 to-pink-600'} bg-clip-text text-transparent mb-2`}>
              Admin Dashboard
            </h1>
            <p className={`${textSecondary} text-lg`}>Manage your events and track performance</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`group relative flex items-center ${theme === 'dark' ? 'bg-gray-700/80' : 'bg-white'} ${textPrimary} px-6 py-3 rounded-xl shadow-lg border-2 ${borderColor} font-semibold transition-all overflow-hidden disabled:opacity-70`}
              whileHover={{ scale: 1.05, y: -2, boxShadow: theme === 'dark' ? '0 10px 30px rgba(147, 51, 234, 0.3)' : '0 10px 30px rgba(236, 72, 153, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated background on hover */}
              <motion.div
                className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20' : 'bg-gradient-to-r from-fuchsia-500/20 to-pink-500/20'}`}
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                animate={refreshing ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
                className="relative z-10"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'text-purple-500' : ''}`} />
              </motion.div>
              <span className="relative z-10">
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </span>
            </motion.button>
            
            <motion.button
              onClick={handleLogout}
              className="group relative flex items-center bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl shadow-lg font-semibold overflow-hidden"
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                boxShadow: '0 10px 30px rgba(220, 38, 38, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              
              {/* Pulsing background */}
              <motion.div
                className="absolute inset-0 bg-red-700"
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <motion.div
                className="relative z-10"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <LogOut className="h-5 w-5 mr-2" />
              </motion.div>
              <span className="relative z-10">Logout</span>
              
              {/* Particle effects on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: '50%',
                    }}
                    initial={{ y: 0, opacity: 0 }}
                    whileHover={{
                      y: [0, -20, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Calendar} 
            label="Total Events" 
            value={stats.totalEvents}
            color={theme === 'dark' ? 'bg-purple-600' : 'bg-fuchsia-600'}
            delay={0.1}
          />
          <StatCard 
            icon={Ticket} 
            label="Total Bookings" 
            value={stats.totalBookings.toLocaleString()}
            color={theme === 'dark' ? 'bg-blue-600' : 'bg-pink-600'}
            delay={0.2}
          />
          <StatCard 
            icon={DollarSign} 
            label="Total Revenue" 
            value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            color={theme === 'dark' ? 'bg-green-600' : 'bg-rose-600'}
            delay={0.3}
          />
          <StatCard 
            icon={TrendingUp} 
            label="Active Events" 
            value={stats.activeEvents}
            color={theme === 'dark' ? 'bg-indigo-600' : 'bg-orange-600'}
            delay={0.4}
          />
        </div>

        {/* Events Table */}
        <motion.div 
          className={`${cardBg} rounded-2xl shadow-2xl border-2 ${borderColor} overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-6 border-b-2 border-opacity-30" style={{ borderColor: theme === 'dark' ? '#4B5563' : '#F9A8D4' }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className={`text-2xl font-bold ${textPrimary} mb-1`}>Manage Events</h2>
                <p className={`${textMuted} text-sm`}>{events.length} events in total</p>
              </div>
              <motion.button 
                onClick={handleCreateEvent}
                className={`flex items-center ${buttonPrimary} text-white px-6 py-3 rounded-xl shadow-lg font-semibold`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Event
              </motion.button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={theme === 'dark' ? 'bg-gray-700/50' : 'bg-pink-50'}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-bold ${textSecondary} uppercase tracking-wider`}>Event</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold ${textSecondary} uppercase tracking-wider`}>Date & Time</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold ${textSecondary} uppercase tracking-wider`}>Location</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold ${textSecondary} uppercase tracking-wider`}>Price</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold ${textSecondary} uppercase tracking-wider`}>Bookings</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold ${textSecondary} uppercase tracking-wider`}>Status</th>
                  <th className={`px-6 py-4 text-left text-xs font-bold ${textSecondary} uppercase tracking-wider`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-pink-100'}`}>
                <AnimatePresence>
                  {events.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <Calendar className={`h-16 w-16 ${textMuted} mx-auto mb-4 opacity-50`} />
                        <p className={`${textPrimary} text-lg font-semibold mb-2`}>No events found</p>
                        <p className={`${textMuted} mb-4`}>Create your first event to get started!</p>
                        <motion.button
                          onClick={handleCreateEvent}
                          className={`${buttonPrimary} text-white px-6 py-2 rounded-lg font-medium`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Create Event
                        </motion.button>
                      </td>
                    </motion.tr>
                  ) : (
                    events.map((event, index) => (
                      <motion.tr 
                        key={event._id}
                        className={`${hoverBg} transition-all`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <motion.img 
                              src={event.image} 
                              alt={event.title}
                              className="w-16 h-16 rounded-xl object-cover shadow-md"
                              whileHover={{ scale: 1.1 }}
                            />
                            <div>
                              <div className={`font-bold ${textPrimary} text-sm mb-1`}>{event.title}</div>
                              <div className={`${textMuted} text-xs flex items-center gap-1`}>
                                <Users className="h-3 w-3" />
                                {event.organizer}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm ${textPrimary}`}>
                            <div className="flex items-center gap-2 mb-1 font-semibold">
                              <Calendar className="h-4 w-4" />
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className={`flex items-center gap-2 ${textMuted} text-xs`}>
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm ${textPrimary}`}>
                            <div className="font-semibold mb-1">{event.venue}</div>
                            <div className={`flex items-center gap-1 ${textMuted} text-xs`}>
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-lg font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                            ${event.price.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm ${textPrimary}`}>
                            <div className="font-bold text-lg mb-1">{event.bookings}</div>
                            <div className={`${textMuted} text-xs`}>
                              {event.availableSeats} / {event.capacity} available
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                              <motion.div 
                                className={`h-1.5 rounded-full ${theme === 'dark' ? 'bg-purple-600' : 'bg-fuchsia-600'}`}
                                style={{ width: `${(event.bookings / event.capacity) * 100}%` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${(event.bookings / event.capacity) * 100}%` }}
                                transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <motion.span 
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                              event.status === 'active' 
                                ? theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                                : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {event.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                            {event.status}
                          </motion.span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <motion.button 
                              onClick={() => handleEditEvent(event._id)}
                              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'} transition-all`}
                              title="Edit Event"
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDelete(event._id, event.title)}
                              disabled={deletingId === event._id}
                              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-100 text-red-600 hover:bg-red-200'} transition-all disabled:opacity-50`}
                              title="Delete Event"
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {deletingId === event._id ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </motion.div>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteModal({ show: false, eventId: null, eventTitle: '' })}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className={`${cardBg} rounded-2xl shadow-2xl p-8 max-w-md w-full border-2 ${borderColor}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4"
                >
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </motion.div>
                <h3 className={`text-2xl font-bold ${textPrimary} mb-2`}>Delete Event?</h3>
                <p className={`${textSecondary} mb-1`}>Are you sure you want to delete</p>
                <p className={`font-bold ${textPrimary}`}>"{deleteModal.eventTitle}"?</p>
                <p className={`${textMuted} text-sm mt-2`}>This action cannot be undone.</p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setDeleteModal({ show: false, eventId: null, eventTitle: '' })}
                  className={`flex-1 px-6 py-3 border-2 ${borderColor} ${hoverBg} ${textPrimary} rounded-xl font-semibold transition-all`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmDelete}
                  disabled={deletingId !== null}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {deletingId ? (
                    <span className="flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </motion.div>
                      Deleting...
                    </span>
                  ) : (
                    'Delete Event'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;