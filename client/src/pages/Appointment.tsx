import { useState } from 'react';
import { useAppointments } from '../hooks/useAppointments';
import { useVeterinarians } from '../hooks/useVeterinarians';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface AppointmentFormData {
  petName: string;
  ownerName: string;
  date: string;
  time: string;
  veterinarianId: string;
  description: string;
}

const initialFormData: AppointmentFormData = {
  petName: '',
  ownerName: '',
  date: '',
  time: '',
  veterinarianId: '',
  description: ''
};

const Appointment = () => {
  const [formData, setFormData] = useState<AppointmentFormData>(initialFormData);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const { createAppointment } = useAppointments();
  const { veterinarians, isLoading: loadingVets } = useVeterinarians();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: '' });

    // Validações básicas
    if (!formData.petName.trim()) {
      setSubmitStatus({ type: 'error', message: 'Nome do pet é obrigatório' });
      return;
    }
    if (!formData.ownerName.trim()) {
      setSubmitStatus({ type: 'error', message: 'Nome do responsável é obrigatório' });
      return;
    }
    if (!formData.date) {
      setSubmitStatus({ type: 'error', message: 'Data é obrigatória' });
      return;
    }
    if (!formData.time) {
      setSubmitStatus({ type: 'error', message: 'Horário é obrigatório' });
      return;
    }
    if (!formData.veterinarianId) {
      setSubmitStatus({ type: 'error', message: 'Selecione um veterinário' });
      return;
    }

    const appointmentData = {
      petName: formData.petName,
      petType: '',
      petOwnerName: formData.ownerName,
      email: '',
      phone: '',
      serviceId: '',
      veterinarianId: formData.veterinarianId,
      date: formData.date,
      time: formData.time,
      notes: formData.description
    };

    const result = await createAppointment(appointmentData);

    if (result.success) {
      setSubmitStatus({ 
        type: 'success', 
        message: 'Agendamento realizado com sucesso!' 
      });
      setFormData(initialFormData);
    } else {
      setSubmitStatus({ 
        type: 'error', 
        message: result.error || 'Erro ao criar agendamento' 
      });
    }
  };

  const selectedVet = veterinarians.find(vet => vet._id === formData.veterinarianId);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Agendar Consulta</h1>

          {submitStatus.message && (
            <div className={`p-4 mb-6 rounded-md ${
              submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="petName" className="block text-sm font-medium text-gray-700">
                Nome do Pet
              </label>
              <input
                type="text"
                id="petName"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                Nome do Responsável
              </label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Data
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Horário
                </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                >
                  <option value="">Selecione um horário</option>
                  {selectedVet?.availableHours.map(hour => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="veterinarianId" className="block text-sm font-medium text-gray-700">
                Veterinário
              </label>
              {loadingVets ? (
                <div className="flex items-center space-x-2 mt-1">
                  <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
                  <span className="text-sm text-gray-500">Carregando veterinários...</span>
                </div>
              ) : (
                <select
                  id="veterinarianId"
                  name="veterinarianId"
                  value={formData.veterinarianId}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                >
                  <option value="">Selecione um veterinário</option>
                  {veterinarians.map(vet => (
                    <option key={vet._id} value={vet._id}>
                      {vet.name} - {vet.specialization}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedVet && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Dias disponíveis do(a) {selectedVet.name}:
                </h4>
                <p className="text-sm text-gray-600">
                  {selectedVet.availableDays.join(', ')}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descrição/Motivo da Consulta
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
              >
                Agendar Consulta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
