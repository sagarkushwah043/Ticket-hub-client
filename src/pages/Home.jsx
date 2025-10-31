import React, { useEffect, useState, useRef } from 'react';
import { Calendar, MapPin, Star, Users, Zap, Shield, TrendingUp, Clock, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const featuredEvents = [
    {
      id: 1,
      title: 'Summer Music Festival 2025',
      date: 'Nov 15, 2025',
      location: 'Central Park, NY',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      rating: 4.8,
      attendees: 2500
    },
    {
      id: 2,
      title: 'Tech Conference 2025',
      date: 'Dec 5, 2025',
      location: 'Convention Center',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      rating: 4.9,
      attendees: 1800
    },
    {
      id: 3,
      title: 'Comedy Night Live',
      date: 'Nov 20, 2025',
      location: 'Comedy Club Downtown',
      image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
      rating: 4.7,
      attendees: 500
    }
  ];

  const categories = [
    { icon: '🎵', name: 'Music', count: '12K+ Events', color: 'from-purple-500 to-pink-500' },
    { icon: '🎭', name: 'Theater', count: '8K+ Shows', color: 'from-blue-500 to-cyan-500' },
    { icon: '⚽', name: 'Sports', count: '15K+ Games', color: 'from-green-500 to-emerald-500' },
    { icon: '🎨', name: 'Arts', count: '6K+ Events', color: 'from-orange-500 to-red-500' },
    { icon: '🎤', name: 'Comedy', count: '4K+ Shows', color: 'from-yellow-500 to-orange-500' },
    { icon: '🎪', name: 'Festivals', count: '10K+ Events', color: 'from-indigo-500 to-purple-500' }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Instant Booking',
      description: 'Book tickets instantly with our fast and secure checkout process',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'Your payments are safe with bank-level security encryption',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: Users,
      title: 'Best Selection',
      description: 'Access to thousands of events from top organizers worldwide',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Get help anytime with our dedicated customer support team',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Event Enthusiast',
      image: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      text: 'TicketHub made booking tickets so easy! Found amazing concerts and the process was seamless.'
    },
    {
      name: 'Michael Chen',
      role: 'Sports Fan',
      image: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      text: 'Best platform for sports events. Never missed a game since I started using TicketHub!'
    },
    {
      name: 'Emily Davis',
      role: 'Theater Lover',
      image: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      text: 'The variety of shows available is incredible. Highly recommend for theater enthusiasts!'
    }
  ];

  return (
    <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}>
      <Header />

      {/* Categories Section with Parallax */}
      <section 
        id="categories"
        ref={(el) => (sectionRefs.current.categories = el)}
        className={`py-20 relative overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div 
          className="absolute inset-0 opacity-5"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="py-3 text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Explore by Category
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Find the perfect event for your interests from our diverse collection
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`group cursor-pointer transition-all duration-500 ${
                  isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border border-gray-600' 
                    : 'bg-white border border-gray-100'
                }`}>
                  <div className={`text-5xl mb-4 group-hover:scale-125 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                    {category.name}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {category.count}
                  </p>
                  <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-500 mt-4`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events with Parallax */}
      <section 
        id="featured"
        ref={(el) => (sectionRefs.current.featured = el)}
        className="py-20 relative overflow-hidden"
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: theme === 'dark' 
              ? 'linear-gradient(to bottom, rgba(17, 24, 39, 0) 0%, rgba(17, 24, 39, 1) 100%)'
              : 'linear-gradient(to bottom, rgba(249, 250, 251, 0) 0%, rgba(249, 250, 251, 1) 100%)',
            transform: `translateY(${scrollY * 0.2}px)`
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className={`inline-flex items-center gap-2 rounded-full px-6 py-2 mb-4 ${
              theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'
            }`}>
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-purple-600 font-semibold text-sm">Trending Now</span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Featured Events
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Don't miss out on these incredible experiences happening soon
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => (
              <div
                key={event.id}
                className={`group transition-all duration-700 ${
                  isVisible.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  transform: `translateY(${scrollY * 0.05 * (index + 1)}px)`
                }}
              >
                <div className={`rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-100'
                }`}>
                  <div className="relative overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-sm">{event.rating}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="text-sm font-medium">{event.date}</span>
                      </div>
                      <div className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="text-sm font-medium">{event.location}</span>
                      </div>
                      <div className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        <Users className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="text-sm font-medium">{event.attendees}+ attending</span>
                      </div>
                    </div>

                    <div className={`flex justify-between items-center pt-4 border-t ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                    }`}>
                      <div>
                        <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                          {event.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
            >
              View All Events
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section with Parallax */}
      <section 
        id="features"
        ref={(el) => (sectionRefs.current.features = el)}
        className={`py-20 relative overflow-hidden ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
            : 'bg-gradient-to-br from-purple-50 to-indigo-50'
        }`}
      >
        <div 
          className="absolute inset-0 opacity-30"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-300 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className={`text-4xl md:text-5xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Why Choose TicketHub?
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              We make event booking simple, secure, and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`group transition-all duration-700 ${
                    isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border border-gray-700' 
                      : 'bg-white border border-gray-100'
                  }`}>
                    <div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h3>
                    <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="testimonials"
        ref={(el) => (sectionRefs.current.testimonials = el)}
        className={`py-20 relative overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className={`inline-flex items-center gap-2 rounded-full px-6 py-2 mb-4 ${
              theme === 'dark' ? 'bg-pink-900/50' : 'bg-pink-100'
            }`}>
              <Heart className="w-4 h-4 text-pink-600 fill-pink-600" />
              <span className="text-pink-600 font-semibold text-sm">Loved by Thousands</span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              What Our Users Say
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Join millions of happy event-goers who trust TicketHub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-700' 
                    : 'bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100'
                }`}>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className={`mb-6 leading-relaxed italic ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-4 ring-purple-200"
                    />
                    <div>
                      <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {testimonial.name}
                      </div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Parallax */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Experience Something Amazing?
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Join thousands of event enthusiasts and never miss out on the best experiences
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Start Exploring
            <ChevronRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;