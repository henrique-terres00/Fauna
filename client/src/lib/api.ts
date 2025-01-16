import axios from 'axios';
import { Appointment, Contact, Service, TeamMember, Testimonial } from '../types';

const API_URL = 'http://localhost:5000/api';

// Criar instância do axios
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Adicionar interceptor para incluir token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface CreateAppointmentData {
  petName: string;
  petType: string;
  petOwnerName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  serviceId: string;
  veterinarianId: string;
  notes?: string;
}

const api = {
  // Função básica para requisições HTTP
  post: async <T>(url: string, data: any): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  },

  appointments: {
    list: async (): Promise<Appointment[]> => {
      const response = await axiosInstance.get<Appointment[]>('/appointments');
      return response.data;
    },
    create: async (data: CreateAppointmentData): Promise<Appointment> => {
      const response = await axiosInstance.post<Appointment>('/appointments', data);
      return response.data;
    },
    getAvailableHours: async (veterinarianId: string, date: string): Promise<string[]> => {
      const response = await axiosInstance.get<string[]>(
        '/appointments/available-hours',
        {
          params: {
            veterinarianId,
            date
          }
        }
      );
      return response.data;
    },
    update: async (id: string, appointment: Partial<Appointment>): Promise<Appointment> => {
      const response = await axiosInstance.put<Appointment>(`/appointments/${id}`, appointment);
      return response.data;
    },
    delete: async (id: string): Promise<void> => {
      await axiosInstance.delete(`/appointments/${id}`);
    },
  },

  services: {
    list: async (): Promise<Service[]> => {
      const response = await axiosInstance.get<Service[]>('/services');
      return response.data;
    },
    create: async (service: Omit<Service, '_id'>): Promise<Service> => {
      const response = await axiosInstance.post<Service>('/services', service);
      return response.data;
    },
    update: async (id: string, service: Partial<Service>): Promise<Service> => {
      const response = await axiosInstance.put<Service>(`/services/${id}`, service);
      return response.data;
    },
    delete: async (id: string): Promise<void> => {
      await axiosInstance.delete(`/services/${id}`);
    },
  },

  veterinarians: {
    list: async (): Promise<TeamMember[]> => {
      const response = await axiosInstance.get<TeamMember[]>('/veterinarians');
      return response.data;
    },
    create: async (veterinarian: Omit<TeamMember, '_id'>): Promise<TeamMember> => {
      const response = await axiosInstance.post<TeamMember>('/veterinarians', veterinarian);
      return response.data;
    },
    update: async (id: string, veterinarian: Partial<TeamMember>): Promise<TeamMember> => {
      const response = await axiosInstance.put<TeamMember>(`/veterinarians/${id}`, veterinarian);
      return response.data;
    },
    delete: async (id: string): Promise<void> => {
      await axiosInstance.delete(`/veterinarians/${id}`);
    },
  },

  testimonials: {
    list: async (): Promise<Testimonial[]> => {
      const response = await axiosInstance.get<Testimonial[]>('/testimonials');
      return response.data;
    },
    create: async (testimonial: Omit<Testimonial, '_id' | 'createdAt' | 'updatedAt'>): Promise<Testimonial> => {
      const response = await axiosInstance.post<Testimonial>('/testimonials', testimonial);
      return response.data;
    },
    update: async (id: string, testimonial: Partial<Omit<Testimonial, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Testimonial> => {
      const response = await axiosInstance.put<Testimonial>(`/testimonials/${id}`, testimonial);
      return response.data;
    },
    delete: async (id: string): Promise<void> => {
      await axiosInstance.delete(`/testimonials/${id}`);
    },
  },

  contact: {
    create: async (contact: Contact): Promise<void> => {
      await axiosInstance.post('/contact', contact);
    },
  },
};

export default api;