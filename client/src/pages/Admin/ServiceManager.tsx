import React, { useState } from 'react';
import { Pencil, Trash2, Plus, Stethoscope, Syringe, Pill, Scissors, Heart, 
  Thermometer, Dog, Cat, Bird, Fish } from 'lucide-react';
import { Service, ServiceFormData, IconName } from '../../types';
import { useNotification, useServices } from '../../hooks';

const initialFormData: ServiceFormData = {
  title: '',
  description: '',
  icon: 'stethoscope',
  price: undefined as any,
  duration: 30,
  active: true
};

// Lista de ícones disponíveis com seus componentes
const availableIcons = [
  { name: 'stethoscope' as IconName, icon: Stethoscope },
  { name: 'syringe' as IconName, icon: Syringe },
  { name: 'pill' as IconName, icon: Pill },
  { name: 'scissors' as IconName, icon: Scissors },
  { name: 'heart' as IconName, icon: Heart },
  { name: 'thermometer' as IconName, icon: Thermometer },
  { name: 'dog' as IconName, icon: Dog },
  { name: 'cat' as IconName, icon: Cat },
  { name: 'bird' as IconName, icon: Bird },
  { name: 'fish' as IconName, icon: Fish }
];

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

export const ServiceManager: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);
  const { services, isLoading, error, createService, updateService, deleteService, refreshServices } = useServices();
  const { showNotification } = useNotification();

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon,
        price: service.price,
        duration: service.duration,
        active: service.active
      });
    } else {
      setEditingService(null);
      setFormData(initialFormData);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingService(null);
    setFormData(initialFormData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' 
        ? Number(value)
        : type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateService(editingService._id, formData);
        showNotification('Serviço atualizado com sucesso!', 'success');
      } else {
        await createService(formData);
        showNotification('Serviço criado com sucesso!', 'success');
      }
      handleCloseDialog();
      refreshServices();
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'Erro ao salvar serviço', 'error');
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (window.confirm('Tem certeza que deseja remover este serviço?')) {
      try {
        await deleteService(serviceId);
        showNotification('Serviço removido com sucesso!', 'success');
        refreshServices();
      } catch (error) {
        showNotification(error instanceof Error ? error.message : 'Erro ao remover serviço', 'error');
      }
    }
  };

  if (isLoading) {
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Serviços</h1>
        <button
          onClick={() => handleOpenDialog()}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.filter(service => service.active).map((service) => {
          const IconComponent = getIconComponent(service.icon);
          return (
            <div key={service._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <IconComponent size={24} className="text-teal-600" />
                  <h2 className="text-xl font-semibold text-gray-800">{service.title}</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenDialog(service)}
                    className="text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
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

      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ícone
                  </label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    {availableIcons.map(({ name }) => (
                      <option key={name} value={name}>
                        {name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-500">Pré-visualização:</span>
                    {(() => {
                      const IconComponent = getIconComponent(formData.icon);
                      return <IconComponent size={24} className="text-teal-600" />;
                    })()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    min="0"
                    step="15"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseDialog}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    {editingService ? 'Atualizar' : 'Criar'} Serviço
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
