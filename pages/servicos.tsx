import { useState } from 'react';
import MobileNav from '../components/ui/mobile-nav';
import ThemeToggle from '../components/ui/theme-toggle';
import { CalendarIcon, PlayCircleIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Produtos', href: '/' },
  { name: 'Recursos', href: '#' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Empresa', href: '/empresa' },
];

// Dados de exemplo para os treinos
const treinosExemplo = [
  { id: 1, nome: 'Agendamento de Aula Presencial', nivel: 'Intermediário', duracao: '60 min', foco: 'Diário' },
  { id: 2, nome: 'Treinos Personalizados', nivel: 'Avançado', duracao: '60 min', foco: 'Diário' },
  { id: 3, nome: 'Treino Funcional', nivel: 'Iniciante', duracao: '60 min', foco: 'Diário' },
];

// Horários disponíveis de 05:00 até 22:00 (a cada 1 hora)
const hourSlots = Array.from({ length: 18 }, (_, i) => `${String(5 + i).padStart(2, '0')}:00`)
const horariosDisponiveis = [
  { id: 1, dia: 'Segunda', horarios: hourSlots },
  { id: 2, dia: 'Terça', horarios: hourSlots },
  { id: 3, dia: 'Quarta', horarios: hourSlots },
  { id: 4, dia: 'Quinta', horarios: hourSlots },
  { id: 5, dia: 'Sexta', horarios: hourSlots },
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
    titulo: 'Treinos Personalizados para Queima de Gordura', 
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

// Sugestões de exercícios por grupo muscular
const exerciciosPorGrupo: Record<string, string[]> = {
  Peito: [
    'Supino reto', 'Supino inclinado', 'Supino declinado', 'Crucifixo reto', 'Crucifixo inclinado',
    'Peck deck', 'Flexão', 'Paralelas (peito)', 'Cross-over alto', 'Cross-over médio', 'Cross-over baixo'
  ],
  Costas: [
    'Remada curvada', 'Remada baixa', 'Remada unilateral', 'Barra fixa', 'Pulldown frente', 'Pulldown atrás',
    'Levantamento terra', 'Pull-over', 'Encolhimento trapézio', 'Face pull'
  ],
  Pernas: [
    'Agachamento livre', 'Agachamento hack', 'Leg press', 'Cadeira extensora', 'Mesa flexora',
    'Stiff', 'Afundo (lunge)', 'Passada', 'Panturrilha em pé', 'Panturrilha sentada'
  ],
  Ombros: [
    'Desenvolvimento militar', 'Desenvolvimento com halteres', 'Elevação lateral', 'Elevação frontal',
    'Remada alta', 'Arnold press', 'Encolhimento', 'Face pull'
  ],
  Braços: [
    'Rosca direta', 'Rosca alternada', 'Rosca martelo', 'Rosca concentrada',
    'Tríceps testa', 'Tríceps pulley', 'Tríceps francês', 'Paralelas (tríceps)'
  ],
  Core: [
    'Prancha', 'Abdominal crunch', 'Abdominal infra', 'Abdominal oblíquo', 'Ab wheel',
    'Elevação de pernas', 'Russian twist', 'Prancha lateral'
  ],
  'Corpo inteiro': [
    'Burpee', 'Kettlebell swing', 'Thruster', 'Clean', 'Snatch', 'Deadlift', 'Power clean'
  ],
};
const todosExercicios = Array.from(new Set(Object.values(exerciciosPorGrupo).flat()));

export default function Servicos() {
  const [activeTab, setActiveTab] = useState('treinos');
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [selectedDia, setSelectedDia] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [customStart, setCustomStart] = useState<string | null>(null);
  const [customEnd, setCustomEnd] = useState<string | null>(null);
  const rangeValido = customStart && customEnd ? toMinutes(customStart) < toMinutes(customEnd) : false;
  const [agendamentoSucesso, setAgendamentoSucesso] = useState(false);
  // Gerenciador de Vídeo Aulas
  const [videos, setVideos] = useState(
    videoAulas.map((v) => ({ ...v, legenda: '' }))
  );
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoThumb, setNovoThumb] = useState('');
  const [novaLegenda, setNovaLegenda] = useState('');
  const gruposMusculares = ['Peito','Costas','Pernas','Ombros','Braços','Core','Corpo inteiro'];
  const [customGroup, setCustomGroup] = useState<string>(gruposMusculares[0]);
  const [exerciseName, setExerciseName] = useState<string>('');
  const [exerciseSetsOne, setExerciseSetsOne] = useState<number>(3);
  const [exerciseRepsOne, setExerciseRepsOne] = useState<number>(10);
  const [exerciseRestOne, setExerciseRestOne] = useState<string>('60s');
  const [dayPlanExercises, setDayPlanExercises] = useState<Array<{nome: string, series: number, repeticoes: number, descanso: string}>>([]);

  const handleAgendarTreino = () => {
    if (selectedTreino && selectedDia && selectedHorario) {
      setAgendamentoSucesso(true);
      setTimeout(() => {
        setAgendamentoSucesso(false);
        setSelectedTreino(null);
        setSelectedDia(null);
        setSelectedHorario(null);
      }, 3000);
    }
  };

  // Handlers de Vídeo Aulas (adicionar/remover/editar legenda)
  const handleAdicionarVideo = () => {
    if (!novoTitulo.trim() || !novoThumb.trim()) return;
    const novo = {
      id: Date.now(),
      titulo: novoTitulo.trim(),
      duracao: '',
      nivel: '',
      thumbnail: novoThumb.trim(),
      legenda: novaLegenda.trim(),
    } as any;
    setVideos((prev) => [novo, ...prev]);
    setNovoTitulo('');
    setNovoThumb('');
    setNovaLegenda('');
  };

  const handleRemoverVideo = (id: number) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAlterarLegenda = (id: number, legenda: string) => {
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, legenda } : v)));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <MobileNav navigation={navigation} />
      </div>
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            NatFit Pro - Serviços
          </h1>
          
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
                Agendamento de Aula Presencial
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
          
          {activeTab === 'treinos' && (
            <div className="bg-card shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Treinos Personalizados</h2>
              <p className="mb-6">
                Nossos treinadores especializados criam programas de treinamento adaptados às suas necessidades e objetivos específicos.
              </p>
              <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
                <h3 className="text-lg font-medium mb-3">Montar Treino Personalizado</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coluna esquerda: formulário do Exercício 1 */}
                  <div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de grupo muscular</label>
                      <select 
                        className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                        value={customGroup}
                        onChange={(e) => setCustomGroup(e.target.value)}
                      >
                        {gruposMusculares.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-4 border border-border rounded-md p-3 bg-background">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Exercício 1</label>
                          <input
                            type="text"
                            list="exercicios-sugestao"
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                            placeholder="Ex: Supino reto"
                            className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                          />
                          <datalist id="exercicios-sugestao">
                            {(exerciciosPorGrupo[customGroup] || []).map((ex) => (
                              <option key={`grp-${ex}`} value={ex} />
                            ))}
                            {todosExercicios.map((ex) => (
                              <option key={`all-${ex}`} value={ex} />
                            ))}
                          </datalist>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Séries</label>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={exerciseSetsOne}
                            onChange={(e) => setExerciseSetsOne(Math.max(1, Math.min(10, parseInt(e.target.value || '1', 10))))}
                            className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Repetições</label>
                          <input
                            type="number"
                            min={1}
                            max={30}
                            value={exerciseRepsOne}
                            onChange={(e) => setExerciseRepsOne(Math.max(1, Math.min(30, parseInt(e.target.value || '1', 10))))}
                            className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Descanso</label>
                          <input
                            type="text"
                            value={exerciseRestOne}
                            onChange={(e) => setExerciseRestOne(e.target.value)}
                            placeholder="Ex: 60s, 90s"
                            className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button
                          className={`px-4 py-2 rounded-md text-white ${exerciseName.trim() ? 'bg-primary hover:bg-primary/80' : 'bg-gray-400 cursor-not-allowed'}`}
                          disabled={!exerciseName.trim()}
                          onClick={() => {
                            setDayPlanExercises((prev) => ([
                              ...prev,
                              { nome: exerciseName.trim(), series: exerciseSetsOne, repeticoes: exerciseRepsOne, descanso: exerciseRestOne }
                            ]));
                            setExerciseName('');
                            setExerciseSetsOne(3);
                            setExerciseRepsOne(10);
                            setExerciseRestOne('60s');
                          }}
                        >
                          Adicionar exercício
                        </button>
                        <button
                          className="px-4 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80"
                          onClick={() => {
                            setExerciseName('');
                            setExerciseSetsOne(3);
                            setExerciseRepsOne(10);
                            setExerciseRestOne('60s');
                          }}
                        >
                          Limpar
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Coluna direita: planilha dinâmica */}
                  <div>
                    <div className="p-3 rounded-md border border-border bg-background">
                      <p className="text-sm text-foreground/80">Grupo: <span className="font-medium">{customGroup}</span> • Exercícios: <span className="font-medium">{dayPlanExercises.length}</span></p>
                      {dayPlanExercises.length === 0 ? (
                        <p className="mt-2 text-sm text-muted-foreground">Nenhum exercício adicionado ainda.</p>
                      ) : (
                        <div className="mt-2 overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left">
                                <th className="py-1">Exercício</th>
                                <th className="py-1">Séries</th>
                                <th className="py-1">Reps</th>
                                <th className="py-1">Descanso</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dayPlanExercises.map((ex, i) => (
                                <tr key={i} className="border-t border-border">
                                  <td className="py-1">{ex.nome}</td>
                                  <td className="py-1">{ex.series}</td>
                                  <td className="py-1">{ex.repeticoes}</td>
                                  <td className="py-1">{ex.descanso}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button 
                          className="px-3 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80"
                          onClick={() => {
                            const texto = [
                              `Treino Personalizado — Grupo: ${customGroup}`,
                              '',
                              ...dayPlanExercises.map((ex) => `- ${ex.nome}: ${ex.series} séries x ${ex.repeticoes} reps — descanso ${ex.descanso}`)
                            ].join('\n');
                            navigator.clipboard?.writeText(texto);
                          }}
                        >
                          Copiar plano
                        </button>
                        <button 
                          className="px-3 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80"
                          onClick={() => {
                            const texto = [
                              `Treino Personalizado — Grupo: ${customGroup}`,
                              '',
                              ...dayPlanExercises.map((ex) => `- ${ex.nome}: ${ex.series} séries x ${ex.repeticoes} reps — descanso ${ex.descanso}`)
                            ].join('\n');
                            const blob = new Blob([texto], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'treino-personalizado.txt';
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          Baixar plano (.txt)
                        </button>
                      </div>
                      <div className="mt-3">
                        <button 
                          className={`px-4 py-2 rounded-md text-white ${dayPlanExercises.length > 0 ? 'bg-primary hover:bg-primary/80' : 'bg-gray-400 cursor-not-allowed'}`}
                          disabled={dayPlanExercises.length === 0}
                          onClick={() => {
                            const treinoPersonalizado = {
                              id: Date.now(),
                              nome: 'Treino Personalizado',
                              nivel: 'Personalizado',
                              duracao: '60 min',
                              foco: customGroup,
                              detalhes: dayPlanExercises,
                            } as any;
                            setSelectedTreino(treinoPersonalizado);
                            setActiveTab('agendamento');
                          }}
                        >
                          Agendar este treino
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid de cartões removido conforme solicitado */}
            </div>
          )}
          
          {activeTab === 'agendamento' && (
            <div className="bg-card shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Agendamento de Aula Presencial</h2>
              
              {agendamentoSucesso ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                  <p>Agendamento realizado com sucesso! Um e-mail de confirmação foi enviado.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">1. Selecione o tipo de aula:</h3>
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
                            onClick={() => {
                              setSelectedHorario(horario);
                              setCustomStart(horario);
                              setCustomEnd(addMinutes(horario, 60)); // sugestão padrão: 60 min
                            }}
                          >
                            <p className="font-medium">{horario}</p>
                          </div>
                        ))}
                      </div>
                      {selectedHorario && (
                        <div className="mt-4 p-4 border border-border rounded-md bg-muted/30">
                          <h4 className="text-md font-medium mb-3">Editar horário selecionado</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Início</label>
                              <input
                                type="time"
                                step={300}
                                min="05:00"
                                max="22:00"
                                value={customStart || ''}
                                onChange={(e) => setCustomStart(e.target.value)}
                                className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Fim</label>
                              <input
                                type="time"
                                step={300}
                                min="05:00"
                                max="22:00"
                                value={customEnd || ''}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                              />
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">Sugestão padrão: 60 min. Você pode ajustar, por exemplo, 06:00–06:40 ou 06:00–06:50.</p>
                          {!rangeValido && (
                            <p className="mt-2 text-xs text-red-600">O horário de início deve ser menor que o horário de fim.</p>
                          )}
                          {rangeValido && customStart && customEnd && (
                            <p className="mt-2 text-sm text-foreground/80">Selecionado: {selectedDia?.dia}, das {customStart} às {customEnd}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {selectedTreino && selectedDia && selectedHorario && (
                    <div className="mt-6">
                      <button 
                        className={`px-6 py-2 rounded-md text-white ${rangeValido ? 'bg-primary hover:bg-primary/80' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!rangeValido}
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
          
          {activeTab === 'videos' && (
            <div className="bg-card shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Vídeo Aulas</h2>
              <p className="mb-6">Adicione, remova e edite a legenda dos seus vídeos.</p>

              {/* Formulário para adicionar novo vídeo */}
              <div className="border border-border rounded-lg p-4 bg-background">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Título</label>
                    <input 
                      type="text"
                      value={novoTitulo}
                      onChange={(e) => setNovoTitulo(e.target.value)}
                      placeholder="Ex: Fundamentos de Agachamento"
                      className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Thumbnail (URL)</label>
                    <input 
                      type="url"
                      value={novoThumb}
                      onChange={(e) => setNovoThumb(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Legenda</label>
                    <input 
                      type="text"
                      value={novaLegenda}
                      onChange={(e) => setNovaLegenda(e.target.value)}
                      placeholder="Ex: Técnicas básicas para iniciantes"
                      className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <button 
                    className={`px-4 py-2 rounded-md text-white ${novoTitulo.trim() && novoThumb.trim() ? 'bg-primary hover:bg-primary/80' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!novoTitulo.trim() || !novoThumb.trim()}
                    onClick={handleAdicionarVideo}
                  >
                    Adicionar vídeo
                  </button>
                </div>
              </div>

              {/* Lista de vídeos existente com edição de legenda e remoção */}
              <div className="mt-6 space-y-4">
                {videos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum vídeo cadastrado.</p>
                ) : (
                  videos.map((video) => (
                    <div key={video.id} className="flex flex-col md:flex-row gap-4 border border-border rounded-lg p-4 bg-background">
                      <div className="w-full md:w-48 h-28 bg-muted overflow-hidden rounded-md">
                        {video.thumbnail ? (
                          <img src={video.thumbnail} alt={video.titulo} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">Sem imagem</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{video.titulo}</p>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Legenda</label>
                            <input 
                              type="text"
                              value={video.legenda || ''}
                              onChange={(e) => handleAlterarLegenda(video.id, e.target.value)}
                              placeholder="Digite a legenda para este vídeo"
                              className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                            />
                          </div>
                          <div className="flex items-end">
                            <button 
                              className="px-4 py-2 rounded-md bg-destructive text-white hover:bg-destructive/80"
                              onClick={() => handleRemoverVideo(video.id)}
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {/* Modal de vídeo removido; agora a aba é somente gerenciador */}
        </div>
      </main>
      
      <ThemeToggle />
    </div>
  );
}
  function toMinutes(hhmm: string) {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  }

  function fromMinutes(total: number) {
    const h = Math.floor(total / 60) % 24;
    const m = total % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  function addMinutes(hhmm: string, minutes: number) {
    return fromMinutes(toMinutes(hhmm) + minutes);
  }