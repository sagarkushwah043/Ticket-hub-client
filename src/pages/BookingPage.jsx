import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  Calendar, MapPin, Users, CreditCard, Mail, Phone, 
  User, Lock, Check, AlertCircle, Download, Loader,
  ArrowLeft, Shield, Ticket
} from 'lucide-react';
import jsPDF from 'jspdf';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    numberOfSeats: 1,
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});
  const [highlightClass, setHighlightClass] = useState('hidden');
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardDigits, setCardDigits] = useState(Array(16).fill('#'));

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`https://ticket-hub-server-sv0b.onrender.com/api/events/${id}`);
      const data = await response.json();
      if (data.success) {
        setEvent(data.data);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setFormData(prev => ({ ...prev, cardNumber: value }));
    
    const newDigits = Array(16).fill('#');
    for (let i = 0; i < value.length; i++) {
      if (i >= 4 && i < 12) {
        newDigits[i] = '*';
      } else {
        newDigits[i] = value[i];
      }
    }
    setCardDigits(newDigits);
    
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setFormData(prev => ({ ...prev, expiryDate: value }));
    if (errors.expiryDate) {
      setErrors(prev => ({ ...prev, expiryDate: '' }));
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData(prev => ({ ...prev, cvv: value }));
    if (errors.cvv) {
      setErrors(prev => ({ ...prev, cvv: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (formData.numberOfSeats < 1) newErrors.numberOfSeats = 'Select at least 1 seat';
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    }
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateEnhancedTicket = (booking, eventData) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(147, 51, 234);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setFillColor(168, 85, 247);
    doc.circle(pageWidth - 20, 15, 25, 'F');
    doc.circle(-5, 40, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('🎫 TicketHub', pageWidth / 2, 22, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('YOUR EVENT TICKET', pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(9);
    doc.text(`Ref: ${booking.bookingReference || booking._id}`, pageWidth / 2, 38, { align: 'center' });

    let yPos = 60;

    doc.setFillColor(34, 197, 94);
    doc.roundedRect(15, yPos, 40, 10, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ CONFIRMED', 35, yPos + 7, { align: 'center' });

    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const bookingDateStr = new Date(booking.bookingDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    doc.text(`Booked: ${bookingDateStr}`, pageWidth - 15, yPos + 7, { align: 'right' });

    yPos += 20;

    doc.setFillColor(249, 250, 251);
    doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('🎭 EVENT INFORMATION', 20, yPos + 5.5);

    yPos += 15;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    const eventTitle = doc.splitTextToSize(eventData.title, pageWidth - 40);
    doc.text(eventTitle, 20, yPos);
    yPos += eventTitle.length * 7 + 5;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);

    doc.setFont('helvetica', 'bold');
    doc.text('📅 Date & Time:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    const eventDate = new Date(eventData.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(eventDate, 55, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'bold');
    doc.text('📍 Venue:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    const locationText = doc.splitTextToSize(eventData.location, pageWidth - 60);
    doc.text(locationText, 55, yPos);
    yPos += locationText.length * 6 + 2;

    doc.setFont('helvetica', 'bold');
    doc.text('🏷️ Category:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(eventData.category, 55, yPos);
    yPos += 10;

    doc.setFillColor(249, 250, 251);
    doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('👤 ATTENDEE INFORMATION', 20, yPos + 5.5);

    yPos += 15;

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Name:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(booking.fullName, 55, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Email:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(booking.email, 55, yPos);
    yPos += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Phone:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(booking.phone, 55, yPos);
    yPos += 12;

    doc.setFillColor(249, 250, 251);
    doc.rect(15, yPos, pageWidth - 30, 8, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('💰 BOOKING SUMMARY', 20, yPos + 5.5);

    yPos += 15;

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');

    doc.text('Number of Seats:', 20, yPos);
    doc.text(booking.numberOfSeats.toString(), pageWidth - 40, yPos);
    yPos += 7;

    doc.text('Price per Seat:', 20, yPos);
    doc.text(`₹${booking.pricePerSeat}`, pageWidth - 40, yPos);
    yPos += 7;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(147, 51, 234);
    doc.text('Total Amount Paid:', 20, yPos);
    doc.text(`₹${booking.totalAmount}`, pageWidth - 40, yPos);
    yPos += 10;

    doc.setFontSize(9);
    doc.setTextColor(34, 197, 94);
    doc.text(`✓ Payment ${booking.paymentStatus}`, 20, yPos);
    if (booking.paymentDetails?.transactionId) {
      doc.setTextColor(100, 100, 100);
      doc.text(`TXN: ${booking.paymentDetails.transactionId}`, pageWidth - 20, yPos, { align: 'right' });
    }
    yPos += 15;

    const qrSize = 45;
    const qrX = pageWidth - 25 - qrSize;
    const qrY = yPos;

    doc.setDrawColor(147, 51, 234);
    doc.setLineWidth(2);
    doc.roundedRect(qrX, qrY, qrSize, qrSize, 3, 3);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('SCAN', qrX + qrSize / 2, qrY + qrSize / 2 - 2, { align: 'center' });
    doc.text('AT VENUE', qrX + qrSize / 2, qrY + qrSize / 2 + 3, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(booking._id.substring(0, 12), qrX + qrSize / 2, qrY + qrSize + 4, { align: 'center' });

    const noticeY = qrY;
    const noticeWidth = qrX - 25;
    
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(20, noticeY, noticeWidth, 30, 2, 2, 'F');
    
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, noticeY, noticeWidth, 30, 2, 2, 'S');
    
    doc.setTextColor(146, 64, 14);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠️ IMPORTANT', 25, noticeY + 6);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const importantText = [
      '• Please arrive 30 minutes early',
      '• Carry a valid ID proof',
      '• Present this ticket at entrance'
    ];
    
    let noticeTextY = noticeY + 12;
    importantText.forEach(line => {
      doc.text(line, 25, noticeTextY);
      noticeTextY += 5;
    });

    const footerY = pageHeight - 35;
    
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, footerY, pageWidth - 20, footerY);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for choosing TicketHub!', pageWidth / 2, footerY + 8, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Please present this ticket at the venue entrance', pageWidth / 2, footerY + 14, { align: 'center' });
    doc.text('For support: support@tickethub.com | +91-1234567890', pageWidth / 2, footerY + 19, { align: 'center' });
    
    doc.setTextColor(147, 51, 234);
    doc.text('Terms & Conditions', pageWidth / 2, footerY + 24, { align: 'center' });

    const fileName = `TicketHub_${booking.bookingReference || booking._id}.pdf`;
    doc.save(fileName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    try {
      const bookingPayload = {
        eventId: id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        numberOfSeats: parseInt(formData.numberOfSeats),
        pricePerSeat: event.pricePerSeat,
        totalAmount: event.pricePerSeat * formData.numberOfSeats,
        paymentDetails: {
          cardLastFour: formData.cardNumber.slice(-4),
          cardName: formData.cardName,
          paymentMethod: 'Credit Card'
        },
        paymentStatus: 'Completed',
        bookingStatus: 'Confirmed'
      };

      const response = await fetch('https://ticket-hub-server-sv0b.onrender.com/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload)
      });

      const data = await response.json();

      if (data.success) {
        setBookingData(data.data);
        setBookingSuccess(true);
        
        setTimeout(() => {
          generateEnhancedTicket(data.data, event);
        }, 1000);
      } else {
        alert('Booking failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to process booking. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const totalAmount = event ? event.pricePerSeat * formData.numberOfSeats : 0;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <Loader className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Event not found
          </h2>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-10 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-pink-50'
      }`}>
        <div className={`max-w-2xl w-full rounded-3xl shadow-2xl p-8 text-center ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Booking Confirmed!
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Your ticket has been downloaded automatically
            </p>
          </div>

          <div className={`p-6 rounded-2xl mb-6 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Ticket className="w-6 h-6 text-purple-600" />
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Booking Details
              </h3>
            </div>
            <div className={`space-y-2 text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <p><strong>Booking ID:</strong> {bookingData?._id}</p>
              <p><strong>Event:</strong> {event.title}</p>
              <p><strong>Seats:</strong> {formData.numberOfSeats}</p>
              <p><strong>Total Paid:</strong> ₹{totalAmount}</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => generateEnhancedTicket(bookingData, event)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
            >
              <Download className="w-5 h-5" />
              Download Ticket Again
            </button>
            <button
              onClick={() => navigate('/events')}
              className={`px-6 py-3 rounded-xl transition-all ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Browse More Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-pink-50'
    }`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        .card-container {
          transform-style: preserve-3d;
          transition: transform 1s;
        }
        
        .card-container.flip {
          transform: rotateY(180deg);
        }
        
        .card-container:hover .highlight-box {
          display: none;
        }
        
        .card-face {
          backface-visibility: hidden;
        }
        
        .card-front:before {
          content: "";
          position: absolute;
          border: 12px solid #ff6be7;
          border-radius: 100%;
          left: -15%;
          top: -35px;
          height: 220px;
          width: 220px;
          filter: blur(13px);
        }
        
        .card-front:after {
          content: "";
          position: absolute;
          border: 12px solid #7288ff;
          border-radius: 100%;
          width: 220px;
          top: 55%;
          left: -150px;
          height: 220px;
          filter: blur(13px);
        }
        
        .card-back:before {
          content: "";
          position: absolute;
          border: 12px solid #ff6be7;
          border-radius: 100%;
          left: -15%;
          top: -35px;
          height: 220px;
          width: 220px;
          filter: blur(13px);
        }
        
        .card-back:after {
          content: "";
          position: absolute;
          border: 12px solid #7288ff;
          border-radius: 100%;
          width: 220px;
          top: 55%;
          left: -150px;
          height: 220px;
          filter: blur(13px);
        }
        
        .digit-span {
          display: flex;
          flex-direction: column;
          transition: .2s;
        }
        
        .digit-span.filled {
          transform: translateY(-30px);
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-all ${
            theme === 'dark' 
              ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className={`rounded-2xl shadow-xl overflow-hidden sticky top-6 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <img 
                src={event.image || "https://via.placeholder.com/400"} 
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {event.title}
                </h3>
                
                <div className={`space-y-3 mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>

                <div className={`border-t pt-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between mb-2">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Price per seat
                    </span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      ₹{event.pricePerSeat}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Number of seats
                    </span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {formData.numberOfSeats}
                    </span>
                  </div>
                  <div className={`flex justify-between pt-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Total Amount
                    </span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className={`rounded-2xl shadow-xl p-8 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Complete Your Booking
              </h2>

              <div onSubmit={handleSubmit}>
                <div className="mb-8">
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <User className="w-5 h-5" />
                    Personal Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-all ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                        } focus:ring-2 focus:ring-purple-200 outline-none ${
                          errors.fullName ? 'border-red-500' : ''
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border transition-all ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                          } focus:ring-2 focus:ring-purple-200 outline-none ${
                            errors.email ? 'border-red-500' : ''
                          }`}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-lg border transition-all ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                          } focus:ring-2 focus:ring-purple-200 outline-none ${
                            errors.phone ? 'border-red-500' : ''
                          }`}
                          placeholder="1234567890"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Number of Seats *
                      </label>
                      <select
                        name="numberOfSeats"
                        value={formData.numberOfSeats}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-all ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                        } focus:ring-2 focus:ring-purple-200 outline-none`}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num} Seat{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <CreditCard className="w-5 h-5" />
                    Payment Details
                  </h3>
                  
                  <div className={`p-4 rounded-lg mb-6 flex items-center gap-2 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
                  }`}>
                    <Shield className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Your payment information is secure and encrypted
                    </span>
                  </div>

                  {/* Animated Credit Card */}
                  <div className={`card-container relative max-w-[380px] mx-auto mb-8 h-[210px] ${isFlipped ? 'flip' : ''}`}>
                    <div className={`highlight-box absolute border-[3px] border-white rounded-2xl z-20 transition-all duration-300 pointer-events-none ${highlightClass}`} style={{boxShadow: '0 0 15px rgba(255,255,255,0.9)'}}></div>
                    
                    {/* Card Front */}
                    <section className="card-front card-face relative w-full h-[210px] rounded-3xl p-6 overflow-hidden text-white shadow-2xl" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between font-semibold text-base">
                          <div>Credit Card</div>
                          <svg xmlns="http://www.w3.org/2000/svg" height="36" width="54" viewBox="-96 -98.908 832 593.448">
                            <path fill="#ff5f00" d="M224.833 42.298h190.416v311.005H224.833z"/>
                            <path fill="#eb001b" d="M244.446 197.828a197.448 197.448 0 0175.54-155.475 197.777 197.777 0 100 311.004 197.448 197.448 0 01-75.54-155.53z"/>
                            <path fill="#f79e1b" d="M640 197.828a197.777 197.777 0 01-320.015 155.474 197.777 197.777 0 000-311.004A197.777 197.777 0 01640 197.773z"/>
                          </svg>
                        </div>

                        <div className="text-xl flex h-[30px] overflow-hidden tracking-wider">
                          {cardDigits.map((digit, index) => (
                            <span 
                              key={index}
                              className={`digit-span ${digit !== '#' ? 'filled' : ''} ${(index + 1) % 4 === 0 ? 'mr-2.5' : ''}`}
                            >
                              #<br/>{digit}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-end justify-between text-xs">
                          <div className="uppercase flex-1">
                            <div className="text-[11px] font-semibold mb-1 opacity-80">CARD HOLDER</div>
                            <div className="text-sm font-medium">{formData.cardName || 'NAME ON CARD'}</div>
                          </div>
                          <div className="uppercase text-right">
                            <div className="text-[11px] font-semibold mb-1 opacity-80">EXPIRES</div>
                            <div className="text-sm font-medium">
                              <span>{formData.expiryDate ? formData.expiryDate.split('/')[0] : 'MM'}</span>/
                              <span>{formData.expiryDate ? formData.expiryDate.split('/')[1] : 'YY'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Card Back */}
                    <section className="card-back card-face absolute top-0 left-0 w-full h-[210px] rounded-3xl pt-6 overflow-hidden text-white shadow-2xl" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', transform: 'rotateY(180deg)'}}>
                      <div className="h-9 w-full bg-gray-800 relative z-10 mb-5"></div>
                      <div className="relative z-10 px-6 flex flex-col items-end text-sm font-semibold uppercase">
                        <span className="mb-1.5">CVV</span>
                        <div className="bg-white rounded-lg h-10 w-full text-black flex items-center justify-end px-3 text-xl tracking-widest">
                          {formData.cvv ? '•'.repeat(formData.cvv.length) : ''}
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        onFocus={() => {
                          setIsFlipped(false);
                          setHighlightClass('w-[335px] h-[30px] top-[92px] left-[22px]');
                        }}
                        maxLength="16"
                        className={`w-full px-4 py-3 rounded-lg border transition-all ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                        } focus:ring-2 focus:ring-purple-200 outline-none ${
                          errors.cardNumber ? 'border-red-500' : ''
                        }`}
                        placeholder="1234567890123456"
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        onFocus={() => {
                          setIsFlipped(false);
                          setHighlightClass('w-[165px] h-[38px] top-[160px] left-[22px]');
                        }}
                        className={`w-full px-4 py-3 rounded-lg border transition-all ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                        } focus:ring-2 focus:ring-purple-200 outline-none ${
                          errors.cardName ? 'border-red-500' : ''
                        }`}
                        placeholder="Name on card"
                      />
                      {errors.cardName && (
                        <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleExpiryChange}
                          onFocus={() => {
                            setIsFlipped(false);
                            setHighlightClass('w-[80px] h-[38px] top-[160px] left-[275px]');
                          }}
                          maxLength="5"
                          className={`w-full px-4 py-3 rounded-lg border transition-all ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                          } focus:ring-2 focus:ring-purple-200 outline-none ${
                            errors.expiryDate ? 'border-red-500' : ''
                          }`}
                          placeholder="MM/YY"
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                        )}
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleCvvChange}
                          onFocus={() => {
                            setIsFlipped(true);
                            setHighlightClass('w-[335px] h-[54px] top-[80px] left-[22px]');
                          }}
                          onBlur={() => {
                            setIsFlipped(false);
                            setHighlightClass('hidden');
                          }}
                          maxLength="4"
                          className={`w-full px-4 py-3 rounded-lg border transition-all ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-400'
                          } focus:ring-2 focus:ring-purple-200 outline-none ${
                            errors.cvv ? 'border-red-500' : ''
                          }`}
                          placeholder="123"
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={processing}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {processing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Complete Booking - ₹{totalAmount}
                    </>
                  )}
                </button>

                <p className={`text-xs text-center mt-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  By completing this booking, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;