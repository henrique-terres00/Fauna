import { useState, useMemo, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useVeterinarians } from '../hooks/useVeterinarians';
import { DayPicker } from 'react-day-picker';
import { isBefore, startOfToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import api from '../lib/api';
import { Service } from '../types';
import { useNotification } from '../hooks/useNotification';

interface AppointmentFormData {
  petName: string;
  petType: string;
  ownerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  serviceId: string;
  veterinarianId: string;
  notes?: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
}

const initialFormData: AppointmentFormData = {
  petName: '',
  petType: '',
  ownerName: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  serviceId: '',
  veterinarianId: '',
  notes: ''
};

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, services }) => {
  const { veterinarians, isLoading: loadingVets } = useVeterinarians();
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState<AppointmentFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableHours, setAvailableHours] = useState<string[]>([]);

  const selectedVet = useMemo(() => 
    veterinarians.find(vet => vet._id === formData.veterinarianId),
    [veterinarians, formData.veterinarianId]
  );

  // Estilo para os dias disponíveis
  const modifiersStyles = {
    available: {
      backgroundColor: '#d1fae5',
      color: '#047857',
      fontWeight: 'bold'
    },
    today: {
      fontWeight: 'bold',
      fontSize: '120%',
      color: '#ef4444'
    }
  };

  // Função para verificar se uma data é válida para agendamento
  const isDateDisabled = useMemo(() => (date: Date) => {
    if (!selectedVet) {
      return true;
    }

    // Bloqueia datas passadas
    const today = startOfToday();
    if (isBefore(date, today)) {
      return true;
    }

    // Converte o dia da semana para o formato usado no banco
    const weekDay = date.toLocaleString('pt-BR', { weekday: 'long' });
    // Primeira letra maiúscula
    const formattedWeekDay = weekDay.charAt(0).toUpperCase() + weekDay.slice(1);
    // Adiciona o sufixo '-feira' apenas se não for sábado ou domingo
    const fullWeekDay = formattedWeekDay === 'Sábado' || formattedWeekDay === 'Domingo'
      ? formattedWeekDay
      : formattedWeekDay.replace('-feira', '') + '-feira';

    return !selectedVet.availableDays?.includes(fullWeekDay);
  }, [selectedVet]);

  // Define os dias disponíveis
  const modifiers = useMemo(() => ({
    available: (date: Date) => !isDateDisabled(date),
    today: new Date()
  }), [isDateDisabled]);

  // Busca os horários disponíveis quando a data ou veterinário mudam
  useEffect(() => {
    const fetchAvailableHours = async () => {
      if (formData.date && formData.veterinarianId) {
        try {
          const response = await api.appointments.getAvailableHours(formData.veterinarianId, formData.date);
          setAvailableHours(response);
        } catch (error: any) {
          console.error('Erro ao buscar horários disponíveis:', error);
          setAvailableHours([]);
        }
      }
    };

    fetchAvailableHours();
  }, [formData.date, formData.veterinarianId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const appointmentData = {
        ...formData,
        petOwnerName: formData.ownerName,
      };
      await api.appointments.create(appointmentData);
      showNotification('Agendamento realizado com sucesso!', 'success');
      setTimeout(() => {
        onClose();
        setFormData(initialFormData);
      }, 2000);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar agendamento';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Formata a data diretamente para YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      setFormData(prev => ({
        ...prev,
        date: `${year}-${month}-${day}`,
        time: '' // Limpa o horário quando uma nova data é selecionada
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Agendar Consulta</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações do Pet */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Informações do Pet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Pet
                  </label>
                  <input
                    type="text"
                    value={formData.petName}
                    onChange={e => setFormData(prev => ({ ...prev, petName: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo/Espécie
                  </label>
                  <input
                    type="text"
                    value={formData.petType}
                    onChange={e => setFormData(prev => ({ ...prev, petType: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Informações do Proprietário */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Informações do Proprietário</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={e => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Informações da Consulta */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Informações da Consulta</h3>
              
              {/* Serviço e Veterinário */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serviço
                  </label>
                  <select
                    value={formData.serviceId}
                    onChange={e => setFormData(prev => ({ ...prev, serviceId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map(service => (
                      <option key={service._id} value={service._id}>
                        {service.title} - R$ {service.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Veterinário
                  </label>
                  <select
                    value={formData.veterinarianId}
                    onChange={e => {
                      setFormData(prev => ({
                        ...prev,
                        veterinarianId: e.target.value,
                        date: '',
                        time: ''
                      }));
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={loadingVets}
                  >
                    <option value="">Selecione um veterinário</option>
                    {veterinarians.map(vet => (
                      <option key={vet._id} value={vet._id}>
                        Dr(a). {vet.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Data e Hora */}
              {selectedVet && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selecione uma Data Disponível
                    </label>
                    <div className="inline-block border border-gray-300 rounded-md p-2">
                      <DayPicker
                        mode="single"
                        selected={formData.date ? parseISO(formData.date) : undefined}
                        onSelect={handleDateSelect}
                        modifiers={modifiers}
                        modifiersStyles={modifiersStyles}
                        disabled={isDateDisabled}
                        locale={ptBR}
                        weekStartsOn={0}
                        style={{ fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>

                  {formData.date && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                        Horários Disponíveis
                      </label>
                      <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
                        {availableHours.length > 0 ? (
                          availableHours.map(time => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, time }))}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                                ${formData.time === time
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                              {time}
                            </button>
                          ))
                        ) : (
                          <p className="col-span-4 text-center text-gray-500 py-4">
                            Nenhum horário disponível para esta data
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações Adicionais
                </label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Agendar Consulta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;