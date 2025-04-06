import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Calendar, 
  Video, 
  BarChart3, 
  ChevronRight, 
  Building2, 
  Shield, 
  Users, 
  Clock, 
  Award,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Heart
} from 'lucide-react';

const Landing = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e) => {
      // Get the cursor position relative to the window
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-slate-50 text-slate-800 overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Dynamic background patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(0, 163, 173, 0.2) 0%, transparent 70%),
                radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 123, 255, 0.3) 0%, transparent 60%),
                radial-gradient(circle at 90% 90%, rgba(73, 197, 182, 0.15) 0%, transparent 50%)
              `,
              transition: 'background-position 0.2s ease-out'
            }}
          />
          <div className="absolute inset-0 backdrop-blur-[100px]" />
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[20%] w-64 h-64 rounded-full bg-gradient-to-r from-teal-500/10 to-cyan-500/10 animate-float blur-xl" />
          <div className="absolute bottom-40 right-[15%] w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-teal-500/10 animate-float-delayed blur-xl" />
        </div>

        {/* Glass card floating effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-br from-white/5 to-white/0 rounded-full blur-3xl pointer-events-none" />
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-8 md:py-0 h-auto md:h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <div className="mb-8">
                <div className="inline-block bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl p-3 mb-6 rotate-3 hover:rotate-6 transition-transform duration-300">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600 animate-gradient-x">MediCare</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 animate-gradient-x">Connect</span>
                </h1>
                <p className="text-lg text-slate-600 mb-8 max-w-md leading-relaxed">
                  Experience the future of healthcare management with our intelligent, secure, and seamless digital solutions.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/login">
                  <button className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium transition-all duration-300 overflow-hidden w-full sm:w-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 transition-transform group-hover:scale-105" />
                    <div className="relative flex items-center justify-center gap-2 text-white">
                      <span>Get Started</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </Link>
                <Link to="/register">
                  <button className="relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 transition-colors duration-300 text-teal-700 w-full sm:w-auto">
                    Create Account
                  </button>
                </Link>
              </div>

              <div>
                <p className="mb-6 text-sm font-medium uppercase tracking-wider text-slate-500">Trusted by leading healthcare providers</p>
                <div className="flex flex-wrap gap-6 md:gap-8">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Building2 className="w-5 h-5" />
                    <span>MediGroup</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Building2 className="w-5 h-5" />
                    <span>LifeCare</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Building2 className="w-5 h-5" />
                    <span>HealthTech</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {[
                  {
                    icon: <Calendar className="w-6 h-6 text-teal-600" />,
                    title: "Smart Scheduling",
                    description: "AI-powered appointment management",
                    color: "from-teal-600 to-cyan-600",
                    iconBg: "teal"
                  },
                  {
                    icon: <Video className="w-6 h-6 text-blue-600" />,
                    title: "Telemedicine",
                    description: "Virtual healthcare, anywhere",
                    color: "from-blue-600 to-cyan-600",
                    iconBg: "blue"
                  },
                  {
                    icon: <BarChart3 className="w-6 h-6 text-cyan-600" />,
                    title: "Analytics",
                    description: "Data-driven insights",
                    color: "from-cyan-600 to-teal-600",
                    iconBg: "cyan"
                  },
                  {
                    icon: <Stethoscope className="w-6 h-6 text-blue-600" />,
                    title: "Patient Care",
                    description: "Comprehensive health tracking",
                    color: "from-blue-600 to-cyan-600",
                    iconBg: "blue"
                  }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="group relative bg-white shadow-md p-6 rounded-xl hover:transform hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl" />
                    <div className={`w-12 h-12 bg-${feature.iconBg}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-500">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Why Choose MediCare Connect?</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Experience healthcare management reimagined with cutting-edge technology and user-centric design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-teal-600" />,
                title: "Enterprise-Grade Security",
                description: "Bank-level encryption and compliance with HIPAA and other healthcare regulations."
              },
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "Collaborative Care",
                description: "Seamless communication between healthcare providers, staff, and patients."
              },
              {
                icon: <Clock className="w-8 h-8 text-cyan-600" />,
                title: "24/7 Availability",
                description: "Access your healthcare information and services anytime, anywhere."
              },
              {
                icon: <Award className="w-8 h-8 text-teal-600" />,
                title: "Industry Leading",
                description: "Recognized by top healthcare institutions for innovation and reliability."
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
                title: "Data Analytics",
                description: "Advanced insights and reporting for better healthcare decisions."
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-cyan-600" />,
                title: "Easy Integration",
                description: "Seamlessly integrates with existing healthcare systems and workflows."
              }
            ].map((benefit, index) => (
              <div 
                key={index}
                className="group bg-white shadow-md rounded-xl p-6 md:p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-teal-100 to-cyan-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 relative bg-gradient-to-b from-teal-600 to-cyan-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { number: "99.9%", label: "Uptime" },
              { number: "10M+", label: "Patient Records" },
              { number: "5000+", label: "Healthcare Providers" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <p className="text-teal-100 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 backdrop-blur-sm" />
            <div className="relative z-10">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-teal-800">Ready to Transform Your Healthcare Management?</h2>
                <p className="text-lg md:text-xl text-slate-600 mb-8">
                  Join thousands of healthcare providers who trust MediCare Connect for their digital healthcare solutions.
                </p>
                <Link to="/register">
                  <button className="group relative px-6 md:px-8 py-3 md:py-4 rounded-xl font-medium transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 transition-transform group-hover:scale-105" />
                    <div className="relative flex items-center justify-center gap-2 text-white">
                      <span>Start Your Free Trial</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">What Our Clients Say</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Healthcare professionals trust MediCare Connect to streamline their practices
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                quote: "MediCare Connect has transformed how we manage patient appointments and records. The interface is intuitive and our staff required minimal training.",
                author: "Dr. Sarah Johnson",
                position: "Medical Director, LifeCare Hospital"
              },
              {
                quote: "The telemedicine features have allowed us to reach patients in rural areas who previously had limited access to specialist care. A game-changer for our practice.",
                author: "Dr. Michael Chen",
                position: "Cardiologist, Heart Health Clinic"
              },
              {
                quote: "Their customer support is exceptional. Any questions we have are answered promptly, and the team is always open to feedback for future updates.",
                author: "Amanda Rivera",
                position: "Practice Manager, Family Care Associates"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-xl shadow">
                <div className="mb-4 text-teal-500">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 11H6C5.46957 11 4.96086 10.7893 4.58579 10.4142C4.21071 10.0391 4 9.53043 4 9V8C4 6.93913 4.42143 5.92172 5.17157 5.17157C5.92172 4.42143 6.93913 4 8 4H9C9.26522 4 9.51957 4.10536 9.70711 4.29289C9.89464 4.48043 10 4.73478 10 5V11ZM20 11H16C15.4696 11 14.9609 10.7893 14.5858 10.4142C14.2107 10.0391 14 9.53043 14 9V8C14 6.93913 14.4214 5.92172 15.1716 5.17157C15.9217 4.42143 16.9391 4 18 4H19C19.2652 4 19.5196 4.10536 19.7071 4.29289C19.8946 4.48043 20 4.73478 20 5V11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 16.8V16.8C4 15.1198 4 14.2798 4.32698 13.638C4.6146 13.0735 5.07354 12.6146 5.63803 12.327C6.27976 12 7.11984 12 8.8 12H15.2C16.8802 12 17.7202 12 18.362 12.327C18.9265 12.6146 19.3854 13.0735 19.673 13.638C20 14.2798 20 15.1198 20 16.8V16.8C20 18.4802 20 19.3202 19.673 19.962C19.3854 20.5265 18.9265 20.9854 18.362 21.273C17.7202 21.6 16.8802 21.6 15.2 21.6H8.8C7.11984 21.6 6.27976 21.6 5.63803 21.273C5.07354 20.9854 4.6146 20.5265 4.32698 19.962C4 19.3202 4 18.4802 4 16.8V16.8Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <p className="text-slate-700 mb-6 italic">{testimonial.quote}</p>
                <div>
                  <p className="font-medium text-slate-900">{testimonial.author}</p>
                  <p className="text-sm text-slate-500">{testimonial.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 bg-slate-800 text-white border-t border-slate-700">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Heart className="w-6 h-6 text-teal-400" />
                <span className="text-xl font-bold">MediCare Connect</span>
              </div>
              <p className="text-slate-300 mb-6">
                Transforming healthcare management with innovative digital solutions.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-teal-600 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-teal-600 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 3.01006C22.0424 3.68553 20.9821 4.20217 19.86 4.54006C19.2577 3.84757 18.4573 3.35675 17.567 3.13398C16.6767 2.91122 15.7395 2.96725 14.8821 3.29451C14.0247 3.62177 13.2884 4.20446 12.773 4.96377C12.2575 5.72309 11.9877 6.62239 12 7.54006V8.54006C10.2426 8.58562 8.50127 8.19587 6.93101 7.4055C5.36074 6.61513 4.01032 5.44869 3 4.01006C3 4.01006 -1 13.0101 8 17.0101C5.94053 18.408 3.48716 19.109 1 19.0101C10 24.0101 21 19.0101 21 7.51006C20.9991 7.23151 20.9723 6.95365 20.92 6.68006C21.9406 5.67355 22.6608 4.40277 23 3.01006V3.01006Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center hover:bg-teal-600 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8V8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 9H2V21H6V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-slate-300 hover:text-teal-300 transition-colors">About Us</Link></li>
                <li><Link to="/features" className="text-slate-300 hover:text-teal-300 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-slate-300 hover:text-teal-300 transition-colors">Pricing</Link></li>
                <li><Link to="/contact" className="text-slate-300 hover:text-teal-300 transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-5 h-5 text-teal-400" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-5 h-5 text-teal-400" />
                  <span>contact@medicareconnect.com</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-5 h-5 text-teal-400" />
                  <span>123 Health Street, Medical District</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><Link to="/privacy" className="text-slate-300 hover:text-teal-300 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-slate-300 hover:text-teal-300 transition-colors">Terms of Service</Link></li>
                <li><Link to="/compliance" className="text-slate-300 hover:text-teal-300 transition-colors">HIPAA Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} MediCare Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;