import { useState } from 'react'
import MobileNav from '../components/ui/mobile-nav'
import { HomeIcon, BanknotesIcon, ShoppingBagIcon, UserCircleIcon, BellAlertIcon, ClipboardDocumentCheckIcon, LinkIcon, UserGroupIcon, UsersIcon } from '@heroicons/react/24/outline'
import Head from 'next/head'

const navigation = [
  { name: 'Produtos', href: '/' },
  { name: 'Recursos', href: '#' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Empresa', href: '/empresa' },
]

export default function AppPage() {
  const [tab, setTab] = useState<'inicio' | 'financas'>('inicio')
  const [bottom, setBottom] = useState<'home' | 'finance' | 'store' | 'profile'>('home')

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>NatFit Pro — App</title>
        <meta name="description" content="Área principal do app NatFit Pro." />
      </Head>
      <MobileNav navigation={navigation} />
      <main className="px-4 py-6">
        {/* Moldura de dispositivo para focar no layout mobile */}
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card text-card-foreground shadow overflow-hidden">
          {/* Header no estilo app */}
          <div className="p-4 bg-primary/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary/70" />
              <div>
                <div className="text-xs text-foreground/70">Bem‑vindo(a)</div>
                <div className="text-sm font-semibold">ArchFiche Pro</div>
              </div>
            </div>
            {/* Abas principais */}
            <div className="mt-4 flex rounded-lg bg-muted p-1">
              {([
                { key: 'inicio', label: 'Início' },
                { key: 'financas', label: 'Finanças' },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex-1 rounded-md px-3 py-2 text-sm ${tab === key ? 'bg-primary text-white' : 'text-foreground'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo por aba */}
          {tab === 'inicio' && (
            <div className="p-4 space-y-4">
              {/* Ações rápidas com badges */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Feedbacks', icon: BellAlertIcon, badge: 2 },
                  { label: 'Atualizações', icon: ClipboardDocumentCheckIcon, badge: 3 },
                  { label: 'Visão', icon: EyeIconFallback, badge: 1 },
                  { label: 'Mensagens', icon: UserGroupIcon, badge: 4 },
                ].map(({ label, icon: Icon, badge }, i) => (
                  <button key={i} className="relative flex flex-col items-center gap-1 rounded-lg border border-border p-2 hover:bg-secondary">
                    <Icon className="h-6 w-6 text-primary" />
                    <span className="text-xs text-foreground/80 text-center">{label}</span>
                    {badge && (
                      <span className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white flex items-center justify-center">
                        {badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Seus alunos */}
              <div>
                <div className="text-sm font-semibold mb-2">Seus alunos</div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="rounded-lg border border-border p-4 text-left hover:bg-secondary">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-5 w-5 text-primary" />
                      <div className="text-sm font-medium">Adicionar alunos</div>
                    </div>
                  </button>
                  <button className="rounded-lg border border-border p-4 text-left hover:bg-secondary">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-5 w-5 text-primary" />
                      <div className="text-sm font-medium">Link de cadastro</div>
                    </div>
                  </button>
                  <div className="col-span-2 grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-border p-3">
                      <div className="text-xs text-foreground/70">Alunos</div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {['Novos 12', 'Ativos 32', 'Pendentes 5'].map((t) => (
                          <span key={t} className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="rounded-lg border border-border p-3 text-left hover:bg-secondary">
                      <div className="text-xs text-foreground/70">Grupo de alunos</div>
                      <div className="mt-1 text-sm">Criar/gerenciar grupos</div>
                    </button>
                    <button className="rounded-lg border border-border p-3 text-left hover:bg-secondary">
                      <div className="text-xs text-foreground/70">Grupo de desafio</div>
                      <div className="mt-1 text-sm">Organizar desafios</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'financas' && (
            <div className="p-4 space-y-4">
              <div className="rounded-xl bg-muted p-4">
                <div className="text-sm font-semibold">Resumo financeiro</div>
                <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-md bg-card/50 p-3">
                    <div className="text-xs text-foreground/70">Receitas</div>
                    <div className="mt-1 font-semibold">R$ 8.420</div>
                  </div>
                  <div className="rounded-md bg-card/50 p-3">
                    <div className="text-xs text-foreground/70">Despesas</div>
                    <div className="mt-1 font-semibold">R$ 3.150</div>
                  </div>
                  <div className="rounded-md bg-card/50 p-3">
                    <div className="text-xs text-foreground/70">Saldo</div>
                    <div className="mt-1 font-semibold">R$ 5.270</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="rounded-lg border border-border p-4 text-left hover:bg-secondary">
                  <div className="flex items-center gap-2">
                    <BanknotesIcon className="h-5 w-5 text-primary" />
                    <div className="text-sm font-medium">Cobranças</div>
                  </div>
                </button>
                <button className="rounded-lg border border-border p-4 text-left hover:bg-secondary">
                  <div className="flex items-center gap-2">
                    <ShoppingBagIcon className="h-5 w-5 text-primary" />
                    <div className="text-sm font-medium">Loja</div>
                  </div>
                </button>
              </div>
            </div>
          )}


          {/* Barra inferior */}
          <div className="sticky bottom-0 bg-card/95 border-t border-border">
            <div className="grid grid-cols-4">
              {([
                { key: 'home', label: 'Início', icon: HomeIcon, on: () => setTab('inicio') },
                { key: 'finance', label: 'Finanças', icon: BanknotesIcon, on: () => setTab('financas') },
                { key: 'store', label: 'Loja', icon: ShoppingBagIcon, on: () => setTab('financas') },
                { key: 'profile', label: 'Perfil', icon: UserCircleIcon, on: () => setBottom('profile') },
              ] as const).map(({ key, label, icon: Icon, on }) => (
                <button
                  key={key}
                  onClick={() => { setBottom(key); on() }}
                  className={`flex flex-col items-center gap-1 py-3 ${bottom === key ? 'text-primary' : 'text-foreground/70'} hover:text-primary`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Heroicons não tem Eye em outline importado acima, crio fallback simples
function EyeIconFallback(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
      <path d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}