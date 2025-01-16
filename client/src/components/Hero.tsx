import { useState } from 'react';
import { Calendar, Phone } from 'lucide-react';
import { AppointmentModal } from './AppointmentModal';
import { useServices } from '../hooks/useServices';

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { services } = useServices();

  return (
    <div id="home" className="relative min-h-screen flex items-center">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?ixlib=rb-4.0.3")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">
            Bem-vindo à Clínica Fauna
          </h1>
          <p className="text-xl mb-8">
            Onde cuidamos do seu pet com amor e expertise. Nossa equipe está pronta para
            oferecer o melhor atendimento veterinário.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition-colors"
            >
              <Calendar size={20} />
              Agende uma Consulta
            </button>
            <a
              href="#contact"
              className="flex items-center justify-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Phone size={20} />
              Entre em Contato
            </a>
          </div>
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        services={services}
      />
    </div>
  );
};

export default Hero;