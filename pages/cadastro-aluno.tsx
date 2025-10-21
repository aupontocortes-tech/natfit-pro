import MobileNav from '../components/ui/mobile-nav'
import { useState } from 'react'
import Head from 'next/head'

const navigation = [
  { name: 'Produtos', href: '/' },
  { name: 'Recursos', href: '#' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Empresa', href: '/empresa' },
]

type Nivel = 'Iniciante' | 'Intermediário' | 'Avançado'

export default function CadastroAlunoPage() {
  const [enviado, setEnviado] = useState(false)
  const [form, setForm] = useState({
    nome: '', idade: '', nivel: 'Iniciante' as Nivel,
    objetivos: '', lesoes: '', preferencias: '',
    email: '', telefone: '', observacoes: '',
  })

  const handleEnviar = () => {
    if (!form.nome.trim()) return
    setEnviado(true)
    try {
      const payload = JSON.stringify({ ...form, idade: Number(form.idade) || 0 }, null, 2)
      localStorage.setItem('natfit_cadastro_aluno', payload)
    } catch {}
  }

  const resumoTexto = () => [
    `Aluno: ${form.nome}`,
    `Idade: ${Number(form.idade) || 0}`,
    `Nível: ${form.nivel}`,
    `Objetivos: ${form.objetivos || '-'}`,
    `Lesões/Histórico: ${form.lesoes || '-'}`,
    `Preferências: ${form.preferencias || '-'}`,
    `Email: ${form.email || '-'}`,
    `Telefone: ${form.telefone || '-'}`,
    `Observações: ${form.observacoes || '-'}`,
  ].join('\n')

  const copiarResumo = () => {
    navigator.clipboard?.writeText(resumoTexto())
  }

  const baixarResumo = () => {
    const blob = new Blob([resumoTexto()], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cadastro-${form.nome.replace(/\s+/g, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <MobileNav navigation={navigation} />
      </div>

      <main className="px-6 py-10">
        <Head>
          <title>NatFit Pro — Cadastro de Aluno</title>
          <meta name="description" content="Cadastre novos alunos e gerencie informações." />
        </Head>
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Cadastro do Aluno</h1>
          <p className="text-sm text-foreground/70">Preencha seus dados para que a empresa personalize seu atendimento e treinos.</p>

          <div className="bg-card text-card-foreground rounded-xl p-6 shadow">
            {!enviado ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome</label>
                    <input type="text" value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Idade</label>
                    <input type="number" value={form.idade} onChange={(e) => setForm((f) => ({ ...f, idade: e.target.value }))} className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nível</label>
                    <select value={form.nivel} onChange={(e) => setForm((f) => ({ ...f, nivel: e.target.value as Nivel }))} className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground">
                      <option>Iniciante</option>
                      <option>Intermediário</option>
                      <option>Avançado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone</label>
                    <input type="tel" value={form.telefone} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))} className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Objetivos</label>
                  <textarea value={form.objetivos} onChange={(e) => setForm((f) => ({ ...f, objetivos: e.target.value }))} rows={3} className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Lesões / Histórico</label>
                    <textarea value={form.lesoes} onChange={(e) => setForm((f) => ({ ...f, lesoes: e.target.value }))} rows={3} className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferências</label>
                    <textarea value={form.preferencias} onChange={(e) => setForm((f) => ({ ...f, preferencias: e.target.value }))} rows={3} className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Observações</label>
                  <textarea value={form.observacoes} onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))} rows={2} className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground" />
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/80" onClick={handleEnviar} disabled={!form.nome.trim()}>Enviar cadastro</button>
                  <button className="px-4 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80" onClick={() => setForm({ nome: '', idade: '', nivel: 'Iniciante', objetivos: '', lesoes: '', preferencias: '', email: '', telefone: '', observacoes: '' })}>Limpar</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border border-green-400 bg-green-50 p-3 text-green-700">Cadastro enviado! Compartilhe seus dados com a empresa.</div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80" onClick={copiarResumo}>Copiar resumo</button>
                  <button className="px-4 py-2 rounded-md bg-secondary text-foreground hover:bg-secondary/80" onClick={baixarResumo}>Baixar resumo (.txt)</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}