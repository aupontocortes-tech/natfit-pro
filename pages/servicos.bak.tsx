import { useState } from 'react';
import MobileNav from '../components/ui/mobile-nav';
import ThemeToggle from '../components/ui/theme-toggle';
import { CalendarIcon, PlayCircleIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Produtos', href: '/' },
  { name: 'Recursos', href: '#' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Empresa', href: '#' },
];

// Dados de exemplo para os treinos
const treinosExemplo = [
  { id: 1, nome: 'Treino de Força', nivel: 'Intermediário', duracao: '45 min', foco: 'Membros superiores' },
  { id: 2, nome: 'Treino HIIT', nivel: 'Avançado', duracao: '30 min', foco: 'Cardio' },
  { id: 3, nome: 'Treino Funcional', nivel: 'Iniciante', duracao: '60 min', foco: 'Corpo inteiro' },
];

// Dados de exemplo para os horários disponíveis
const horariosDisponiveis = [
  { id: 1, dia: 'Segunda', horarios: ['08:00', '10:00', '14:00', '16:00'] },
  { id: 2, dia: 'Terça', horarios: ['09:00', '11:00', '15:00', '17:00'] },
  { id: 3, dia: 'Quarta', horarios: ['08:00', '10:00', '14:00', '16:00'] },
  { id: 4, dia: 'Quinta', horarios: ['09:00', '11:00', '15:00', '17:00'] },
  { id: 5, dia: 'Sexta', horarios: ['08:00', '10:00', '14:00', '16:00'] },
];

// Dados de exemplo para vídeo aulas
const videoAulas = [
  { 
    id: 1, 
    titulo: 'Fundamentos de Agachamento', 
    duracao: '15 min', 
    nivel: 'Iniciante',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  { 
    id: 2, 
    titulo: 'Treino HIIT para Queima de Gordura', 
    duracao: '25 min', 
    nivel: 'Intermediário',
    thumbnail: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  { 
    id: 3, 
    titulo: 'Alongamentos Pós-treino', 
    duracao: '10 min', 
    nivel: 'Todos os níveis',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
];

export default function Servicos() {
  const [activeTab, setActiveTab] = useState('treinos');
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [selectedDia, setSelectedDia] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [agendamentoSucesso, setAgendamentoSucesso] = useState(false);
  const [videoSelecionado, setVideoSelecionado] = useState(null);

  const handleAgendarTreino = () => {
    if (selectedTreino && selectedDia && selectedHorario) {
      // Aqui seria implementada a lógica de agendamento real
      setAgendamentoSucesso(true);
      setTimeout(() => {
        setAgendamentoSucesso(false);
        setSelectedTreino(null);
        setSelectedDia(null);
        setSelectedHorario(null);
      }, 3000);
    }
  };

  const handlePlayVideo = (video) => {
    setVideoSelecionado(video);
  };

  const handleCloseVideo = () => {
    setVideoSelecionado(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <MobileNav navigation={navigation} />
      </div>
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            NATFIT PRO - Serviços
          </h1>
          
          {/* Tabs de navegação */}
          <div className="flex justify-center mb-8">
            <nav className="flex space-x-4 bg-card p-1 rounded-lg shadow">
              <button
                onClick={() => setActiveTab('treinos')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'treinos' 
                    ? 'bg-primary text-white' 
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <ClipboardDocumentCheckIcon className="h-5 w-5 inline mr-1" />
                Treinos Personalizados
              </button>
              <button
                onClick={() => setActiveTab('agendamento')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'agendamento' 
                    ? 'bg-primary text-white' 
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <CalendarIcon className="h-5 w-5 inline mr-1" />
                Agendamento
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'videos' 
                    ? 'bg-primary text-white' 
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <PlayCircleIcon className="h-5 w-5 inline mr-1" />
                Vídeo Aulas
              </button>
            </nav>
          </div>
          
          {/* Conteúdo da tab de treinos personalizados */}
          {activeTab === 'treinos' && (
            <div className="bg-card shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Treinos Personalizados</h2>
              <p className="mb-6">
                Nossos treinadores especializados criam programas de treinamento adaptados às suas necessidades e objetivos específicos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {treinosExemplo.map((treino) => (
                  <div 
                    key={treino.id} 
                    className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedTreino(treino)}
                  >
                    <h3 className="text-lg font-medium">{treino.nome}</h3>
                    <div className="mt-2 text-sm">
                      <p><span className="font-medium">Nível:</span> {treino.nivel}</p>
                      <p><span className="font-medium">Duração:</span> {treino.duracao}</p>
                      <p><span className="font-medium">Foco:</span> {treino.foco}</p>
                    </div>
                    <div className="mt-4">
                      <button 
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTreino(treino);
                          setActiveTab('agendamento');
                        }}
                      >
                        Agendar Treino
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Conteúdo da tab de agendamento */}
          {activeTab === 'agendamento' && (
            <div className="bg-card shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Agendamento de Treinos</h2>
              
              {agendamentoSucesso ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <p>Agendamento realizado com sucesso! Um e-mail de confirmação foi enviado.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">1. Selecione um treino:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {treinosExemplo.map((treino) => (
                        <div 
                          key={treino.id}
                          className={`border p-3 rounded-md cursor-pointer ${
                            selectedTreino?.id === treino.id 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedTreino(treino)}
                        >
                          <h4 className="font-medium">{treino.nome}</h4>
                          <p className="text-sm">{treino.duracao} • {treino.nivel}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {selectedTreino && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">2. Selecione um dia:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {horariosDisponiveis.map((dia) => (
                          <div 
                            key={dia.id}
                            className={`border p-3 rounded-md text-center cursor-pointer ${
                              selectedDia?.id === dia.id 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedDia(dia)}
                          >
                            <p className="font-medium">{dia.dia}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedTreino && selectedDia && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">3. Selecione um horário:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {selectedDia.horarios.map((horario, index) => (
                          <div 
                            key={index}
                            className={`border p-3 rounded-md text-center cursor-pointer ${
                              selectedHorario === horario 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedHorario(horario)}
                          >
                            <p className="font-medium">{horario}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedTreino && selectedDia && selectedHorario && (
                    <div className="mt-6">
                      <button 
                        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
                        onClick={handleAgendarTreino}
                      >
                        Confirmar Agendamento
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Conteúdo da tab de vídeo aulas */}
          {activeTab === 'videos' && (
            <div className="bg-card shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Vídeo Aulas</h2>
              <p className="mb-6">
                Acesse nossas vídeo aulas exclusivas para treinar em qualquer lugar e a qualquer momento.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoAulas.map((video) => (
                  <div 
                    key={video.id} 
                    className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-48 bg-gray-200">
                      <img 
                        src={video.thumbnail} 
                        alt={video.titulo} 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-opacity"
                        onClick={() => handlePlayVideo(video)}
                      >
                        <PlayCircleIcon className="h-16 w-16 text-white" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium">{video.titulo}</h3>
                      <div className="mt-2 text-sm">
                        <p><span className="font-medium">Duração:</span> {video.duracao}</p>
                        <p><span className="font-medium">Nível:</span> {video.nivel}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Modal de vídeo */}
          {videoSelecionado && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-lg max-w-4xl w-full">
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <h3 className="text-lg font-medium">{videoSelecionado.titulo}</h3>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={handleCloseVideo}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="aspect-w-16 aspect-h-9 bg-black">
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-white">Vídeo: {videoSelecionado.titulo}</p>
                    {/* Aqui seria inserido o player de vídeo real */}
                  </div>
                </div>
                <div className="p-4">
                  <p><span className="font-medium">Duração:</span> {videoSelecionado.duracao}</p>
                  <p><span className="font-medium">Nível:</span> {videoSelecionado.nivel}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <ThemeToggle />
    </div>
  );
}
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            NATFIT PRO - Serviços
          </h1>
          
          {/* Tabs de navegação */}
          <div className="flex justify-center mb-8">
            <nav className="flex space-x-4 bg-card p-1 rounded-lg shadow">
              <button
                onClick={() => setActiveTab('treinos')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'treinos' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2" />
                Treinos Personalizados
              </button>
              <button
                onClick={() => setActiveTab('agendamento')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'agendamento' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Agendamento
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-4 py-2 rounded-md flex items-center ${
                  activeTab === 'videos' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <PlayCircleIcon className="h-5 w-5 mr-2" />
                Vídeo Aulas
              </button>
            </nav>
          </div>
          
          {/* Conteúdo das tabs */}
          <div className="bg-white shadow rounded-lg p-6">
            {/* Tab de Treinos Personalizados */}
            {activeTab === 'treinos' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Treinos Personalizados</h2>
                <p className="text-gray-600 mb-6">
                  Selecione um dos nossos treinos personalizados abaixo ou entre em contato para criarmos um plano específico para seus objetivos.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {treinosExemplo.map((treino) => (
                    <div 
                      key={treino.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedTreino === treino ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedTreino(treino)}
                    >
                      <h3 className="font-semibold text-lg">{treino.nome}</h3>
                      <div className="mt-2 space-y-1 text-sm">
                        <p><span className="font-medium">Nível:</span> {treino.nivel}</p>
                        <p><span className="font-medium">Duração:</span> {treino.duracao}</p>
                        <p><span className="font-medium">Foco:</span> {treino.foco}</p>
                      </div>
                      <button 
                        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTreino(treino);
                          setActiveTab('agendamento');
                        }}
                      >
                        Agendar este treino
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Precisa de um treino personalizado?</h3>
                  <p className="text-gray-600 mb-4">
                    Nossa equipe de profissionais pode criar um plano de treino específico para suas necessidades e objetivos.
                  </p>
                  <button className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors">
                    Solicitar treino personalizado
                  </button>
                </div>
              </div>
            )}
            
            {/* Tab de Agendamento */}
            {activeTab === 'agendamento' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Agendamento de Treino</h2>
                
                {agendamentoSucesso ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                    <strong className="font-bold">Sucesso!</strong>
                    <span className="block sm:inline"> Seu treino foi agendado com sucesso.</span>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">1. Selecione o treino</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {treinosExemplo.map((treino) => (
                          <div 
                            key={treino.id} 
                            className={`border rounded-lg p-3 cursor-pointer ${
                              selectedTreino?.id === treino.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                            onClick={() => setSelectedTreino(treino)}
                          >
                            <h4 className="font-medium">{treino.nome}</h4>
                            <p className="text-sm text-gray-500">{treino.duracao} • {treino.nivel}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">2. Selecione o dia</h3>
                      <div className="flex flex-wrap gap-2">
                        {horariosDisponiveis.map((dia) => (
                          <button
                            key={dia.id}
                            className={`px-4 py-2 rounded-md ${
                              selectedDia?.id === dia.id 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setSelectedDia(dia)}
                          >
                            {dia.dia}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {selectedDia && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">3. Selecione o horário</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedDia.horarios.map((horario, index) => (
                            <button
                              key={index}
                              className={`px-4 py-2 rounded-md ${
                                selectedHorario === horario 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              onClick={() => setSelectedHorario(horario)}
                            >
                              {horario}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-8">
                      <button
                        className={`px-6 py-3 rounded-md text-white font-medium ${
                          selectedTreino && selectedDia && selectedHorario
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!selectedTreino || !selectedDia || !selectedHorario}
                        onClick={handleAgendarTreino}
                      >
                        Confirmar Agendamento
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Tab de Vídeo Aulas */}
            {activeTab === 'videos' && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Vídeo Aulas de Treinos</h2>
                <p className="text-gray-600 mb-6">
                  Acesse nossas vídeo aulas para aprender técnicas corretas e realizar treinos em casa.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoAulas.map((video) => (
                    <div key={video.id} className="border rounded-lg overflow-hidden">
                      <div className="relative h-48 bg-gray-200">
                        <img 
                          src={video.thumbnail} 
                          alt={video.titulo} 
                          className="w-full h-full object-cover"
                        />
                        <button 
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-opacity"
                          onClick={() => handlePlayVideo(video)}
                        >
                          <PlayCircleIcon className="h-16 w-16 text-white" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">{video.titulo}</h3>
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <span>{video.duracao}</span>
                          <span>{video.nivel}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Modal de vídeo */}
      {videoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">{videoSelecionado.titulo}</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={handleCloseVideo}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="aspect-w-16 aspect-h-9 bg-black">
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="text-center text-white">
                  <PlayCircleIcon className="h-20 w-20 mx-auto mb-4" />
                  <p>Aqui seria reproduzido o vídeo "{videoSelecionado.titulo}"</p>
                  <p className="text-sm mt-2">Duração: {videoSelecionado.duracao}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Descrição</h4>
              <p className="text-gray-600">
                Este vídeo demonstra técnicas e exercícios para {videoSelecionado.titulo.toLowerCase()}. 
                Ideal para praticantes de nível {videoSelecionado.nivel.toLowerCase()}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}