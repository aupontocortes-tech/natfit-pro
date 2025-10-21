import { useEffect, useState } from 'react'
import MobileNav from '../components/ui/mobile-nav'
import { UserCircleIcon, LinkIcon } from '@heroicons/react/24/outline'
import Head from 'next/head'

const navigation = [
  { name: 'Produtos', href: '/' },
  { name: 'Recursos', href: '#' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Empresa', href: '/empresa' },
]

type Nivel = 'Iniciante' | 'Intermediário' | 'Avançado'
type Aluno = {
  id: string
  nome: string
  idade: number
  nivel: Nivel
  objetivos: string
  lesoes: string
  preferencias: string
  email: string
  telefone: string
  observacoes: string
}

export default function EmpresaPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [form, setForm] = useState({
    nome: '',
    idade: '',
    nivel: 'Iniciante' as Nivel,
    objetivos: '',
    lesoes: '',
    preferencias: '',
    email: '',
    telefone: '',
    observacoes: '',
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem('natfit_alunos')
      if (raw) setAlunos(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('natfit_alunos', JSON.stringify(alunos))
    } catch {}
  }, [alunos])

  const handleAddAluno = () => {
    if (!form.nome.trim()) return
    const novo: Aluno = {
      id: String(Date.now()),
      nome: form.nome.trim(),
      idade: Number(form.idade) || 0,
      nivel: form.nivel,
      objetivos: form.objetivos.trim(),
      lesoes: form.lesoes.trim(),
      preferencias: form.preferencias.trim(),
      email: form.email.trim(),
      telefone: form.telefone.trim(),
      observacoes: form.observacoes.trim(),
    }
    setAlunos((prev) => [...prev, novo])
    setForm({ nome: '', idade: '', nivel: 'Iniciante', objetivos: '', lesoes: '', preferencias: '', email: '', telefone: '', observacoes: '' })
  }

  const handleRemoveAluno = (id: string) => {
    setAlunos((prev) => prev.filter((a) => a.id !== id))
  }

  const handleUpdateAluno = (id: string, patch: Partial<Aluno>) => {
    setAlunos((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }

  const copyPerfil = (a: Aluno) => {
    const texto = [
      `Aluno: ${a.nome}`,
      `Idade: ${a.idade}`,
      `Nível: ${a.nivel}`,
      `Objetivos: ${a.objetivos || '-'}`,
      `Lesões/Histórico: ${a.lesoes || '-'}`,
      `Preferências: ${a.preferencias || '-'}`,
      `Email: ${a.email || '-'}`,
      `Telefone: ${a.telefone || '-'}`,
      `Observações: ${a.observacoes || '-'}`,
    ].join('\n')
    navigator.clipboard?.writeText(texto)
  }

  const downloadPerfil = (a: Aluno) => {
    const texto = [
      `Aluno: ${a.nome}`,
      `Idade: ${a.idade}`,
      `Nível: ${a.nivel}`,
      `Objetivos: ${a.objetivos || '-'}`,
      `Lesões/Histórico: ${a.lesoes || '-'}`,
      `Preferências: ${a.preferencias || '-'}`,
      `Email: ${a.email || '-'}`,
      `Telefone: ${a.telefone || '-'}`,
      `Observações: ${a.observacoes || '-'}`,
    ].join('\n')
    const blob = new Blob([texto], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const aEl = document.createElement('a')
    aEl.href = url
    aEl.download = `perfil-${a.nome.replace(/\s+/g, '_')}.txt`
    aEl.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <MobileNav navigation={navigation} />
      </div>

      <main className="px-6 py-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <Head>
            <title>NatFit Pro — Empresa</title>
            <meta name="description" content="Conheça a NatFit Pro, missão e valores." />
          </Head>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Empresa — Conhecer o Aluno</h1>
            <div className="flex items-center gap-2">
              <a
                href="/aluno"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-secondary"
                aria-label="Ir para área do aluno"
              >
                <UserCircleIcon className="h-5 w-5" />
                <span className="text-sm">Aluno</span>
              </a>
              <a
                href="/cadastro-aluno"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-secondary"
                aria-label="Abrir página de auto‑cadastro do aluno"
              >
                <LinkIcon className="h-5 w-5" />
                <span className="text-sm">Link de cadastro</span>
              </a>
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-secondary"
                onClick={() => {
                  const base = typeof window !== 'undefined' ? window.location.origin : ''
                  const url = `${base}/cadastro-aluno`
                  navigator.clipboard?.writeText(url)
                }}
                aria-label="Copiar link de auto‑cadastro"
              >
                <span className="text-sm">Copiar link</span>
              </button>
            </div>
          </div>
          <p className="text-sm text-foreground/70">Colete informações essenciais do aluno para personalizar treinos e atendimento. Dados são salvos no navegador (localStorage).</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna esquerda: formulário */}
            <div className="bg-card text-card-foreground rounded-xl p-6 shadow">
              <h2 className="text-lg font-semibold">Cadastrar aluno</h2>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome</label>
                    <input
                      type="text"
                      value={form.nome}
                      onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                      placeholder="Nome do aluno"
                      className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Idade</label>
                    <input
                      type="number"
                      value={form.idade}
                      onChange={(e) => setForm((f) => ({ ...f, idade: e.target.value }))}
                      placeholder="Ex.: 28"
                      className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nível</label>
                    <select
                      value={form.nivel}
                      onChange={(e) => setForm((f) => ({ ...f, nivel: e.target.value as Nivel }))}
                      className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                    >
                      <option>Iniciante</option>
                      <option>Intermediário</option>
                      <option>Avançado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="aluno@exemplo.com"
                      className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={form.telefone}
                      onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                      className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Objetivos</label>
                  <textarea
                    value={form.objetivos}
                    onChange={(e) => setForm((f) => ({ ...f, objetivos: e.target.value }))}
                    placeholder="Ex.: Emagrecimento, ganho de massa, melhorar mobilidade"
                    rows={3}
                    className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Lesões / Histórico de saúde</label>
                    <textarea
                      value={form.lesoes}
                      onChange={(e) => setForm((f) => ({ ...f, lesoes: e.target.value }))}
                      placeholder="Ex.: dor lombar, cirurgia no joelho, hipertensão"
                      rows={3}
                      className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferências de treino</label>
                    <textarea
                      value={form.preferencias}
                      onChange={(e) => setForm((f) => ({ ...f, preferencias: e.target.value }))}
                      placeholder="Ex.: treinos curtos, foco em pernas, treinos ao ar livre"
                      rows={3}
                      className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Observações</label>
                  <textarea
                    value={form.observacoes}
                    onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
                    placeholder="Ex.: disponibilidade, horários, preferências adicionais"
                    rows={2}
                    className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/80"
                    onClick={handleAddAluno}
                    disabled={!form.nome.trim()}
                  >
                    Adicionar aluno
                  </button>
                  <button
                    className="px-4 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80"
                    onClick={() => setForm({ nome: '', idade: '', nivel: 'Iniciante', objetivos: '', lesoes: '', preferencias: '', email: '', telefone: '', observacoes: '' })}
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>

            {/* Coluna direita: lista */}
            <div className="bg-card text-card-foreground rounded-xl p-6 shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Alunos cadastrados</h2>
                <span className="text-sm text-foreground/70">Total: {alunos.length}</span>
              </div>

              {alunos.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">Nenhum aluno cadastrado ainda.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {alunos.map((a) => (
                    <div key={a.id} className="rounded-md border border-border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-foreground/70">Nível: {a.nivel}</div>
                          <div className="text-base font-semibold">{a.nome}{a.idade ? ` • ${a.idade} anos` : ''}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 rounded-md bg-secondary text-foreground hover:bg-secondary/80 text-sm"
                            onClick={() => copyPerfil(a)}
                          >
                            Copiar perfil
                          </button>
                          <button
                            className="px-3 py-1 rounded-md bg-secondary text-foreground hover:bg-secondary/80 text-sm"
                            onClick={() => downloadPerfil(a)}
                          >
                            Baixar (.txt)
                          </button>
                          <button
                            className="px-3 py-1 rounded-md bg-destructive text-white hover:bg-destructive/80 text-sm"
                            onClick={() => handleRemoveAluno(a.id)}
                          >
                            Remover
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="rounded bg-background p-3">
                          <div className="text-foreground/70">Objetivos</div>
                          <div className="mt-1 whitespace-pre-wrap">{a.objetivos || '-'}</div>
                        </div>
                        <div className="rounded bg-background p-3">
                          <div className="text-foreground/70">Lesões / Histórico</div>
                          <div className="mt-1 whitespace-pre-wrap">{a.lesoes || '-'}</div>
                        </div>
                        <div className="rounded bg-background p-3">
                          <div className="text-foreground/70">Preferências</div>
                          <div className="mt-1 whitespace-pre-wrap">{a.preferencias || '-'}</div>
                        </div>
                        <div className="rounded bg-background p-3">
                          <div className="text-foreground/70">Contato</div>
                          <div className="mt-1">{a.email || '-'} • {a.telefone || '-'}</div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-sm font-medium mb-2">Observações</label>
                        <textarea
                          value={a.observacoes}
                          onChange={(e) => handleUpdateAluno(a.id, { observacoes: e.target.value })}
                          placeholder="Anotações do atendimento, disponibilidade, necessidades específicas"
                          rows={2}
                          className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}