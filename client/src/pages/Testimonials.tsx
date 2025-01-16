import React, { useState, useEffect } from 'react';
import { Testimonial } from '../types';
import api from '../lib/api';
import { Loader2, X, Star } from 'lucide-react';
import { useNotification } from '../hooks/useNotification';

interface TestimonialFormData {
  name: string;
  pet: string;
  text: string;
  rating: number;
}

const initialFormData: TestimonialFormData = {
  name: '',
  pet: '',
  text: '',
  rating: 5
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TestimonialFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const { showNotification } = useNotification();

  const fetchTestimonials = async () => {
    try {
      const data = await api.testimonials.list();
      setTestimonials(data);
    } catch (err) {
      console.error('Erro ao carregar depoimentos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar depoimentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      await api.testimonials.create({
        ...formData,
        active: true // Todos os novos depoimentos começam como ativos
      });
      showNotification('Depoimento enviado com sucesso!', 'success');
      setIsModalOpen(false);
      setFormData(initialFormData);
      fetchTestimonials();
    } catch (error) {
      console.error('Erro ao enviar depoimento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar depoimento';
      setSubmitError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Depoimentos</h1>
          <p className="text-lg text-gray-600">
            O que nossos clientes dizem sobre nós
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {testimonials.filter(t => t.active).map((testimonial) => (
            <div key={testimonial._id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">Tutor de {testimonial.pet}</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    className={`${
                      star <= testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">{testimonial.text}</p>
              <p className="text-sm text-gray-400 mt-4">
                {new Date(testimonial.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-teal-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Compartilhe sua experiência</h2>
            <p className="text-gray-600 mb-8">
              Sua opinião é muito importante para nós e ajuda outros tutores a conhecerem nosso trabalho
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition-colors"
            >
              Deixar um depoimento
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Depoimento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Deixar um depoimento</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seu nome
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do pet
                </label>
                <input
                  type="text"
                  name="pet"
                  value={formData.pet}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avaliação
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingClick(rating)}
                      onMouseEnter={() => setHoverRating(rating)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={`${
                          rating <= (hoverRating ?? formData.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seu depoimento
                </label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              {submitError && (
                <p className="text-red-600 text-sm">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Enviando...' : 'Enviar depoimento'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
