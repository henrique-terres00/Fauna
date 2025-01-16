import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Contact from '../components/Contact';
import { LoginModal } from '../components/LoginModal';
import { useAuth } from '../hooks/useAuth';

export const Home: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  return (
    <div>
      {/* Mostrar botão de login apenas quando não estiver autenticado */}
      {!isAuthenticated && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            title="Área Administrativa"
          >
            <Lock size={20} className="text-gray-600" />
          </button>
        </div>
      )}

      <Hero />
      <div id="services">
        <Services />
      </div>
      <div id="contact">
        <Contact />
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};
