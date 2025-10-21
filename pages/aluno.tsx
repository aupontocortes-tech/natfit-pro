import MobileNav from '../components/ui/mobile-nav'
import { ClipboardDocumentCheckIcon, PlayCircleIcon, CalendarIcon, CreditCardIcon, QrCodeIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { useAuth } from '../contexts/AuthContext'
import Head from 'next/head'

const navigation = [
  { name: 'Produtos', href: '/' },
  { name: 'Recursos', href: '#' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Empresa', href: '/empresa' },
]

type AgendaItem = {
  id: string
  data: string
  horario?: string
  titulo?: string
  observacoes?: string
}

type TreinoItem = {
  id: string
  titulo: string
  descricao?: string
  criadoEm?: string
}

type VideoAula = {
  id: string
  titulo: string
  url: string
  descricao?: string
}

type Pagamento = {
  id: string
  titulo: string
  valor: number
  status: 'pendente' | 'aprovado' | 'recusado'
  metodo?: 'pix' | 'cartao'
}

type RegistrosAluno = {
  treinos: TreinoItem[]
  agenda: AgendaItem[]
  videos: VideoAula[]
  pagamentos?: Pagamento[]
}

export default function AlunoPage() {
  const { user } = useAuth()
  const [registros, setRegistros] = useState<RegistrosAluno | null>(null)
  const [cadastrado, setCadastrado] = useState<boolean | null>(null)

  // Pagamentos
  const [pixChave, setPixChave] = useState<string>('')
  const [pixQrUrl, setPixQrUrl] = useState<string>('')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })

  const email = user?.email || ''
  const [form, setForm] = useState({
    nome: '',
    idade: '',
    nivel: 'Iniciante' as 'Iniciante' | 'Intermediário' | 'Avançado',
    objetivos: '',
    lesoes: '',
    preferencias: '',
    telefone: '',
    observacoes: '',
  })

  const handleSalvarCadastro = () => {
    if (!email) return
    try {
      const rawAlunos = window.localStorage.getItem('natfit_alunos')
      const list = rawAlunos ? (JSON.parse(rawAlunos) as any[]) : []
      const novo = {
        id: Date.now().toString(),
        nome: form.nome.trim(),
        idade: Number(form.idade) || 0,
        nivel: form.nivel,
        objetivos: form.objetivos.trim(),
        lesoes: form.lesoes.trim(),
        preferencias: form.preferencias.trim(),
        email: email,
        telefone: form.telefone.trim(),
        observacoes: form.observacoes.trim(),
      }
      const idx = list.findIndex((a) => a.email?.toLowerCase() === email.toLowerCase())
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...novo }
      } else {
        list.push(novo)
      }
      window.localStorage.setItem('natfit_alunos', JSON.stringify(list))
      setCadastrado(true)
    } catch {}
  }

  const persistRegistros = (updated: RegistrosAluno) => {
    if (typeof window === 'undefined' || !email) return
    try {
      const raw = window.localStorage.getItem('natfit_aluno_registros')
      const mapa: Record<string, RegistrosAluno> = raw ? JSON.parse(raw) : {}
      mapa[email.toLowerCase()] = updated
      window.localStorage.setItem('natfit_aluno_registros', JSON.stringify(mapa))
      setRegistros(updated)
    } catch {}
  }

  const confirmarPagamento = (id: string, metodo: 'pix' | 'cartao') => {
    if (!registros) return
    const pagos = (registros.pagamentos || []).map(p =>
      p.id === id ? { ...p, status: 'aprovado', metodo } : p
    )
    persistRegistros({ ...registros, pagamentos: pagos })
  }

  const gerarPixQr = async (p: Pagamento) => {
    try {
      const payload = `PIX|CHAVE=${pixChave}|VALOR=${p.valor.toFixed(2)}|DESCRICAO=${p.titulo}|ID=${p.id}`
      const dataUrl = await QRCode.toDataURL(payload, { margin: 1 })
      setPixQrUrl(dataUrl)
    } catch {
      setPixQrUrl('')
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    // Verifica se usuário está cadastrado na empresa
    try {
      const rawAlunos = window.localStorage.getItem('natfit_alunos')
      const alunos: { email: string }[] = rawAlunos ? JSON.parse(rawAlunos) : []
      const ok = !!email && alunos.some((a) => a.email?.toLowerCase() === email.toLowerCase())
      setCadastrado(ok)
    } catch {
      setCadastrado(false)
    }
    // Carrega registros atribuídos pelo professor
    try {
      const raw = window.localStorage.getItem('natfit_aluno_registros')
      const mapa: Record<string, RegistrosAluno> = raw ? JSON.parse(raw) : {}
      const dados = email ? mapa[email.toLowerCase()] : undefined
      setRegistros(dados || null)
    } catch {
      setRegistros(null)
    }
  }, [email])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const chave = window.localStorage.getItem('natfit_pix_chave') || 'chave@exemplo.com'
    setPixChave(chave)
  }, [])

  const temTreinos = useMemo(() => (registros?.treinos?.length || 0) > 0, [registros])
  const temAgenda = useMemo(() => (registros?.agenda?.length || 0) > 0, [registros])
  const temVideos = useMemo(() => (registros?.videos?.length || 0) > 0, [registros])
  const pagamentosPendentes = useMemo(() => (registros?.pagamentos || []).filter(p => p.status === 'pendente'), [registros])
  const pagamentoAtual = pagamentosPendentes[0] || null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <MobileNav navigation={navigation} />
      </div>

      <main className="px-6 py-10">
        <Head>
          <title>NatFit Pro — Aluno</title>
          <meta name="description" content="Área do aluno: treinos, agenda, vídeos e pagamentos." />
        </Head>
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Área do Aluno</h1>
          </div>
          <p className="text-sm text-foreground/70">Veja seus agendamentos, treinos e vídeo-aulas atribuídos pelo seu professor.</p>

          {!user && (
            <div className="rounded-xl border border-border bg-card p-4 text-card-foreground">
              <div className="text-sm">Você não está logado.</div>
              <a href="/login" className="mt-2 inline-block text-sm underline">Fazer login</a>
            </div>
          )}

          {user && cadastrado === false && (
            <div className="rounded-xl border border-border bg-card p-4 text-card-foreground">
              <h2 className="text-lg font-semibold">Cadastro do Aluno</h2>
              <p className="mt-1 text-xs text-foreground/70">Preencha seu perfil para liberar sua Área do Aluno.</p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <input className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Idade</label>
                  <input type="number" className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" value={form.idade} onChange={(e) => setForm((f) => ({ ...f, idade: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nível</label>
                  <select className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" value={form.nivel} onChange={(e) => setForm((f) => ({ ...f, nivel: e.target.value as any }))}>
                    <option>Iniciante</option>
                    <option>Intermediário</option>
                    <option>Avançado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Telefone</label>
                  <input className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" value={form.telefone} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Objetivos</label>
                  <textarea className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" rows={2} value={form.objetivos} onChange={(e) => setForm((f) => ({ ...f, objetivos: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Lesões/Histórico</label>
                  <textarea className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" rows={2} value={form.lesoes} onChange={(e) => setForm((f) => ({ ...f, lesoes: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Preferências</label>
                  <textarea className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" rows={2} value={form.preferencias} onChange={(e) => setForm((f) => ({ ...f, preferencias: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Observações</label>
                  <textarea className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" rows={2} value={form.observacoes} onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs text-foreground/70">Email: {email}</div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/80" onClick={handleSalvarCadastro} disabled={!form.nome.trim()}>Salvar cadastro</button>
                <button className="px-4 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80" onClick={() => setForm({ nome: '', idade: '', nivel: 'Iniciante' as any, objetivos: '', lesoes: '', preferencias: '', telefone: '', observacoes: '' })}>Limpar</button>
              </div>
            </div>
          )}

          {user && cadastrado && (<>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card text-card-foreground rounded-xl p-6 shadow">
                <div className="flex items-center gap-2">
                  <ClipboardDocumentCheckIcon className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Treinos Personalizados</h2>
                </div>
                {!temTreinos ? (
                  <p className="mt-2 text-sm text-foreground/80">Nenhum treino atribuído ainda. Aguarde seu professor configurar seu plano.</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {registros!.treinos.map((t) => (
                      <li key={t.id} className="rounded-md border border-border p-3">
                        <div className="text-sm font-semibold">{t.titulo}</div>
                        {t.descricao && <div className="mt-1 text-sm text-foreground/80 whitespace-pre-wrap">{t.descricao}</div>}
                        {t.criadoEm && <div className="mt-1 text-xs text-foreground/60">Criado em: {t.criadoEm}</div>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-card text-card-foreground rounded-xl p-6 shadow">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Agendamentos</h2>
                </div>
                {!temAgenda ? (
                  <p className="mt-2 text-sm text-foreground/80">Nenhum agendamento marcado ainda.</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {registros!.agenda.map((a) => (
                      <li key={a.id} className="rounded-md border border-border p-3 text-sm">
                        <div className="font-medium">{a.titulo || 'Sessão'}</div>
                        <div className="mt-1 text-foreground/80">{a.data}{a.horario ? ` • ${a.horario}` : ''}</div>
                        {a.observacoes && <div className="mt-1 text-foreground/70 whitespace-pre-wrap">{a.observacoes}</div>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-card text-card-foreground rounded-xl p-6 shadow">
                <div className="flex items-center gap-2">
                  <PlayCircleIcon className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Vídeo Aulas</h2>
                </div>
                {!temVideos ? (
                  <p className="mt-2 text-sm text-foreground/80">Nenhum vídeo atribuído ainda.</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {registros!.videos.map((v) => (
                      <li key={v.id} className="rounded-md border border-border p-3">
                        <div className="text-sm font-semibold">{v.titulo}</div>
                        {v.descricao && <div className="mt-1 text-sm text-foreground/80 whitespace-pre-wrap">{v.descricao}</div>}
                        <a href={v.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs underline">Assistir</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-card text-card-foreground rounded-xl p-6 shadow md:col-span-3">
                <div className="flex items-center gap-2">
                  <CreditCardIcon className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Pagamentos</h2>
                </div>
                {!pagamentoAtual ? (
                  <p className="mt-2 text-sm text-foreground/80">Nenhuma cobrança pendente no momento.</p>
                ) : (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-md border border-border p-4">
                      <div className="text-sm font-semibold">Pagar via Pix</div>
                      <div className="mt-1 text-xs text-foreground/70">Chave Pix: {pixChave}</div>
                      <div className="mt-1 text-xs text-foreground/70">Valor: R$ {pagamentoAtual.valor.toFixed(2)}</div>
                      <button
                        onClick={() => gerarPixQr(pagamentoAtual)}
                        className="mt-3 inline-flex items-center rounded-md border px-3 py-1 text-xs"
                      >
                        Gerar QR
                      </button>
                      {pixQrUrl && (
                        <div className="mt-3">
                          <img src={pixQrUrl} alt="QR Pix" className="h-40 w-40 border rounded" />
                          <button
                            onClick={() => confirmarPagamento(pagamentoAtual.id, 'pix')}
                            className="mt-3 inline-flex items-center rounded-md border px-3 py-1 text-xs"
                          >
                            Confirmar pagamento (simulado)
                          </button>
                          <div className="mt-2 text-[11px] text-foreground/60">Demo: QR gerado a partir de texto “copia e cola”.</div>
                        </div>
                      )}
                    </div>

                    <div className="rounded-md border border-border p-4">
                      <div className="text-sm font-semibold">Pagar com Cartão</div>
                      <div className="mt-2 grid grid-cols-1 gap-2">
                        <input
                          className="rounded-md border px-2 py-1 text-sm bg-background"
                          placeholder="Número do cartão"
                          value={card.number}
                          onChange={(e) => setCard({ ...card, number: e.target.value })}
                        />
                        <input
                          className="rounded-md border px-2 py-1 text-sm bg-background"
                          placeholder="Nome impresso"
                          value={card.name}
                          onChange={(e) => setCard({ ...card, name: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            className="rounded-md border px-2 py-1 text-sm bg-background"
                            placeholder="Validade (MM/AA)"
                            value={card.expiry}
                            onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                          />
                          <input
                            className="rounded-md border px-2 py-1 text-sm bg-background"
                            placeholder="CVV"
                            value={card.cvv}
                            onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                          />
                        </div>
                        <button
                          onClick={() => confirmarPagamento(pagamentoAtual.id, 'cartao')}
                          className="mt-2 inline-flex items-center rounded-md border px-3 py-1 text-xs"
                        >
                          Pagar (simulado)
                        </button>
                        <div className="mt-2 text-[11px] text-foreground/60">Demo: pagamento aprovado localmente (sem processador real).</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>)}
        </div>
      </main>
    </div>
  )
}