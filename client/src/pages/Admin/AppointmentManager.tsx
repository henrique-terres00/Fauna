import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { useVeterinarians } from '../../hooks/useVeterinarians';
import { useServices } from '../../hooks/useServices';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800 border border-green-300',
  cancelled: 'bg-red-100 text-red-800 border border-red-300'
};

const statusIcons = {
  pending: Clock,
  confirmed: CheckCircle,
  cancelled: XCircle
};

const statusLabels = {
  pending: 'Pendente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada'
};

const AppointmentManager = () => {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { appointments, isLoading: appointmentsLoading, error: appointmentsError, updateAppointmentStatus, refreshAppointments } = useAppointments();
  const { veterinarians, isLoading: veterinariansLoading, error: veterinariansError } = useVeterinarians();
  const { services } = useServices();

  const getVeterinarianName = (veterinarian: string | { _id: string; name: string }) => {
    if (veterinariansLoading) return 'Carregando...';
    if (veterinariansError) return 'Erro ao carregar';
    if (!veterinarian) return 'Veterinário não especificado';
    
    // Se recebemos apenas o ID do veterinário
    if (typeof veterinarian === 'string') {
      const vet = veterinarians.find(v => v._id === veterinarian);
      if (!vet) return 'Veterinário não encontrado';
      return vet.name;
    }
    
    // Se recebemos o objeto completo do veterinário
    return veterinarian.name;
  };

  const getServiceTitle = (service: string | { _id: string; title: string }) => {
    if (!service) return 'Serviço não especificado';
    
    // Se recebemos apenas o ID do serviço
    if (typeof service === 'string') {
      const foundService = services.find(s => s._id === service);
      if (!foundService) return 'Serviço não encontrado';
      return foundService.title;
    }
    
    // Se recebemos o objeto completo do serviço
    return service.title;
  };

  const filteredAppointments = appointments.filter(appointment => 
    selectedStatus === 'all' ? true : appointment.status === selectedStatus
  );

  const handleStatusChange = async (appointmentId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    setUpdatingId(appointmentId);
    setUpdateError('');
    
    try {
      const result = await updateAppointmentStatus(appointmentId, newStatus);
      
      if (result.success) {
        // Atualiza o estado local imediatamente
        refreshAppointments();
      } else {
        setUpdateError(result.error || 'Erro ao atualizar status');
      }
      
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      setUpdateError(
        error instanceof Error ? error.message : 'Erro ao atualizar status'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (appointmentsLoading || veterinariansLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (appointmentsError || veterinariansError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{appointmentsError || veterinariansError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Consultas</h1>
          <p className="mt-2 text-gray-600">
            Gerencie todas as consultas agendadas na clínica
          </p>
          {updateError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{updateError}</p>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-md ${
              selectedStatus === 'all' 
                ? 'bg-teal-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`px-4 py-2 rounded-md ${
              selectedStatus === 'pending' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setSelectedStatus('confirmed')}
            className={`px-4 py-2 rounded-md ${
              selectedStatus === 'confirmed' 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Confirmadas
          </button>
          <button
            onClick={() => setSelectedStatus('cancelled')}
            className={`px-4 py-2 rounded-md ${
              selectedStatus === 'cancelled' 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Canceladas
          </button>
        </div>

        {/* Lista de Consultas */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pet/Responsável
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veterinário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => {
                  const StatusIcon = statusIcons[appointment.status];
                  const isUpdating = updatingId === appointment._id;
                  return (
                    <tr key={appointment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {format(new Date(appointment.date), "dd 'de' MMMM", { locale: ptBR })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.petName} ({appointment.petType})
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.petOwnerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getVeterinarianName(appointment.veterinarianId)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {typeof appointment.veterinarianId === 'object' && appointment.veterinarianId.specialization 
                            ? appointment.veterinarianId.specialization
                            : 'Especialização não informada'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {getServiceTitle(appointment.serviceId)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[appointment.status]}`}>
                          <StatusIcon className="w-4 h-4 mr-1.5" />
                          {statusLabels[appointment.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {appointment.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                              disabled={isUpdating}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 disabled:opacity-50 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4 mr-1.5" />
                              Confirmar
                            </button>
                            <button
                              onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                              disabled={isUpdating}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-300 hover:bg-red-200 disabled:opacity-50 transition-colors"
                            >
                              <XCircle className="w-4 h-4 mr-1.5" />
                              Cancelar
                            </button>
                          </div>
                        )}
                        {isUpdating && (
                          <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManager;
