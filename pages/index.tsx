import MobileNav from '../components/ui/mobile-nav'
import ThemeToggle from '../components/ui/theme-toggle'
import { useRouter } from 'next/router'
import HeroSlider, { ImageConfig } from '../components/ui/hero-slider'
import { useEffect, useRef, useState } from 'react'
import { KeyIcon, WrenchScrewdriverIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import Head from 'next/head'

const navigation = [
  { name: 'Produtos', href: '/' },
  { name: 'Recursos', href: '#' },
  { name: 'Serviços', href: '/servicos' },
  { name: 'Empresa', href: '/empresa' },
  { name: 'Aluno', href: '/aluno', icon: UserCircleIcon },
]

export default function Home() {
  const router = useRouter()
  const imgQuery = router.query?.img

  // Estado de imagens editáveis
  const [images, setImages] = useState<ImageConfig[]>([
    { src: '/training/olympia.jpg', posX: 50, posY: 50, scale: 100 },
    { src: '/training/2.svg', posX: 50, posY: 50, scale: 100 },
    { src: '/training/3.svg', posX: 50, posY: 50, scale: 100 },
  ])
  // Modo desenvolvedor com senha
  const [devUnlocked, setDevUnlocked] = useState(false)
  const [devPassword, setDevPassword] = useState('')
  const expectedPassword = process.env.NEXT_PUBLIC_DEV_PASSWORD || 'natfit'
  const [showDevPassword, setShowDevPassword] = useState(false)
  const [showDevPanel, setShowDevPanel] = useState(false)

  // Texto do herói editável
  const [heroTitle, setHeroTitle] = useState('NatFit Pro')
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Performance, estética e força em um só lugar. Descubra treinos, agendamentos e vídeo aulas pensados para você.'
  )
  const [heroTitleColor, setHeroTitleColor] = useState<string>('#ffffff')
  const [heroSubtitleColor, setHeroSubtitleColor] = useState<string>('#ffffff')
  const [heroTitleFont, setHeroTitleFont] = useState<string>('system-ui')
  const [heroSubtitleFont, setHeroSubtitleFont] = useState<string>('system-ui')
  const fontOptions = [
    'system-ui', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Trebuchet MS',
    'Montserrat', 'Oswald', 'Roboto', 'Playfair Display', 'Bebas Neue'
  ]
  const titleColorRef = useRef<HTMLInputElement>(null)
  const subtitleColorRef = useRef<HTMLInputElement>(null)

  // Inputs auxiliares
  const [urlInput, setUrlInput] = useState('')
  const [urlVideoInput, setUrlVideoInput] = useState('')

  // Carrega do localStorage quando disponível
  useEffect(() => {
    if (typeof window === 'undefined') return
    // Modo dev
    const unlocked = window.localStorage.getItem('natfit_dev_unlocked')
    if (unlocked === 'true') setDevUnlocked(true)

    // Textos
    const savedTitle = window.localStorage.getItem('natfit_hero_title')
    const savedSubtitle = window.localStorage.getItem('natfit_hero_subtitle')
    if (savedTitle) setHeroTitle(savedTitle)
    if (savedSubtitle) setHeroSubtitle(savedSubtitle)
    const savedTitleColor = window.localStorage.getItem('natfit_hero_title_color')
    const savedSubtitleColor = window.localStorage.getItem('natfit_hero_subtitle_color')
    const savedTitleFont = window.localStorage.getItem('natfit_hero_title_font')
    const savedSubtitleFont = window.localStorage.getItem('natfit_hero_subtitle_font')
    if (savedTitleColor) setHeroTitleColor(savedTitleColor)
    if (savedSubtitleColor) setHeroSubtitleColor(savedSubtitleColor)
    if (savedTitleFont) setHeroTitleFont(savedTitleFont)
    if (savedSubtitleFont) setHeroSubtitleFont(savedSubtitleFont)
  
    // Imagens
    const savedCfg = window.localStorage.getItem('natfit_images_configs')
    if (savedCfg) {
      try {
        const parsed = JSON.parse(savedCfg)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setImages(parsed as ImageConfig[])
          return
        }
      } catch {}
    }
    // Fallback: versão anterior salvava apenas URLs
    const saved = window.localStorage.getItem('natfit_images')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cfgs = (parsed as string[]).map((src) => ({ src, posX: 50, posY: 50, scale: 100 }))
          setImages(cfgs)
        }
      } catch {}
    }
  }, [])

  // Se existir query ?img=, sobrescreve a lista
  useEffect(() => {
    if (!imgQuery) return
    if (typeof imgQuery === 'string') {
      setImages(imgQuery.split(',').map((src) => ({ src, posX: 50, posY: 50, scale: 100 })))
    } else if (Array.isArray(imgQuery) && imgQuery.length > 0) {
      setImages((imgQuery as string[]).map((src) => ({ src, posX: 50, posY: 50, scale: 100 })))
    }
  }, [imgQuery])

  const unlockDev = () => {
    if (devPassword.trim() === expectedPassword) {
      setDevUnlocked(true)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('natfit_dev_unlocked', 'true')
      }
      setDevPassword('')
    } else {
      alert('Senha incorreta')
    }
  }

  const lockDev = () => {
    setDevUnlocked(false)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('natfit_dev_unlocked')
    }
  }

  const handleAddUrl = () => {
    if (!urlInput.trim()) return
    setImages((prev) => [...prev, { src: urlInput.trim(), posX: 50, posY: 50, scale: 100 }])
    setUrlInput('')
  }

  const handleAddVideoUrl = () => {
    if (!urlVideoInput.trim()) return
    setImages((prev) => [...prev, { src: urlVideoInput.trim(), mediaType: 'video', posX: 50, posY: 50, scale: 100 }])
    setUrlVideoInput('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setImages((prev) => [...prev, { src: dataUrl, posX: 50, posY: 50, scale: 100 }])
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setImages((prev) => [...prev, { src: dataUrl, mediaType: 'video', posX: 50, posY: 50, scale: 100 }])
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSaveImages = () => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('natfit_images_configs', JSON.stringify(images))
  }

  const handleResetDefault = () => {
    setImages([
      { src: '/training/olympia.jpg', posX: 50, posY: 50, scale: 100 },
      { src: '/training/2.svg', posX: 50, posY: 50, scale: 100 },
      { src: '/training/3.svg', posX: 50, posY: 50, scale: 100 },
    ])
  }

  const handleSaveTexts = () => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('natfit_hero_title', heroTitle)
    window.localStorage.setItem('natfit_hero_subtitle', heroSubtitle)
    window.localStorage.setItem('natfit_hero_title_color', heroTitleColor)
    window.localStorage.setItem('natfit_hero_subtitle_color', heroSubtitleColor)
    window.localStorage.setItem('natfit_hero_title_font', heroTitleFont)
    window.localStorage.setItem('natfit_hero_subtitle_font', heroSubtitleFont)
  }

  // Carrega Google Fonts quando selecionadas
  const ensureFontLoaded = (font: string) => {
    const fontMap: Record<string, string> = {
      'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap',
      'Oswald': 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap',
      'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
      'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
      'Bebas Neue': 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
    }
    const href = fontMap[font]
    if (!href || typeof document === 'undefined') return
    const exists = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .some((l) => (l as HTMLLinkElement).href === href)
    if (!exists) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>NatFit Pro — Home</title>
        <meta name="description" content="NatFit Pro: treinos, serviços e gestão de alunos." />
      </Head>
      <MobileNav navigation={navigation} />
      
      <main className="px-6 py-10">
        {/* Botão flutuante para abrir/fechar a Área do Desenvolvedor */}
        <button
          type="button"
          onClick={() => setShowDevPanel((v) => !v)}
          className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-lg bg-card/80 backdrop-blur-sm p-2 shadow-lg text-foreground hover:bg-secondary"
          aria-label="Abrir/fechar área do desenvolvedor"
        >
          <WrenchScrewdriverIcon className="h-5 w-5" />
          <span className="text-sm hidden sm:inline">Desenvolvedor</span>
        </button>
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Seção Desenvolvedor com senha (oculta até clicar no ícone) */}
          {showDevPanel && (
          <section id="developer" className="bg-card text-card-foreground rounded-xl p-6 shadow">
            <h2 className="text-xl font-semibold">Área do Desenvolvedor</h2>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDevPassword((s) => !s)}
                className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
                aria-label="Mostrar/ocultar senha de desenvolvedor"
              >
                <KeyIcon className="h-4 w-4" />
                Senha de desenvolvedor
              </button>
              {showDevPassword && (
                <span className="rounded bg-secondary px-2 py-1 text-sm font-mono">
                  {expectedPassword}
                </span>
              )}
            </div>
            {!devUnlocked ? (
              <div className="mt-4 flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Senha</label>
                  <input
                    type="password"
                    value={devPassword}
                    onChange={(e) => setDevPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                  />
                </div>
                <button
                  onClick={unlockDev}
                  className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80"
                >
                  Entrar
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/70">Acesso liberado</span>
                  <button onClick={lockDev} className="rounded-md bg-gray-700 px-3 py-1 text-white hover:bg-gray-800">Sair</button>
                </div>

                {/* Editor de textos do herói */}
                <div className="border border-border rounded-md p-4 bg-background">
                  <h3 className="text-lg font-medium mb-3">Editar letras do topo</h3>
                  <label className="block text-sm font-medium">Título</label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                  />
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium">Fonte do título</label>
                      <select
                        value={heroTitleFont}
                        onChange={(e) => { setHeroTitleFont(e.target.value); ensureFontLoaded(e.target.value) }}
                        className="mt-1 w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                      >
                        {fontOptions.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium">Cor do título</label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          ref={titleColorRef}
                          type="color"
                          value={heroTitleColor}
                          onChange={(e) => setHeroTitleColor(e.target.value)}
                          className="sr-only"
                        />
                        <button
                          type="button"
                          onClick={() => titleColorRef.current?.click()}
                          className="h-6 w-6 rounded-full border border-border shadow-sm"
                          style={{ backgroundColor: heroTitleColor }}
                          aria-label="Selecionar cor do título"
                          title={heroTitleColor}
                        />
                      </div>
                    </div>
                  </div>
                  <label className="block text-sm font-medium mt-3">Subtítulo</label>
                  <textarea
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                    rows={3}
                  />
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium">Fonte do subtítulo</label>
                      <select
                        value={heroSubtitleFont}
                        onChange={(e) => { setHeroSubtitleFont(e.target.value); ensureFontLoaded(e.target.value) }}
                        className="mt-1 w-full rounded-md border border-border px-3 py-2 bg-background text-foreground"
                      >
                        {fontOptions.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium">Cor do subtítulo</label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          ref={subtitleColorRef}
                          type="color"
                          value={heroSubtitleColor}
                          onChange={(e) => setHeroSubtitleColor(e.target.value)}
                          className="sr-only"
                        />
                        <button
                          type="button"
                          onClick={() => subtitleColorRef.current?.click()}
                          className="h-6 w-6 rounded-full border border-border shadow-sm"
                          style={{ backgroundColor: heroSubtitleColor }}
                          aria-label="Selecionar cor do subtítulo"
                          title={heroSubtitleColor}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <button onClick={handleSaveTexts} className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80">Salvar letras</button>
                  </div>
                </div>

                {/* Editor de imagens do slider */}
                <div className="border border-border rounded-md p-4 bg-background">
                  <h3 className="text-lg font-medium mb-3">Editar imagens do topo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Adicionar por URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://exemplo.com/imagem.jpg"
                          className="flex-1 rounded-md border border-border px-3 py-2 bg-background text-foreground"
                        />
                        <button
                          onClick={handleAddUrl}
                          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Carregar do computador</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-white hover:file:bg-secondary/80"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-6 mb-2">Adicionar vídeos (sem som)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Adicionar vídeo por URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={urlVideoInput}
                          onChange={(e) => setUrlVideoInput(e.target.value)}
                          placeholder="https://exemplo.com/video.mp4"
                          className="flex-1 rounded-md border border-border px-3 py-2 bg-background text-foreground"
                        />
                        <button
                          onClick={handleAddVideoUrl}
                          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80"
                        >
                          Adicionar vídeo
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Carregar vídeo do computador</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="block w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-white hover:file:bg-secondary/80"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    {images.length === 0 ? (
                      <p className="text-sm text-foreground/70">Nenhuma imagem. Adicione pelo menos uma.</p>
                    ) : (
                      <ul className="space-y-2">
                        {images.map((cfg, i) => (
                          <li key={`${cfg.src}-${i}`} className="space-y-2 border border-border rounded-md p-3 bg-background">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {cfg.mediaType === 'video' ? (
                                  <video
                                    src={cfg.src}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="h-12 w-20 overflow-hidden rounded border border-border object-cover"
                                    style={{
                                      objectPosition: `${cfg.posX ?? 50}% ${cfg.posY ?? 50}%`,
                                      transform: `scale(${(cfg.scale ?? 100) / 100})`,
                                    }}
                                  />
                                ) : (
                                  <div
                                    className="h-12 w-20 overflow-hidden rounded border border-border bg-gray-200"
                                    style={{
                                      backgroundImage: `url('${cfg.src}')`,
                                      backgroundSize: `${cfg.scale ?? 100}%`,
                                      backgroundPosition: `${cfg.posX ?? 50}% ${cfg.posY ?? 50}%`,
                                    }}
                                  />
                                )}
                                <span className="text-sm truncate max-w-[200px]">
                                  {cfg.mediaType === 'video'
                                    ? (cfg.src.startsWith('data:') ? 'Vídeo carregado' : (cfg.src.split('?')[0].split('/').pop() || 'Vídeo'))
                                    : (cfg.src.startsWith('data:') ? 'Imagem carregada' : (cfg.src.split('?')[0].split('/').pop() || 'Imagem'))}
                                </span>
                              </div>
                              <button
                                onClick={() => handleRemove(i)}
                                className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                              >
                                Remover
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-medium">Posição X (%)</label>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={cfg.posX ?? 50}
                                  onChange={(e) =>
                                    setImages((prev) => prev.map((c, idx) => (idx === i ? { ...c, posX: Number(e.target.value) } : c)))
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium">Posição Y (%)</label>
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={cfg.posY ?? 50}
                                  onChange={(e) =>
                                    setImages((prev) => prev.map((c, idx) => (idx === i ? { ...c, posY: Number(e.target.value) } : c)))
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium">Tamanho (%)</label>
                                <input
                                  type="range"
                                  min={50}
                                  max={200}
                                  value={cfg.scale ?? 100}
                                  onChange={(e) =>
                                    setImages((prev) => prev.map((c, idx) => (idx === i ? { ...c, scale: Number(e.target.value) } : c)))
                                  }
                                />
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button onClick={handleSaveImages} className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80">Salvar imagens</button>
                      <button onClick={handleResetDefault} className="rounded-md bg-gray-700 px-4 py-2 text-white hover:bg-gray-800">Restaurar padrão</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
          )}

           {/* Hero com slider de imagens do Olimpia */}
          <HeroSlider imageConfigs={images} intervalMs={5000}>
            <div className="px-6 sm:px-12 lg:px-16 max-w-3xl">
              <h1
                className="text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow-2xl"
                style={{ color: heroTitleColor, fontFamily: heroTitleFont }}
              >
                {heroTitle}
              </h1>
              <p
                className="mt-4 text-lg sm:text-xl drop-shadow-lg"
                style={{ color: heroSubtitleColor, fontFamily: heroSubtitleFont }}
              >
                {heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/servicos"
                  className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-white shadow hover:bg-primary/80"
                >
                  Explorar Serviços
                </a>
                <a
                  href="#planos"
                  className="inline-flex items-center rounded-md bg-secondary px-6 py-3 text-white shadow hover:bg-secondary/80"
                >
                  Começar Agora
                </a>
              </div>
            </div>
          </HeroSlider>

          {/* Destaques rápidos abaixo da capa */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card text-card-foreground rounded-xl p-6 shadow">
              <h3 className="text-xl font-semibold">Treinos Personalizados</h3>
              <p className="mt-2 text-sm text-foreground/80">
                Planos ajustados ao seu objetivo com foco em resultado.
              </p>
            </div>
            <div className="bg-card text-card-foreground rounded-xl p-6 shadow">
              <h3 className="text-xl font-semibold">Agendamento Fácil</h3>
              <p className="mt-2 text-sm text-foreground/80">
                Escolha dias e horários que combinam com sua rotina.
              </p>
            </div>
            <div className="bg-card text-card-foreground rounded-xl p-6 shadow">
              <h3 className="text-xl font-semibold">Vídeo Aulas</h3>
              <p className="mt-2 text-sm text-foreground/80">
                Treine onde estiver com aulas guiadas e seguras.
              </p>
            </div>
          </section>
        </div>
      </main>
      
      <ThemeToggle />
    </div>
  )
}