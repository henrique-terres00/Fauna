import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react';

const Contact = () => {
  const phoneNumber = '5551993207447';
  const message = encodeURIComponent('Olá! Gostaria de agendar uma consulta.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Entre em Contato</h2>
          <p className="mt-4 text-lg text-gray-600">
            Estamos aqui para ajudar você e seu pet
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Informações de Contato */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Informações de Contato</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-teal-600 mt-1" />
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Endereço</p>
                  <p className="text-gray-600">Av. Imaginária, 1234 - Centro</p>
                  <p className="text-gray-600">Porto Alegre - RS</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-teal-600 mt-1" />
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Telefone</p>
                  <p className="text-gray-600">(51) 1234-5678</p>
                  <p className="text-gray-600">(51) 99320-7447 (WhatsApp)</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-teal-600 mt-1" />
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-600">contato@clinicafauna.com.br</p>
                  <p className="text-gray-600">atendimento@clinicafauna.com.br</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-6 h-6 text-teal-600 mt-1" />
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Horário</p>
                  <p className="text-gray-600">Segunda a Sexta: 8h às 20h</p>
                  <p className="text-gray-600">Sábado: 8h às 18h</p>
                  <p className="text-gray-600 font-medium text-teal-600">Emergência 24h</p>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Contact */}
          <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Fale Conosco</h3>
            <p className="text-gray-600 text-center mb-8">
              Clique no botão abaixo para iniciar uma conversa no WhatsApp. 
              Estamos prontos para atender você!
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-medium"
            >
              <MessageCircle className="w-6 h-6 mr-2" />
              Conversar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;