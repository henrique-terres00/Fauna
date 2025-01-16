import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { AppointmentModal } from './AppointmentModal';
import { useServices } from '../hooks/useServices';
import { useAuth } from '../hooks/useAuth';

interface MenuItem {
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Sobre', href: '/about' },
  { label: 'Equipe', href: '/team' },
  { label: 'Depoimentos', href: '/testimonials' },
  { label: 'Serviços', href: '/#services' },
  { label: 'Contato', href: '/#contact' },
];

const adminMenuItems: MenuItem[] = [
  { label: 'Admin - Consultas', href: '/admin/appointments' },
  { label: 'Admin - Serviços', href: '/admin/services' },
  { label: 'Admin - Depoimentos', href: '/admin/testimonials' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { services } = useServices();
  const { isAuthenticated, logout } = useAuth();

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('/#')) {
      if (location.pathname === '/') {
        const element = document.querySelector(href.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
    setIsOpen(false);
  };

  const renderMenuItem = (item: MenuItem, isMobile: boolean = false) => (
    <button
      key={item.label}
      onClick={() => handleNavigation(item.href)}
      className={`${
        isMobile
          ? 'block w-full text-left px-3 py-2'
          : ''
      } text-gray-600 hover:text-teal-600 transition-colors ${
        location.pathname === item.href ? 'text-teal-600 font-medium' : ''
      }`}
    >
      {item.label}
    </button>
  );

  const renderAdminMenu = (isMobile: boolean = false) => (
    <>
      {isMobile ? (
        <div className="border-t border-gray-200 pt-2">
          <div className="px-3 py-2 text-base font-medium text-gray-700">
            Administrador
          </div>
          {adminMenuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="block px-3 py-2 text-gray-600 hover:text-teal-600 ml-4"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : (
        <div className="relative group">
          <button className="text-gray-600 hover:text-teal-600 transition-colors flex items-center group-hover:text-teal-600">
            Administrador
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
          
          <div className="absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
            {adminMenuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );

  const renderLogoutButton = (isMobile: boolean = false) => (
    <button
      onClick={handleLogout}
      className={`${
        isMobile
          ? 'block w-full text-left px-3 py-2'
          : ''
      } text-red-600 hover:text-red-800 transition-colors`}
    >
      Sair
    </button>
  );

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-teal-600 mr-8">
                Fauna
              </Link>
            </div>

            {/* Menu para desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => renderMenuItem(item))}
              {isAuthenticated && renderAdminMenu()}
              {isAuthenticated && renderLogoutButton()}
              
              <button
                onClick={handleModalOpen}
                className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
              >
                Agendar Consulta
              </button>
            </div>

            {/* Botão do menu mobile */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-teal-600"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => renderMenuItem(item, true))}
              {isAuthenticated && renderAdminMenu(true)}
              {isAuthenticated && renderLogoutButton(true)}

              <button
                onClick={handleModalOpen}
                className="block w-full text-left px-3 py-2 text-teal-600 font-medium"
              >
                Agendar Consulta
              </button>
            </div>
          </div>
        )}
      </nav>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        services={services}
      />
    </>
  );
};

export default Navbar;