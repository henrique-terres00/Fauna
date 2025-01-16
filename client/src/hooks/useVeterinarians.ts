import { useState, useEffect } from 'react';
import { AsyncState } from '../types/loading';
import api from '../lib/api';
import type { TeamMember } from '../types';

export const useVeterinarians = () => {
  const [state, setState] = useState<AsyncState<TeamMember[]>>({
    data: null,
    isLoading: true,
    isError: false,
    error: null
  });

  useEffect(() => {
    const fetchVeterinarians = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, isError: false, error: null }));
        const data = await api.veterinarians.list();
        setState({
          data,
          isLoading: false,
          isError: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching veterinarians:', error);
        setState({
          data: null,
          isLoading: false,
          isError: true,
          error: error instanceof Error ? error.message : 'Erro ao carregar veterinários'
        });
      }
    };

    fetchVeterinarians();
  }, []);

  return {
    veterinarians: state.data ?? [],
    isLoading: state.isLoading,
    isError: state.isError,
    error: state.error
  };
};
