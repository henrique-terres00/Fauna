import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Service } from '../types';
import { AsyncState } from '../types/loading';
import { IconName } from '../types';

interface ServiceData {
  title: string;
  description: string;
  icon: IconName;
  price: number;
  duration: number;
  active: boolean;
}

interface ServiceResponse {
  success: boolean;
  error?: string;
}

export const useServices = () => {
  const [state, setState] = useState<AsyncState<Service[]>>({
    data: null,
    isLoading: true,
    isError: false,
    error: null
  });

  const fetchServices = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
      const response = await api.services.list();
      setState({ data: response, isLoading: false, isError: false, error: null });
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      setState({
        data: null,
        isLoading: false,
        isError: true,
        error: error instanceof Error ? error.message : 'Erro ao carregar serviços'
      });
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const createService = async (data: ServiceData): Promise<ServiceResponse> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
      const response = await api.services.create(data);
      setState(prev => ({
        ...prev,
        data: prev.data ? [...prev.data, response] : [response],
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: error instanceof Error ? error.message : 'Erro ao criar serviço'
      }));
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao criar serviço'
      };
    }
  };

  const updateService = async (id: string, data: Partial<ServiceData>): Promise<ServiceResponse> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
      const response = await api.services.update(id, data);
      setState(prev => ({
        ...prev,
        data: prev.data?.map(service => service._id === id ? response : service) ?? null,
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: error instanceof Error ? error.message : 'Erro ao atualizar serviço'
      }));
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar serviço'
      };
    }
  };

  const deleteService = async (id: string): Promise<ServiceResponse> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
      await api.services.delete(id);
      setState(prev => ({
        ...prev,
        data: prev.data?.filter(service => service._id !== id) ?? null,
        isLoading: false
      }));
      return { success: true };
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        error: error instanceof Error ? error.message : 'Erro ao excluir serviço'
      }));
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao excluir serviço'
      };
    }
  };

  return {
    services: state.data ?? [],
    isLoading: state.isLoading,
    isError: state.isError,
    error: state.error,
    createService,
    updateService,
    deleteService,
    refreshServices: fetchServices
  };
};
