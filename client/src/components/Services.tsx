import React from 'react';
import { Stethoscope, Syringe, Pill, Scissors, Heart, 
  Thermometer, Dog, Cat, Bird, Fish } from 'lucide-react';
import type { Service, IconName } from '../types';
import api from '../lib/api';
import { AppointmentModal } from './AppointmentModal';

// Mapa de ícones para acesso rápido
const iconMap: Record<IconName, React.FC<any>> = {
  stethoscope: Stethoscope,
  syringe: Syringe,
  pill: Pill,
  scissors: Scissors,
  heart: Heart,
  thermometer: Thermometer,
  dog: Dog,
  cat: Cat,
  bird: Bird,
  fish: Fish
};

const getIconComponent = (iconName: IconName) => {
  return iconMap[iconName] || Stethoscope;
};

const Services = () => {
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.services.list();
        setServices(data.filter(service => service.active));
      } catch (err) {
        setError('Erro ao carregar serviços');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = () => {
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Erro ao carregar serviços: {error}
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Nossos Serviços</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Oferecemos uma variedade de serviços veterinários para garantir a saúde e o bem-estar do seu pet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = getIconComponent(service.icon as IconName);
            return (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105 cursor-pointer"
                onClick={handleServiceClick}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-teal-100 rounded-full">
                    <IconComponent className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Duração: {service.duration}min</span>
                  <span>Preço: R${service.price}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        services={services}
      />
    </section>
  );
};

export default Services;