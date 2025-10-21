import { useMemo, useState } from 'react'
import MobileNav from '../components/ui/mobile-nav'
import { useAuth } from '../contexts/AuthContext'
import Head from 'next/head'

const navigation = [
  { name: 'Produtos', href: '/' },
  { name: 'Recursos', href: '#' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Empresa', href: '/empresa' },
]

export default function LoginPage() {
  const { login, register, resetPassword, requestOtp, verifyOtp } = useAuth()
  const [mode, setMode] = useState<'login' | 'register' | 'reset' | 'otp'>('otp')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const strength = useMemo(() => {
    const length = password.length >= 8
    const upper = /[A-Z]/.test(password)
    const lower = /[a-z]/.test(password)
    const number = /\d/.test(password)
    const special = /[^A-Za-z0-9]/.test(password)
    const score = [length, upper, lower, number, special].filter(Boolean).length
    return { length, upper, lower, number, special, score }
  }, [password])

  const StrengthBar = () => (
    <div className="mt-2">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded ${strength.score > i ? 'bg-green-500' : 'bg-muted'}`}></div>
        ))}
      </div>
      <div className="mt-2 text-xs text-foreground/70 space-y-1">
        <div className={`${strength.length ? 'text-green-600' : ''}`}>• Mínimo 8 caracteres</div>
        <div className={`${strength.upper ? 'text-green-600' : ''}`}>• Letra maiúscula</div>
        <div className={`${strength.lower ? 'text-green-600' : ''}`}>• Letra minúscula</div>
        <div className={`${strength.number ? 'text-green-600' : ''}`}>• Número</div>
        <div className={`${strength.special ? 'text-green-600' : ''}`}>• Caractere especial</div>
      </div>
    </div>
  )

  const handleLogin = async () => {
    setMessage(null)
    if (!email || !password) { setMessage('Preencha e-mail e senha.'); return }
    const ok = await login(email, password)
    setMessage(ok ? 'Login realizado!' : 'E-mail ou senha inválidos.')
  }

  const handleRegister = async () => {
    setMessage(null)
    if (!email || !password || !confirm) { setMessage('Preencha todos os campos.'); return }
    if (password !== confirm) { setMessage('As senhas não coincidem.'); return }
    if (strength.score < 4) { setMessage('Senha fraca. Atenda aos requisitos.'); return }
    const ok = await register(email, password)
    setMessage(ok ? 'Conta criada! Você já está logado.' : 'E-mail já cadastrado.')
  }

  const handleReset = async () => {
    setMessage(null)
    if (!email || !password || !confirm) { setMessage('Preencha todos os campos.'); return }
    if (password !== confirm) { setMessage('As senhas não coincidem.'); return }
    if (strength.score < 4) { setMessage('Senha fraca. Atenda aos requisitos.'); return }
    const ok = await resetPassword(email, password)
    setMessage(ok ? 'Senha redefinida. Faça login com a nova senha.' : 'E-mail não encontrado.')
    if (ok) setMode('login')
  }

  const handleOtp = async () => {
    setMessage(null)
    if (!email) { setMessage('Informe seu e-mail.'); return }
    if (!otpSent) {
      const ok = await requestOtp(email)
      setMessage(ok ? 'Código enviado por e-mail!' : 'Falha ao enviar código.')
      if (ok) setOtpSent(true)
    } else {
      if (!otpCode) { setMessage('Digite o código recebido.'); return }
      const ok = await verifyOtp(email, otpCode)
      setMessage(ok ? 'Login realizado por código!' : 'Código inválido ou expirado.')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileNav navigation={navigation} />
      <main className="px-6 py-10">
        <Head>
          <title>NatFit Pro — Login</title>
          <meta name="description" content="Acesse sua conta para gerenciar treinos e serviços." />
        </Head>
        <div className="max-w-md mx-auto bg-card text-card-foreground rounded-xl p-6 shadow">
          <div className="flex gap-2 mb-4">
            <button
              className={`px-3 py-2 rounded-md ${mode === 'otp' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
              onClick={() => setMode('otp')}
            >Entrar por código</button>
            <button
              className={`px-3 py-2 rounded-md ${mode === 'login' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
              onClick={() => setMode('login')}
            >Entrar</button>
            <button
              className={`px-3 py-2 rounded-md ${mode === 'register' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
              onClick={() => setMode('register')}
            >Criar conta</button>
            <button
              className={`px-3 py-2 rounded-md ${mode === 'reset' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
              onClick={() => setMode('reset')}
            >Esqueci minha senha</button>
          </div>

          {mode === 'otp' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                />
              </div>
              {otpSent && (
                <div>
                  <label className="block text-sm font-medium mb-1">Código</label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                  />
                </div>
              )}
              <button onClick={handleOtp} className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80">
                {otpSent ? 'Validar código' : 'Enviar código'}
              </button>
              {!otpSent && (
                <div className="text-sm text-muted-foreground">O código expira em 10 minutos.</div>
              )}
            </div>
          ) : mode === 'login' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                />
              </div>
              <button onClick={handleLogin} className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80">Entrar</button>
              <button
                type="button"
                className="w-full text-primary underline text-sm"
                onClick={() => { setMode('reset'); setMessage(null); setPassword(''); setConfirm('') }}
              >Esqueci minha senha</button>
            </div>
          ) : mode === 'register' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Crie sua senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                />
                <StrengthBar />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirme a senha</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                />
              </div>
              <button onClick={handleRegister} className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80">Criar conta</button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nova senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                />
                <StrengthBar />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirmar nova senha</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                />
              </div>
              <button onClick={handleReset} className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80">Redefinir senha</button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-muted-foreground underline text-sm">Voltar ao login</button>
            </div>
          )}

          {message && (
            <p className="mt-4 text-sm text-foreground/80">{message}</p>
          )}
        </div>
      </main>
    </div>
  )
}