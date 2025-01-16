const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sobre a Fauna</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Há mais de 15 anos cuidando com amor e dedicação dos pets de Porto Alegre
          </p>
        </div>

        {/* História */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa História</h2>
              <p className="text-gray-600 mb-4">
                Fundada em 2008, a Fauna nasceu do sonho de oferecer atendimento veterinário de excelência com um toque humano e acolhedor. Nossa jornada começou em uma pequena sala no bairro da Vila Mariana e, graças à confiança de nossos clientes, hoje somos referência em medicina veterinária na cidade.
              </p>
              <p className="text-gray-600">
                Ao longo desses anos, investimos constantemente em tecnologia e capacitação profissional, sempre mantendo nosso compromisso com o bem-estar animal e o atendimento humanizado.
              </p>
            </div>
            <div>
              <img 
                src="/images/about/vet-caring-dog.jpg"
                alt="Veterinários examinando cachorro"
                className="rounded-lg shadow-lg w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Missão e Valores */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <img 
                src="/images/about/vet-caring-rabbit.jpg"
                alt="Veterinária examinando coelho" 
                className="rounded-lg shadow-lg w-full h-[400px] object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Missão e Valores</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Missão</h3>
                  <p className="text-gray-600">
                    Proporcionar saúde e qualidade de vida aos animais através de atendimento veterinário de excelência e cuidado humanizado.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Valores</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Ética e transparência em todos os procedimentos</li>
                    <li>Compromisso com o bem-estar animal</li>
                    <li>Excelência no atendimento</li>
                    <li>Educação continuada da equipe</li>
                    <li>Responsabilidade social</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estrutura */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Estrutura</h2>
              <p className="text-gray-600 mb-4">
                Contamos com instalações modernas e equipamentos de última geração para oferecer o melhor atendimento aos nossos pacientes:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Centro cirúrgico completo</li>
                <li>Laboratório de análises clínicas</li>
                <li>Raio-X digital</li>
                <li>Ultrassonografia</li>
                <li>Internação 24 horas</li>
                <li>Farmácia veterinária</li>
              </ul>
            </div>
            <div>
              <img 
                src="/images/about/surgery.jpg"
                alt="Centro Cirúrgico" 
                className="rounded-lg shadow-lg w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
