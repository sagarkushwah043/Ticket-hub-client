import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Music, Theater, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const floatingIcons = [
    { Icon: Music, delay: 0, duration: 3 },
    { Icon: Theater, delay: 0.5, duration: 4 },
    { Icon: Trophy, delay: 1, duration: 3.5 },
    { Icon: Sparkles, delay: 1.5, duration: 4.5 }
  ];

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float {
          animation: float var(--duration, 3s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
        }
        .animate-pulse-scale {
          animation: pulse-scale 4s ease-in-out infinite;
        }
        .gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800">
        
        {/* Animated Background Gradient */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`,
            transition: 'background 0.3s ease'
          }}
        />

        {/* Parallax Background Circles */}
        <div 
          className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse-scale"
          style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)` }}
        />
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-scale"
          style={{ 
            transform: `translate(${-scrollY * 0.08}px, ${-scrollY * 0.12}px)`,
            animationDelay: '2s'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"
          style={{ transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.08}px)` }}
        />

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {floatingIcons.map(({ Icon, delay, duration }, index) => (
            <div
              key={index}
              className="absolute animate-float opacity-20"
              style={{
                '--delay': `${delay}s`,
                '--duration': `${duration}s`,
                top: `${20 + index * 20}%`,
                left: `${10 + index * 20}%`,
                transform: `translate(${scrollY * (0.02 * (index + 1))}px, ${scrollY * (0.03 * (index + 1))}px)`
              }}
            >
              <Icon className="w-16 h-16 text-white" />
            </div>
          ))}
        </div>

        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 mb-8 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
            style={{ transform: `translateY(${scrollY * -0.2}px)` }}
          >
            <Sparkles className="w-4 h-4 text-yellow-300 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-white text-sm font-medium">Discover Amazing Events</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          {/* Main Heading */}
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-white leading-tight"
            style={{ transform: `translateY(${scrollY * -0.3}px)` }}
          >
            Book Your Next
            <br />
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent gradient-shift">
              Experience
            </span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-purple-100 leading-relaxed"
            style={{ transform: `translateY(${scrollY * -0.4}px)` }}
          >
            Discover and book tickets to the hottest events, concerts, and shows in your city. 
            <span className="block mt-2 text-purple-200 font-semibold">Join millions of event lovers worldwide.</span>
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            style={{ transform: `translateY(${scrollY * -0.5}px)` }}
          >
            <Link
              to="/events"
              className="group relative inline-flex items-center bg-white text-purple-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <span className="relative z-10">Explore Events</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
            </Link>

            <button className="group relative inline-flex items-center bg-purple-500/20 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/50">
              <span className="relative z-10">Learn More</span>
              <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500 relative z-10" />
            </button>
          </div>

          {/* Stats Preview */}
          <div 
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            style={{ transform: `translateY(${scrollY * -0.6}px)` }}
          >
            {[
              { value: '50K+', label: 'Events' },
              { value: '2M+', label: 'Tickets Sold' },
              { value: '98%', label: 'Happy Customers' }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center group cursor-pointer"
              >
                <div className="text-3xl md:text-4xl font-black text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-purple-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;