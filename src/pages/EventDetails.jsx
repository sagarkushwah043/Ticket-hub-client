import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, ArrowLeft, Tag } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { API_BASE_URL } from "../config/api";


const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/events/${id}`);
const data = await res.json();


      if (data.success) {
        setEvent(data.data);
      } else {
        setError("Event not found");
      }
    } catch (err) {
      console.error("Error fetching event:", err);
      setError("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading event details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <p className="text-2xl font-bold text-red-600 mb-4">{error || "Event not found"}</p>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-10 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-all ${
            theme === 'dark' 
              ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </button>

        {/* Event Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8">
          <img
            src={event.image || "https://via.placeholder.com/1200x500?text=Event+Image"}
            alt={event.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Category Badge */}
          <div className="absolute top-6 right-6">
            <span className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              {event.category || "Event"}
            </span>
          </div>

          {/* Event Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">
              {event.title}
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl shadow-xl p-8 mb-6 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-2xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                About This Event
              </h2>
              <p className={`text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {event.description || "No description available for this event."}
              </p>
            </div>

            {/* Additional Info */}
            <div className={`rounded-2xl shadow-xl p-8 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Event Details
              </h2>
              
              <div className="space-y-4">
                <div className={`flex items-start gap-4 p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <Calendar className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Date & Time
                    </p>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className={`flex items-start gap-4 p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <MapPin className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Location
                    </p>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className={`flex items-start gap-4 p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Available Seats
                    </p>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {event.availableSeats || "Limited"} seats remaining
                    </p>
                  </div>
                </div>

                <div className={`flex items-start gap-4 p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <Tag className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Category
                    </p>
                    <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                      {event.category || "General"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl shadow-xl p-6 sticky top-6 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="text-center mb-6">
                <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Ticket Price
                </p>
                <p className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ₹{event.pricePerSeat}
                </p>
                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  per seat
                </p>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
              >
                Book Now
              </button>

              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Instant confirmation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Mobile tickets
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Secure payment
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    24/7 support
                  </li>
                </ul>
              </div>

              <p className={`text-xs text-center mt-4 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Free cancellation up to 24 hours before event
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;