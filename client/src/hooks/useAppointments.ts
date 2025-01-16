import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Appointment } from '../types';
import { AsyncState } from '../types/loading';

interface AppointmentData {
  petName: string;
  petType: string;
  petOwnerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  veterinarianId: string;
  serviceId: string;
  notes?: string;
}

interface AppointmentResponse {
  success: boolean;
  error?: string;
}

export const useAppointments = () => {
  const [state, setState] = useState<AsyncState<Appointment[]>>({
    data: null,
    isLoading: true,
    isError: false,
    error: null
  });

  const fetchAppointments = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
      const response = await api.appointments.list();
      setState({
        data: response,
        isLoading: false,
        isError: false,
        error: null
      });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        isError: true,
        error: error instanceof Error ? error.message : 'Erro ao carregar agendamentos'
      });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const createAppointment = async (data: AppointmentData): Promise<AppointmentResponse> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
      await api.appointments.create(data);
      setState(prev => ({
        ...prev,
        data: prev.data ? [...prev.data, { 
          ...data, 
          _id: Date.now().toString(),
          status: 'pending' as const
        }] : null,
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: error instanceof Error ? error.message : 'Erro ao criar agendamento'
      }));
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao criar agendamento'
      };
    }
  };

  const updateAppointmentStatus = async (
    id: string, 
    status: 'pending' | 'confirmed' | 'cancelled'
  ): Promise<AppointmentResponse> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
      await api.appointments.update(id, { status });
      setState(prev => ({
        ...prev,
        data: prev.data?.map(appointment => 
          appointment._id === id ? { ...appointment, status } : appointment
        ) ?? null,
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: error instanceof Error ? error.message : 'Erro ao atualizar status do agendamento'
      }));
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro ao atualizar status do agendamento'
      };
    }
  };

  return {
    appointments: state.data ?? [],
    isLoading: state.isLoading,
    isError: state.isError,
    error: state.error,
    createAppointment,
    updateAppointmentStatus,
    refreshAppointments: fetchAppointments
  };
};
