import React, { useState, useEffect } from 'react';
import { Ticket, Moon, Sun, Menu, X, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  // Handlers
  const closeMobileMenu = () => setMobileMenuOpen(false);
  
  const handleNavigation = (path) => {
    closeMobileMenu();
    navigate(path);
  };

  const handleAdminClick = () => {
    closeMobileMenu();
    navigate('/admin');
  };

  // Theme-based classes
  const navBg = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-950/98 via-gray-900/98 to-gray-950/98' 
    : 'bg-gradient-to-br from-white/98 via-gray-50/98 to-white/98';
  const borderColor = theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50';
  const textColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const hoverText = theme === 'dark' ? 'hover:text-white' : 'hover:text-gray-900';

  const NavLink = ({ href, children, mobile = false }) => {
    const isActive = location.pathname === href;
    
    if (mobile) {
      return (
        <button
          onClick={() => handleNavigation(href)}
          className="w-full flex items-center justify-between px-6 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 group hover:bg-linear-to-r hover:from-purple-500/10 hover:to-indigo-500/10 relative overflow-hidden"
        >
          <span className={`${isActive ? 'text-purple-500' : textColor} group-hover:text-purple-500 transition-colors duration-300 relative z-10`}>
            {children}
          </span>
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 animate-pulse" />
          )}
          <Ticket className={`h-5 w-5 ${isActive ? 'text-purple-500' : 'text-gray-400'} group-hover:text-purple-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`} />
        </button>
      );
    }

    return (
      <button
        onClick={() => handleNavigation(href)}
        className={`relative px-6 py-2.5 text-base font-semibold rounded-full transition-all duration-300 flex items-center justify-center group overflow-hidden ${textColor} ${hoverText}`}
      >
        {/* Hover background */}
        <span className={`absolute inset-0 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100`} />
        
        {/* Active indicator */}
        {isActive && (
          <>
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 animate-pulse" />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
          </>
        )}
        
        {/* Text */}
        <span className={`relative z-10 ${isActive ? 'text-purple-500' : ''}`}>{children}</span>
        
        {/* Shine effect on hover */}
        <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full" style={{ transition: 'transform 0.8s ease' }} />
      </button>
    );
  };

  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
          50% { opacity: 0.8; box-shadow: 0 0 30px rgba(168, 85, 247, 0.6); }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

    <nav
  className={`fixed top-0 left-0 right-0 z-50 mb-24 transition-all duration-500 backdrop-blur-2xl
    ${scrolled ? 'h-16 shadow-2xl' : 'h-20 shadow-lg'}
    ${navBg} ${scrolled ? `border-b ${borderColor}` : ''}
  `}
>

        {/* Gradient line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">

            {/* Logo */}
            <button
              onClick={() => handleNavigation('/')}
              className="group flex items-center space-x-3 relative z-50 animate-float"
              aria-label="TicketHub Home"
            >
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 via-indigo-400 to-purple-500 blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse-glow" />
                
                {/* Sparkle effect */}
                <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125" />
                
                <Ticket className="h-6 w-6 text-white relative z-10 group-hover:rotate-12 transition-transform duration-500" />
              </div>
              <span className="text-xl lg:text-2xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight bg-[length:200%_auto] animate-shimmer">
                TicketHub
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">

              {/* Navigation Links */}
              <NavLink href="/">Home</NavLink>
              <NavLink href="/events">Events</NavLink>
              

              {/* Divider */}
              <div className={`w-px h-8 mx-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-gray-100/60'} backdrop-blur-sm transition-all duration-500 group hover:scale-110 hover:rotate-12 focus:outline-none focus:ring-2 focus:ring-purple-500/50 relative overflow-hidden`}
                aria-label="Toggle theme"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <Sun
                    className={`absolute h-5 w-5 text-amber-400 transition-all duration-700 ${
                      theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-180 scale-0 opacity-0'
                    }`}
                  />
                  <Moon
                    className={`absolute h-5 w-5 text-indigo-500 transition-all duration-700 ${
                      theme === 'dark' ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                    }`}
                  />
                </div>
              </button>

              {/* Admin Button */}
              <button
                onClick={handleAdminClick}
                className="relative ml-2 px-7 py-3 font-bold text-white text-sm lg:text-base rounded-full overflow-hidden shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 group"
                aria-label="Go to Admin Panel"
              >
                {/* Base gradient */}
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] animate-shimmer" />
                
                {/* Hover glow */}
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
                
                {/* Shine effect */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full" style={{ transition: 'transform 1s ease' }} />
                
                <span className="relative z-10 tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                  Admin
                </span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-3 rounded-2xl transition-all duration-300 z-50 ${
                theme === 'dark'
                  ? 'bg-gray-800/80 hover:bg-gray-700/80'
                  : 'bg-gray-100/80 hover:bg-gray-200/80'
              } backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:scale-105`}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} transition-transform duration-500 rotate-180`} />
              ) : (
                <Menu className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} transition-transform duration-300`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-0 z-40 transition-all duration-500 ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 backdrop-blur-md transition-all duration-500 ${
              theme === 'dark' ? 'bg-black/70' : 'bg-gray-900/60'
            } ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeMobileMenu}
          />

          {/* Menu Panel */}
          <div
            className={`absolute top-0 left-0 right-0 shadow-2xl transition-all duration-500 ease-out ${
              theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'
            } backdrop-blur-xl border-b ${borderColor} ${
              mobileMenuOpen ? 'translate-y-16 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            <div className="container mx-auto px-4 py-8 space-y-2">

              <NavLink href="/" mobile>Home</NavLink>
              <NavLink href="/events" mobile>Events</NavLink>
              <NavLink href="/about" mobile>About</NavLink>

              {/* Divider */}
              <div className={`my-4 h-px ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`} />

              <button
                onClick={() => { toggleTheme(); }}
                className="w-full flex items-center justify-between px-6 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 group hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-indigo-500/10"
              >
                <span className={`${textColor} group-hover:text-purple-500 transition-colors duration-300`}>
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-amber-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
              </button>

              <button
                onClick={handleAdminClick}
                className="w-full mt-6 px-6 py-5 font-bold text-white text-lg rounded-2xl overflow-hidden shadow-2xl relative group transition-all duration-500 hover:scale-[1.02] hover:shadow-purple-500/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] animate-shimmer" />
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                <span className="relative z-10 tracking-wide flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  Admin Panel
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;