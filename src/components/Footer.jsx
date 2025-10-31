import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Heart, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();

  // Enhanced theme-based styling with shiny light pink for light mode
  const bgClass = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900' 
    : 'bg-gradient-to-br from-pink-50 via-rose-100 to-pink-100';
  
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-pink-200';
  const hoverColor = theme === 'dark' ? 'hover:text-purple-400' : 'hover:text-pink-600';
  const inputBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80 backdrop-blur-sm';
  const socialBg = theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/60';
  const decorBlur1 = theme === 'dark' ? 'bg-purple-500' : 'bg-pink-400';
  const decorBlur2 = theme === 'dark' ? 'bg-blue-500' : 'bg-rose-400';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'About Us', href: '#' },
    { name: 'Contact', href: '#' }
  ];

  const contactInfo = [
    { icon: Mail, text: 'info@tickethub.com', href: 'mailto:info@tickethub.com' },
    { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, text: '123 Event Street, NY', href: '#' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  return (
    <footer className={`${bgClass} ${textSecondary} relative overflow-hidden transition-colors duration-700`}>
      {/* Enhanced decorative background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className={`absolute top-10 left-10 w-72 h-72 ${decorBlur1} rounded-full blur-3xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div 
          className={`absolute bottom-10 right-10 w-96 h-96 ${decorBlur2} rounded-full blur-3xl`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
        
        {/* Additional sparkle effects */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.6
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Company Info with enhanced animations */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h3 
              className={`${textPrimary} text-2xl font-bold mb-4 bg-gradient-to-r ${theme === 'dark' ? 'from-purple-500 to-blue-500' : 'from-pink-500 to-rose-500'} bg-clip-text text-transparent`}
              whileHover={{ scale: 1.05 }}
              variants={floatingVariants}
              initial="initial"
              animate="animate"
            >
              TicketHub
            </motion.h3>
            <p className="text-sm leading-relaxed mb-4">
              Your one-stop destination for booking tickets to the best events, concerts, and shows.
            </p>
            <motion.div
              className="mt-4 flex items-center space-x-2 text-xs"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.span 
                className={`px-3 py-1 ${theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-pink-500/20 text-pink-600'} rounded-full`}
                whileHover={{ scale: 1.05 }}
              >
                Trusted by 10K+ users
              </motion.span>
            </motion.div>
          </motion.div>
          
          {/* Quick Links with staggered hover effects */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className={`${textPrimary} font-semibold mb-4 text-lg`}>Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <motion.a
                    href={link.href}
                    className={`${hoverColor} transition-colors inline-flex items-center group`}
                    whileHover={{ x: 8, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Contact Info with icon animations */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className={`${textPrimary} font-semibold mb-4 text-lg`}>Contact Info</h4>
            <ul className="space-y-3 text-sm">
              {contactInfo.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.3, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="mt-0.5"
                  >
                    <item.icon className={`h-4 w-4 ${theme === 'dark' ? 'text-purple-400' : 'text-pink-500'}`} />
                  </motion.div>
                  <motion.a
                    href={item.href}
                    className={`${hoverColor} transition-colors`}
                    whileHover={{ x: 5, scale: 1.02 }}
                  >
                    {item.text}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Social Links with enhanced animations */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className={`${textPrimary} font-semibold mb-4 text-lg`}>Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`${hoverColor} transition-colors`}
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className={`p-2 rounded-full ${socialBg} ${theme === 'dark' ? 'hover:bg-purple-500/20' : 'hover:bg-pink-500/20'} transition-colors shadow-sm`}
                    whileHover={{ boxShadow: theme === 'dark' ? '0 0 20px rgba(168, 85, 247, 0.4)' : '0 0 20px rgba(236, 72, 153, 0.4)' }}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.div>
                </motion.a>
              ))}
            </div>
            
            {/* Newsletter with enhanced button */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-sm mb-2">Subscribe to our newsletter</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className={`flex-1 px-3 py-2 text-sm rounded-l-lg ${inputBg} border ${borderColor} focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-purple-500' : 'focus:ring-pink-500'} ${textSecondary} transition-all`}
                />
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 bg-gradient-to-r ${theme === 'dark' ? 'from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600' : 'from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} text-white text-sm font-semibold rounded-r-lg transition-all`}
                >
                  Join
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Bottom Section - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className={`border-t ${borderColor} mt-12 pt-8`}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <motion.p
              className="text-sm text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              &copy; {new Date().getFullYear()} TicketHub. All rights reserved.
            </motion.p>
            
            {/* Made by Section - Centered */}
            <motion.div
              className="flex items-center space-x-2 text-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span>Made with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.4, 1],
                }}
                transition={{ 
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="text-red-500 fill-red-500" size={16} />
              </motion.div>
              <span>by</span>
              <motion.a
                href="https://sagar-portfolio-cquf.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`font-semibold bg-gradient-to-r ${theme === 'dark' ? 'from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600' : 'from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'} bg-clip-text text-transparent transition-all`}
              >
                Sagar Kushwah
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;