import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, Sparkles, TrendingUp, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { API_BASE_URL } from '../config/api';

const Events = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [visibleCards, setVisibleCards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      setVisibleCards([]);
      const filtered = getFilteredEvents();
      filtered.forEach((_, index) => {
        setTimeout(() => {
          setVisibleCards(prev => [...prev, index]);
        }, index * 100);
      });
    }
  }, [events, searchTerm, selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://ticket-hub-server-sv0b.onrender.com/api/events');
      const data = await response.json();

      if (data.success) {
        setEvents(data.data);
        
        const uniqueCategories = ['All', ...new Set(data.data.map(event => event.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } else {
        setError('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredEvents = () => {
    return events.filter((event) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        event.title?.toLowerCase().includes(search) ||
        event.location?.toLowerCase().includes(search) ||
        event.category?.toLowerCase().includes(search);
      
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  const handleViewDetails = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleBookNow = (eventId) => {
    navigate(`/booking/${eventId}`);
  };

  const filteredEvents = getFilteredEvents();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
      }`}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-purple-600 border-r-pink-600 mx-auto mb-6"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-purple-600 animate-pulse" />
          </div>
          <div className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            Loading amazing events...
          </div>
          <div className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Preparing something special for you
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
      }`}>
        <div className="text-center animate-fadeIn">
          <div className="text-6xl mb-4">😕</div>
          <div className={`text-2xl font-semibold mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
            {error}
          </div>
          <button
            onClick={fetchEvents}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-24 min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900' 
        : 'bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'
    }`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 mb-4">
            <TrendingUp className={`h-8 w-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} animate-bounce`} />
            <h1 className={`text-5xl font-bold bg-gradient-to-r ${
              theme === 'dark'
                ? 'from-purple-400 via-pink-400 to-blue-400'
                : 'from-purple-600 via-pink-600 to-blue-600'
            } bg-clip-text text-transparent`}>
              Discover Events
            </h1>
            <Sparkles className={`h-8 w-8 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'} animate-pulse`} />
          </div>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Find your next unforgettable experience
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 animate-slideUp">
          <div className="relative group">
            <Search className={`absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
              theme === 'dark' ? 'text-gray-500 group-focus-within:text-purple-400' : 'text-gray-400 group-focus-within:text-purple-600'
            }`} />
            <input
              type="text"
              placeholder="Search events by name, location, or category..."
              className={`w-full pl-14 pr-6 py-4 rounded-2xl border-2 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500 focus:bg-gray-750'
                  : 'bg-white/80 backdrop-blur-sm border-gray-200 text-gray-800 placeholder-gray-400 focus:border-purple-400 focus:bg-white'
              } focus:outline-none focus:ring-4 ${
                theme === 'dark' ? 'focus:ring-purple-500/20' : 'focus:ring-purple-200'
              } shadow-lg hover:shadow-xl`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="max-w-4xl mx-auto mb-12 animate-slideUp">
          <div className="flex items-center gap-2 mb-3">
            <Filter className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Filter by category:
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white/80 text-gray-700 hover:bg-white shadow-md'
                }`}
              >
                {category}
                {selectedCategory === category && category !== 'All' && (
                  <X className="inline-block ml-1 h-3 w-3" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Events Count */}
        <div className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="text-sm">
            Showing <span className="font-semibold text-purple-600">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className={`text-center text-xl mt-16 animate-fadeIn ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className="text-6xl mb-4">🔍</div>
            <div className="font-semibold mb-2">
              {searchTerm || selectedCategory !== 'All' 
                ? 'No events found matching your filters.' 
                : 'No events available at the moment.'}
            </div>
            <div className="text-sm">
              {(searchTerm || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4 text-purple-600 hover:text-purple-700 underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <div
                key={event._id}
                className={`group relative transform transition-all duration-500 ${
                  visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className={`relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-750'
                    : 'bg-white hover:bg-gray-50'
                } transform hover:-translate-y-2`}>
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={event.image || "https://via.placeholder.com/400?text=No+Image"}
                      alt={event.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                        theme === 'dark'
                          ? 'bg-purple-500/90 text-white'
                          : 'bg-purple-100/90 text-purple-800'
                      } transform group-hover:scale-110 transition-transform duration-300`}>
                        {event.category || "General"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-2 line-clamp-1 ${
                      theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                    }`}>
                      {event.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{event.pricePerSeat}
                      </span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        per seat
                      </span>
                    </div>

                    <p className={`text-sm mb-4 line-clamp-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-5">
                      <div className={`flex items-center gap-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>

                      <div className={`flex items-center gap-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm line-clamp-1">{event.location}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transform hover:scale-105`}
                        onClick={() => handleViewDetails(event._id)}
                      >
                        Details
                      </button>

                      <button
                        className="flex-1 px-4 py-2.5 rounded-xl font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                        onClick={() => handleBookNow(event._id)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10'
                      : 'bg-gradient-to-br from-purple-100/50 via-transparent to-pink-100/50'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Events;